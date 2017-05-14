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


(function(settings) {
  console.log('Global settings:', settings);
  // some uh-inner scripts content
})(GLOBAL_SETTINGS);
