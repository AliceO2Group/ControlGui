/**
 * Padlock jQuery UI widget. Displays whether the interface is locked.
 * Required options:
 *  - (none)
 * Internal options
 *  - locked - flag that states whether it's locked or not
 *  - id - person ID that holds the lock
 * @author Adam Wegrzynek <adam.wegrzynek@cern.ch>
 */

$.widget('o2.padlock', {
  /**
   * Clear all classes from the element, sets back default color
   */ 
  _clear: function() {
    this._removeClass('ui-icon-locked')._removeClass('ui-icon-unlocked');
    this.element.css('color', 'black');
  },

  /**
   * Sets icon to locked, stored the id
   */ 
  lock: function(id) {
    this._clear();
    if (this.options.id != id) {
      this.element.css('color', 'red');
    }
    this.options.locked = true;
    this._addClass('ui-icon-locked');
  },

  /**
   * Sets icon to unlocked
   */
  unlock: function() {
    this.options.locked = false;
    this._clear();
    this._addClass('ui-icon-unlocked');
  }
});
