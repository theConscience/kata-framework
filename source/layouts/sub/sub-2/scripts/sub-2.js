'use strict';

(function() {

  var langButton = document.querySelector('.nav-external__link--lang-selection');
  var langPopup = document.querySelector('.lang-selection__popup-1');

  var langSelectionLinkNodes = document.querySelectorAll('.lang-selection__link');

  // var logoButton = document.querySelector('.nav-external__link--logo');
  // var logoPopup = document.querySelector('.logo__popup');

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
    // elementToggleClass(langPopup, 'is-active');
  };

  var onLangButtonKeyDown = function(evt) {
    evt.preventDefault();
    // if ([13, 32].indexOf(evt.keyCode) !== -1) {
    //   elementToggleClass(langPopup, 'is-active');
    // }
  };


  var setLanguage = function(elem) {
    var languageForm = elem.closest('form');
    var languageValue = languageForm.querySelector('#language__value');
    languageValue.value = elem.getAttribute('data-language-code');
    languageForm.submit();
  };

  var onLangSelectionLinkClick = function(evt) {
    evt.preventDefault();
    console.log(this);
    setLanguage(this);
  };

  var onLangSelectionLinkKeyDown = function(evt) {
    if ([13, 32].indexOf(evt.keyCode) > -1) {
      evt.preventDefault();
      setLanguage(this);
    }
  };


  // var onLogoButtonClick = function(evt) {
  //   evt.preventDefault();
  //   elementToggleClass(logoPopup, 'is-active');
  // };
  //
  // var onLogoButtonKeyDown = function(evt) {
  //   evt.preventDefault();
  //   if ([13, 32].indexOf(evt.keyCode) !== -1) {
  //     elementToggleClass(logoPopup, 'is-active');
  //   }
  // };


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

  for (var i = 0; i < langSelectionLinkNodes.length; i++) {
    langSelectionLinkNodes[i].addEventListener('click', onLangSelectionLinkClick);
    langSelectionLinkNodes[i].addEventListener('keyDown', onLangSelectionLinkKeyDown);
  }

  // logoButton.addEventListener('click', onLogoButtonClick);
  // logoButton.addEventListener('keydown', onLogoButtonKeyDown);

  signInButton.addEventListener('click', onSignInButtonClick);
  signInButton.addEventListener('keydown', onSignInButtonKeyDown);


  // Добавляю поддержку свайпов на всплывающее окно
  var signInHammer = new Hammer(signInPopup);

  var setHammerSwipeSettings = function() {
    if (document.documentElement.clientWidth < 752) {
      // console.log('set vertical swipe');
      signInHammer.get('swipe').set({ direction: Hammer.DIRECTION_VERTICAL });
    } else {
      // console.log('set horizontal swipe');
      signInHammer.get('swipe').set({ direction: Hammer.DIRECTION_HORIZONTAL });
    }
  };

  setHammerSwipeSettings();

  signInHammer.on('swipe', function(evt) {
    console.log(evt, 'swipe horizontal');
    if (evt.target.tagName.toLowerCase() !== 'input') {
      elementToggleClass(signInPopup, 'is-active');
    } else {
      console.log('Swipe was blocked on input!');
    }
  });

  window.addEventListener('resize', debounce(function(evt) {
    setHammerSwipeSettings();
  }, 1000));

})();
