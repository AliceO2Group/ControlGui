<html>
<head>
<link rel="stylesheet" href="//code.jquery.com/ui/1.12.1/themes/base/jquery-ui.css">
<style>
body {
  margin: 20px;
}

button {
  padding: 10px;
}

</style>
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
    $('#txt').append(data + "\n");
  });
  $('button').on('click', function() {
    var json = {command : this.id, value: Math.random()*100 };
    $ws.send(JSON.stringify(json));
  });
});
</script>
</head>
<body>
<button id="lock-get">Lock</button>
<button id="lock-release">Unlock</button>
<button id="lock-check">Check lock</button>
<br><br>
<textarea id="txt"></textarea>
<div id="ws"></div>
</body>
</html>

