const connect = require("../shared/rabbitmq");

const logger = require("../shared/logger");

const { QUEUES } = require("../shared/constants");

async function start() {
  const connection = await connect();

  const channel = await connection.createChannel();

  await channel.assertQueue(QUEUES.PAYMENT);

  channel.prefetch(1);

  channel.consume(
    QUEUES.PAYMENT,

    (message) => {
      const workerId = process.pid;

      logger.info({
        workerId,

        message: "Processing payment",
      });

      setTimeout(
        () => {
          channel.ack(message);
        },

        3000,
      );
    },
  );
}

start();
