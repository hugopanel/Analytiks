Après avoir démarré Kafka :

```sh
docker exec -it kafka /opt/kafka/bin/kafka-topics.sh --create --topic events --bootstrap-server localhost:9092
```

Pour créer le topic dans Kafka.
