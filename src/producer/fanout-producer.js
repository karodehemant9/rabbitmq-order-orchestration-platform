const { v4: uuid } = require("uuid");

const connect = require("../shared/rabbitmq");

const logger = require("../shared/logger");

const { EXCHANGES } = require("../shared/constants");

async function start() {
  const connection = await connect();

  const channel = await connection.createChannel();

  await channel.assertExchange(
    EXCHANGES.ORDER_FANOUT,

    "fanout",

    {
      durable: true,
    },
  );

  setInterval(
    () => {
      const order = {
        orderId: uuid(),
      };

      channel.publish(
        EXCHANGES.ORDER_FANOUT,

        "",

        Buffer.from(JSON.stringify(order)),
      );

      logger.info({
        message: "Broadcast sent",

        order,
      });
    },

    1000,
  );
}

start();
