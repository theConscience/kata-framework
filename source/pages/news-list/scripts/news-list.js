/* global GLOBAL_SETTINGS, UTILS, jQuery */

'use strict';

(function(settings, utils, $) {
  // news-list scripts content

  console.log('Global settings:', settings);

  var LOGGER = {
    // helper object for logging outs
    IMPORTANT: true,
    DETAILED: true
  };

  ///////////////////
  // configuration //
  ///////////////////

  var CONFIGURATION = {
    components: {
      newsSlider: {
        TITLE: 'news-slider',
        ELEMENTS: {},
        MODIFIERS: {},
        STATE: {}
      },
      shiftablePanel: {
        TITLE: 'shiftable-panel',
        ELEMENTS: {
          CONTENT: 'shiftable-panel__content',
          CONTROLS_LIST: 'shiftable-panel__controls-list',
          CONTROL: 'shiftable-panel__control'
        },
        MODIFIERS: {
          CONTROL_SHIFT_LEFT: 'shiftable-panel__control--shift--left',
          CONTROL_SHIFT_RIGHT: 'shiftable-panel__control--shift--right',
          CONTROL_ENABLED: 'shiftable-panel__control--enabled'
        },
        STATE: {}
      }
    }
  };

  ///////////////
  // interface //
  ///////////////

  initNewsSlider(CONFIGURATION.components.newsSlider); // news slider initialization
  initShiftablePanel(CONFIGURATION.components.shiftablePanel); // shiftable filters panel initialization
  initMediaCardBodyHyphens(); // hyphenation of news media cards body content initialization

  ////////////////////////////
  // implementation details //
  ////////////////////////////

  function initNewsSlider(config) {
    // news slider scripts

    // configuration //

    var newsSlider = document.querySelector('#news-slider');
    var newsSliderSlides = newsSlider.querySelector('.slider__slides');
    var newsSliderRadioControls = newsSlider.querySelectorAll('.slider__radio-control'); // NodeList
    var newsSliderControlLabels = newsSlider.querySelectorAll('.slider__controls-label'); // NodeList

    // interface //

    utils.forEachNode(newsSliderRadioControls, sliderRadioControlCallback);
    utils.forEachNode(newsSliderControlLabels, sliderControlLabelsCallback);

    function sliderRadioControlCallback(index, node) {
      // this callback is called for each node in pageMenuLinks NodeList
      node.addEventListener('change', sliderRadioControlChangeHandler);
    }

    function sliderControlLabelsCallback(index, node) {
      // this callback is called for each node in pageMenuLinks NodeList
      node.addEventListener('keydown', sliderControlLabelKeydownHandler);
    }

    // implementation details //

    function sliderRadioControlChangeHandler(evt) {
      if (LOGGER.DETAILED) console.log('sliderRadioControlChangeHandler is called!');
      if (LOGGER.DETAILED) console.log(evt, evt.target.checked);
      var sliderControlsLabel = newsSlider.querySelector('[for="' + evt.target.id + '"');
      changeSlide(sliderControlsLabel);
    }

    function sliderControlLabelKeydownHandler(evt) {
      if (LOGGER.DETAILED) console.log('sliderControlLabelKeydownHandler is called!');
      if ([13, 32].indexOf(evt.keyCode) > -1) {
        evt.preventDefault();
        var boundedRadioControlID = evt.target.getAttribute('for');
        var boundedRadioControl = newsSlider.querySelector('#' + boundedRadioControlID);
        if (boundedRadioControl && !boundedRadioControl.checked) {
          var changeEvent = new Event('change', { bubbles: true, cancelable: false });
          boundedRadioControl.checked = true;
          boundedRadioControl.dispatchEvent(changeEvent);
        } else {
          throw new Error(
            'There is no radiobutton bound to label with id #' + boundedRadioControlID + ' and for attribute.'
          );
        }
      }
    }

    function changeSlide(sliderControlsLabelNode) {
      if (LOGGER.DETAILED) console.log('sliderControlsLabelNode:', sliderControlsLabelNode);
      var sliderControlsItem = sliderControlsLabelNode.closest('.slider__controls-item');
      var sliderControlsImage = sliderControlsItem.querySelector('.slider__controls-image');
      var sliderControlsImageSRC = sliderControlsImage.getAttribute('src');
      if (LOGGER.DETAILED) console.log('sliderCOntrolsImageSRC:', sliderControlsImageSRC);
      // newsSliderInner.style.backgroundImage = 'url(' + sliderControlsImageSRC + ')';
      $(newsSliderSlides).fadeOut(400, function() {
        newsSliderSlides.style.backgroundImage = 'url(' + sliderControlsImageSRC + ')';
      });
      $(newsSliderSlides).fadeIn(400, function() {});
    }
  }
  // end of news slider scripts

  function initShiftablePanel(config) {
    // shiftable panel scripts

    // configuration //

    var shiftablePanel = document.querySelectorAll('.' + config.TITLE); // NodeList

    // interface //

    utils.forEachNode(shiftablePanel, shiftablePanelCallback);

    function shiftablePanelCallback(index, node) {
      var shiftablePanelControlsList = node.querySelector('.' + config.ELEMENTS.CONTROLS_LIST);
      var shiftablePanelControls = shiftablePanelControlsList.querySelectorAll('.' + config.ELEMENTS.CONTROL); //NodeList

      utils.forEachNode(shiftablePanelControls, function(i, shiftablePanelControl) {
        shiftablePanelControl.addEventListener('click', shiftPanelControlClickHandler);
        shiftablePanelControl.addEventListener('keydown', shiftPanelControlKeydownHandler);
      });

      toggleShiftablePanelControls(node); // on load script

      window.addEventListener('resize', function() {
        // on resize event listener
        toggleShiftablePanelControls(node);
      });

      var uhInnerEventChannel = settings.getRootComponent().element;
      console.log('uhInnerEventChannel:', uhInnerEventChannel);
      uhInnerEventChannel.subscribe('mainMenu:toggle/end', function() {
        // menu toggle handler

        var cssLeftTransitionTimeout = parseFloat(getComputedStyle(node.querySelector('.' + config.ELEMENTS.CONTENT)).transitionDuration, 10) * 1000;
        // должен быть равен 400, это значение свойства transition-duration в CSS-правиле
        // для .shiftable-panel__content, причём - только для transition-property: left
        if (LOGGER.DETAILED) console.log('cssLeftTransitionTimeout:', cssLeftTransitionTimeout);

        setTimeout(function() {
          toggleShiftablePanelControls(node);
        }, cssLeftTransitionTimeout);
      });
    }

    // implementation details //

    function shiftPanelControlClickHandler(evt) {
      if (LOGGER.DETAILED) console.log('shiftPanelLeftClickHandler is called!');
      evt.preventDefault();
      panelShift(evt.target);
    }

    function shiftPanelControlKeydownHandler(evt) {
      if (LOGGER.DETAILED) console.log('shiftPanelLeftKeydownHandler is called!');
      if ([13, 32].indexOf(evt.keyCode) > -1) {
        evt.preventDefault();
        panelShift(evt.target);
      }
    }

    function panelShift(panelControl) {
      if (LOGGER.DETAILED) console.log('panelShift is called! with panelControl button =', panelControl);

      var shiftLeft = panelControl.classList.contains(config.MODIFIERS.CONTROL_SHIFT_LEFT);
      var shiftRight = panelControl.classList.contains(config.MODIFIERS.CONTROL_SHIFT_RIGHT);

      var closestShiftablePanel = panelControl.closest('.' + config.TITLE);
      var panelContent = closestShiftablePanel.querySelector('.' + config.ELEMENTS.CONTENT);
      var panelControlsList = closestShiftablePanel.querySelector('.' + config.ELEMENTS.CONTROLS_LIST);

      var shiftLeftControl = panelControlsList.querySelector('.' + config.MODIFIERS.CONTROL_SHIFT_LEFT);
      var shiftRightControl = panelControlsList.querySelector('.' + config.MODIFIERS.CONTROL_SHIFT_RIGHT);

      var shiftablePanelCoords = closestShiftablePanel.getBoundingClientRect();
      var shiftablePanelCSS = getComputedStyle(closestShiftablePanel);
      var shiftablePanelPaddingLeft = parseFloat(shiftablePanelCSS.paddingLeft, 10);
      var shiftablePanelPaddingRight = parseFloat(shiftablePanelCSS.paddingRight, 10);
      var shiftablePanelInnerWidth = shiftablePanelCoords.width - shiftablePanelPaddingLeft - shiftablePanelPaddingRight;
      var shiftablePanelInnerRight = shiftablePanelCoords.right - shiftablePanelPaddingRight;
      var shiftablePanelInnerLeft = shiftablePanelCoords.left + shiftablePanelPaddingLeft;
      var panelContentCoords = panelContent.getBoundingClientRect();

      if (LOGGER.DETAILED) {
        console.log('shiftablePanelCoords.width:', shiftablePanelCoords.width);
        console.log('shiftablePanelInnerWidth:', shiftablePanelInnerWidth);
        console.log('panelContentCoords.width:', panelContentCoords.width);
        console.log('shiftablePanelCoords.left:', shiftablePanelCoords.left);
        console.log('shiftablePanelCoords.right:', shiftablePanelCoords.right);
        console.log('shiftablePanelPaddingLeft:', shiftablePanelPaddingLeft);
        console.log('shiftablePanelPaddingRight:', shiftablePanelPaddingRight);
        console.log('shiftablePanelInnerLeft:', shiftablePanelInnerLeft);
        console.log('shiftablePanelInnerRight:', shiftablePanelInnerRight);
        console.log('panelContentCoords.left:', panelContentCoords.left);
        console.log('panelContentCoords.right:', panelContentCoords.right);
      }

      var canDoLeftShift = shiftablePanelInnerRight < panelContentCoords.right;
      var canDoRightShift = shiftablePanelInnerLeft > panelContentCoords.left;

      var panelContentCssleftProperty = parseFloat(getComputedStyle(panelContent).left, 10);

      var hasRightOverflow = false;
      var hasLeftOverflow = false;
      var computedLeftCoord = 0;
      var shiftSize = 0;

      if (shiftLeft && canDoLeftShift) {
        if (LOGGER.DETAILED) console.log('Left button is pressed, we can see righter content now!');
        computedLeftCoord = panelContentCoords.left - shiftablePanelInnerWidth;

        hasRightOverflow = computedLeftCoord + shiftablePanelInnerWidth < shiftablePanelInnerRight;
        if (hasRightOverflow) {
          if (LOGGER.DETAILED) console.log('shiftable panel content has overflow on right side!');
          shiftSize = shiftablePanelInnerRight - panelContentCoords.right;
          shiftLeftControl.classList.remove(config.MODIFIERS.CONTROL_ENABLED);
        } else {
          shiftSize = computedLeftCoord;
          shiftLeftControl.classList.add(config.MODIFIERS.CONTROL_ENABLED);
        }

        hasLeftOverflow = computedLeftCoord > shiftablePanelInnerLeft;
        if (hasLeftOverflow) {
          if (LOGGER.DETAILED) console.log('shiftable panel content has overflow on left side!');
          shiftRightControl.classList.remove(config.MODIFIERS.CONTROL_ENABLED);
        } else {
          shiftRightControl.classList.add(config.MODIFIERS.CONTROL_ENABLED);
        }

        panelContent.style.left = panelContentCssleftProperty + shiftSize + 'px';

      } else if (shiftLeft && !canDoLeftShift) {
        if (LOGGER.IMPORTANT) console.log('Left button is pressed, but panel is already shifted to left!');
      } else if (shiftRight && canDoRightShift) {
        if (LOGGER.DETAILED) console.log('Right button is pressed, we can see lefter content now!');
        computedLeftCoord = panelContentCoords.left + shiftablePanelInnerWidth;

        hasLeftOverflow = computedLeftCoord > shiftablePanelInnerLeft;
        if (hasLeftOverflow) {
          if (LOGGER.DETAILED) console.log('shiftable panel content has overflow on left side!');
          shiftSize = shiftablePanelInnerLeft;
          panelControl.classList.remove(config.MODIFIERS.CONTROL_ENABLED);
        } else {
          shiftSize = computedLeftCoord;
        }

        hasRightOverflow = computedLeftCoord + shiftablePanelInnerWidth < shiftablePanelInnerRight;
        if (hasRightOverflow) {
          if (LOGGER.DETAILED) console.log('shiftable panel content has overflow on right side!');
          shiftLeftControl.classList.remove(config.MODIFIERS.CONTROL_ENABLED);
        } else {
          shiftLeftControl.classList.add(config.MODIFIERS.CONTROL_ENABLED);
        }

        panelContent.style.left = shiftSize - shiftablePanelCoords.left + 'px';
      } else if (shiftRight && !canDoRightShift) {
        if (LOGGER.IMPORTANT) console.log('Right button is pressed, but panel is already shifted to right!');
      }
    }

    function toggleShiftablePanelControls(shiftablePanelElement) {
      if (LOGGER.DETAILED) console.log('toggleShiftablePanelControls is called with shiftablePanelElement:', shiftablePanelElement);

      var shiftablePanelControlShiftLeft = shiftablePanelElement.querySelector('.' + config.MODIFIERS.CONTROL_SHIFT_LEFT);
      var shiftablePanelControlShiftRight = shiftablePanelElement.querySelector('.' + config.MODIFIERS.CONTROL_SHIFT_RIGHT);

      var shiftablePanelContent = shiftablePanelElement.querySelector('.' + config.ELEMENTS.CONTENT);
      var shiftablePanelCoords = shiftablePanelElement.getBoundingClientRect();
      var shiftablePanelContentCoords = shiftablePanelContent.getBoundingClientRect();
      var shiftablePanelCSS = getComputedStyle(shiftablePanelElement);
      var shiftablePanelPaddingLeft = parseFloat(shiftablePanelCSS.paddingLeft, 10);
      var shiftablePanelPaddingRight = parseFloat(shiftablePanelCSS.paddingRight, 10);
      var shiftablePanelInnerWidth = shiftablePanelCoords.width - shiftablePanelPaddingLeft - shiftablePanelPaddingRight;
      var shiftablePanelInnerLeft = shiftablePanelCoords.left + shiftablePanelPaddingLeft;
      var shiftablePanelInnerRight = shiftablePanelCoords.right - shiftablePanelPaddingRight;

      if (LOGGER.DETAILED) {
        console.log('shiftablePanelCoords.width:', shiftablePanelCoords.width);
        console.log('shiftablePanelCoords.left:', shiftablePanelCoords.left);
        console.log('shiftablePanelCoords.right:', shiftablePanelCoords.right);
        console.log('shiftablePanelPaddingLeft:', shiftablePanelPaddingLeft);
        console.log('shiftablePanelPaddingRight:', shiftablePanelPaddingRight);
        console.log('shiftablePanelInnerWidth:', shiftablePanelInnerWidth);
        console.log('shiftablePanelInnerLeft:', shiftablePanelInnerLeft);
        console.log('shiftablePanelInnerRight:', shiftablePanelInnerRight);
        console.log('shiftablePanelContentCoords.left:', shiftablePanelContentCoords.left);
        console.log('shiftablePanelContentCoords.right:', shiftablePanelContentCoords.right);
      }

      var hideButtons = shiftablePanelInnerWidth > shiftablePanelContentCoords.width;

      if (hideButtons) {  // если кнопки можно скрыть
        if (LOGGER.DETAILED) console.log('Ширина содержимого меньше ширины маски! Кнопки можно скрыть, а содержимое прижимаем к левому краю.');
        shiftablePanelContent.style.left = shiftablePanelInnerLeft - shiftablePanelCoords.left + 'px';  // сдвигаем содержимое в начало
        shiftablePanelContentCoords = shiftablePanelContent.getBoundingClientRect();  // пересчитываем координаты содержимого
      }

      var showLeftControlButton = (shiftablePanelInnerRight < shiftablePanelContentCoords.right) && !hideButtons;
      var showRightControlButton = (shiftablePanelInnerLeft > shiftablePanelContentCoords.left) && !hideButtons;

      if (showLeftControlButton) {
        if (LOGGER.DETAILED) console.log('Показываем кнопку смещения влево');
        shiftablePanelControlShiftLeft.classList.add(config.MODIFIERS.CONTROL_ENABLED);
      } else {
        if (LOGGER.DETAILED) console.log('Скрываем кнопку смещения влево');
        shiftablePanelControlShiftLeft.classList.remove(config.MODIFIERS.CONTROL_ENABLED);
      }

      if (showRightControlButton) {
        if (LOGGER.DETAILED) console.log('Показываем кнопку смещения вправо');
        shiftablePanelControlShiftRight.classList.add(config.MODIFIERS.CONTROL_ENABLED);
      } else {
        if (LOGGER.DETAILED) console.log('Скрываем кнопку смещения вправо');
        shiftablePanelControlShiftRight.classList.remove(config.MODIFIERS.CONTROL_ENABLED);
      }

    }
  }
  // end of shiftable panel scripts

  function initMediaCardBodyHyphens() {
    $('.media-card__body p').hyphenate('ru');
  }

  /////////
  // END //
  /////////
})(GLOBAL_SETTINGS, UTILS, jQuery);
