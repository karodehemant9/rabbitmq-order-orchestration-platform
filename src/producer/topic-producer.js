const { v4: uuid } = require("uuid");

const connect = require("../shared/rabbitmq");

const logger = require("../shared/logger");

const { EXCHANGES, ROUTING_KEYS } = require("../shared/constants");

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

  setInterval(
    () => {
      const order = {
        orderId: uuid(),

        amount: 1000,
      };

      channel.publish(
        EXCHANGES.ORDER_TOPIC,

        ROUTING_KEYS.ORDER_CREATED,

        Buffer.from(JSON.stringify(order)),
      );

      logger.info({
        message: "Topic order published",

        order,
      });
    },

    1000,
  );
}

start();
