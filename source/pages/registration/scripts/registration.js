'use strict';

(function($) {
  $(window).on('load', function() {
    if (!Modernizr.cssscrollbar) {
      $('.registration-form__inner').mCustomScrollbar();
    }
  });
})(jQuery);
