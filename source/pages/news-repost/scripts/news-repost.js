/* global GLOBAL_SETTINGS, UTILS, jQuery, throttle, debounce, CONFIG_BASE_UH_INNER, CONFIG_SUB_3 */

'use strict';


var CONFIG_PAGE_NEWS_REPOST = (function (settings, utils, baseConfig, subConfig, $) {
  // news-repost scripts content

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
    breakpoints: {
      XS: 767,
      XSM: 667
    },
    components: {
      newsRepost: {
        TITLE: 'news-repost',
        ELEMENTS: {},
        MODIFIERS: {
          FIXED: 'news-repost--fixed'
        },
        DATA: {},
        STATE: {}
      },
      customTimepicker: {
        TITLE: 'custom-timepicker',
        ELEMENTS: {
          PREV: 'custom-timepicker__prev',
          NEXT: 'custom-timepicker__next',
          INPUT: 'custom-timepicker__input',
          BACKDROP: 'custom-timepicker__backdrop',
          BACKDROP_ITEM: 'custom-timepicker__backdrop-item',
          DESCRIPTION: 'custom-timepicker__description'
        },
        MODIFIERS: {
          WIDE: 'custom-timepicker--wide',
          INPUT_VISIBLE: 'custom-timepicker__input--visible',
          BACKDROP_HIDDEN: 'custom-timepicker__backdrop--hidden',
          BACKDROP_ITEM_ACTIVE: 'custom-timepicker__backdrop-item--active'
        },
        DATA: {
          BACKDROP_ITEM_VALUE: 'data-value'
        },
        STATE: {}
      }
    }
  };


  ///////////////////
  // cashed values //
  ///////////////////

  var baseFunctions = baseConfig.functions;
  var baseBreakpoints = baseConfig.breakpoints;


  ///////////////
  // interface //
  ///////////////

  // var uhInnerEventChannel = baseConfig.root.NODE;
  var uhInnerEventChannel = settings.getRootComponent().element;
  if (LOGGER.DETAILED) console.log('uhInnerEventChannel:', uhInnerEventChannel);


  // baseFunctions.initElementScroll (CONFIGURATION.components.newsRepost, baseBreakpoints.XS, false);
  initCustomTimepickers(CONFIGURATION.components.customTimepicker);  // custom-timepickers component initialization


  ////////////////////////////
  // implementation details //
  ////////////////////////////

  // function CustomTimepicker(config) {
  //   this.timepickers = document.querySelectorAll('.' + config.TITLE); // NodeList

  //   this.customTimepickerCallback = this.customTimepickerCallback.bind(this);

  //   utils.forEachNode(customTimepickers, this.customTimepickerCallback);
  // }

  // CustomTimepicker.prototype.customTimepickerCallback = function(index, node) {
  //   var prevButton = node.querySelector('.' + config.ELEMENTS.PREV);
  //   var nextButton = node.querySelector('.' + config.ELEMENTS.NEXT);
  //   var input = node.querySelector('.' + config.ELEMENTS.INPUT);
  //   var backdrop = node.querySelector('.' + config.ELEMENTS.BACKDROP);

  //   prevButton.addEventListener('click', customTimepickerPrevClickHandler);
  //   prevButton.addEventListener('click', customTimepickerPrevKeydownHandler);

  //   nextButton.addEventListener('click', customTimepickerNextClickHandler);
  //   nextButton.addEventListener('click', customTimepickerNextKeydownHandler);
  // }


  function initCustomTimepickers(config) {  // custom-timepickers components initialization scripts

    // configuration //
    var customTimepickers = document.querySelectorAll('.' + config.TITLE); // NodeList

    utils.forEachNode(customTimepickers, customTimepickerCallback);

    // interface //

    function customTimepickerCallback(index, node) {
      node.dataset.activeBackdropItem = 0;
      node.dataset.isBlocked = false;

      var prevButton = node.querySelector('.' + config.ELEMENTS.PREV);
      var nextButton = node.querySelector('.' + config.ELEMENTS.NEXT);

      var input = node.querySelector('.' + config.ELEMENTS.INPUT);
      var backdrop = node.querySelector('.' + config.ELEMENTS.BACKDROP);

      if (!prevButton) {
        console.warn('There is no prevButton element in custom timepicker:', prevButton);
        return;
      }
      if (!nextButton) {
        console.warn('There is no nextButton element in custom timepicker:', nextButton);
        return;
      }
      if (!input) {
        console.warn('There is no input element in custom timepicker:', input);
        return;
      }
      if (!backdrop) {
        console.warn('There is no backdrop element in custom timepicker:', backdrop);
        return;
      }

      // save default transform translateX value to HTML-node data attribute
      // node.dataset.deaultOffset = parseFloat(getBackdropTransformREM(backdrop), 10).toPrecision(4).replace(/0*$/gi, '') + 'rem';  // первые скобки - fix Для IE

      // set default input value
      var activeBackdropItem = backdrop.querySelector('.' + config.MODIFIERS.BACKDROP_ITEM_ACTIVE);
      if (LOGGER.DETAILED) console.log('activeBackdropItem:', activeBackdropItem);
      input.value = (activeBackdropItem) ? activeBackdropItem.getAttribute(config.DATA.BACKDROP_ITEM_VALUE) : input.getAttribute('value');
      input.setAttribute('value', input.value);
      setCustomTimepickerValue(node, input.value);

      prevButton.addEventListener('click', customTimepickerPrevClickHandler);
      prevButton.addEventListener('keydown', customTimepickerPrevKeydownHandler);

      nextButton.addEventListener('click', customTimepickerNextClickHandler);
      nextButton.addEventListener('keydown', customTimepickerNextKeydownHandler);

      backdrop.addEventListener('click', backdropClickHandler);

      // input.addEventListener('click', inputClickHandler);
      // input.addEventListener('keydown', inputKeydownHandler);
      input.addEventListener('focus', inputFocusHandler);
      input.addEventListener('blur', inputBlurHandler);
    }


    // implementation details //

    function customTimepickerPrevClickHandler(evt) {
      evt.preventDefault();
      var customTimepicker = evt.target.closest('.' + config.TITLE);
      if (customTimepicker.dataset.isBlocked === 'false') {
        changeCustomTimepickerValue(customTimepicker, 'prev');
      } else {
        console.warn('Sorry, action is unavailable — switching is in process...');
        return;
      }
    }

    function customTimepickerPrevKeydownHandler(evt) {
      if ([13, 32].indexOf(evt.keyCode) > -1) {
        evt.preventDefault();
        var customTimepicker = evt.target.closest('.' + config.TITLE);
        if (customTimepicker.dataset.isBlocked === 'false') {
          changeCustomTimepickerValue(customTimepicker, 'prev');
        } else {
          console.warn('Sorry, action is unavailable — switching is in process...');
          return;
        }
      }
    }

    function customTimepickerNextClickHandler(evt) {
      evt.preventDefault();
      var customTimepicker = evt.target.closest('.' + config.TITLE);
      if (customTimepicker.dataset.isBlocked === 'false') {
        changeCustomTimepickerValue(customTimepicker, 'next');
      } else {
        console.warn('Sorry, action is unavailable — switching is in process...');
        return;
      }
    }

    function customTimepickerNextKeydownHandler(evt) {
      if ([13, 32].indexOf(evt.keyCode) > -1) {
        evt.preventDefault();
        var customTimepicker = evt.target.closest('.' + config.TITLE);
        if (customTimepicker.dataset.isBlocked === 'false') {
          changeCustomTimepickerValue(customTimepicker, 'next');
        } else {
          console.warn('Sorry, action is unavailable — switching is in process...');
          return;
        }
      }
    }

    function changeCustomTimepickerValue(customTimepicker, direction) {
      if (LOGGER.DETAILED) console.log('customTimepicker:', customTimepicker, ' is activated, gonna switch to', direction, 'values');
      customTimepicker.dataset.isBlocked = true;

      var backdrop = customTimepicker.querySelector('.' + config.ELEMENTS.BACKDROP);
      if (!backdrop) {
        console.warn('There is no backdrop element in custom timepicker:', backdrop);
        return;
      }
      var backdropItems = backdrop.querySelectorAll('.' + config.ELEMENTS.BACKDROP_ITEM);  // NodeList
      var backdropItemsLength = backdropItems.length;
      if (LOGGER.DETAILED) console.log('backdropItemsLength:', backdropItemsLength);
      var firstItemDataValue = parseFloat(backdropItems[0].dataset.value, 10);
      if (LOGGER.DETAILED) console.log('firstItemDataValue:', firstItemDataValue);
      var prevActiveItemIndex = Math.abs(parseFloat(customTimepicker.dataset.activeBackdropItem, 10) - firstItemDataValue);
      if (LOGGER.DETAILED) console.log('prevActiveItemIndex:', prevActiveItemIndex);
      var prevActiveBackdropItem = backdropItems[prevActiveItemIndex];
      if (LOGGER.DETAILED) console.log('prevActiveBackdropItem:', prevActiveBackdropItem);
      prevActiveBackdropItem.classList.remove(config.MODIFIERS.BACKDROP_ITEM_ACTIVE);
      var newActiveItemIndex = 0;

      var rollBackward = false;  // переключается в true когда уходим ранье начала списка элементов
      var rollForward = false;  // переключается в true когда переходим конец списка элементов

      if (direction === 'prev') {
        if (LOGGER.DETAILED) console.log('prev!');
        if (prevActiveItemIndex > 0) {
          newActiveItemIndex = --customTimepicker.dataset.activeBackdropItem;
        } else {
          rollBackward = true;
          newActiveItemIndex = customTimepicker.dataset.activeBackdropItem = backdropItemsLength - 1;
        }
      } else if (direction === 'next') {
        if (LOGGER.DETAILED) console.log('next!');
        if (prevActiveItemIndex + 1 < backdropItemsLength) {
          newActiveItemIndex = ++customTimepicker.dataset.activeBackdropItem;
        } else {
          rollForward = true;
          newActiveItemIndex = customTimepicker.dataset.activeBackdropItem = 0;
        }
      }
      if (LOGGER.DETAILED) console.log('newActiveItemIndex:', newActiveItemIndex);

      var activeBackdropItem = backdropItems[newActiveItemIndex];
      if (LOGGER.DETAILED) console.log('activeBackdropItem:', activeBackdropItem);
      activeBackdropItem.classList.add(config.MODIFIERS.BACKDROP_ITEM_ACTIVE);

      var customTimepickerInput = customTimepicker.querySelector('.' + config.ELEMENTS.INPUT);
      customTimepickerInput.setAttribute('value', activeBackdropItem.dataset.value);
      customTimepickerInput.value = activeBackdropItem.dataset.value;

      var htmlRootFontSize = parseFloat(getComputedStyle(document.documentElement).fontSize, 10);
      if (LOGGER.DETAILED) console.log('htmlRootFontSize:', htmlRootFontSize);
      var activeBackdropItemCssWidth = parseFloat(getComputedStyle(activeBackdropItem).width, 10);
      if (!activeBackdropItemCssWidth) {
        console.warn('There is no activeBackdropItemCssWidth: ' + activeBackdropItemCssWidth);
        customTimepicker.dataset.isBlocked = false;
        return;
      }
      var activeBackdropItemCssWidthREM = activeBackdropItemCssWidth / htmlRootFontSize;
      if (LOGGER.DETAILED) console.log('activeBackdropItemCssWidthREM:', activeBackdropItemCssWidthREM);
      // var backdropDefaultOffsetREM = parseFloat(customTimepicker.dataset.defaultOffset, 10);
      // if (LOGGER.DETAILED) console.log('backdropDefaultOffsetREM:', backdropDefaultOffsetREM);
      var backdropCssStartTransformPropertyREM = getBackdropTransformREM(backdrop);

      var newBackdropTransformValueREM = 0;
      if (direction === 'prev') {
        if (rollBackward) {
          newBackdropTransformValueREM = -parseFloat(getComputedStyle(backdrop).width, 10) / htmlRootFontSize + activeBackdropItemCssWidthREM;  //  + backdropDefaultOffsetREM
        } else {
          newBackdropTransformValueREM = backdropCssStartTransformPropertyREM + activeBackdropItemCssWidthREM;
        }
      } else if (direction === 'next') {
        if (rollForward) {
          // newBackdropTransformValueREM = (customTimepicker.classList.contains(config.MODIFIERS.WIDE)) ? parseFloat((backdropCssStartTransformPropertyREM % 1).toPrecision(2), 10) : Math.abs(parseFloat((backdropCssStartTransformPropertyREM % 1).toPrecision(2), 10));
          newBackdropTransformValueREM = 0;  // backdropDefaultOffsetREM; // parseFloat((backdropCssStartTransformPropertyREM % 1).toPrecision(2), 10);
          // if (!customTimepicker.classList.contains(config.MODIFIERS.WIDE)) newBackdropTransformValueREM = Math.abs(newBackdropTransformValueREM);
        } else {
          newBackdropTransformValueREM = backdropCssStartTransformPropertyREM - activeBackdropItemCssWidthREM;
        }
      }

      if (LOGGER.DETAILED) console.log('newBackdropTransformValueREM:', newBackdropTransformValueREM);
      backdrop.style.transform = 'translateZ(0) translateX(' + newBackdropTransformValueREM + 'rem)';

      var backdropTransitionDuration = parseFloat(getComputedStyle(backdrop).transitionDuration, 10) * 1000;
      setTimeout(function () {
        customTimepicker.dataset.isBlocked = false;
      }, backdropTransitionDuration);

    }

    function backdropClickHandler(evt) {
      evt.currentTarget.classList.add(config.MODIFIERS.BACKDROP_HIDDEN);
      var customTimepicker = evt.currentTarget.closest('.' + config.TITLE);
      var customTimepickerInput = customTimepicker.querySelector('.' + config.ELEMENTS.INPUT);
      customTimepickerInput.classList.add(config.MODIFIERS.INPUT_VISIBLE);
      customTimepickerInput.focus();
    }

    /*
      function inputClickHandler(evt) {
        evt.preventDefault();

      }

      function inputKeydownHandler(evt) {
        if ([13, 32].indexOf(evt.keyCode) > -1) {
          // evt.preventDefault();
          var customTimepicker = evt.currentTarget.closest('.' + config.TITLE);

        }
      }
    */

    function inputFocusHandler(evt) {
      evt.target.classList.add(config.MODIFIERS.INPUT_VISIBLE);
      var customTimepicker = evt.target.closest('.' + config.TITLE);
      var customTimepickerBackdrop = customTimepicker.querySelector('.' + config.ELEMENTS.BACKDROP);
      customTimepickerBackdrop.classList.add(config.MODIFIERS.BACKDROP_HIDDEN);
      evt.target.setSelectionRange(0, evt.target.value.length);
    }

    function inputBlurHandler(evt) {
      evt.target.classList.remove(config.MODIFIERS.INPUT_VISIBLE);
      var customTimepicker = evt.target.closest('.' + config.TITLE);
      var customTimepickerBackdrop = customTimepicker.querySelector('.' + config.ELEMENTS.BACKDROP);
      customTimepickerBackdrop.classList.remove(config.MODIFIERS.BACKDROP_HIDDEN);
      var symbolsCount = parseFloat(evt.target.getAttribute('pattern').match(/\[0-9\]\{(\d*)\}/, 'gi')[1], 10);  // get symbols count from html attribute
      if (LOGGER.DETAILED) console.log('symbolsCount is:', symbolsCount);
      var enteredValue = evt.target.value = evt.target.value.replace(/^0+/i, '').slice(0, symbolsCount) || '0';
      evt.target.setAttribute('value', enteredValue);
      // evt.target.value = evt.target.value;
      setCustomTimepickerValue(customTimepicker, enteredValue);
    }

    function setCustomTimepickerValue(customTimepicker, value) {
      if (LOGGER.DETAILED) console.log('customTimepicker:', customTimepicker, ' is activated, gonna switch to value', value);
      customTimepicker.dataset.isBlocked = true;

      var backdrop = customTimepicker.querySelector('.' + config.ELEMENTS.BACKDROP);
      var activeBackdropItem = backdrop.querySelector('.' + config.ELEMENTS.BACKDROP_ITEM + '[' + config.DATA.BACKDROP_ITEM_VALUE + '="' + value + '"]');  // NodeList
      if (LOGGER.DETAILED) console.log('activeBackdropItem:', activeBackdropItem);
      if (!activeBackdropItem) {
        console.warn('Unexpected value!');
        customTimepicker.dataset.isBlocked = false;
        return;
      }

      customTimepicker.dataset.activeBackdropItem = value;

      var backdropLeftOffset = backdrop.getBoundingClientRect().left;
      if (LOGGER.DETAILED) console.log('backdropLeftOffset:', backdropLeftOffset);
      var activeBackdropItemLeftOffset = activeBackdropItem.getBoundingClientRect().left;
      if (LOGGER.DETAILED) console.log('activeBackdropItemLeftOffset:', activeBackdropItemLeftOffset);

      var htmlRootFontSize = parseFloat(getComputedStyle(document.documentElement).fontSize, 10);
      // var backdropCssStartTransformPropertyREM = getBackdropTransformREM(backdrop);
      // var backdropDefaultOffsetREM = parseFloat(customTimepicker.dataset.defaultOffset, 10);
      // if (LOGGER.DETAILED) console.log('backdropDefaultOffsetREM:', backdropDefaultOffsetREM);

      var backdropStyles = getComputedStyle(backdrop);
      // var newBackdropTransformValueREM = (backdropLeftOffset - activeBackdropItemLeftOffset) / htmlRootFontSize + Math.abs(backdropCssStartTransformPropertyREM % 1);
      var backdropPaddingLeft = parseFloat(backdropStyles.paddingLeft, 10);
      var newBackdropTransformValueREM = (backdropLeftOffset - activeBackdropItemLeftOffset + backdropPaddingLeft) / htmlRootFontSize;  // + backdropDefaultOffsetREM;

      if (LOGGER.DETAILED) console.log('newBackdropTransformValueREM:', newBackdropTransformValueREM);
      backdrop.style.transform = 'translateZ(0) translateX(' + newBackdropTransformValueREM + 'rem)';


      var backdropTransitionDuration = parseFloat(backdropStyles.transitionDuration, 10) * 1000;

      setTimeout(function () {
        customTimepicker.dataset.isBlocked = false;
      }, backdropTransitionDuration);
    }

    function getBackdropTransformREM(backdrop) {
      var backdropCssTransform = getComputedStyle(backdrop).transform;
      if (LOGGER.DETAILED) console.log('backdropCssTransform:', backdropCssTransform);
      var backdropCssTransformMatrix = backdropCssTransform.match(/matrix\((.*)\)/, 'gi');
      if (LOGGER.DETAILED) console.log('backdropCssTransformMatrix:', backdropCssTransformMatrix);
      if (!backdropCssTransformMatrix) {  // { TODO: fix for ie11}
        var backdropCssTransformMatrix3D = backdropCssTransform.match(/matrix3d\((.*)\)/, 'gi');
      }
      if (backdropCssTransformMatrix && backdropCssTransformMatrix[1]) {
        var backdropCssTransformTranslateX = backdropCssTransformMatrix[1].split(', ')[4];
        if (LOGGER.DETAILED) console.log('backdropCssTransformTranslateX:', backdropCssTransformTranslateX);
        var backdropCssStartTransformProperty = parseFloat(backdropCssTransformTranslateX, 10);
        if (LOGGER.DETAILED) console.log('backdropCssStartTransformProperty:', backdropCssStartTransformProperty);
        var htmlRootFontSize = parseFloat(getComputedStyle(document.documentElement).fontSize, 10);
        if (LOGGER.DETAILED) console.log('htmlRootFontSize:', htmlRootFontSize);
        var backdropCssStartTransformPropertyREM = parseFloat((backdropCssStartTransformProperty / htmlRootFontSize).toPrecision(4).replace(/0*$/gi, ''), 10);
        if (LOGGER.DETAILED) console.log('backdropCssStartTransformPropertyREM:', backdropCssStartTransformPropertyREM);
        return backdropCssStartTransformPropertyREM;
      } else if (backdropCssTransformMatrix3D) {
        console.warn('There is 3d transformation matrix found!');
        var backdropCssTransformTranslateX = backdropCssTransformMatrix3D[1].split(', ')[13];
        if (LOGGER.DETAILED) console.log('backdropCssTransformTranslateX:', backdropCssTransformTranslateX);
        var backdropCssStartTransformProperty = parseFloat(backdropCssTransformTranslateX, 10);
        if (LOGGER.DETAILED) console.log('backdropCssStartTransformProperty:', backdropCssStartTransformProperty);
        var htmlRootFontSize = parseFloat(getComputedStyle(document.documentElement).fontSize, 10);
        if (LOGGER.DETAILED) console.log('htmlRootFontSize:', htmlRootFontSize);
        var backdropCssStartTransformPropertyREM = parseFloat((backdropCssStartTransformProperty / htmlRootFontSize).toPrecision(4).replace(/0*$/gi, ''), 10);
        if (LOGGER.DETAILED) console.log('backdropCssStartTransformPropertyREM:', backdropCssStartTransformPropertyREM);
        return backdropCssStartTransformPropertyREM;
        // { TODO: fix for ie11}
        // return false;
      } else {
        console.warn('There is no backdrop css transform property, which should be!');
        return false;
      }
    }

  }
  // end of custom-timepickers components initialization scripts


  return CONFIGURATION;

  /////////
  // END //
  /////////

})(GLOBAL_SETTINGS, UTILS, CONFIG_BASE_UH_INNER, CONFIG_SUB_3, jQuery);
