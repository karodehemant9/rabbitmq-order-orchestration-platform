# RabbitMQ Order Orchestration Platform

A production-grade asynchronous order orchestration platform built to demonstrate how modern distributed systems use **RabbitMQ for reliable command execution and task orchestration.**

This platform simulates how companies like:

- Amazon
- Flipkart
- Swiggy
- Razorpay

process customer orders asynchronously while keeping APIs fast, resilient, and horizontally scalable.

The platform demonstrates:

- asynchronous order processing
- exchange routing
- retries
- TTL queues
- dead-letter queues
- manual acknowledgements
- backpressure handling
- fault isolation
- idempotent consumers

---

# Business Problem

When a customer places an order, multiple downstream systems must execute:

- payment authorization
- inventory reservation
- notification delivery
- invoice generation
- fraud checks

Running these synchronously creates:

- high latency
- blocked application threads
- cascading failures
- tight coupling
- poor scalability

Modern systems solve this using **message-driven orchestration.**

This platform demonstrates exactly that.

---

# Architecture

```text
                           CLIENT

                             │
                             │ Place Order
                             ▼

                      Order API (Producer)

                             │
                             ▼


                          RabbitMQ


                     Exchange Layer


 ┌────────────────────────────────────────────────────────────┐
 │                                                            │
 │      Direct      Topic      Fanout      Headers            │
 │                                                            │
 └────────────────────────────────────────────────────────────┘


        │                │                │

        ▼                ▼                ▼


   Payment Queue    Inventory Queue   Notification Queue


        │                │                │

        ▼                ▼                ▼


     Worker           Worker           Worker


        │

   success / failure


        │

        ▼


         Retry Queue (TTL)


        │

        ▼


      Dead Letter Exchange


        │

        ▼


          DLQ Consumer
```

---

# Tech Stack

## Runtime

- Node.js
- Express

## Messaging

- RabbitMQ
- amqplib

## Logging

- Winston

## Containers

- Docker
- Docker Compose

---

# Folder Structure

```text
rabbitmq-order-orchestration-platform/

├── services/
│
├── producer/
│   └── index.js
│
├── consumers/
│   ├── payment-worker/
│   ├── inventory-worker/
│   ├── notification-worker/
│   ├── retry-worker/
│   └── dlq-worker/
│
├── shared/
│   ├── events/
│   │   ├── rabbitmq.js
│   │   ├── constants.js
│   │
│   └── logger/
│
├── docker-compose.yml
├── package.json
└── .env
```

---

# End-to-End Request Flow

# Step 1 — Order Placement

Client sends:

```http
POST /orders
```

Example:

```json
{
  "orderId": "ord_123",
  "amount": 5000
}
```

---

# Step 2 — Producer

Order API publishes:

```json
order.created
```

to RabbitMQ exchange.

---

# Step 3 — Exchange Routing

RabbitMQ routes the message to multiple queues.

## Payment Queue

Processes:

- card authorization
- transaction validation

---

## Inventory Queue

Processes:

- stock reservation
- inventory locking

---

## Notification Queue

Processes:

- email
- SMS
- push notifications

---

# Step 4 — Worker Processing

Each worker:

- consumes messages
- processes business logic
- ACKs only on success

---

# Step 5 — Failure Handling

If processing fails:

## Retry Queue

Message is delayed using:

- TTL
- delayed requeue

---

## Dead Letter Queue

After max retries:

message is moved to DLQ.

---

## DLQ Consumer

Failed messages are isolated for:

- debugging
- reprocessing
- operational investigation

---

# Reliability Patterns

# Manual ACK

Workers ACK only after successful processing.

Ensures:

- at-least-once delivery

---

# Retry Queues

Transient failures automatically retried.

Uses:

- TTL
- delayed requeue

---

# Dead Letter Queues

Poison messages safely isolated.

---

# QoS / Prefetch

Workers limit message consumption.

Prevents:

- overload
- memory spikes

---

# Idempotent Consumers

Duplicate deliveries never corrupt business state.

---

# Backpressure

RabbitMQ naturally buffers producer spikes.

---

# Exchange Patterns Implemented

# Direct Exchange

One-to-one routing.

---

# Topic Exchange

Pattern-based routing.

---

# Fanout Exchange

Broadcast routing.

---

# Headers Exchange

Metadata-based routing.

---

# Tradeoffs

# Why RabbitMQ?

RabbitMQ is ideal for:

- command execution
- task orchestration
- retries
- routing

Tradeoff:

Messages are not replayable like Kafka.

---

# Why Manual ACK?

Ensures:

- reliable processing

Tradeoff:

Duplicate deliveries are possible.

---

# Why TTL-Based Retries?

Simple and production proven.

Tradeoff:

Not ideal for very complex retry workflows.

---

# Scaling Considerations

Current deployment:

Single broker.

Can scale by:

## RabbitMQ

- quorum queues
- mirrored queues

---

## Consumers

Horizontal worker scaling.

---

## Retry Infrastructure

Dedicated retry clusters.

---

## Monitoring

Prometheus + Grafana.

---

# Interview Talking Points

This project demonstrates:

## RabbitMQ Internals

- exchanges
- bindings
- routing keys
- queues

## Reliability

- retries
- TTL
- DLQ
- manual ACK

## Performance

- QoS
- prefetch
- backpressure

## Distributed Systems

- asynchronous orchestration
- fault isolation
- eventual consistency

Interview one-liner:

> I built an asynchronous order orchestration platform where RabbitMQ routes order commands to independent payment, inventory, and notification workers, with retries, dead-letter queues, manual acknowledgements, and backpressure controls.

---

# API Examples

# Place Order

```http
POST /orders
```

Example:

```json
{
  "orderId": "ord_123",
  "amount": 5000
}
```

Response:

```json
{
  "status": "accepted"
}
```

---

# RabbitMQ Dashboard

```text
http://localhost:15672
```

Default credentials:

```text
guest / guest
```

---

# Local Setup

# Clone

```bash
git clone https://github.com/karodehemant9/rabbitmq-order-orchestration-platform.git
```

---

# Install

```bash
npm install
```

---

# Start Infrastructure

```bash
docker compose up -d
```

Starts:

- RabbitMQ

---

# Start Producer

```bash
npm run producer
```

---

# Start Workers

```bash
npm run payment
npm run inventory
npm run notification
npm run retry
npm run dlq
```

---

# Test

Place order:

```bash
curl.exe -X POST http://localhost:3000/orders
```

---

# Monitoring

## RabbitMQ Dashboard

```text
http://localhost:15672
```

Monitor:

- exchanges
- queues
- retries
- dead letters

---

# Screenshots

## Exchanges

(Add screenshot)

---

## Queues

(Add screenshot)

---

## Retry Queue

(Add screenshot)

---

## Dead Letter Queue

(Add screenshot)

---

# Future Improvements

## Persistent Order Store

MongoDB / PostgreSQL.

## Security

TLS.

## Monitoring

Prometheus + Grafana.

## Tracing

OpenTelemetry.

## Schema Validation

JSON schema.

## Deployment

Kubernetes.

## Multi-Broker

RabbitMQ cluster.

---

# Author

Built for backend engineering interviews, messaging systems, and production-grade asynchronous orchestration.
