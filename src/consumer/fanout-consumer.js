const connect = require("../shared/rabbitmq");

const logger = require("../shared/logger");

const { EXCHANGES, QUEUES } = require("../shared/constants");

async function start() {
  const connection = await connect();

  const channel = await connection.createChannel();

  await channel.assertExchange(
    EXCHANGES.ORDER_FANOUT,

    "fanout",
  );

  const queues = [QUEUES.EMAIL, QUEUES.ANALYTICS, QUEUES.AUDIT];

  for (const queue of queues) {
    await channel.assertQueue(queue);

    await channel.bindQueue(
      queue,

      EXCHANGES.ORDER_FANOUT,

      "",
    );

    channel.consume(
      queue,

      (message) => {
        logger.info({
          queue,

          message: "Broadcast received",
        });

        channel.ack(message);
      },
    );
  }
}

start();
