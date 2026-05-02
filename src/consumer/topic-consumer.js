const connect = require("../shared/rabbitmq");

const logger = require("../shared/logger");

const { EXCHANGES, QUEUES } = require("../shared/constants");

async function start() {
  const connection = await connect();

  const channel = await connection.createChannel();

  await channel.assertExchange(
    EXCHANGES.ORDER_TOPIC,

    "topic",

    {
      durable: true,
    },
  );

  await channel.assertQueue(QUEUES.EMAIL);

  await channel.assertQueue(QUEUES.ANALYTICS);

  await channel.bindQueue(
    QUEUES.EMAIL,

    EXCHANGES.ORDER_TOPIC,

    "order.*",
  );

  await channel.bindQueue(
    QUEUES.ANALYTICS,

    EXCHANGES.ORDER_TOPIC,

    "order.*",
  );

  channel.consume(
    QUEUES.EMAIL,

    (message) => {
      logger.info("Email sent");

      channel.ack(message);
    },
  );

  channel.consume(
    QUEUES.ANALYTICS,

    (message) => {
      logger.info("Analytics updated");

      channel.ack(message);
    },
  );
}

start();
