/* global jQuery */

'use strict';

//////////////////////////////////////////
// Element prototype polifilled methods //
//////////////////////////////////////////

(function(e) {
  // .matches polyfill, used by closest polyfill
  e.matches ||
    (e.matches =
      e.matchesSelector ||
      function(selector) {
        var matches = document.querySelectorAll(selector),
          th = this;
        return Array.prototype.some.call(matches, function(e) {
          return e === th;
        });
      });
})(Element.prototype);

(function(e) {
  // .closest polyfill
  e.closest =
    e.closest ||
    function(css) {
      var node = this;
      while (node) {
        if (node.matches(css)) return node;
        else node = node.parentElement;
      }
      return null;
    };
})(Element.prototype);

//////////////////////////
// Global configuration //
//////////////////////////

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

  var getRootComponent = function() {
    return {
      title: 'uhInnerPage',
      element: document.querySelector('.uh-inner-page')
    };
  };

  return {
    getHiddenClass: getHiddenClass,
    getActiveClass: getActiveClass,
    getInvalidClass: getInvalidClass,
    getValidClass: getValidClass,
    getMediaUrl: getMediaUrl,
    getStaticUrl: getStaticUrl,
    getRootComponent: getRootComponent
  };
})();

///////////////////////
// Utility functions //
///////////////////////

var UTILS = (function() {
  return {
    /**
     * Итерирует по объектам типа NodeList.
     * @param {object} nodelist
     * @param {function} callback
     * @param {object} scope
     */
    forEachNode: function(nodelist, callback, scope) {
      for (var i = 0; i < nodelist.length; i++) {
        callback.call(scope, i, nodelist[i]);
      }
    },

    /**
     * Возвращает объект pub/sub.
     * @return {Object}
     */
    eventChannelFactory: function() {
      var subscribers = {};

      var subscribe = function(eventType, subscriberFn) {
        if (!subscribers[eventType]) subscribers[eventType] = [];

        var subscribersGroup = subscribers[eventType];
        if (subscribersGroup.indexOf(subscriberFn) > -1) return this;

        console.log('add ' + subscriberFn.name + ' observer Fn to ' + eventType + ' event group');
        subscribersGroup.push(subscriberFn);

        return this;
      };

      var unsubscribe = function(eventType, subscriberFn) {
        var subscribersGroup = subscribers[eventType];
        if (!subscribersGroup) return this;

        if (!subscriberFn) {
          console.log('clean all ' + eventType + ' subscribers');
          subscribers[eventType] = [];
        } else {
          console.log('remove ' + subscriberFn.name + ' observer Fn from ' + eventType + ' event group');
          var subscriberIndex = subscribersGroup.indexOf(subscriberFn);
          if (subscriberIndex > -1) subscribersGroup.splice(subscriberIndex, 1);
        }

        return this;
      };

      var publish = function(eventType, evtObj) {
        var subscribersGroup = subscribers[eventType];
        if (!subscribersGroup) {
          console.log('There is no such event group!');
          return this;
        }
        evtObj = evtObj || {};
        evtObj.type = eventType;

        if (subscribersGroup.length < 1) {
          console.log('There is no events in ' + eventType + ' group!');
        } else {
          subscribersGroup.forEach(function(subscriber) {
            subscriber(evtObj);
          });
        }

        return this;
      };

      var getSubscribers = function() {
        return subscribers;
      };

      return {
        subscribe: subscribe,
        unsubscribe: unsubscribe,
        publish: publish,
        getSubscribers: getSubscribers
      };
    }
  };
})();

///////////////////////////
// Base template scripts //
///////////////////////////

(function(settings, utils, $) {
  console.log('Global settings:', settings);
  // some uh-inner scripts content

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
      uhInnerPage: {
        TITLE: 'uh-inner-page',
        ELEMENTS: {},
        MODIFIERS: {},
        STATE: {}
      },
      mainMenuToggle: {
        MODIFIERS: {
          // EXTENDED_INNER: 'uh-inner-page__inner--extended',
          EXTENDED_PAGE: 'uh-inner-page--extended',
          COLLAPSED_ASIDE: 'uh-inner-aside--collapsed',
          COLLAPSED_MAIN_MENU: 'main-nav--collapsed',
          COLLAPSED_ACTIONS_MENU: 'actions-nav--collapsed',
          EXTENDED_SITE_SEARCH: 'site-search--extended',
          EXTENDED_FOOTER: 'uh-inner-footer--extended'
          // components
          // EXTENDED_SLIDER: 'slider--extended'
        },
        STATE: {}
      },
      siteLanguage: {
        TITLE: 'site-language',
        ELEMENTS: {},
        MODIFIERS: {
          OPEN: 'site-language--open'
        },
        STATE: {}
      },
      siteSearch: {
        TITLE: 'site-search',
        ELEMENTS: {},
        MODIFIERS: {
          EXTENDED: 'site-search--extended'
        },
        STATE: {}
      }
    }
  };

  ///////////////
  // interface //
  ///////////////

  // uh-inner base page components initialization
  initUhInnerEventChannel(CONFIGURATION.components.uhInnerPage); // extends uh-inner page component with eventChannel functionality
  initMainMenuToggle(CONFIGURATION.components.mainMenuToggle); // site main menu toggle button initialization
  initSiteLanguage(CONFIGURATION.components.siteLanguage); // site-language component initialization
  initSiteSearch(CONFIGURATION.components.siteSearch); // site-search component initialization

  // // global components initialization
  // initDropdownSimple(CONFIGURATION.dropdownSimple);  // dropdown-simple component initialization

  ////////////////////////////
  // implementation details //
  ////////////////////////////

  function initUhInnerEventChannel(config) {
    // uh-inner page event channel initialization scripts
    var uhInnerPageEventChannel = utils.eventChannelFactory();
    var uhInnerPage = document.querySelector('.' + config.TITLE);
    $.extend(uhInnerPage, uhInnerPageEventChannel);
  }
  // end of uh-inner page event channel initialization scripts

  function initMainMenuToggle(config) {
    // site main menu toggle scripts

    // configuration //

    var uhInnerPage = document.querySelector('.uh-inner-page');
    // var bodyInner = uhInnerPage.querySelector('.uh-inner-page__inner');
    // var mainMenu = uhInnerPage.querySelector('.uh-inner-page__aside');
    // var mainMenuToggleButton = uhInnerPage.querySelector('.uh-inner-aside__toggle');
    var siteSearch = document.querySelector('.site-search');
    var pageAside = uhInnerPage.querySelector('.uh-inner-aside');
    var mainMenuToggleButton = uhInnerPage.querySelector('.uh-inner-aside__toggle');
    var mainMenu = uhInnerPage.querySelector('.main-nav');
    var actionsMenu = uhInnerPage.querySelector('.actions-nav');
    var pageFooter = uhInnerPage.querySelector('.uh-inner-footer');
    var components = [];
    components.push({
      name: 'pageSlider',
      element: uhInnerPage.querySelector('.slider'),
      MODIFIERS: {
        EXTENDED: 'slider--extended'
      }
    });

    // interface //

    mainMenuToggleButton.addEventListener('click', mainMenuClickHandler);
    mainMenuToggleButton.addEventListener('keydown', mainMenuKeydownHandler);

    // implementation details //

    function mainMenuClickHandler(evt) {
      if (LOGGER.DETAILED) console.log('mainMenuClickHandler is called!');
      evt.preventDefault();
      toggleMainMenu();
    }

    function mainMenuKeydownHandler(evt) {
      if (LOGGER.DETAILED) console.log('mainMenuKeydownHandler is called!');
      var isEnterOrSpaceKey = [13, 32].indexOf(evt.keyCode) > -1;
      if (isEnterOrSpaceKey) {
        evt.preventDefault();
        toggleMainMenu();
      }
    }

    function toggleMainMenu() {
      if (LOGGER.DETAILED) console.log('toggleMainMenu is called!');
      /* Old layout scripts:
        var mainMenuIsCollapsed = mainMenu.classList.contains(config.MODIFIERS.COLLAPSED_MENU);
        var pageInnerIsExtended = bodyInner.classList.contains(config.MODIFIERS.EXTENDED_INNER);
        if (mainMenuIsCollapsed && pageInnerIsExtended) {
          mainMenu.classList.remove(config.MODIFIERS.COLLAPSED_MENU);
          bodyInner.classList.remove(config.MODIFIERS.EXTENDED_INNER);
        } else if (!mainMenuIsCollapsed && !pageInnerIsExtended) {
          mainMenu.classList.add(config.MODIFIERS.COLLAPSED_MENU);
          bodyInner.classList.add(config.MODIFIERS.EXTENDED_INNER);
        } else {
          throw new Error('There is unexpected behaviour in uh main menu toggling logic.');
        }
      */
      uhInnerPage.publish('mainMenu:toggle/start');
      var pageIsExtended = uhInnerPage.classList.contains(config.MODIFIERS.EXTENDED_PAGE);
      var pageAsideIsCollapsed = pageAside.classList.contains(config.MODIFIERS.COLLAPSED_ASIDE);
      var mainNavIsCollapsed = mainMenu.classList.contains(config.MODIFIERS.COLLAPSED_MAIN_MENU);
      var actionsNavIsCollapsed = actionsMenu.classList.contains(config.MODIFIERS.COLLAPSED_ACTIONS_MENU);
      var siteSearchIsExtended = siteSearch.classList.contains(config.MODIFIERS.EXTENDED_SITE_SEARCH);
      var pageFooterIsExtended = pageFooter.classList.contains(config.MODIFIERS.EXTENDED_FOOTER);
      if (
        pageIsExtended &&
        siteSearchIsExtended &&
        pageAsideIsCollapsed &&
        mainNavIsCollapsed &&
        actionsNavIsCollapsed &&
        pageFooterIsExtended
      ) {
        extendMainMenu();
      } else if (
        !pageIsExtended &&
        !siteSearchIsExtended &&
        !pageAsideIsCollapsed &&
        !mainNavIsCollapsed &&
        !actionsNavIsCollapsed &&
        !pageFooterIsExtended
      ) {
        collapseMainMenu();
      } else {
        throw new Error('There is unexpected behaviour in uh main menu toggling logic.');
      }

      function extendMainMenu() {
        uhInnerPage.publish('mainMenu:toggle/extend/start');
        uhInnerPage.classList.remove(config.MODIFIERS.EXTENDED_PAGE);
        siteSearch.classList.remove(config.MODIFIERS.EXTENDED_SITE_SEARCH);
        pageAside.classList.remove(config.MODIFIERS.COLLAPSED_ASIDE);
        mainMenu.classList.remove(config.MODIFIERS.COLLAPSED_MAIN_MENU);
        actionsMenu.classList.remove(config.MODIFIERS.COLLAPSED_ACTIONS_MENU);
        pageFooter.classList.remove(config.MODIFIERS.EXTENDED_FOOTER);
        if (components.length) {
          components.forEach(function(component) {
            component.element.classList.remove(component.MODIFIERS.EXTENDED);
          });
        }
        switchMainMenuToggleButtonValues();
        uhInnerPage.publish('mainMenu:toggle/extend/end');
      }

      function collapseMainMenu() {
        uhInnerPage.publish('mainMenu:toggle/collapse/start');
        uhInnerPage.classList.add(config.MODIFIERS.EXTENDED_PAGE);
        siteSearch.classList.add(config.MODIFIERS.EXTENDED_SITE_SEARCH);
        pageAside.classList.add(config.MODIFIERS.COLLAPSED_ASIDE);
        mainMenu.classList.add(config.MODIFIERS.COLLAPSED_MAIN_MENU);
        actionsMenu.classList.add(config.MODIFIERS.COLLAPSED_ACTIONS_MENU);
        pageFooter.classList.add(config.MODIFIERS.EXTENDED_FOOTER);
        if (components.length) {
          components.forEach(function(component) {
            setTimeout(function() {
              component.element.classList.add(component.MODIFIERS.EXTENDED);
            }, 200);
          });
        }
        switchMainMenuToggleButtonValues();
        uhInnerPage.publish('mainMenu:toggle/collapse/end');
      }

      function switchMainMenuToggleButtonValues() {
        var mainMenuToggleButtonValue = mainMenuToggleButton.textContent;
        var mainMenuToggleButtonExtendedValue = mainMenuToggleButton.getAttribute('data-alternate-title');
        mainMenuToggleButton.textContent = mainMenuToggleButtonExtendedValue;
        mainMenuToggleButton.setAttribute('data-alternate-title', mainMenuToggleButtonValue);
        mainMenuToggleButton.setAttribute('title', mainMenuToggleButtonExtendedValue);
        uhInnerPage.publish('mainMenu:toggle/end');
      }
    }
  }
  // end of site main menu toggle scripts

  function initSiteLanguage(config) {
    // site-language component scripts

    // configuration //

    var siteLanguage = document.querySelector('.site-language');
    var siteLanguageActiveLanguageItem = siteLanguage.querySelector('.site-language__menu-item--active');
    var siteLanguageActiveLanguageLink = siteLanguageActiveLanguageItem.querySelector('.site-language__menu-link');

    // interface //

    siteLanguageActiveLanguageLink.addEventListener('click', siteLanguageClickHandler);
    siteLanguage.addEventListener('keydown', siteLanguageKeydownHandler);

    // implementation details //

    function siteLanguageClickHandler(evt) {
      if (LOGGER.DETAILED) console.log('siteLanguageClickHandler is called!');
      toggleSiteLanguage(evt);
    }

    function siteLanguageKeydownHandler(evt) {
      if (LOGGER.DETAILED) console.log('siteLanguageKeydownHandler is called!');
      if ([13, 32].indexOf(evt.keyCode) > -1) {
        toggleSiteLanguage(evt);
      }
    }

    function toggleSiteLanguage(evt) {
      if (LOGGER.DETAILED) console.log('toggleSiteLanguage is called!');
      evt.preventDefault();
      var dispatchingComponent = evt.target.closest('.site-language');
      if (LOGGER.DETAILED) console.log('dispatchingComponent:', dispatchingComponent);
      var siteLanguageIsOpen = dispatchingComponent.classList.contains(config.MODIFIERS.OPEN);

      if (siteLanguageIsOpen) {
        dispatchingComponent.classList.remove(config.MODIFIERS.OPEN);
      } else {
        dispatchingComponent.classList.add(config.MODIFIERS.OPEN);
      }
    }
  }
  // end of site-language component scripts

  function initSiteSearch(config) {
    // site-search component scripts

    // configuration //

    var siteSearch = document.querySelector('.site-search');
    var siteSearchQuery = siteSearch.querySelector('#site-search__query');

    // interface //
    siteSearchQuery.addEventListener('input', siteSearchQueryInputHandler);
    siteSearchQuery.dispatchEvent(new Event('input', { bubbles: true }));

    // implementation details //
    function siteSearchQueryInputHandler(evt) {
      if (LOGGER.DETAILED) console.log('siteSearchQueryInputHandler is called!');
      if (evt.target.value === '') {
        evt.target.setCustomValidity('empty value');
      } else {
        evt.target.setCustomValidity('');
      }
    }
  }
  // end of site-search component scripts

  /////////
  // END //
  /////////
})(GLOBAL_SETTINGS, UTILS, jQuery);
