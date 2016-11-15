# Prototype of Control GUI

## Technologies
- node.js
- ZeroMQ
- WebSockets
- OAuth 2
- JSON Web Tokens
- jQuery

## Functional modules
1. Client side application that consists of custom jQuery widgets
2. HTTP server/REST API
3. WebSocket server that communicates with Control subsystem via ZeroMQ

## Features
- HTTPS and WSS
- HTTP Authentication via CERN OAuth 2 and authorization via e-groups
- Custom WebSocket authentication based on JSON Web Tokens (as it is not standarized in RFC 6455)

## Architecture
![Control GUI Architecture](./docs/images/architecture.png "Prototype of Control GUI - Architecture")

## Authentication and authorization flow

![Control GUI Authentication](./docs/images/auth.png "Authentication and authorization flow")
