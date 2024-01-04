import {
    Connection, Receiver, EventContext, ConnectionOptions, ReceiverOptions, delay, ReceiverEvents
} from "rhea-promise";

import * as dotenv from "dotenv"; // Optional for loading environment configuration from a .env (config) file
import { getConnection } from "./amqp-common";
dotenv.config();

const host = process.env.AMQP_HOST || "mymachine";
const username = process.env.AMQP_USERNAME || "arif";
const password = process.env.AMQP_PASSWORD || "arif";
const port = parseInt(process.env.AMQP_PORT || "5672");
const receiverAddressList = ["test", "death"];

async function getReceiver(connection: Connection, address: string): Promise<Receiver> {
    const receiverName = "receiver-1";
    const receiverOptions: ReceiverOptions = {
        name: receiverName,
        source: {
            address: address
        },
        // onError: (context: EventContext) => {
        //     const receiverError = context.receiver && context.receiver.error;
        //     if (receiverError) {
        //         console.log(">>>>> [%s] An error occurred for receiving '%s': %O.",
        //             connection.id, receiverName, receiverError);
        //     }
        // },
        onSessionError: (context: EventContext) => {
            const sessionError = context.session && context.session.error;
            if (sessionError) {
                console.log(">>>>> [%s] An error occurred for session of receiver '%s': %O.",
                    connection.id, receiverName, sessionError);
            }
        }
    };

    const receiver: Receiver = await connection.createReceiver(receiverOptions);
    return receiver
}

async function createReceiver(connection: Connection, receiverAddress: string): Promise<Receiver> {
    const receiver: Receiver = await getReceiver(connection, receiverAddress);

    receiver.on(ReceiverEvents.message, (context: EventContext) => {
        console.log("topic %s msg=>: %O", receiverAddress, context.message?.body.content.toString());
        //console.log("Received message: %O", context.message);
    });

    receiver.on(ReceiverEvents.receiverError, (context: EventContext) => {
        const receiverError = context.receiver && context.receiver.error;
        if (receiverError) {
            const receiverName = "receiver-1";
            console.log(">>>>> [%s] An error occurred for receiver '%s': %O.",
                connection.id, receiverName, receiverError);
        }
    });

    return receiver
}

async function main(): Promise<void> {
    const connection: Connection = getConnection()
    await connection.open();

    const recieverList = await Promise.all(
        receiverAddressList.map(queueName => createReceiver(connection, queueName))
    );

    await delay(120000);
    await Promise.all(
        recieverList.map(receiver => receiver.close())
    );
    await connection.close();
}

main().catch((err) => console.log(err));


