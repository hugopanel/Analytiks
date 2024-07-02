from fastapi import FastAPI
from kafka import KafkaConsumer, TopicPartition, KafkaProducer

app = FastAPI()

# Setup Kafka
## Consumer
consumer = KafkaConsumer(bootstrap_servers='localhost:9092', enable_auto_commit=False, api_version="2.7.0")
topic = 'events'
partition = 0
tp = TopicPartition(topic, partition)
consumer.assign([tp])
consumer.seek_to_beginning(tp) # Start from the beginning

## Producer
producer = KafkaProducer(bootstrap_servers='localhost:9092', api_version="2.7.0")

# Setup API routes
@app.get("/")
def read_root():
    return {"name": "Analytiks API", "version": "1"}

@app.get("/register_event/{event}/{value}")
def register_event(event: str, value: str = None):
    producer.send(topic, key=event.encode(), value=value.encode())
    producer.flush()
    return {"event": event, "value": value} 

"""
This route will consume messages from the Kafka topic and return them as a list of dictionaries.
THIS ROUTE IS ONLY SUPPOSED TO BE USED FOR TESTING PURPOSES.
nb_messages must be AT MOST equal to the number of mesaages in the topic. Otherwise, it will loop until there are *nb_messages* messages.
"""
@app.get("/get_events/{nb_messages}")
def get_events(nb_messages: int = 10):
    events = []
    # Limit the number of iterations
    for i, message in enumerate(consumer):
        events.append({message.key.decode(): message.value.decode()})
        if i >= nb_messages:  # Change the number of iterations as needed
            break
    return events