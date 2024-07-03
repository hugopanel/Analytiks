import asyncio
import json
import logging
import time
from fastapi import FastAPI
from fastapi.responses import StreamingResponse
from kafka import KafkaConsumer, TopicPartition, KafkaProducer
from aiokafka import AIOKafkaConsumer

app = FastAPI()

# Setup Kafka
topic = 'events'

producer = KafkaProducer(bootstrap_servers='localhost:9092', api_version="2.7.0")

## Add PySpark and connect it to the kafka topic
# import findspark
# findspark.init()
# from pyspark.sql import SparkSession
# from pyspark.sql.functions import from_json, col
# from pyspark.sql.types import StructType, StringType

# spark = SparkSession.builder.appName("Analytiks").getOrCreate()
# schema = StructType().add("event", StringType()).add("value", StringType())
# df = spark.readStream.format("kafka").option("kafka.bootstrap.servers", "localhost:9092").option("subscribe", topic).load()
# df = df.selectExpr("CAST(key AS STRING)", "CAST(value AS STRING)")
# df = df.select(from_json(col("value"), schema).alias("data")).select("data.*")


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
