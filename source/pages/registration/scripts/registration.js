/* global GLOBAL_SETTINGS, jQuery */

'use strict';

(function(settings, $) {
  $(window).on('load', function() {
    if (!Modernizr.cssscrollbar) {
      $('.registration-form__inner').mCustomScrollbar();
    }
    $('#reg-contact-phone').mask('+7 ( 999 ) 999 99 99');
  });
})(GLOBAL_SETTINGS, jQuery);
