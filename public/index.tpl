<html>
<head>
<link rel="stylesheet" href="libs/jquery-ui.css">
<link rel="stylesheet" href="libs/font-awesome.css">
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

</style>
<script src="libs/jquery-3.1.1.js"></script>
<script src="libs/jquery-ui.js"></script>
<script src="ws.widget.js"></script>
<script src="padlock.widget.js"></script>
<script src="pushnotif.widget.js"></script>
<script>
$(function() {
  /// instance of websocket widget
  var ws = $.o2.websocket({
    // pass url of websocket server
    url: 'wss://{{websockethostname}}',
    // token, cernid, name and username are provided by CERN SSO
    token: '{{token}}',
    id: {{personid}},
  }, $('#ws') );

  var padlock = $.o2.padlock({
    id: {{personid}}
  }, $('#padlock') );

  var notification = $.o2.pushNotification();

  $('#ws').bind('websocketlock-get', function(evt, data) {
    padlock.lock(data.payload.id);
    $('#execute-zeromq').prop('disabled', false).removeClass("ui-state-disabled");
  });

  $('#ws').bind('websocketlock-release', function(evt, data) {
    padlock.unlock();
    $('#execute-zeromq').prop('disabled', true).addClass("ui-state-disabled");
  });

  $('#ws').bind('websocketlock-check', function(evt, data) {
    if (data.locked) padlock.taken();
    else padlock.unlock();
  });
 
  /// button listener - sends commands to server
  $('button').on('click', function() {
    ws.send({command : this.id, value: Math.random()*100});
  });

  $('#ws').bind('websocketopen', function() {
    ws.send({command: 'lock-check'});
  });
  $('#ws').bind('websocketclose', function() {
    $('#overlay').css('visibility', 'visible');
    const networkInterval = setInterval(function() {
      window.location.href = location.protocol + '//' + location.host;
    }, 2000);
  });

  $('#ws').bind('websocketnotification', function(evt, parsed) {
    notification.generate(parsed);
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
<span id="padlock" class="fa fa-2x"></span>
<br><br>
<h3>Messages arrived</h3>
<textarea id="messages" class="ui-widget ui-state-default ui-corner-all"></textarea>
<br><br>
<h3>Console log</h3>
<textarea id="console" class="ui-widget ui-state-default ui-corner-all"></textarea>
<div id="ws"></div>
<div id="overlay"></div>
</body>
</html>

