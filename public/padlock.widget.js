$.widget('o2.padlock', {
  options: {
    locked: undefined,
    id: undefined
  },
  _clear: function() {
    this.element.removeClass('ui-icon-locked').removeClass('ui-icon-unlocked');
    this.element.css('color', 'black');
  },
  lock: function(id) {
    this._clear();
    if (this.options.id != id) {
      this.element.css('color', 'red');
    }
    this.options.locked = true;
    this.element.addClass('ui-icon-locked');
  },
  unlock: function() {
    this.options.locked = false;
    this._clear();
    this.element.addClass('ui-icon-unlocked');
  }
});
