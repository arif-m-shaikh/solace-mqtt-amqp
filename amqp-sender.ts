import {
    Connection, Sender, EventContext, Message, ConnectionOptions, Delivery, SenderOptions, delay
} from "rhea-promise"
import * as dotenv from "dotenv"
import { getConnection } from "./amqp-common";
dotenv.config()
const senderAddressList = ["test", "death"];

async function getSender(connection: Connection, address: string): Promise<Sender> {
    const senderName = "sender-1";
    const senderOptions: SenderOptions = {
        name: senderName,
        target: {
            address: address
        },
        onError: (context: EventContext) => {
            const senderError = context.sender && context.sender.error;
            if (senderError) {
                console.log(">>>>> [%s] An error occurred for sender '%s': %O.",
                    connection.id, senderName, senderError);
            }
        },
        onSessionError: (context: EventContext) => {
            const sessionError = context.session && context.session.error;
            if (sessionError) {
                console.log(">>>>> [%s] An error occurred for session of sender '%s': %O.",
                    connection.id, senderName, sessionError);
            }
        }
    };

    const sender: Sender = await connection.createSender(senderOptions);
    return sender
}

async function sendMessageToSender(sender: Sender, message: Message) {

    // Please, note that we are not awaiting on sender.send()
    // You will notice that `delivery.settled` will be `false`.
    const delivery: Delivery = sender.send(message);
    console.log(">>>>>Delivery id: %d, settled: %s ====> Message id: %d",
        delivery.id,
        delivery.settled,
        message.message_id);
}

async function main(): Promise<void> {
    const connection: Connection = getConnection();
    await connection.open();

    const senderList = await Promise.all(
        senderAddressList.map(queueName => getSender(connection, queueName))
    );

    let message_id = 0;
    while (true) {
        ++message_id;
        const message: Message = {
            body: "Hello World!!",
            message_id: message_id.toString()
        };

        // Please, note that we are not awaiting on sender.send()
        // You will notice that `delivery.settled` will be `false`.
        await Promise.all(
            senderList.map(sender => sendMessageToSender(sender, message))
        );
        await delay(1000);
    }

    await Promise.all(
        senderList.map(sender => sender.close())
    );
    await connection.close();


}

main().catch((err) => console.log(err));



