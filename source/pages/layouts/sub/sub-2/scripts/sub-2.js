'use strict';

(function() {

  var langButton = document.querySelector('.nav-external__link--lang-selection');
  var langPopup = document.querySelector('.lang-selection');

  var logoButton = document.querySelector('.nav-external__link--logo');
  var logoPopup = document.querySelector('.logo__popup');

  var signInButton = document.querySelector('.nav-external__link--sign-in');
  var signInPopup = document.querySelector('#sign-in');


  var elementToggleClass = function(element, className) {
    console.log('elementToggleClass is called!');
    if (!element.classList.contains(className)) {
      element.classList.add(className);
    } else {
      element.classList.remove(className);
    }
  };

  var onLangButtonClick = function(evt) {
    evt.preventDefault();
    elementToggleClass(langPopup, 'is-active');
  };

  var onLangButtonKeyDown = function(evt) {
    evt.preventDefault();
    if ([13, 32].indexOf(evt.keyCode) !== -1) {
      elementToggleClass(langPopup, 'is-active');
    }
  };

  var onLogoButtonClick = function(evt) {
    evt.preventDefault();
    elementToggleClass(logoPopup, 'is-active');
  };

  var onLogoButtonKeyDown = function(evt) {
    evt.preventDefault();
    if ([13, 32].indexOf(evt.keyCode) !== -1) {
      elementToggleClass(logoPopup, 'is-active');
    }
  };

  var onSignInButtonClick = function(evt) {
    evt.preventDefault();
    elementToggleClass(signInPopup, 'is-active');
  };

  var onSignInButtonKeyDown = function(evt) {
    evt.preventDefault();
    if ([13, 32].indexOf(evt.keyCode) !== -1) {
      elementToggleClass(signInPopup, 'is-active');
    }
  };

  langButton.addEventListener('click', onLangButtonClick);
  langButton.addEventListener('keydown', onLangButtonKeyDown);

  logoButton.addEventListener('click', onLogoButtonClick);
  logoButton.addEventListener('keydown', onLogoButtonKeyDown);

  signInButton.addEventListener('click', onSignInButtonClick);
  signInButton.addEventListener('keydown', onSignInButtonKeyDown);
})();
