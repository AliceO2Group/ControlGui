<html>
<head>
<script src="libs/jquery-3.1.1.js"></script>
<script src="libs/jquery-ui.js"></script>
<script src="ws.widget.js"></script>
<script>
$(function(){

  var $ws = $.o2.websocket({
    url: 'wss://pcald03.cern.ch',
    token: '{{token}}',
    id: {{personid}},
    name: '{{name}}',
    username: '{{username}}'
  }, $('#ws') );
  $('#ws').bind('websocketmessage', function(event, data) {
    console.log(data);
  });
  $('#start').on('click', function() {
    $ws.send('test');
  });

  $('#stop').on('click', function() {
    $ws.send('sstest');
  });
});
</script>
</head>
<body>
Control GUI!<br>
<button id="start">Start run</button>
<button id="stop">Stop run</button>
<div id="run-details"></div>
<div id="ws"></div>
</body>
</html>

