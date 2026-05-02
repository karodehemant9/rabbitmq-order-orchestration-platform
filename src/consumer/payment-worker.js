const connect = require("../shared/rabbitmq");

const logger = require("../shared/logger");

const { QUEUES, EXCHANGES, ROUTING_KEYS } = require("../shared/constants");

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

      maxPriority: 10,
    },
  );

  await channel.bindQueue(
    QUEUES.PAYMENT,

    EXCHANGES.ORDER_DIRECT,

    ROUTING_KEYS.PAYMENT,
  );

  channel.prefetch(1);
  channel.consume(
    QUEUES.PAYMENT,

    (message) => {
      const order = JSON.parse(message.content.toString());

      order.retryCount ||= 0;

      if (Math.random() < 0.4) {
        order.retryCount++;

        if (order.retryCount >= 3) {
          channel.publish(
            EXCHANGES.PAYMENT_DLX,

            "failed",

            Buffer.from(JSON.stringify(order)),
          );

          logger.error({
            message: "Moved to DLQ",

            order,
          });
        } else {
          channel.sendToQueue(
            QUEUES.PAYMENT_RETRY,

            Buffer.from(JSON.stringify(order)),
          );

          logger.warn({
            message: "Retrying later",

            order,
          });
        }

        channel.ack(message);

        return; // IMPORTANT
      }

      logger.info({
        message: "Payment success",

        order,
      });

      channel.ack(message);
    },
  );
}

start();
