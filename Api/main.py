import asyncio
import json
import logging
import time
from fastapi import FastAPI
from fastapi.responses import StreamingResponse, JSONResponse
from kafka import KafkaConsumer, TopicPartition, KafkaProducer
from aiokafka import AIOKafkaConsumer

app = FastAPI()

# Setup Kafka
topic = 'events'

# Update the bootstrap_servers to point to the Docker container IP or hostname
# producer = KafkaProducer(bootstrap_servers='localhost:9092', api_version="2.7.0")
producer = KafkaProducer(bootstrap_servers='localhost:9092', api_version="3.7.1")

# Add PySpark and connect it to the Kafka topic
from pyspark.sql import SparkSession
from pyspark.sql.functions import from_json, col, window
from pyspark.sql.types import StructType, StringType, StructField, TimestampType

# Update the master URL to point to your Spark master in Docker
spark = SparkSession \
    .builder \
    .appName("Analytiks") \
    .master("spark://localhost:7077") \
    .config("spark.jars.packages", "org.apache.spark:spark-sql-kafka-0-10_2.12:3.5.1") \
    .config("spark.executor.extraJavaOptions", "-Djava.net.preferIPv4Stack=true") \
    .getOrCreate()
    # .config("spark.jars.packages", "org.apache.spark:spark-sql-kafka-0-10_2.12:3.2.0") \


schema = StructType([
    StructField("event", StringType(), True),
    StructField("value", StringType(), True),
    StructField("timestamp", TimestampType(), True)
])

df = spark \
    .readStream \
    .format("kafka") \
    .option("kafka.bootstrap.servers", "localhost:9092") \
    .option("subscribe", topic) \
    .load()

df = df.selectExpr("CAST(key AS STRING)", "CAST(value AS STRING)")
df = df.select(from_json(col("value"), schema).alias("data")).select("data.*")

# Filter for "btn_click" events and compute the count for each value every minute
btn_clicks = df.filter(col("event") == "btn_click") \
    .groupBy(
        window(col("timestamp"), "1 minute"),
        col("value")
    ).count()

query = btn_clicks.writeStream \
    .outputMode("complete") \
    .format("memory") \
    .queryName("btn_clicks_counts") \
    .start()

# Setup API routes
@app.get("/")
def read_root():
    return {"name": "Analytiks API", "version": "1"}

@app.get("/register_event/{event}/{value}")
async def register_event(event: str, value: str = None):
    producer.send(topic, key=event.encode(), value=value.encode())
    producer.flush()
    return {"event": event, "value": value} 

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Helper function for the /get_events_stream route
async def consume_messages():
    consumer = AIOKafkaConsumer(
        topic,
        bootstrap_servers='localhost:9092',
        group_id='mygroup'
    )

    await consumer.start()
    logger.info("Kafka consumer started")
    try:
        async for message in consumer:
            yield json.dumps({"type": message.key.decode(), "subject": message.value.decode()}) + "\n"
    finally:
        logger.info("Stopping Kafka consumer")
        await consumer.stop()

# Route to stream the events
@app.get("/get_events_stream", response_class=StreamingResponse)
async def stream():
    return StreamingResponse(consume_messages(), media_type="application/x-ndjson")

# Route to get the aggregated events report
@app.get("/get_events_report", response_class=JSONResponse)
def get_events_report():
    # Read the latest result from the in-memory table
    result = spark.sql("SELECT window.start, window.end, value, count FROM btn_clicks_counts")
    result_json = result.toJSON().collect()
    return JSONResponse(content={"data": result_json})
