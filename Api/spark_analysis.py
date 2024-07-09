import pyspark
print("Using PySpark version", pyspark.__version__)

from pyspark.sql import SparkSession
from pyspark.sql.types import StructType, StructField, StringType, IntegerType, ArrayType
from pyspark.sql.functions import from_json, col, monotonically_increasing_id

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
events_df = spark.read.option("delimiter", "|").csv("events.csv", header=True, inferSchema=True)
events_df.show()
events_df.printSchema()

# Clear the collections
for collection in db.list_collection_names():
    db[collection].drop()


#### Number of visits on each product page
visits = events_df.filter((events_df.event == "navPage") | (events_df.event == "openCart"))
if visits.count() == 0:
    print("No 'navPage' or 'openCart' events found.")
else:
    # Parse the JSON string in the data column
    parsed_visits = visits.withColumn("parsed_data", from_json(col("data"), StructType([StructField("productId", StringType())])))
    # Group by productId and count the visits
    grouped_visits = parsed_visits.groupBy("parsed_data.productId").count()
    grouped_visits.show()
    db['page_visits'].insert_many(grouped_visits.toPandas().to_dict(orient='records'))


#### Number of "add to cart" for each product
add_to_cart = events_df.filter(events_df.event == "addToCart")
if add_to_cart.count() == 0:
    print("No 'addToCart' events found.")
else:
    # Parse the JSON string in the data column
    parsed_add_to_cart = add_to_cart.withColumn("parsed_data", from_json(col("data"), StructType([
        StructField("productId", StringType()),
        StructField("quantity", IntegerType()),
        StructField("price", StringType()),
        StructField("total", StringType()),
        StructField("name", StringType())
        ])))
    # Group by productId and count the "add to cart" events
    grouped_add_to_cart = parsed_add_to_cart.groupBy("parsed_data.productId").count()
    grouped_add_to_cart.show()
    db['add_to_cart'].insert_many(grouped_add_to_cart.toPandas().to_dict(orient='records'))


#### Number of purchases for each product 
# Define schema for checkout event data
checkout_schema = StructType([
        StructField("products", ArrayType(StructType([
            StructField("productId", StringType(), True),
            StructField("quantity", IntegerType(), True),
            StructField("price", StringType(), True),
            StructField("total", StringType(), True),
            StructField("name", StringType(), True),
            StructField("image", StringType(), True)
        ])), True)
])

parsed_add_to_cart = events_df.filter(events_df.event == "checkout") # Filter only checkout events
if parsed_add_to_cart.count() == 0:
    print("No 'checkout' events found.")
else:
    parsed_add_to_cart = parsed_add_to_cart.withColumn("parsed_data", from_json(col("data"), checkout_schema)) # Parse the JSON string
    parsed_add_to_cart = parsed_add_to_cart.selectExpr('event', 'explode(parsed_data.products) as products') # Explode the products array
    parsed_add_to_cart = parsed_add_to_cart.selectExpr('event', 'products.productId as productId', 'products.quantity as quantity') # Select the productId and quantity
    grouped_purchases = parsed_add_to_cart.groupBy("productId").sum("quantity") # Group by productId and sum the quantities
    grouped_purchases.show()
    db['purchases'].insert_many(grouped_purchases.toPandas().to_dict(orient='records'))


### Average quantity for each product on all orders
    average_quantity = parsed_add_to_cart.groupBy("productId").avg("quantity")
    average_quantity.show()
    db['average_quantity'].insert_many(average_quantity.toPandas().to_dict(orient='records'))


### Average amount spent on each order
mydata = events_df.filter(events_df.event == "checkout") # Filter only checkout events
if mydata.count() == 0:
    print("No 'checkout' events found.")
else:
    mydata = mydata.withColumn("parsed_data", from_json(col("data"), checkout_schema)) # Parse the JSON string
    mydata = mydata.withColumn("checkoutId", monotonically_increasing_id())
    mydata = mydata.selectExpr('event', 'checkoutId', 'explode(parsed_data.products) as products') # Explode the products array
    mydata = mydata.selectExpr('event', 'checkoutId', 'products.total as productTotal') # Select the productId and quantity
    mydata = mydata.withColumn("productTotal", mydata["productTotal"].substr(2, 100).cast(IntegerType())) # Remove the dollar sign before the total and cast to integer in the productTotal column
    grouped_purchases = mydata.groupBy("checkoutId").sum("productTotal") # Group by productId, sum the quantities
    # Calculate the average of the productTotal column 
    grouped_purchases = grouped_purchases.selectExpr('avg(`sum(productTotal)`) as avgTotal')
    grouped_purchases.show()
    db['checkout_average_total'].insert_many(grouped_purchases.toPandas().to_dict(orient='records'))


### Max amount for an order
    max_amount = mydata.groupBy("checkoutId").sum("productTotal") # Group by productId, sum the quantities
    max_amount = max_amount.selectExpr('max(`sum(productTotal)`) as maxTotal')
    max_amount.show()
    db['checkout_max_total'].insert_many(max_amount.toPandas().to_dict(orient='records'))


### Min amount for an order
    min_amount = mydata.groupBy("checkoutId").sum("productTotal") # Group by productId, sum the quantities
    min_amount = min_amount.selectExpr('min(`sum(productTotal)`) as minTotal')
    min_amount.show()
    db['checkout_min_total'].insert_many(min_amount.toPandas().to_dict(orient='records'))


### Number of product removals (remove from cart = "removeProduct" event)
remove_product = events_df.filter(events_df.event == "removeProduct")
if remove_product.count() == 0:
    print("No 'removeProduct' events found.")
else:
    # Parse the JSON string in the data column
    parsed_remove_product = remove_product.withColumn("parsed_data", from_json(col("data"), StructType([StructField("productId", StringType()), StructField("quantity", IntegerType())])))
    # Group by productId and count the removals 
    grouped_remove_product = parsed_remove_product.groupBy("parsed_data.productId").count()
    grouped_remove_product.show()
    db['remove_product'].insert_many(grouped_remove_product.toPandas().to_dict(orient='records'))


### More statistics to show, but no need to store them in MongoDB since a simple query can be used to get the result
### Most removed product
# most_removed_product = parsed_remove_product.groupBy("parsed_data.productId").count()
# most_removed_product = most_removed_product.orderBy(col("count").desc()).limit(1)
# most_removed_product.show()

### Most bought product (not just added but checked out, based on quantity)
# most_bought_product = parsed_add_to_cart.groupBy("parsed_data.productId").sum("parsed_data.quantity")
# most_bought_product = most_bought_product.orderBy(col("sum(quantity)").desc()).limit(1)
# most_bought_product.show()
