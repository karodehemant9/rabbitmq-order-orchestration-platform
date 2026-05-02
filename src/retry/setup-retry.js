const connect = require("../shared/rabbitmq");

const { QUEUES, EXCHANGES } = require("../shared/constants");

async function setup() {
  const connection = await connect();

  const channel = await connection.createChannel();

  await channel.assertExchange(
    EXCHANGES.PAYMENT_DLX,

    "direct",
  );

  await channel.assertQueue(QUEUES.PAYMENT_DLQ);

  await channel.bindQueue(
    QUEUES.PAYMENT_DLQ,

    EXCHANGES.PAYMENT_DLX,

    "failed",
  );

  await channel.assertQueue(
    QUEUES.PAYMENT_RETRY,

    {
      deadLetterExchange: EXCHANGES.ORDER_DIRECT,

      deadLetterRoutingKey: "payment.process",

      messageTtl: 5000,
    },
  );

  console.log("Retry setup complete");

  process.exit(0);
}

setup();
