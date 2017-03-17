$.widget('o2.padlock', {
  options: {
    locked: undefined
  },
  _clear: function() {
    this.element.removeClass('fa-lock').removeClass('fa-unlock');
    this.element.css('color', 'black');
  },
  lock: function() {
    this.options.locked = true;
    this._clear();
    this.element.addClass('fa-lock');
  },
  unlock: function() {
    this.options.locked = false;
    this._clear();
    this.element.addClass('fa-unlock');
  },
  taken: function() {
    this.lock();
    this.element.css('color', 'red');
  }
});
