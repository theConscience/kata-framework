'use strict';


(function(e) { // .closest polyfill
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
