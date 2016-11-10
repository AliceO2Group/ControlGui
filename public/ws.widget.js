$.widget("o2.websocket", {
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
    this.options.connection = new WebSocket(this.options.url + "?token=" + this.options.token);

    this.options.connection.onopen = $.proxy(function() {
      this._trigger('open', null, null);
    }, this);

    this.options.connection.onerror = $.proxy(function(err) {
      this._trigger('error', null, err);
    }, this);

    this.options.connection.onmessage = $.proxy(function(evt) {
      this._trigger('message', evt, evt.data);
    }, this);

    this.options.connection.onclose = $.proxy(function(code) {
      this._trigger('close', null, null);
    }, this);
  },
  send: function(message) {
    this.options.connection.send(message);
  }
 
});
