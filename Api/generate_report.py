from kafka import KafkaConsumer, TopicPartition

consumer = KafkaConsumer(bootstrap_servers='localhost:9092', enable_auto_commit=False, api_version="3.7.1")
topic = 'events'
partitions = consumer.partitions_for_topic(topic)
partitionsList = []
for partition in partitions:
    partitionsList.append(TopicPartition(topic, partition))
consumer.assign(partitionsList)

# Seek to the beginning of each partition to start from the first message
for partition in partitionsList:
    consumer.seek_to_beginning(partition)

events = []

# Consume all messages from the topic
try:
    while True:
        # Poll for new messages
        message_pack = consumer.poll(timeout_ms=1000)
        
        if not message_pack:
            # Exit the loop if no more messages are available
            break
        
        for tp, messages in message_pack.items():
            for message in messages:
                events.append(message)
                print(f"Received message: {message.key.decode()}:{message.value.decode()}")

except KeyboardInterrupt:
    pass
finally:
    # Close the consumer to ensure clean exit
    consumer.close()

print("Done!")
print("Generating CSV file...")

# Generate a CSV file with all the events
import csv

# Create a CSV file with the events
with open('events.csv', mode='w', newline='') as file:
    writer = csv.writer(file)
    writer.writerow(['key', 'value'])
    for event in events:
        writer.writerow([event.key.decode(), event.value.decode()])
    
print("CSV file generated!")
