'use strict';

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
