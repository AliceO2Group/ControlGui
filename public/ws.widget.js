$.widget('o2.websocket', {
  options: {
    username: undefined,
    name: undefined,
    id: undefined,
    token: undefined,
    connection: undefined,
    url: undefined
  },
  _create: function() {
    this._connect();
  },
  _connect: function() {
    this.options.connection = new WebSocket(this.options.url + '?token=' + this.options.token);

    this.options.connection.onopen = $.proxy(function() {
      this._trigger('open', null, null);
    }, this);

    this.options.connection.onerror = $.proxy(function(err) {
      this._trigger('error', null, err);
    }, this);

    this.options.connection.onmessage = $.proxy(function(evt) {
      $((~evt.data.indexOf('testmessage')) ? '#messages' : '#console').append(evt.data + '\n');
      try {
        let parsed = $.parseJSON(evt.data);
        // handling token refresh error
        if (parsed.code == 440) {
          this.options.token = parsed.payload.newtoken;
        } else if (parsed.code >= 400) {
          this._trigger('error', evt, parsed);
        } else {
          this._trigger(parsed.command, evt, parsed);
        }
      } catch(e) {
        // continue even though message parsing failed
      }
    }, this);

    this.options.connection.onclose = $.proxy(function(code) {
      this._trigger('close', null, null);
    }, this);
  },
  send: function(message) {
    message.token = this.options.token;
    this.options.connection.send(JSON.stringify(message));
  }
});
