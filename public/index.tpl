<html>
<head>
<link rel="stylesheet" href="/jquery-ui/jquery-ui.css">
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
<script src="/jquery/jquery.js"></script>
<script src="/jquery-ui/jquery-ui.js"></script>
<script src="ws.widget.js"></script>
<script src="padlock.widget.js"></script>
<script src="notification-ws.widget.js"></script>
<script src="notification-settings.widget.js"></script>
<script src="notification-apn.widget.js"></script>
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

  var notification = $.o2.socketNotification();

  var pushNotif = $.o2.pushNotification({
    applicationServerPublicKey: '{{applicationServerPublicKey}}',
    pushButton: $('.js-push-btn'),
    result: $('.result'),
    jwtToken: '{{token}}',
    preferencesForm: $('.preferences-form'),
    preferenceOptionsSection: $('#preferenceOptions')
  });

  var apn = $.o2.apn({
    pushButton: $('#safariSubscribe'),
    result: $('.result'),
    jwtToken: '{{token}}',
    preferencesForm: $('.preferences-form'),
    preferenceOptionsSection: $('#preferenceOptions'),
    pushId: '{{pushId}}',
    hostname: '{{hostname}}'
  });

  $('#ws').bind('websocketlock-get', function(evt, data) {
    padlock.lock(data.payload.id);
    $('#execute-zeromq').prop('disabled', false).removeClass("ui-state-disabled");
  });

  $('#ws').bind('websocketlock-release', function(evt, data) {
    padlock.unlock();
    $('#execute-zeromq').prop('disabled', true).addClass("ui-state-disabled");
  });

  $('#ws').bind('websocketlock-check', function(evt, data) {
  if (data.payload.locked) padlock.lock(data.payload.id);
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
<span id="padlock" class="ui-icon ui-icon-locked"></span>
<br><br>
<h3>Messages arrived</h3>
<textarea id="messages" class="ui-widget ui-state-default ui-corner-all"></textarea>
<br><br>
<h3>Console log</h3>
<textarea id="console" class="ui-widget ui-state-default ui-corner-all"></textarea>
<div id="ws"></div>
<div id="overlay"></div>
<hr>
<p>
  <h3>Push Notification Controls</h3>
  <button disabled class="js-push-btn ui-button ui-corner-all ui-widget">
    Enable Push Messaging
  </button>
  <button disabled id="safariSubscribe" class="ui-button ui-corner-all ui-widget">
    Enable Push Messaging
  </button>
</p>
<br>
<form class="is-invisible preferences-form">
  <h3>Notification Preferences</h3>
  <div id="preferenceOptions"></div>
  <input type="submit" class="ui-button ui-corner-all ui-widget" value="Update Notification Preferences">
</form>
<br><br>
<div class="result"></div>
</body>
</html>
