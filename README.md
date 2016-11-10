# Prototype of Control GUI

## Modules:
- Client side application that cosists of jQuery custom widgets
- HTTP server
- WebSocket server that communicates with Control Agent via ZeroMQ

## Features:
- HTTPS and WSS
- Authentication and authorization via CERN OAuth 2 and e-groups
- In addition WebSocket authentication via JSON Web Tokens (as RFC 6455 does not foreseen any)

![Control GUI Architecture](./docs/images/architecture.png "Prototype of Control GUI - Architecture")
