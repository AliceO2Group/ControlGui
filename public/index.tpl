<html>
<head>
<link rel="stylesheet" href="/libs/jquery-ui.css">
<style>
body {
  margin: 20px;
}

button {
  padding: 10px;
}

textarea {
  width: 500px;
  height: 150px;
}

#overlay {
  position:fixed;
  top:0;
  left:0;
  background:rgba(0,0,0,0.6);
  z-index:5;
  padding: 30%;
  width:100%;
  height:100%;
  visibility: hidden;
  font-size: 40px;
  font-color: #fff;
}

.is-invisible {
  display: none;
}
</style>
<script src="/libs/jquery.js"></script>
<script src="/libs/jquery-ui.js"></script>
<script src="websocket-client.js"></script>
<script src="padlock.widget.js"></script>
<script>
$(function() {
  var ws = new WebSocketClient(
    {{personid}},
    '{{token}}',
    '{{oauth}}'
  );
  ws.onclose(console.log);
  ws.onopen(console.log);
  ws.onerror(console.log);
  
  var padlock = $.o2.padlock({
    id: {{personid}}
  }, $('#padlock') );

  ws.bind('lock-get', function(data) {
    padlock.lock(data.payload.id);
    $('#execute-zeromq').prop('disabled', false).removeClass("ui-state-disabled");
  });

  ws.bind('lock-release', function(data) {
    padlock.unlock();
    $('#execute-zeromq').prop('disabled', true).addClass("ui-state-disabled");
  });

  ws.bind('lock-check', function(data) {
    if (data.payload.locked) padlock.lock(data.payload.id);
    else padlock.unlock();
  });
 
  /// button listener - sends commands to server
  $('button').on('click', function() {
    ws.setFilter(function(message) {
      return (message.command != 'test');
    });
    ws.send({command : this.id, value: Math.random()*100});
  });

  ws.bind('authed', function() {
    ws.send({command: 'lock-check'});
  });
  ws.bind('close', function() {
    $('#overlay').css('visibility', 'visible');
  });
});
</script>
</head>
<body>
<h2>Hello, {{name}} (@{{username}})</h2>
<h3>Commands</h3>
<button id="lock-get" class="ui-button ui-corner-all ui-widget">Lock</button>
<button id="lock-release" class="ui-button ui-corner-all ui-widget">Unlock</button>
<button id="lock-check" class="ui-button ui-corner-all ui-widget">Check lock</button>
<button id="test-zeromq" class="ui-button ui-corner-all ui-widget">Request test value</button>
<button id="execute-zeromq" class="ui-button ui-corner-all ui-widget ui-state-disabled">Execute test command</button>
<br><br>
<h3>Lock icon</h3>
<span id="padlock" class="ui-icon ui-icon-locked"></span>
<br><br>
<h3>Messages arrived</h3>
<textarea id="messages" class="ui-widget ui-state-default ui-corner-all"></textarea>
<br><br>
<h3>Console log</h3>
<textarea id="console" class="ui-widget ui-state-default ui-corner-all"></textarea>
<div id="overlay"></div>
<div>Test var test: {{test}}</div>
</body>
</html>
