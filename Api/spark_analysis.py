from pyspark.sql import SparkSession

spark = SparkSession \
    .builder \
    .appName("Analytiks") \
    .getOrCreate()

# Import the CSV file
events_df = spark.read.csv("events.csv", header=True, inferSchema=True)
events_df.show()
events_df.printSchema()

# Filter for "btn_click" events and compute the count for each value
print("Count of btn_click events:")
btn_clicks = events_df.filter(events_df.event == "btn_click") \
    .groupBy("actor").count()
btn_clicks.show()

# Show the top 3 most clicked buttons
print("Top 3 most clicked buttons:")
btn_clicks.orderBy("count", ascending=False).show(3)
# The Spark SQL way:
print("Top 3 most clicked buttons (SQL):")
events_df.createOrReplaceTempView("events")
spark.sql("SELECT actor, count(*) as count FROM events WHERE event = 'btn_click' GROUP BY actor ORDER BY count DESC LIMIT 3").show()

# Most visited pages
print("Most visited pages:")
events_df.filter(events_df.event == "page_visit") \
    .groupBy("actor").count().show()

# Show the top 3 most visited pages
print("Top 3 most visited pages:")
events_df.filter(events_df.event == "page_visit") \
    .groupBy("actor").count().orderBy("count", ascending=False).show(3)

# The least visited pages
print("Least visited pages:")
events_df.filter(events_df.event == "page_visit") \
    .groupBy("actor").count().orderBy("count").show(3)

# Show the total number of sessions
print("Total number of sessions:")
events_df.select("session").distinct().count()

# Show the sessions with the most events
print("Sessions with the most events:")
events_df.groupBy("session").count().orderBy("count", ascending=False).show(3)

# Show the pages visited by each session ordered by session
print("Pages visited by each session:")
events_df.filter(events_df.event == "page_visit") \
    .groupBy("session", "actor").count().show()

# Show the pages visited by each session in order of visit
print("Pages visited by each session in order of visit:")
from pyspark.sql.window import Window
from pyspark.sql.functions import row_number

windowSpec = Window.partitionBy("session").orderBy("timestamp")
events_df.filter(events_df.event == "page_visit") \
    .select("session", "actor", "timestamp", row_number().over(windowSpec).alias("row_number")).show()

