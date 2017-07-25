/* global GLOBAL_SETTINGS, UTILS, jQuery, throttle, debounce, CONFIG_BASE_UH_INNER, CONFIG_SUB_3 */

'use strict';


var CONFIG_PAGE_NEWS_LIST = (function (settings, utils, baseConfig, subConfig, $) {
  // news-list scripts content

  var LOGGER = {
    // helper object for logging outs
    IMPORTANT: true,
    DETAILED: true
  };

  if (LOGGER.DETAILED) console.log('Global settings:', settings);


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
      },
      puzzledList: {
        TITLE: 'js-puzzled-list',
        ELEMENTS: {
          ITEM: 'js-puzzled-list__item'
        },
        MODIFIERS: {},
        STATE: {}
      },
      mediaCard: {
        TITLE: 'media-card',
        ELEMENTS: {
          CONTROLS_BUTTON: 'media-card__controls-button'
        },
        MODIFIERS: {
          FOCUSED: 'media-card--focused'
        },
        STATE: {}
      }
    }
  };


  ///////////////
  // interface //
  ///////////////

  // var uhInnerEventChannel = baseConfig.root.NODE;
  var uhInnerEventChannel = settings.getRootComponent().element;
  if (LOGGER.DETAILED) console.log('uhInnerEventChannel:', uhInnerEventChannel);

  initNewsSlider(CONFIGURATION.components.newsSlider); // news slider initialization
  initShiftablePanel(CONFIGURATION.components.shiftablePanel); // shiftable filters panel initialization
  initMediaCardActions(CONFIGURATION.components.mediaCard); // media-card actions initialization
  initMediaCardBodyHyphens(); // hyphenation of news media cards body content initialization
  // initPuzzledList() должен вызываться после initMediaCardBodyHyphens() потому что последний
  // пересчитывает размеры карточек новостей, а первый использует эти размеры в рассчётах.
  initPuzzledList(CONFIGURATION.components.puzzledList);  // puzzled list initialization


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
      $(newsSliderSlides).fadeOut(400, function () {
        newsSliderSlides.style.backgroundImage = 'url(' + sliderControlsImageSRC + ')';
      });
      $(newsSliderSlides).fadeIn(400, function () { });
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

      utils.forEachNode(shiftablePanelControls, function (i, shiftablePanelControl) {
        shiftablePanelControl.addEventListener('click', shiftPanelControlClickHandler);
        shiftablePanelControl.addEventListener('keydown', shiftPanelControlKeydownHandler);
      });

      toggleShiftablePanelControls(node); // on load script

      window.addEventListener('resize', throttle(function () {
        // on resize event listener
        toggleShiftablePanelControls(node);
      }, 60));

      uhInnerEventChannel.subscribe('mainMenu:toggle/end', function () {
        // menu toggle handler

        var cssLeftTransitionTimeout =
          parseFloat(getComputedStyle(node.querySelector('.' + config.ELEMENTS.CONTENT)).transitionDuration, 10) * 1000;
        // должен быть равен 400, это значение свойства transition-duration в CSS-правиле
        // для .shiftable-panel__content, причём - только для transition-property: left
        if (LOGGER.DETAILED) console.log('cssLeftTransitionTimeout:', cssLeftTransitionTimeout);

        setTimeout(function () {
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
      var shiftablePanelInnerWidth =
        shiftablePanelCoords.width - shiftablePanelPaddingLeft - shiftablePanelPaddingRight;
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
      if (LOGGER.DETAILED)
        console.log('toggleShiftablePanelControls is called with shiftablePanelElement:', shiftablePanelElement);

      var shiftablePanelControlShiftLeft = shiftablePanelElement.querySelector(
        '.' + config.MODIFIERS.CONTROL_SHIFT_LEFT
      );
      var shiftablePanelControlShiftRight = shiftablePanelElement.querySelector(
        '.' + config.MODIFIERS.CONTROL_SHIFT_RIGHT
      );

      var shiftablePanelContent = shiftablePanelElement.querySelector('.' + config.ELEMENTS.CONTENT);
      var shiftablePanelCoords = shiftablePanelElement.getBoundingClientRect();
      var shiftablePanelContentCoords = shiftablePanelContent.getBoundingClientRect();
      var shiftablePanelCSS = getComputedStyle(shiftablePanelElement);
      var shiftablePanelPaddingLeft = parseFloat(shiftablePanelCSS.paddingLeft, 10);
      var shiftablePanelPaddingRight = parseFloat(shiftablePanelCSS.paddingRight, 10);
      var shiftablePanelInnerWidth =
        shiftablePanelCoords.width - shiftablePanelPaddingLeft - shiftablePanelPaddingRight;
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

      if (hideButtons) {
        // если кнопки можно скрыть
        if (LOGGER.DETAILED)
          console.log(
            'Ширина содержимого меньше ширины маски! Кнопки можно скрыть, а содержимое прижимаем к левому краю.'
          );
        shiftablePanelContent.style.left = shiftablePanelInnerLeft - shiftablePanelCoords.left + 'px'; // сдвигаем содержимое в начало
        shiftablePanelContentCoords = shiftablePanelContent.getBoundingClientRect(); // пересчитываем координаты содержимого
      }

      var showLeftControlButton = shiftablePanelInnerRight < shiftablePanelContentCoords.right && !hideButtons;
      var showRightControlButton = shiftablePanelInnerLeft > shiftablePanelContentCoords.left && !hideButtons;

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

  function initPuzzledList(config) { // puzzled list scripts

    // configuration

    var puzzledLists = document.querySelectorAll('.' + config.TITLE);  // NodeList

    // interface

    setTimeout(puzzledListHandler, 100);  // костыль

    uhInnerEventChannel.subscribe('mainMenu:toggle/end', function () {
      // menu toggle handler

      var cssLeftTransitionTimeout = 400;  // костыль
      // parseFloat(getComputedStyle(node.querySelector('.' + config.ELEMENTS.CONTENT)).transitionDuration, 10) * 1000;
      // должен быть равен 400, это значение свойства transition-duration в CSS-правиле
      // для .shiftable-panel__content, причём - только для transition-property: left
      if (LOGGER.DETAILED) console.log('cssLeftTransitionTimeout:', cssLeftTransitionTimeout);

      setTimeout(puzzledListHandler, cssLeftTransitionTimeout);
    });

    window.addEventListener('resize', puzzledListHandler);

    function puzzledListHandler() {
      if (LOGGER.DETAILED) console.log('puzzledListHandler is called!');
      utils.forEachNode(puzzledLists, puzzledListCallback);
    }

    // implementation details

    function puzzledListCallback(index, node) {
      if (LOGGER.DETAILED) console.log('puzzledListCallback is called!');
      var puzzledListItem = node.querySelector('.' + config.ELEMENTS.ITEM);

      var columnsCount = getColumnsCount(node, puzzledListItem);
      if (LOGGER.DETAILED) {
        console.log('node.previousColumnsCount:', node.previousColumnsCount);
        console.log('columnsCount:', columnsCount);
      }
      if (columnsCount !== node.previousColumnsCount) {
        shiftListItems(node, columnsCount);
      }
      node.previousColumnsCount = columnsCount;
    }

    function getColumnsCount(puzzledList, puzzledListItem) {
      var puzzledListOffsets = puzzledList.getBoundingClientRect();
      var puzzledListItemOffsets = puzzledListItem.getBoundingClientRect();
      var columnsCount = Math.floor(puzzledListOffsets.width / puzzledListItemOffsets.width);
      return columnsCount;
    }

    function shiftListItems(puzzledList, columnsCount) {
      var puzzledListItems = puzzledList.querySelectorAll('.' + config.ELEMENTS.ITEM);  // NodeList
      var columnsCountIndex = columnsCount - 1;
      var restColumns = puzzledListItems.length % columnsCount;
      var restColumnsStartIndex = puzzledListItems.length - restColumns;
      if (LOGGER.DETAILED) {
        console.log('columnsCountIndex:', columnsCountIndex);
        console.log('restColumns:', restColumns);
        console.log('restColumnsStartIndex:', restColumnsStartIndex);
      }
      utils.forEachNode(puzzledListItems, function shiftListItemCallback(index, itemNode) {
        if (index > columnsCountIndex && index < restColumnsStartIndex) {
          var upperItem = puzzledListItems[index - columnsCount];
          var upperItemOffsets = getOffsetRect(upperItem);
          itemNode.style.marginTop = '';
          var itemOffsets = getOffsetRect(itemNode);
          var marginShift = upperItemOffsets.bottom - itemOffsets.top;
          if (LOGGER.DETAILED) {
            console.log('upperItem:', upperItem);
            console.log('upperItemOffsets:', upperItemOffsets);
            console.log('itemNode:', itemNode);
            console.log('itemOffsets:', itemOffsets);
            console.log('marginShift:', marginShift);
          }

          itemNode.style.marginTop = marginShift + 'px';
        } else {
          itemNode.style.marginTop = '';
        }
      });
    }

    function getOffsetRect(elem) {
      var box = elem.getBoundingClientRect();
      var body = document.body;
      var docElem = document.documentElement;
      var scrollTop = window.pageYOffset || docElem.scrollTop || body.scrollTop;
      // var scrollLeft = window.pageXOffset || docElem.scrollLeft || body.scrollLeft;
      var clientTop = docElem.clientTop || body.clientTop || 0;
      // var clientLeft = docElem.clientLeft || body.clientLeft || 0;
      var top = box.top + scrollTop - clientTop;
      var bottom = top + box.height;
      // var left = box.left + scrollLeft - clientLeft;
      return { top: Math.round(top), bottom: Math.round(bottom) }; //, left: Math.round(left) }
    }
  }
  // end of puzzled list scripts

  function initMediaCardActions(config) {
    // media-card actions scripts

    var mediaCards = document.querySelectorAll('.' + config.TITLE); // NodeList

    utils.forEachNode(mediaCards, mediaCardsCallback);

    function mediaCardsCallback(index, node) {
      node.addEventListener('focus', mediaCardFocusHandler);
      // node.addEventListener('blur', mediaCardBlurHandler);

      function mediaCardFocusHandler(evt) {
        if (LOGGER.DETAILED) console.log('mediaCardFocusHandler is called!');

        var focusedMediaCard = evt.currentTarget;
        var controlsClassName = config.ELEMENTS.CONTROLS_BUTTON;
        var controlsButtons = focusedMediaCard.querySelectorAll('.' + controlsClassName);  // NodeList

        uhInnerEventChannel.publish('mediaCard:focus', {
          focusedClassName: config.MODIFIERS.FOCUSED,
          controlsClassName: controlsClassName,
          focusedMediaCard: focusedMediaCard,
          controlsButtons: controlsButtons
        });
      }
    }

    uhInnerEventChannel.subscribe('mediaCard:focus', mediaCardFocusSubscriber);
    uhInnerEventChannel.subscribe('mediaCard:blur', mediaCardBlurSubscriber);

    function mediaCardFocusSubscriber(evtObj) {
      if (LOGGER.DETAILED) console.log('uhInnerEventChannel mediaCard:focus event published!');

      var previousFocusedMediaCard = document.querySelector('.' + evtObj.focusedClassName);
      if (previousFocusedMediaCard) {  // actions for blurring previous mediaCard
        var previousControlsButtons = previousFocusedMediaCard.querySelectorAll('.' + evtObj.controlsClassName);  // NodeList

        uhInnerEventChannel.publish('mediaCard:blur', {
          focusedClassName: evtObj.focusedClassName,
          previousFocusedMediaCard: previousFocusedMediaCard,
          previousControlsButtons: previousControlsButtons
        });
      }

      utils.forEachNode(evtObj.controlsButtons, function (i, controlButton) {
        controlButton.setAttribute('tabindex', '0');
      });
      evtObj.focusedMediaCard.classList.add(evtObj.focusedClassName);
    }

    function mediaCardBlurSubscriber(evtObj) {
      if (LOGGER.DETAILED) console.log('uhInnerEventChannel mediaCard:blur event published!');

      evtObj.previousFocusedMediaCard.classList.remove(evtObj.focusedClassName);
      utils.forEachNode(evtObj.previousControlsButtons, function (i, controlButton) {
        controlButton.setAttribute('tabindex', '-1');
      });
    }

  }
  // end of media-card actions scripts

  function initMediaCardBodyHyphens() {
    $('.media-card__body p').hyphenate('ru');
  }


  return CONFIGURATION;

  /////////
  // END //
  /////////

})(GLOBAL_SETTINGS, UTILS, CONFIG_BASE_UH_INNER, CONFIG_SUB_3, jQuery);
