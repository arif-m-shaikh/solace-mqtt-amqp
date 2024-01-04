# Goal
There are 3 goals:
1. Write a client and server that communicate on MQTT topic
2. Write a client and server that communicate on AMQP queue
3. Make MQTT topic publish on client and then recieve the message on AMQP queue.

## Broker
We are using Solace as a brokers install the local broker using the following scripts
docker run -p 8080:8080 -p 55555:55555 -p 8008:8008 -p 1883:1883 -p 8000:8000 \
  -p 5672:5672 -p 9000:9000 -p 2222:2222 -p 5671:5671 \
  --shm-size=2g \
  --env username_admin_globalaccesslevel=admin \
  --env username_admin_password=admin \
  --name=solace solace/solace-pubsub-standard

### Create a queue and subscribing to a topic
Use the browser to connect to local solace broker http://localhost:8080/#/login
1. Login using username: admin password: admin
2. Click on the default Message VPN.
3. One the left hand side create two queues "test" and "death"
   If you run the amqp-sender/receiver it will automatically create the test queue.
4. Click on the test queue -> goto Subscription tab -> add test topic to it.
   This means we can receive the message from test topic on this queue.
5. Click on the death queue -> goto Subscription tab -> add lastwill topic to it.
   This means when we recieve the message on lastwill it will be forwarded to this queue.

### defect