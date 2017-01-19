$.widget("o2.padlock", {
  options: {
    id: undefined
  },
  _clear: function() {
    this.element.removeClass('fa-lock').removeClass('fa-unlock');
    this.element.css('color', 'black');
  },
  lock: function() {
    this._clear();
    this.element.addClass('fa-lock');
  },
  unlock: function() {
    this._clear();
    this.element.addClass('fa-unlock');
  },
  taken: function() {
    this.lock();
    this.element.css('color', 'red');
  }
 
});
