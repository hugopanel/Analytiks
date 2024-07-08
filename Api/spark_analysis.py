import pyspark
print(pyspark.__version__)

from pyspark.sql import SparkSession
from pyspark.sql.types import StructType, StructField, StringType, TimestampType

# MongoDB credentials and connection details
mongo_username = "root"
mongo_password = "password"
mongo_host = "localhost"
mongo_port = 27017
mongo_database = "analytiks"

# Construct the MongoDB URI with credentials
mongo_uri = f"mongodb://{mongo_username}:{mongo_password}@{mongo_host}:{mongo_port}/{mongo_database}?authSource=admin"


spark = SparkSession \
    .builder \
    .appName("Analytiks") \
    .getOrCreate()

from pymongo import MongoClient
import pandas as pd

# Connect to MongoDB
client = MongoClient('mongodb://root:password@localhost:27017/')
db = client['analytiks']

# Import the CSV file
events_df = spark.read.csv("events.csv", header=True, inferSchema=True)
events_df.show()
events_df.printSchema()

# Clear the collections
for collection in db.list_collection_names():
    db[collection].drop()

# Filter for "btn_click" events and compute the count for each value
print("Count of btn_click events:")
btn_clicks = events_df.filter(events_df.event == "btn_click") \
    .groupBy("actor").count()
btn_clicks.show()

db['btn_click_count'].insert_many(btn_clicks.toPandas().to_dict(orient='records'))

# Show the top 3 most clicked buttons
print("Top 3 most clicked buttons:")
btn_clicks.orderBy("count", ascending=False).show(3)
# The Spark SQL way:
print("Top 3 most clicked buttons (SQL):")
events_df.createOrReplaceTempView("events")
spark.sql("SELECT actor, count(*) as count FROM events WHERE event = 'btn_click' GROUP BY actor ORDER BY count DESC LIMIT 3").show()

# Most visited pages
print("Most visited pages:")
most_visited_pages = events_df.filter(events_df.event == "page_visit") \
    .groupBy("actor").count()
most_visited_pages.show()

db['most_visited_pages'].insert_many(most_visited_pages.toPandas().to_dict(orient='records'))

# Show the top 3 most visited pages
print("Top 3 most visited pages:")
events_df.filter(events_df.event == "page_visit") \
    .groupBy("actor").count().orderBy("count", ascending=False).show(3)

# The least visited pages
print("Least visited pages:")
events_df.filter(events_df.event == "page_visit") \
    .groupBy("actor").count().orderBy("count").show(3)

# Show the list of sessions
print("List of sessions:")
sessions = events_df.select("session").distinct()
sessions.show()
db['sessions'].insert_many(sessions.toPandas().to_dict(orient='records'))

# Show the total number of sessions
print("Total number of sessions:")
events_df.select("session").distinct().count()

# Sessions with number of events
print("Sessions with number of events:")
sessions_with_events = events_df.groupBy("session").count()
sessions_with_events.show()
db['sessions_with_events'].insert_many(sessions_with_events.toPandas().to_dict(orient='records'))

# Show the sessions with the most events
print("Sessions with the most events:")
events_df.groupBy("session").count().orderBy("count", ascending=False).show(3)

# Show the pages visited by each session ordered by session
print("Pages visited by each session:")
session_pages = events_df.filter(events_df.event == "page_visit") \
    .groupBy("session", "actor").count()
session_pages.show()
db['session_pages'].insert_many(session_pages.toPandas().to_dict(orient='records'))

# Show the pages visited by each session in order of visit
print("Pages visited by each session in order of visit:")
from pyspark.sql.window import Window
from pyspark.sql.functions import row_number

windowSpec = Window.partitionBy("session").orderBy("timestamp")
session_visits = events_df.filter(events_df.event == "page_visit") \
    .select("session", "actor", "timestamp", row_number().over(windowSpec).alias("row_number"))
session_visits.show()
db['session_visits'].insert_many(session_visits.toPandas().to_dict(orient='records'))
