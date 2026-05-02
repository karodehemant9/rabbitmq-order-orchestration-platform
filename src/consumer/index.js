const connect = require("../shared/rabbitmq");

const logger = require("../shared/logger");

const { EXCHANGES, ROUTING_KEYS, QUEUES } = require("../shared/constants");

async function start() {
  const connection = await connect();

  const channel = await connection.createChannel();

  await channel.assertExchange(
    EXCHANGES.ORDER_DIRECT,

    "direct",

    {
      durable: true,
    },
  );

  await channel.assertQueue(
    QUEUES.PAYMENT,

    {
      durable: true,
    },
  );

  await channel.bindQueue(
    QUEUES.PAYMENT,

    EXCHANGES.ORDER_DIRECT,

    ROUTING_KEYS.PAYMENT,
  );

  channel.consume(
    QUEUES.PAYMENT,

    (message) => {
      const order = JSON.parse(message.content.toString());

      logger.info({
        message: "Payment processing",

        order,
      });

      channel.ack(message);
    },
  );
}

start();
