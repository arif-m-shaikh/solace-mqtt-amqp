import mqtt from "mqtt";
const client = mqtt.connect("mqtt://mymachine");

client.on("connect", () => {
    client.subscribe(["best", "lastwill"], (err) => {
        if (!err) {
            console.log("Connected successfully...")
        }
    });
});

client.on("message", (topic, message) => {
    console.log("topic: " + topic + " Msg => " + message.toString());
});