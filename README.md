# Prototype of Control GUI

## Technologies
- node.js
- ZeroMQ
- WebSockets
- OAuth 2
- JSON Web Tokens

## Modules
- Client side application that cosists of custom widgets
- HTTP server
- WebSocket server that communicates with Control Agent via ZeroMQ

## Features
- HTTPS and WSS
- Authentication and authorization via CERN OAuth 2 and e-groups
- In addition WebSocket authentication via JSON Web Tokens (as RFC 6455 does not foreseen any)

## Architecture
![Control GUI Architecture](./docs/images/architecture.png "Prototype of Control GUI - Architecture")

## Authentication and authorization flow

![Control GUI Authentication](./docs/images/auth.png "Authentication and authorization flow")
