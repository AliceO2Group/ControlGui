$.widget('o2.padlock', {
  options: {
    locked: undefined,
    id: undefined,
  },
  _clear: function() {
    this.element.removeClass('fa-lock').removeClass('fa-unlock');
    this.element.css('color', 'black');
  },
  lock: function(id) {
    this.options.locked = true;
    this._clear();
    this.element.addClass('fa-lock');
  },
  unlock: function() {
    this.options.locked = false;
    this._clear();
    this.element.addClass('fa-unlock');
    this.element.css('color', 'black');
  },
  taken: function() {
    thiss.options.locked = true;
    this._clear();
    this.element.addClass('fa-lock');
    this.element.css('color', 'red');
  }
});
