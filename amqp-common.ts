import {
    Connection, Sender, EventContext, Message, ConnectionOptions, Delivery, SenderOptions, delay
} from "rhea-promise"
import * as dotenv from "dotenv"
dotenv.config()

const host = process.env.AMQP_HOST || "mymachine";
const username = process.env.AMQP_USERNAME || "arif";
const password = process.env.AMQP_PASSWORD || "arif";
const port = parseInt(process.env.AMQP_PORT || "5672");
const senderAddress = process.env.SENDER_ADDRESS || "test";

export function getConnection(): Connection {
    const connectionOptions: ConnectionOptions = {
        //transport: "tls",
        host: host,
        hostname: host,
        // username: username,
        // password: password,
        port: port,
        reconnect: false
    };
    const connection: Connection = new Connection(connectionOptions);
    return connection
}