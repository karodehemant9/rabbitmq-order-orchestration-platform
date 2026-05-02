const connect = require("../shared/rabbitmq");

const logger = require("../shared/logger");

const { QUEUES } = require("../shared/constants");

async function start() {
  const connection = await connect();

  const channel = await connection.createChannel();

  channel.consume(
    QUEUES.PAYMENT_DLQ,

    (message) => {
      logger.error({
        message: "Dead letter received",
      });

      channel.ack(message);
    },
  );
}

start();
