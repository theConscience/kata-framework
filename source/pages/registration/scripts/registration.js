'use strict';

(function($) {
  $(window).on('load', function() {
    if (!Modernizr.cssscrollbar) {
      $('.registration-form__inner').mCustomScrollbar();
    }
    $("#reg-contact-phone").mask("+7 ( 999 ) 999 99 99");
  });
})(jQuery);
