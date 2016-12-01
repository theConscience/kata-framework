'use strict';

var GLOBAL_SETTINGS = (function() {

  var _page_body = document.body;

  var MEDIA_URL = _page_body.getAttribute('data-media-url');
  var STATIC_URL = _page_body.getAttribute('data-static-url');

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


(function() {
  var customLabelsV1 = document.querySelectorAll('.custom-label--v1');
  var customLabelInnerInputs = [];

  for (var i = 0; i < customLabelsV1.length; i++) {
    if (customLabelsV1[i].querySelector('input')) {
      customLabelInnerInputs.push(customLabelsV1[i].querySelector('input'));
    }
  }

  var onInnerInputKeyup = function() {
    if (this.value) {
      this.setAttribute('data-input', true);
    } else {
      this.setAttribute('data-input', false);
    }
  };

  customLabelInnerInputs.forEach(function(input) {
    input.addEventListener('keyup', onInnerInputKeyup);
  });
})();
