Après avoir démarré Kafka :

```sh
docker exec -it kafka /opt/kafka/bin/kafka-topics.sh --create --topic events --bootstrap-server localhost:9092
```

---

Dans le Spark-worker

```sh
start-worker.sh spark://localhost:7077
```

Puis démarrer l'API
