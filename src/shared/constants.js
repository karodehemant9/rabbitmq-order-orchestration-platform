module.exports = {
  EXCHANGES: {
    ORDER_DIRECT: "order.direct",
    ORDER_TOPIC: "order.topic",
    ORDER_FANOUT: "order.fanout",
    PAYMENT_RETRY: "payment.retry",
    PAYMENT_DLX: "payment.dlx",
  },

  ROUTING_KEYS: {
    PAYMENT: "payment.process",
    ORDER_CREATED: "order.created",
  },

  QUEUES: {
    PAYMENT: "payment.queue",
    EMAIL: "email.queue",
    ANALYTICS: "analytics.queue",
    AUDIT: "audit.queue",
    PAYMENT_RETRY: "payment.retry.queue",
    PAYMENT_DLQ: "payment.dlq",
  },
};
