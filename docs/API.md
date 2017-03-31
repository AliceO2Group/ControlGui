## Classes

<dl>
<dt><a href="#OAuth">OAuth</a></dt>
<dd><p>Authenticates users via CERN OAuth 2.0
If successful, queries user account details</p>
</dd>
<dt><a href="#HTTPServer">HTTPServer</a></dt>
<dd><p>HTTPs server needed by REST API</p>
</dd>
<dt><a href="#JwtToken">JwtToken</a></dt>
<dd><p>Contains Java Web Token functionality: generate, verify</p>
</dd>
<dt><a href="#Padlock">Padlock</a></dt>
<dd><p>Manages locking mechanism (only single user can execute commands at the same time).
Other users can preview changes only</p>
</dd>
<dt><a href="#Response">Response</a></dt>
<dd><p>Helper class that allows to prepare response for users request</p>
</dd>
<dt><a href="#WebSocket">WebSocket</a></dt>
<dd><p>The class that represents WebSocket server</p>
</dd>
<dt><a href="#ZeroMQClient">ZeroMQClient</a></dt>
<dd><p>ZeroMQ client that connects to O2 Control Master via on of two endpoints: sub or req</p>
</dd>
</dl>

<a name="OAuth"></a>

## OAuth
Authenticates users via CERN OAuth 2.0
If successful, queries user account details

**Kind**: global class  
**Author**: Adam Wegrzynek <adam.wegrzynek@cern.ch>  

* [OAuth](#OAuth)
    * [new OAuth()](#new_OAuth_new)
    * [.oAuthCallback(emitter, code)](#OAuth+oAuthCallback)
    * [.oAuthGetUserDetails(token, emitter)](#OAuth+oAuthGetUserDetails)

<a name="new_OAuth_new"></a>

### new OAuth()
Creates oauth object based on id and secret stored in config file

<a name="OAuth+oAuthCallback"></a>

### oAuth.oAuthCallback(emitter, code)
OAuth redirection callback (called by library)

**Kind**: instance method of <code>[OAuth](#OAuth)</code>  

| Param | Type |
| --- | --- |
| emitter | <code>object</code> | 
| code | <code>number</code> | 

<a name="OAuth+oAuthGetUserDetails"></a>

### oAuth.oAuthGetUserDetails(token, emitter)
Queries user details using received access token

**Kind**: instance method of <code>[OAuth](#OAuth)</code>  

| Param | Type |
| --- | --- |
| token | <code>string</code> | 
| emitter | <code>object</code> | 

<a name="HTTPServer"></a>

## HTTPServer
HTTPs server needed by REST API

**Kind**: global class  
**Author**: Adam Wegrzynek <adam.wegrzynek@cern.ch>  

* [HTTPServer](#HTTPServer)
    * [new HTTPServer(credentials, app)](#new_HTTPServer_new)
    * [.server](#HTTPServer+server) ⇒ <code>object</code>
    * [.specifyRoutes()](#HTTPServer+specifyRoutes)
    * [.enableHttpRedirect()](#HTTPServer+enableHttpRedirect)
    * [.oAuthAuthorize(res)](#HTTPServer+oAuthAuthorize)
    * [.oAuthCallback(req, res)](#HTTPServer+oAuthCallback)
    * [.renderPage(page, data)](#HTTPServer+renderPage) ⇒ <code>string</code>
    * [.jwtVerify(req, res, next)](#HTTPServer+jwtVerify)
    * [.runs(req, res)](#HTTPServer+runs)

<a name="new_HTTPServer_new"></a>

### new HTTPServer(credentials, app)
Sets up the server, routes and binds HTTP and HTTPs sockets


| Param | Type | Description |
| --- | --- | --- |
| credentials | <code>object</code> | private and public key file paths |
| app | <code>object</code> |  |

<a name="HTTPServer+server"></a>

### httpServer.server ⇒ <code>object</code>
HTTPs server getter

**Kind**: instance property of <code>[HTTPServer](#HTTPServer)</code>  
**Returns**: <code>object</code> - - HTTPs server  
<a name="HTTPServer+specifyRoutes"></a>

### httpServer.specifyRoutes()
Specified routes and their callbacks

**Kind**: instance method of <code>[HTTPServer](#HTTPServer)</code>  
<a name="HTTPServer+enableHttpRedirect"></a>

### httpServer.enableHttpRedirect()
Redirects HTTP to HTTPs

**Kind**: instance method of <code>[HTTPServer](#HTTPServer)</code>  
<a name="HTTPServer+oAuthAuthorize"></a>

### httpServer.oAuthAuthorize(res)
OAuth redirection

**Kind**: instance method of <code>[HTTPServer](#HTTPServer)</code>  

| Param | Type | Description |
| --- | --- | --- |
| res | <code>object</code> | HTTP response |

<a name="HTTPServer+oAuthCallback"></a>

### httpServer.oAuthCallback(req, res)
OAuth callback if authentication succeeds.

**Kind**: instance method of <code>[HTTPServer](#HTTPServer)</code>  

| Param | Type | Description |
| --- | --- | --- |
| req | <code>object</code> | HTTP request |
| res | <code>object</code> | HTTP response |

<a name="HTTPServer+renderPage"></a>

### httpServer.renderPage(page, data) ⇒ <code>string</code>
Renders template using mustache

**Kind**: instance method of <code>[HTTPServer](#HTTPServer)</code>  
**Returns**: <code>string</code> - - HTML page  

| Param | Type | Description |
| --- | --- | --- |
| page | <code>string</code> | template file path |
| data | <code>object</code> | data to fill the template with |

<a name="HTTPServer+jwtVerify"></a>

### httpServer.jwtVerify(req, res, next)
Verified JWT token synchronously!

**Kind**: instance method of <code>[HTTPServer](#HTTPServer)</code>  
**Todo**

- [ ] use promises or generators to call it asynchronously!


| Param | Type | Description |
| --- | --- | --- |
| req | <code>object</code> | HTTP request |
| res | <code>object</code> | HTTP response |
| next | <code>function</code> | passes control to next matching route |

<a name="HTTPServer+runs"></a>

### httpServer.runs(req, res)
For the test purposes
Simply returns JSON encoded fixed run number

**Kind**: instance method of <code>[HTTPServer](#HTTPServer)</code>  

| Param | Type | Description |
| --- | --- | --- |
| req | <code>object</code> | HTTP request |
| res | <code>object</code> | HTTP response |

<a name="JwtToken"></a>

## JwtToken
Contains Java Web Token functionality: generate, verify

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
Generates encrypted token with user id and access level
Sets expiration time and sings it using secret

**Kind**: instance method of <code>[JwtToken](#JwtToken)</code>  
**Returns**: <code>object</code> - generated token  

| Param | Type | Description |
| --- | --- | --- |
| personid | <code>number</code> | CERN user id |
| username | <code>string</code> | CERN username |
| access | <code>number</code> | level of access |

<a name="JwtToken+refreshToken"></a>

### jwtToken.refreshToken(token) ⇒ <code>object</code>
When the token expires, this method allows to refresh it
It skips expiration check and verifies (already expired) token based on maxAge parameter
(maxAge >> expiration).
Then it creates a new token using parameters of the old one and ships it to the user
If maxAge timeouts, the user needs to re-login via OAuth

**Kind**: instance method of <code>[JwtToken](#JwtToken)</code>  
**Returns**: <code>object</code> - new token or false in case of failure  

| Param | Type | Description |
| --- | --- | --- |
| token | <code>object</code> | expired token |

<a name="JwtToken+verify"></a>

### jwtToken.verify(token) ⇒ <code>object</code>
Verifies user token using the same secret as in generateToken method

**Kind**: instance method of <code>[JwtToken](#JwtToken)</code>  
**Returns**: <code>object</code> - whether operation was successful, if so decoded data are passed as well  

| Param | Type | Description |
| --- | --- | --- |
| token | <code>object</code> | token to be verified |

<a name="Padlock"></a>

## Padlock
Manages locking mechanism (only single user can execute commands at the same time).
Other users can preview changes only

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
Processes "lock-*" commands
Ensures that singe user to holds the lock

**Kind**: instance method of <code>[Padlock](#Padlock)</code>  
**Returns**: <code>object</code> - - JSON message  

| Param | Type | Description |
| --- | --- | --- |
| command | <code>string</code> | command name |
| id | <code>number</code> | user id |

<a name="Padlock+isHoldingLock"></a>

### padlock.isHoldingLock(id) ⇒ <code>bool</code>
Checks whether user with given id holds the lock

**Kind**: instance method of <code>[Padlock](#Padlock)</code>  
**Returns**: <code>bool</code> - true if user holods the lock, false otherwise  

| Param | Type | Description |
| --- | --- | --- |
| id | <code>number</code> | user id |

<a name="Padlock+lock"></a>

### padlock.lock(id) ⇒ <code>bool</code>
Sets the lock ownership to given user

**Kind**: instance method of <code>[Padlock](#Padlock)</code>  
**Returns**: <code>bool</code> - true if succeeds, false otherwise  

| Param | Type | Description |
| --- | --- | --- |
| id | <code>number</code> | user id |

<a name="Padlock+unlock"></a>

### padlock.unlock(id) ⇒ <code>bool</code>
Remove ownership of current holder of the lock

**Kind**: instance method of <code>[Padlock](#Padlock)</code>  
**Returns**: <code>bool</code> - true if succeeds, false otherwise  

| Param | Type | Description |
| --- | --- | --- |
| id | <code>number</code> | user id |

<a name="Response"></a>

## Response
Helper class that allows to prepare response for users request

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
Sets initial variables


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
Formats the reponse to object that is ready to be formatted into JSON

**Kind**: instance property of <code>[Response](#Response)</code>  
**Returns**: <code>object</code> - response  
<a name="Response+_message"></a>

### response._message(code) ⇒ <code>string</code>
Provides HTTP message based on code

**Kind**: instance method of <code>[Response](#Response)</code>  
**Returns**: <code>string</code> - message for given code  

| Param | Type |
| --- | --- |
| code | <code>number</code> | 

<a name="Response+command"></a>

### response.command(command) ⇒ <code>object</code>
Command setter

**Kind**: instance method of <code>[Response](#Response)</code>  
**Returns**: <code>object</code> - 'this' to allow function call chaining  

| Param | Type | Description |
| --- | --- | --- |
| command | <code>string</code> | user request command |

<a name="Response+broadcast"></a>

### response.broadcast() ⇒ <code>object</code>
Set broadcast flag to true

**Kind**: instance method of <code>[Response](#Response)</code>  
**Returns**: <code>object</code> - 'this' to allow function call chaining  
<a name="Response+payload"></a>

### response.payload(payload) ⇒ <code>object</code>
Payload setter

**Kind**: instance method of <code>[Response](#Response)</code>  
**Returns**: <code>object</code> - 'this' to allow function call chaining  

| Param | Type |
| --- | --- |
| payload | <code>object</code> | 

<a name="WebSocket"></a>

## WebSocket
The class that represents WebSocket server

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
Starts up the server and binds event handler


| Param | Type | Description |
| --- | --- | --- |
| httpsServer | <code>object</code> | HTTPS server |

<a name="WebSocket+onmessage"></a>

### webSocket.onmessage(message) ⇒ <code>object</code>
Handles incoming text messages: verifies token and processes request/command

**Kind**: instance method of <code>[WebSocket](#WebSocket)</code>  
**Returns**: <code>object</code> - message to be send back to the user  

| Param | Type |
| --- | --- |
| message | <code>object</code> | 

<a name="WebSocket+jwtVerify"></a>

### webSocket.jwtVerify(token, refresh) ⇒ <code>object</code>
Verifies token, if expired request a new one

**Kind**: instance method of <code>[WebSocket](#WebSocket)</code>  
**Returns**: <code>object</code> - includes either parsed token or response message  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| token | <code>object</code> |  | JWT token |
| refresh | <code>bool</code> | <code>true</code> | whether try to refresh token when expired or not |

<a name="WebSocket+onconnection"></a>

### webSocket.onconnection(client)
Handles client connection and message receiving

**Kind**: instance method of <code>[WebSocket](#WebSocket)</code>  

| Param | Type | Description |
| --- | --- | --- |
| client | <code>object</code> | connected client |

<a name="WebSocket+onclose"></a>

### webSocket.onclose(client)
Handles client disconnection

**Kind**: instance method of <code>[WebSocket](#WebSocket)</code>  

| Param | Type | Description |
| --- | --- | --- |
| client | <code>object</code> | disconnected client |

<a name="WebSocket+broadcast"></a>

### webSocket.broadcast(message)
Broadcasts the message to all connected clients

**Kind**: instance method of <code>[WebSocket](#WebSocket)</code>  

| Param | Type |
| --- | --- |
| message | <code>string</code> | 

<a name="ZeroMQClient"></a>

## ZeroMQClient
ZeroMQ client that connects to O2 Control Master via on of two endpoints: sub or req

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
Creates ZeroMQ socket and binds class methods to basic events


| Param | Type | Description |
| --- | --- | --- |
| ip | <code>string</code> | hostname |
| port | <code>number</code> | port number |
| type | <code>bool</code> | socket type, true = sub. false = req |

<a name="ZeroMQClient+connect"></a>

### zeroMQClient.connect(endpoint)
On-connect event handler

**Kind**: instance method of <code>[ZeroMQClient](#ZeroMQClient)</code>  

| Param | Type |
| --- | --- |
| endpoint | <code>string</code> | 

<a name="ZeroMQClient+disconnect"></a>

### zeroMQClient.disconnect(endpoint)
On-disconnect event handler

**Kind**: instance method of <code>[ZeroMQClient](#ZeroMQClient)</code>  

| Param | Type |
| --- | --- |
| endpoint | <code>string</code> | 

<a name="ZeroMQClient+onmessage"></a>

### zeroMQClient.onmessage(message)
On-message event handler

**Kind**: instance method of <code>[ZeroMQClient](#ZeroMQClient)</code>  

| Param | Type |
| --- | --- |
| message | <code>string</code> | 

<a name="ZeroMQClient+send"></a>

### zeroMQClient.send(message)
Sends message via socket

**Kind**: instance method of <code>[ZeroMQClient](#ZeroMQClient)</code>  

| Param | Type |
| --- | --- |
| message | <code>string</code> | 

