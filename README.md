# Control GUI

[![Build Status](https://travis-ci.org/AliceO2Group/ControlGui.svg?branch=master)](https://travis-ci.org/AliceO2Group/ControlGui)
[![Dependencies Status](https://david-dm.org/AliceO2Group/ControlGui/status.svg)](https://david-dm.org/AliceO2Group/ControlGui)
[![devDependencies Status](https://david-dm.org/AliceO2Group/ControlGui/dev-status.svg)](https://david-dm.org/AliceO2Group/ControlGui?type=dev)

The goal of Control GUI Prototype is to identify library and framework sets and develop the core functionalities of common [ALICE O<sup>2</sup>](https://alice-o2.web.cern.ch) Web Applications:
- Server-side (node.js)
  - HTTPS / REST API
  - Authentication via CERN OAuth 2 and authorization via e-groups
- WebSocket (node.js)
  - WebSocket server that can communicate with C++ processes via ZeroMQ (C++ library available in another repo)
  - Custom WebSocket authentication based on JSON Web Tokens
- Front-end (JavaScript/jQuery)
  - Core modules as custom jQuery widgets

## Control specific functionality developed so far
1. Padlock module - single user that owns the lock is allowed to execute commands, other connected users act as spectators.

## Installation
1. Install ZeroMQ >= 4.0
2. Clone repository
     ```
     git clone https://github.com/AliceO2Group/ControlGui && cd ControlGui
     ```
3. Install dependencies
     ```
     npm install
     ```

### ZeroMQ custom installation
If you've installed ZeroMQ under custom path, npm install will fail with : *fatal error: zmq.h: No such file or directory*
To resolve this issue you need to recompile zmq module.

1. Go to ControGui directory
2. Download zeromq modue
     ```
     curl `npm v zeromq dist.tarball` | tar xvz && mv package/ node_modules/zeromq/
     ```
3. Add ZeroMQ include directory to *node_modules/zeromq/binding.gyp* file after line 67
     ```
     '-I/<ZeroMQPath>/include/'
     ```
4. Run again 
     ```
     npm install
     ```

## Configuration file
Replace *&lt;tags&gt;* with corresponding data:

1. jwt
  * secret - JWT secret passphrase
  * issuer - name of token issuer
  * expiration - token expiration time (as time literal)
  * maxAge - token refresh expiration time (as time literal)
2. oAuth
  * secret - oAuth secret
  * id - oAuth ID
  * tokenHost - hostname that provides tokens
  * tokenPath - path to token provider
  * authorizePath - verifies access token
  * redirectUri - oAuth application callback
  * scope - oAuth scope (to fetch user details)
  * state - oAuth state (to prevent CSRF attacks)
  * resource - details of resource server
    * hostname - resource server hostname
    * path - resource server path
    * port - resource server port
3. key - private key
4. cert - certificate
5. zeromq
  * sub - details of control publisher endpoint
  * req - details of control reply endpoint
6. http
  * port - http port
  * portSecure - https port
7. log - log filter
  * console - level of logs displayed in console
  * file - level of logs saved into log file

## Run
Rename *config-default.ini* to *config.ini* and run:
```
npm start
```

## Documentation

### API
The JSDoc documentation in Markdown format is available [in here](docs/API.md).

### Application architecture and data flow
The Control GUI web-application consists of multiple modules on server and client side. [This document](docs/ARCH.md) explains applications' functional architecture and data flows used for in varoius scenarios.

### For developers
* [Coding guideline](https://github.com/AliceO2Group/CodingGuidelines)
* [Development environment](docs/DEV.md)
