'use strict';

var GLOBAL_SETTINGS = (function() {

  var pageBody = document.body;

  var MEDIA_URL = pageBody.getAttribute('data-media-url');
  var STATIC_URL = pageBody.getAttribute('data-static-url');

  var ACTIVE_CLASS_NAME = 'is-active';
  var HIDDEN_CLASS_NAME = 'is-hidden';
  var INVALID_CLASSNAME = 'is-invalid';
  var VALID_CLASSNAME = 'is-valid';

  var getHiddenClass = function() {
    return HIDDEN_CLASS_NAME;
  };

  var getActiveClass = function() {
    return ACTIVE_CLASS_NAME;
  };

  var getInvalidClass = function() {
    return INVALID_CLASSNAME;
  };

  var getValidClass = function() {
    return VALID_CLASSNAME;
  };

  var getMediaUrl = function() {
    return MEDIA_URL;
  };

  var getStaticUrl = function() {
    return STATIC_URL;
  };

  return {
    getHiddenClass: getHiddenClass,
    getActiveClass: getActiveClass,
    getInvalidClass: getInvalidClass,
    getValidClass: getValidClass,
    getMediaUrl: getMediaUrl,
    getStaticUrl: getStaticUrl
  };

})();


(function(e) { // .matches polyfill
  e.matches || (e.matches=e.matchesSelector||function(selector) {
    var matches = document.querySelectorAll(selector), th = this;
    return Array.prototype.some.call(matches, function(e) {
      return e === th;
    });
  });
})(Element.prototype);


(function(e) { // .closest polyfill
  e.closest = e.closest || function(css) {
    var node = this;
    while (node) {
      if (node.matches(css)) return node;
      else node = node.parentElement;
    }
    return null;
  };
})(Element.prototype);


(function(settings) {
  console.log('Global settings:', settings);
  // some uh-inner scripts content
  var USED_CLASS_NAMES = {
    siteLanguage: {
      OPEN: 'site-language--open'
    }
  };


  // site-language component scripts
  var siteLanguage = document.querySelector('.site-language');
  var siteLanguageActiveLanguageItem = siteLanguage.querySelector('.site-language__menu-item--active');
  var siteLanguageActiveLanguageLink = siteLanguageActiveLanguageItem.querySelector('.site-language__menu-link');

  siteLanguageActiveLanguageLink.addEventListener('click', siteLanguageClickHandler);
  siteLanguage.addEventListener('keydown', siteLanguageKeydownHandler);

  function siteLanguageClickHandler(evt) {
    console.log('siteLanguageClickHandler is called!');
    toggleSiteLanguage(evt);
  }

  function siteLanguageKeydownHandler(evt) {
    console.log('siteLanguageKeydownHandler is called!');
    if ([13, 32].indexOf(evt.keyCode) > -1) {
      toggleSiteLanguage(evt);
    }
  }

  function toggleSiteLanguage(evt) {
    console.log('toggleSiteLanguage is called!');
    evt.preventDefault();
    var dispatchingComponent = evt.target.closest('.site-language');
    console.log('dispatchingComponent:', dispatchingComponent);
    var siteLanguageIsOpen = dispatchingComponent.classList.contains(USED_CLASS_NAMES.siteLanguage.OPEN);

    if (siteLanguageIsOpen) {
      dispatchingComponent.classList.remove(USED_CLASS_NAMES.siteLanguage.OPEN);
    } else {
      dispatchingComponent.classList.add(USED_CLASS_NAMES.siteLanguage.OPEN);
    }
  }
  // end of site-language component scripts


})(GLOBAL_SETTINGS);
