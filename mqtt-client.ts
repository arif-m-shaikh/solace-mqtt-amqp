import mqtt from "mqtt";

const lastmessage = {
    body: "This is the last message I am sending!!",
    message_id: '0'
};

const client = mqtt.connect("mqtt://mymachine", {
    will: {
        topic: "lastwill",
        payload: Buffer.from(JSON.stringify(lastmessage))
    }
});

function delay<T>(t: number, value?: T): Promise<T | void> {
    return new Promise((resolve) => setTimeout(() => resolve(value), t));
}

client.on("connect", async () => {

    let message_id = 0;
    while (message_id < 30) {
        ++message_id
        const message = {
            body: "Hello World!!",
            message_id: message_id.toString()
        };

        client.publish("best", JSON.stringify(message));
        console.log(">>>>>Published ====> Message id: %d",
            message_id);
        await delay(1000)
    }

    client.on("close", async () => {
        console.log("client disconneted...")
    })

    client.end()
});

