## Classes

<dl>
<dt><a href="#OAuth">OAuth</a></dt>
<dd><p>Authenticates users via CERN OAuth 2.0.
Gathers user account details.</p>
</dd>
<dt><a href="#HttpServer">HttpServer</a></dt>
<dd><p>HTTPS server that handles OAuth and provides REST API.
Each request is authenticated with JWT token.</p>
</dd>
<dt><a href="#JwtToken">JwtToken</a></dt>
<dd><p>Provides JSON Web Token functionality such as token generation and verification.</p>
</dd>
<dt><a href="#Padlock">Padlock</a></dt>
<dd><p>WebSocket module enforcing that only single user is allowed to execute commands at the time.
Remaining connected users behave as spectators.</p>
</dd>
<dt><a href="#Response">Response</a></dt>
<dd><p>WebSocket module that allows to create response to user request.
It&#39;s based on HTTP status codes.</p>
</dd>
<dt><a href="#WebSocket">WebSocket</a></dt>
<dd><p>It represents WebSocket server (RFC 6455).
In addition, it provides custom authentication with JWT tokens.</p>
</dd>
<dt><a href="#ZeroMQClient">ZeroMQClient</a></dt>
<dd><p>ZeroMQ client that communicates with Control Master prcess via one of two supported
socket patterns (sub and req).</p>
</dd>
</dl>

<a name="OAuth"></a>

## OAuth
Authenticates users via CERN OAuth 2.0.
Gathers user account details.

**Kind**: global class  
**Author**: Adam Wegrzynek <adam.wegrzynek@cern.ch>  
**Todo**

- [ ] e-group authorization


* [OAuth](#OAuth)
    * [new OAuth()](#new_OAuth_new)
    * [.oAuthCallback(emitter, code)](#OAuth+oAuthCallback)
    * [.oAuthGetUserDetails(token, emitter)](#OAuth+oAuthGetUserDetails)

<a name="new_OAuth_new"></a>

### new OAuth()
Creates OAuth object based on id and secret stored in config file.

<a name="OAuth+oAuthCallback"></a>

### oAuth.oAuthCallback(emitter, code)
OAuth redirection callback (called by library).

**Kind**: instance method of <code>[OAuth](#OAuth)</code>  

| Param | Type | Description |
| --- | --- | --- |
| emitter | <code>object</code> |  |
| code | <code>number</code> | authorization code to request access token |

<a name="OAuth+oAuthGetUserDetails"></a>

### oAuth.oAuthGetUserDetails(token, emitter)
Queries user details using received access token.

**Kind**: instance method of <code>[OAuth](#OAuth)</code>  

| Param | Type | Description |
| --- | --- | --- |
| token | <code>string</code> | OAuth access token |
| emitter | <code>object</code> |  |

<a name="HttpServer"></a>

## HttpServer
HTTPS server that handles OAuth and provides REST API.
Each request is authenticated with JWT token.

**Kind**: global class  
**Author**: Adam Wegrzynek <adam.wegrzynek@cern.ch>  

* [HttpServer](#HttpServer)
    * [new HttpServer(credentials, app)](#new_HttpServer_new)
    * [.server](#HttpServer+server) ⇒ <code>object</code>
    * [.specifyRoutes()](#HttpServer+specifyRoutes)
    * [.enableHttpRedirect()](#HttpServer+enableHttpRedirect)
    * [.oAuthAuthorize(res)](#HttpServer+oAuthAuthorize)
    * [.oAuthCallback(req, res)](#HttpServer+oAuthCallback)
    * [.renderPage(page, data)](#HttpServer+renderPage) ⇒ <code>string</code>
    * [.jwtVerify(req, res, next)](#HttpServer+jwtVerify)
    * [.runs(req, res)](#HttpServer+runs)

<a name="new_HttpServer_new"></a>

### new HttpServer(credentials, app)
Sets up the server, routes and binds HTTP and HTTPS sockets.


| Param | Type | Description |
| --- | --- | --- |
| credentials | <code>object</code> | private and public key file paths |
| app | <code>object</code> |  |

<a name="HttpServer+server"></a>

### httpServer.server ⇒ <code>object</code>
HTTPs server getter.

**Kind**: instance property of <code>[HttpServer](#HttpServer)</code>  
**Returns**: <code>object</code> - - HTTPs server  
<a name="HttpServer+specifyRoutes"></a>

### httpServer.specifyRoutes()
Specified routes and their callbacks.

**Kind**: instance method of <code>[HttpServer](#HttpServer)</code>  
<a name="HttpServer+enableHttpRedirect"></a>

### httpServer.enableHttpRedirect()
Redirects HTTP to HTTPS.

**Kind**: instance method of <code>[HttpServer](#HttpServer)</code>  
<a name="HttpServer+oAuthAuthorize"></a>

### httpServer.oAuthAuthorize(res)
OAuth redirection.

**Kind**: instance method of <code>[HttpServer](#HttpServer)</code>  

| Param | Type | Description |
| --- | --- | --- |
| res | <code>object</code> | HTTP response |

<a name="HttpServer+oAuthCallback"></a>

### httpServer.oAuthCallback(req, res)
OAuth callback if authentication succeeds.

**Kind**: instance method of <code>[HttpServer](#HttpServer)</code>  

| Param | Type | Description |
| --- | --- | --- |
| req | <code>object</code> | HTTP request |
| res | <code>object</code> | HTTP response |

<a name="HttpServer+renderPage"></a>

### httpServer.renderPage(page, data) ⇒ <code>string</code>
Renders template using Mustache engine.

**Kind**: instance method of <code>[HttpServer](#HttpServer)</code>  
**Returns**: <code>string</code> - - HTML page  

| Param | Type | Description |
| --- | --- | --- |
| page | <code>string</code> | template file path |
| data | <code>object</code> | data to fill the template with |

<a name="HttpServer+jwtVerify"></a>

### httpServer.jwtVerify(req, res, next)
Verifies JWT token synchronously.

**Kind**: instance method of <code>[HttpServer](#HttpServer)</code>  
**Todo**

- [ ] use promises or generators to call it asynchronously!


| Param | Type | Description |
| --- | --- | --- |
| req | <code>object</code> | HTTP request |
| res | <code>object</code> | HTTP response |
| next | <code>function</code> | passes control to next matching route |

<a name="HttpServer+runs"></a>

### httpServer.runs(req, res)
For the test purposes.
Simply returns JSON encoded fixed run number.

**Kind**: instance method of <code>[HttpServer](#HttpServer)</code>  

| Param | Type | Description |
| --- | --- | --- |
| req | <code>object</code> | HTTP request |
| res | <code>object</code> | HTTP response |

<a name="JwtToken"></a>

## JwtToken
Provides JSON Web Token functionality such as token generation and verification.

**Kind**: global class  
**Author**: Adam Wegrzynek <adam.wegrzynek@cern.ch>  

* [JwtToken](#JwtToken)
    * [new JwtToken(config)](#new_JwtToken_new)
    * [.generateToken(personid, username, access)](#JwtToken+generateToken) ⇒ <code>object</code>
    * [.refreshToken(token)](#JwtToken+refreshToken) ⇒ <code>object</code>
    * [.verify(token)](#JwtToken+verify) ⇒ <code>object</code>

<a name="new_JwtToken_new"></a>

### new JwtToken(config)
Stores secret


| Param | Type | Description |
| --- | --- | --- |
| config | <code>object</code> | jwt cofiguration object |

<a name="JwtToken+generateToken"></a>

### jwtToken.generateToken(personid, username, access) ⇒ <code>object</code>
Generates encrypted token with user id and access level.
Sets expiration time and sings it using secret.

**Kind**: instance method of <code>[JwtToken](#JwtToken)</code>  
**Returns**: <code>object</code> - generated token  

| Param | Type | Description |
| --- | --- | --- |
| personid | <code>number</code> | CERN user id |
| username | <code>string</code> | CERN username |
| access | <code>number</code> | level of access |

<a name="JwtToken+refreshToken"></a>

### jwtToken.refreshToken(token) ⇒ <code>object</code>
When the token expires, this method allows to refresh it.
It skips expiration check and verifies (already expired) token based on maxAge parameter
(maxAge >> expiration).
Then it creates a new token using parameters of the old one and ships it to the user.
If maxAge timeouts, the user needs to re-login via OAuth.

**Kind**: instance method of <code>[JwtToken](#JwtToken)</code>  
**Returns**: <code>object</code> - new token or false in case of failure  

| Param | Type | Description |
| --- | --- | --- |
| token | <code>object</code> | expired token |

<a name="JwtToken+verify"></a>

### jwtToken.verify(token) ⇒ <code>object</code>
Decrypts user token to verify that is vaild.

**Kind**: instance method of <code>[JwtToken](#JwtToken)</code>  
**Returns**: <code>object</code> - whether operation was successful, if so decoded data are passed as well  

| Param | Type | Description |
| --- | --- | --- |
| token | <code>object</code> | token to be verified |

<a name="Padlock"></a>

## Padlock
WebSocket module enforcing that only single user is allowed to execute commands at the time.
Remaining connected users behave as spectators.

**Kind**: global class  
**Author**: Adam Wegrzynek <adam.wegrzynek@cern.ch>  

* [Padlock](#Padlock)
    * [new Padlock()](#new_Padlock_new)
    * [.check(command, id)](#Padlock+check) ⇒ <code>object</code>
    * [.isHoldingLock(id)](#Padlock+isHoldingLock) ⇒ <code>bool</code>
    * [.lock(id)](#Padlock+lock) ⇒ <code>bool</code>
    * [.unlock(id)](#Padlock+unlock) ⇒ <code>bool</code>

<a name="new_Padlock_new"></a>

### new Padlock()
Initialized member variables

<a name="Padlock+check"></a>

### padlock.check(command, id) ⇒ <code>object</code>
Processes "lock-*" commands.
Ensures that singe user to holds the lock.

**Kind**: instance method of <code>[Padlock](#Padlock)</code>  
**Returns**: <code>object</code> - - JSON message  

| Param | Type | Description |
| --- | --- | --- |
| command | <code>string</code> | command name |
| id | <code>number</code> | user id |

<a name="Padlock+isHoldingLock"></a>

### padlock.isHoldingLock(id) ⇒ <code>bool</code>
Checks whether user with given id holds the lock.

**Kind**: instance method of <code>[Padlock](#Padlock)</code>  
**Returns**: <code>bool</code> - true if user holods the lock, false otherwise  

| Param | Type | Description |
| --- | --- | --- |
| id | <code>number</code> | user id |

<a name="Padlock+lock"></a>

### padlock.lock(id) ⇒ <code>bool</code>
Sets the lock ownership to given user.

**Kind**: instance method of <code>[Padlock](#Padlock)</code>  
**Returns**: <code>bool</code> - true if succeeds, false otherwise  

| Param | Type | Description |
| --- | --- | --- |
| id | <code>number</code> | user id |

<a name="Padlock+unlock"></a>

### padlock.unlock(id) ⇒ <code>bool</code>
Removes lock  ownership from current holder.

**Kind**: instance method of <code>[Padlock](#Padlock)</code>  
**Returns**: <code>bool</code> - true if succeeds, false otherwise  

| Param | Type | Description |
| --- | --- | --- |
| id | <code>number</code> | user id |

<a name="Response"></a>

## Response
WebSocket module that allows to create response to user request.
It's based on HTTP status codes.

**Kind**: global class  
**Author**: Adam Wegrzynek <adam.wegrzynek@cern.ch>  

* [Response](#Response)
    * [new Response(code)](#new_Response_new)
    * [.getcode](#Response+getcode) ⇒ <code>number</code>
    * [.getcommand](#Response+getcommand) ⇒ <code>string</code>
    * [.getbroadcast](#Response+getbroadcast) ⇒ <code>bool</code>
    * [.getpayload](#Response+getpayload) ⇒ <code>object</code>
    * [.json](#Response+json) ⇒ <code>object</code>
    * [._message(code)](#Response+_message) ⇒ <code>string</code>
    * [.command(command)](#Response+command) ⇒ <code>object</code>
    * [.broadcast()](#Response+broadcast) ⇒ <code>object</code>
    * [.payload(payload)](#Response+payload) ⇒ <code>object</code>

<a name="new_Response_new"></a>

### new Response(code)
Sets initial variables.


| Param | Type | Description |
| --- | --- | --- |
| code | <code>number</code> | response code (based on HTTP) |

<a name="Response+getcode"></a>

### response.getcode ⇒ <code>number</code>
**Kind**: instance property of <code>[Response](#Response)</code>  
**Returns**: <code>number</code> - code  
<a name="Response+getcommand"></a>

### response.getcommand ⇒ <code>string</code>
**Kind**: instance property of <code>[Response](#Response)</code>  
**Returns**: <code>string</code> - command  
<a name="Response+getbroadcast"></a>

### response.getbroadcast ⇒ <code>bool</code>
**Kind**: instance property of <code>[Response](#Response)</code>  
**Returns**: <code>bool</code> - broadcast flag  
<a name="Response+getpayload"></a>

### response.getpayload ⇒ <code>object</code>
**Kind**: instance property of <code>[Response](#Response)</code>  
**Returns**: <code>object</code> - payload  
<a name="Response+json"></a>

### response.json ⇒ <code>object</code>
Formats the reponse to object that is ready to be formatted into JSON.

**Kind**: instance property of <code>[Response](#Response)</code>  
**Returns**: <code>object</code> - response  
<a name="Response+_message"></a>

### response._message(code) ⇒ <code>string</code>
Provides HTTP message based on code.

**Kind**: instance method of <code>[Response](#Response)</code>  
**Returns**: <code>string</code> - message for given code  

| Param | Type |
| --- | --- |
| code | <code>number</code> | 

<a name="Response+command"></a>

### response.command(command) ⇒ <code>object</code>
Command setter.

**Kind**: instance method of <code>[Response](#Response)</code>  
**Returns**: <code>object</code> - 'this' to allow function call chaining  

| Param | Type | Description |
| --- | --- | --- |
| command | <code>string</code> | user request command |

<a name="Response+broadcast"></a>

### response.broadcast() ⇒ <code>object</code>
Set broadcast flag to true.

**Kind**: instance method of <code>[Response](#Response)</code>  
**Returns**: <code>object</code> - 'this' to allow function call chaining  
<a name="Response+payload"></a>

### response.payload(payload) ⇒ <code>object</code>
Payload setter.

**Kind**: instance method of <code>[Response](#Response)</code>  
**Returns**: <code>object</code> - 'this' to allow function call chaining  

| Param | Type |
| --- | --- |
| payload | <code>object</code> | 

<a name="WebSocket"></a>

## WebSocket
It represents WebSocket server (RFC 6455).
In addition, it provides custom authentication with JWT tokens.

**Kind**: global class  
**Author**: Adam Wegrzynek <adam.wegrzynek@cern.ch>  

* [WebSocket](#WebSocket)
    * [new WebSocket(httpsServer)](#new_WebSocket_new)
    * [.onmessage(message)](#WebSocket+onmessage) ⇒ <code>object</code>
    * [.jwtVerify(token, refresh)](#WebSocket+jwtVerify) ⇒ <code>object</code>
    * [.onconnection(client)](#WebSocket+onconnection)
    * [.onclose(client)](#WebSocket+onclose)
    * [.broadcast(message)](#WebSocket+broadcast)

<a name="new_WebSocket_new"></a>

### new WebSocket(httpsServer)
Starts up the server and binds event handler.


| Param | Type | Description |
| --- | --- | --- |
| httpsServer | <code>object</code> | HTTPS server |

<a name="WebSocket+onmessage"></a>

### webSocket.onmessage(message) ⇒ <code>object</code>
Handles incoming text messages: verifies token and processes request/command.

**Kind**: instance method of <code>[WebSocket](#WebSocket)</code>  
**Returns**: <code>object</code> - message to be send back to the user  

| Param | Type |
| --- | --- |
| message | <code>object</code> | 

<a name="WebSocket+jwtVerify"></a>

### webSocket.jwtVerify(token, refresh) ⇒ <code>object</code>
Verifies token, if expired requests a new one.

**Kind**: instance method of <code>[WebSocket](#WebSocket)</code>  
**Returns**: <code>object</code> - includes either parsed token or response message  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| token | <code>object</code> |  | JWT token |
| refresh | <code>bool</code> | <code>true</code> | whether try to refresh token when expired or not |

<a name="WebSocket+onconnection"></a>

### webSocket.onconnection(client)
Handles client connection and message receiving.

**Kind**: instance method of <code>[WebSocket](#WebSocket)</code>  

| Param | Type | Description |
| --- | --- | --- |
| client | <code>object</code> | connected client |

<a name="WebSocket+onclose"></a>

### webSocket.onclose(client)
Handles client disconnection.

**Kind**: instance method of <code>[WebSocket](#WebSocket)</code>  

| Param | Type | Description |
| --- | --- | --- |
| client | <code>object</code> | disconnected client |

<a name="WebSocket+broadcast"></a>

### webSocket.broadcast(message)
Broadcasts the message to all connected clients.

**Kind**: instance method of <code>[WebSocket](#WebSocket)</code>  

| Param | Type |
| --- | --- |
| message | <code>string</code> | 

<a name="ZeroMQClient"></a>

## ZeroMQClient
ZeroMQ client that communicates with Control Master prcess via one of two supported
socket patterns (sub and req).

**Kind**: global class  
**Author**: Adam Wegrzynek <adam.wegrzynek@cern.ch>  

* [ZeroMQClient](#ZeroMQClient)
    * [new ZeroMQClient(ip, port, type)](#new_ZeroMQClient_new)
    * [.connect(endpoint)](#ZeroMQClient+connect)
    * [.disconnect(endpoint)](#ZeroMQClient+disconnect)
    * [.onmessage(message)](#ZeroMQClient+onmessage)
    * [.send(message)](#ZeroMQClient+send)

<a name="new_ZeroMQClient_new"></a>

### new ZeroMQClient(ip, port, type)
Connects to ZeroMQ socket and binds class methods to ZeroMQ events.


| Param | Type | Description |
| --- | --- | --- |
| ip | <code>string</code> | hostname |
| port | <code>number</code> | port number |
| type | <code>bool</code> | socket type, true = sub. false = req |

<a name="ZeroMQClient+connect"></a>

### zeroMQClient.connect(endpoint)
On-connect event handler.

**Kind**: instance method of <code>[ZeroMQClient](#ZeroMQClient)</code>  

| Param | Type |
| --- | --- |
| endpoint | <code>string</code> | 

<a name="ZeroMQClient+disconnect"></a>

### zeroMQClient.disconnect(endpoint)
On-disconnect event handler.

**Kind**: instance method of <code>[ZeroMQClient](#ZeroMQClient)</code>  

| Param | Type |
| --- | --- |
| endpoint | <code>string</code> | 

<a name="ZeroMQClient+onmessage"></a>

### zeroMQClient.onmessage(message)
On-message event handler.

**Kind**: instance method of <code>[ZeroMQClient](#ZeroMQClient)</code>  

| Param | Type |
| --- | --- |
| message | <code>string</code> | 

<a name="ZeroMQClient+send"></a>

### zeroMQClient.send(message)
Sends message via socket.

**Kind**: instance method of <code>[ZeroMQClient](#ZeroMQClient)</code>  

| Param | Type |
| --- | --- |
| message | <code>string</code> | 

