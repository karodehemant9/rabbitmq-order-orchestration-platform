module.exports = {
  EXCHANGES: {
    ORDER_DIRECT: "order.direct",
    ORDER_TOPIC: "order.topic",
  },

  ROUTING_KEYS: {
    PAYMENT: "payment.process",
    ORDER_CREATED: "order.created",
  },

  QUEUES: {
    PAYMENT: "payment.queue",
    EMAIL: "email.queue",
    ANALYTICS: "analytics.queue",
  },
};
