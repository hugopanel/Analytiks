# Analytiks

<img width="1667" alt="image" src="https://github.com/user-attachments/assets/00567398-002b-4099-82f8-4c4b011fcb4a">

_This is a fork from the original repo to add context and fix typos. The original repository can be found [here](https://github.com/ArthB94/KafKa_Project)._

# Goal and objectives

Analytiks is a fake eCommerce website where clicks and page visits by users are tracked.

Each action generates an event (visit a page, add a product to the cart, checkout...) that is sent to a Kafka topic. The events are then written to a CSV file and given to Spark to be transformed and used to create indicators.

The different indicators that are computed are the following:

- How many times each page was visited
- How many times each product has been added to a cart
- How many times each product has been bought (because products can be removed from the cart)
- On average, how many times is each product present in an order (only taking checked out orders into account)
- The average total cost for an order
- The maximum total cost of an order
- The minimum total cost of an order
- How many times each product's quantity has been decreased from a cart
- The most bought item
- The least bought item

_Note: We chose not to store the last two indicators in the database as a simple query would do the trick. However, the values are still computed by Spark._

# Prerequisites

To run this project, you need to have installed:

- Node.js and npm
- Docker with the `docker compose` command
- Python 3.12+ (not tested on versions below 3.12) with the `pip` command

# How to run

Begin by cloning the repository locally using `git clone`.

## Start the backend

Navigate to the `/Api` folder and use the `docker-compose.yml` file to start Zookeeper, Kafka and MongoDB:

```
docker compose up -d
```

The three containers should be running.

Create a Kafka topic:

```
docker exec -it kafka /opt/kafka/bin/kafka-topics.sh --create --topic events --bootstrap-server localhost:9092
```

## Start the frontend

Navigate to the `/Front` folder.

Install the dependencies:

```
npm i
```

Start the dev server:

```
npm run dev
```

Once the server is started, you can open your browser and go to the url `http://localhost:3000`. The website should appear. Click on the "catalogue" button to start browsing the catalog.

## Trigger an analysis

Navigate to the `/Api` folder.
Ensure the Python modules are installed:

```
pip install -r requirements.txt
```

Create the CSV file:

```
python generate_report.py
```

Use Spark to read the CSV, compute the indicators and store them in the database:

```
python spark_analysis.py
```

## View the data

The data is written to the output of the console when you run the Spark analysis. The data is also visible in the MongoDB database. You can connect to it using a tool such as MongoDB Atlas or Jetbrains DataGrip using the following credentials (if they were not modified in `docker-compose.yml`):

- Host: localhost
- Port: 27017
- Username: root
- Password: password

# Technologies used

The technologies we used for this project are the following:

- Docker (Compose) to simplify the setup and deployment of Kafka, Zookeeper and MongoDB.
- Apache Kafka to store, send and retrieve the events
- Apache Zookeeper to handle the Kafka instances
- Apache Spark to compute the indicators
- MongoDB to store the results from Spark

More language-specific technologies:

- PySpark to use Spark in a Python script
- PyMongo to connect to a MongoDB instance from a Python script
- Kafka-node to use Kafka inside Node.js
