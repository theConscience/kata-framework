'use strict';

(function() {
  var KEYCODES = {
    A: 65,
    Q: 81
  };

  var HIDDEN_CLASSNAME = 'hidden'

  var popup = document.getElementById('popup');
  var popupCloseButton = popup.getElementsByClassName('popup__close')[0];

  var onBodyKeydown = function(evt) {
    if ([KEYCODES.A].indexOf(evt.keyCode) > -1) {
      evt.preventDefault();
      alert('A popup is on page!');
    } else if ([KEYCODES.Q].indexOf(evt.keyCode) > -1) {
      evt.preventDefault();
      alert('Q popup is on page!');
    }
  };

  var onPopupCloseButton = function(evt) {
    evt.preventDefault();
    if (!popup.classList.contains('popup--' + HIDDEN_CLASSNAME)) {
      popup.classList.add('popup--' + HIDDEN_CLASSNAME);
    }
  };

  document.body.addEventListener('keydown', onBodyKeydown);
  popupCloseButton.addEventListener('click', onPopupCloseButton);
})();
