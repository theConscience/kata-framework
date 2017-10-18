/* global jQuery, throttle, debounce */

'use strict';


//////////////////////////////////////////
// Element prototype polifilled methods //
//////////////////////////////////////////

(function (e) {
  // .matches polyfill, used by closest polyfill
  e.matches ||
    (e.matches =
      e.matchesSelector ||
      function (selector) {
        var matches = document.querySelectorAll(selector), th = this;
        return Array.prototype.some.call(matches, function (e) {
          return e === th;
        });
      });
})(Element.prototype);

(function (e) {
  // .closest polyfill
  e.closest =
    e.closest ||
    function (css) {
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

var GLOBAL_SETTINGS = (function () {
  var pageBody = document.body;

  var MEDIA_URL = pageBody.getAttribute('data-media-url');
  var STATIC_URL = pageBody.getAttribute('data-static-url');

  var ACTIVE_CLASS_NAME = 'is-active';
  var HIDDEN_CLASS_NAME = 'is-hidden';
  var INVALID_CLASSNAME = 'is-invalid';
  var VALID_CLASSNAME = 'is-valid';

  var getHiddenClass = function () {
    return HIDDEN_CLASS_NAME;
  };

  var getActiveClass = function () {
    return ACTIVE_CLASS_NAME;
  };

  var getInvalidClass = function () {
    return INVALID_CLASSNAME;
  };

  var getValidClass = function () {
    return VALID_CLASSNAME;
  };

  var getMediaUrl = function () {
    return MEDIA_URL;
  };

  var getStaticUrl = function () {
    return STATIC_URL;
  };

  var getRootComponent = function () {
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

var UTILS = (function () {
  return {
    /**
     * Итерирует по объектам типа NodeList.
     * @param {object} nodelist
     * @param {function} callback
     * @param {object} scope
     */
    forEachNode: function (nodelist, callback, scope) {
      for (var i = 0; i < nodelist.length; i++) {
        callback.call(scope, i, nodelist[i]);
      }
    },

    /**
     * Возвращает объект pub/sub.
     * @return {Object}
     */
    eventChannelFactory: function () {
      var subscribers = {};

      var subscribe = function (eventType, subscriberFn) {
        if (!subscribers[eventType]) subscribers[eventType] = [];

        var subscribersGroup = subscribers[eventType];
        if (subscribersGroup.indexOf(subscriberFn) > -1) return this;

        console.log('add ' + subscriberFn.name + ' observer Fn to ' + eventType + ' event group');
        subscribersGroup.push(subscriberFn);

        return this;
      };

      var unsubscribe = function (eventType, subscriberFn) {
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

      var publish = function (eventType, evtObj) {
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
          subscribersGroup.forEach(function (subscriber) {
            subscriber(evtObj);
          });
        }

        return this;
      };

      var getSubscribers = function () {
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

var CONFIG_BASE_UH_INNER = (function (settings, utils, $) {
  // some uh-inner scripts content

  var LOGGER = {
    // helper object for logging outs
    IMPORTANT: false,
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
      uhInnerPage: {
        TITLE: 'uh-inner-page',
        NODE: document.querySelector('.uh-inner-page'),
        ELEMENTS: {},
        MODIFIERS: {},
        STATE: {}
      },
      uhInnerAside: {
        TITLE: 'uh-inner-page__aside',
        ELEMENTS: {},
        MODIFIERS: {
          FIXED: 'uh-inner-page__aside--fixed'
          // COLLAPSED_ASIDE: 'uh-inner-aside--collapsed',
          // components
          // EXTENDED_SLIDER: 'slider--extended'
        },
        STATE: {}
      },
      mainMenuToggle: {
        ELEMENTS: {},
        MODIFIERS: {
          // EXTENDED_INNER: 'uh-inner-page__inner--extended',
          EXTENDED_PAGE: 'uh-inner-page--extended',
          COLLAPSED_ASIDE: 'uh-inner-aside--collapsed',
          COLLAPSED_MAIN_MENU: 'main-nav--collapsed',
          COLLAPSED_ACTIONS_MENU: 'actions-nav--collapsed',
          EXTENDED_SITE_SEARCH: 'site-search--extended',
          EXTENDED_SITE_MESSAGES: 'site-messages--extended',
          EXTENDED_FOOTER: 'uh-inner-footer--extended'
          // components
          // EXTENDED_SLIDER: 'slider--extended'
        },
        STATE: {}
      },
      mainNav: {
        TITLE: 'main-nav',
        ELEMENTS: {
          ITEM: 'main-nav__item',
          LINK: 'main-nav__link',
          SUBMENU: 'main-nav__submenu',
          SUBMENU_LINK: 'main-nav__submenu-link'
        },
        MODIFIERS: {
          LINK_ACTIVE: 'main-nav__link--active',
          SUBMENU_OPEN: 'main-nav__submenu--open'
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
      },
      pageNavMenu: {
        TITLE: 'page-nav__menu',
        ELEMENTS: {},
        MODIFIERS: {
          FIXED: 'page-nav__menu--fixed'
        },
        STATE: {}
      },
      siteLoader: {
        TITLE: 'site-loader',
        ELEMENTS: {},
        MODIFIERS: {
          OPEN: 'site-loader--open'
        },
        STATE: {}
      },
      siteModal: {
        TITLE: 'site-modal',
        ELEMENTS: {
          CLOSE: 'site-modal__close',
          CONTROLS_BUTTON: 'modal-controls__button',
          CONTROLS_CANCEL: 'modal-controls__button--cancel',
          CONTROLS_SUBMIT: 'modal-controls__button--submit'
        },
        MODIFIERS: {
          OPEN: 'site-modal--open',
          CLOSED: 'site-modal--closed',
          ERROR: 'site-modal--error'
        },
        STATE: {},
        DATA: {
          MODAL_NAME: 'data-modal-name',
          OPEN_MODAL_BUTTON: 'data-open-modal'
        }
      }

    }
  };


  ///////////////
  // interface //
  ///////////////

  // uh-inner base page components initialization
  var uhInnerEventChannel = initUhInnerEventChannel(CONFIGURATION.components.uhInnerPage); // extends uh-inner page component with eventChannel functionality

  initElementScroll(CONFIGURATION.components.uhInnerAside, CONFIGURATION.breakpoints.XS, false); // uh-inner page aside scroll initialization
  initElementScroll(CONFIGURATION.components.pageNavMenu, CONFIGURATION.breakpoints.XSM, true); // news page navigation menu scroll initialization
  initMainMenuToggle(CONFIGURATION.components.mainMenuToggle); // site main menu toggle button initialization
  initMainNavSubmenu(CONFIGURATION.components.mainNav); // site main nav submenus initialization
  initSiteLanguage(CONFIGURATION.components.siteLanguage); // site-language component initialization
  initSiteSearch(CONFIGURATION.components.siteSearch); // site-search component initialization
  initSiteLoader(CONFIGURATION.components.siteLoader);  // site-loader component initialization
  initSiteModal(CONFIGURATION.components.siteModal);  // site-modal component initialization

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
    return uhInnerPage;
  }
  // end of uh-inner page event channel initialization scripts

  function initElementScroll(config, minBreakpoint, fixedClassChange) {
    // uh-inner page aside scroll scripts


    // configuration //

    var isXsViewport = window.innerWidth <= minBreakpoint;
    var prevScrollInfo = {
      direction: null,
      size: 0,
      value: 0,
      fix: false
    };
    var scrollableElement = document.querySelector('.' + config.TITLE);
    if (!scrollableElement) {
      console.warn('There is no scrollableElement:', '.' + config.TITLE);
      return;
    }
    var scrollableElementParent = scrollableElement.parentElement;


    // interface //

    if (!scrollableElement) return false;

    toggleScrollableElementFixedState(fixedClassChange);

    var throttledWindowScrollElementScroll = throttle(onWindowScroll, 60);
    var throttledWindowResizeElementScroll = throttle(onWindowResize, 60);

    window.addEventListener('scroll', throttledWindowScrollElementScroll);
    window.addEventListener('resize', throttledWindowResizeElementScroll);


    // implementation details //

    function toggleScrollableElementFixedState(enabled) {
      if (LOGGER.DETAILED) console.log('toggleScrollableElementFixedState is called!');

      if (!enabled) return true;  // если переключение класса не нужно, значит элемент уже фиксированно спозиционирован, поэтому сразу возвращаем true

      if (scrollableElement.parentElement.getBoundingClientRect().top < 0) {
        scrollableElement.classList.add(config.MODIFIERS.FIXED);
        if (LOGGER.DETAILED) console.log('scrollableElement', scrollableElement, ' is fixed now!');
        return true;
      } else {
        scrollableElement.classList.remove(config.MODIFIERS.FIXED);
        if (LOGGER.DETAILED) console.log('scrollableElement', scrollableElement, ' is no more fixed...');
        return false;
      }
    }

    function onWindowScroll() {
      var viewportData = getViewportYPositionData();
      var elementData = getElementYPositionData(scrollableElement, scrollableElementParent, 'marginTop');
      var scrollInfo = getScrollInfo(viewportData.top);

      var elementIsFixed = toggleScrollableElementFixedState(fixedClassChange);

      if (elementIsFixed) {
        if (isElementContentHeightMoreThanViewport(viewportData, elementData) && window.innerWidth > minBreakpoint) {
          var newMarginValue = parseFloat(scrollableElement.style.marginTop || 0, 10) + scrollInfo.size;
          if (scrollInfo.direction === 'down' && shouldScrollDown(viewportData, elementData, scrollInfo)) {
            scrollableElement.style.marginTop = newMarginValue + 'px';
          } else if (scrollInfo.direction === 'up' && shouldScrollUp(viewportData, elementData, scrollInfo)) {
            scrollableElement.style.marginTop = (newMarginValue >= 0) ? '' : newMarginValue + 'px';
          }
        } else if (!isElementContentHeightMoreThanViewport(viewportData, elementData) && scrollableElement.style.marginTop) {
          scrollableElement.style.marginTop = '';
        }

        prevScrollInfo = scrollInfo;  // запоминаем значения скролла внутри области видимости этого модуля
      } else {
        scrollableElement.style.marginTop = '';
      }
    }

    function onWindowResize() {
      var viewportData = getViewportYPositionData();
      var scrollInfo = getScrollInfo(viewportData.top);

      if (window.innerWidth <= minBreakpoint && !isXsViewport) {
        if (LOGGER.DETAILED) console.log('removing scroll listener');
        if (LOGGER.DETAILED) console.log('window width =', window.innerWidth);
        window.removeEventListener('scroll', throttledWindowScrollElementScroll);
        scrollableElement.style.marginTop = '';
        scrollableElement.classList.remove(config.MODIFIERS.FIXED);
        isXsViewport = true;
      } else if (window.innerWidth > minBreakpoint && isXsViewport) {
        if (LOGGER.DETAILED) console.log('adding scroll listener');
        if (LOGGER.DETAILED) console.log('window width =', window.innerWidth);
        window.addEventListener('scroll', throttledWindowScrollElementScroll);
        scrollableElement.style.marginTop = '';
        scrollableElement.classList.add(config.MODIFIERS.FIXED);
        isXsViewport = false;
      }

      prevScrollInfo = scrollInfo;  // запоминаем значения скролла внутри области видимости этого модуля
    }

    function getViewportYPositionData() {
      var viewportData = {};
      viewportData.top = window.pageYOffset || document.documentElement.scrollTop;
      viewportData.height = document.documentElement.clientHeight;
      viewportData.getBottom = function getBottom() {
        return this.top + this.height;
      };

      return viewportData;
    }

    function getElementYPositionData(element, elementParent, offsetCssProperty) {
      var elementData = {};
      var elementOffsets = element.getBoundingClientRect();
      elementData.viewportTop = elementOffsets.top;
      elementData.top = element.offsetTop;
      elementData.viewportBottom = elementOffsets.bottom;
      elementData.containerHeight = document.body.clientHeight;

      elementData.firstChild = element.children[0];
      var firstChildOffsets = elementData.firstChild.getBoundingClientRect();
      elementData.firstChildViewportTop = firstChildOffsets.top;
      elementData.firstChildTop = elementData.firstChild.offsetTop;
      elementData.firstChildHeight = elementData.firstChild.clientHeight;

      elementData.lastChild = element.children[element.children.length - 1];
      var lastChildOffsets = elementData.lastChild.getBoundingClientRect();
      elementData.lastChildViewportTop = lastChildOffsets.top;
      elementData.lastChildTop = elementData.lastChild.offsetTop;
      elementData.lastChildViewportBottom = lastChildOffsets.bottom;
      elementData.lastChildHeight = elementData.lastChild.clientHeight;
      elementData.getLastChildBottom = function getLastChildBottom() {
        return this.lastChildTop + this.lastChildHeight;
      };

      var elementParentOffsets = elementParent.getBoundingClientRect();
      elementData.parentViewportBottom = elementParentOffsets.bottom;

      elementData.getElementContentHeight = function getElementContentHeight() {
        return this.getLastChildBottom() - this.firstChildTop;
      };

      elementData.getElementHeight = function getElementHeight() {
        return this.getLastChildBottom() - this.top;
      };

      elementData.innerOffsetTop = parseInt(element.style[offsetCssProperty] || 0, 10);

      return elementData;
    }

    function getScrollInfo(scrollTop) {
      var scrollSize = prevScrollInfo.value - scrollTop; // отрицательное значение - скролл вниз, положительное - вверх
      var scrollDirection = scrollSize < 0 ? 'down' : 'up';

      var info = {
        value: scrollTop,
        size: scrollSize,
        direction: scrollDirection,
        fix: prevScrollInfo.fix
      };

      return info;
    }

    /**
     * @param {HTMLElement} element
     * @return {Boolean}
     */
    function isElementContentHeightMoreThanViewport(viewportData, elementData) {
      if (elementData.getElementContentHeight() > viewportData.height) {
        return true;
      }
      return false;
    }

    function shouldScrollUp(viewportData, elementData, scrollInfo) {  // прокрутка вверх === опускаем блок вниз, за границу вьюпорта
      if (elementData.innerOffsetTop) {
        return true;
      } else if (prevScrollInfo.fix) {
        scrollInfo.fix = false;
        return true;
      }
      return false;
    }

    function shouldScrollDown(viewportData, elementData, scrollInfo) {  // прокрутка вниз === поднимаем блок вверх, за границу вьюпорта
      if ((viewportData.top + elementData.lastChildViewportBottom > viewportData.getBottom() &&
        elementData.containerHeight >= elementData.getElementHeight() + Math.abs(scrollInfo.size)) || // {
        elementData.lastChildViewportBottom >= elementData.parentViewportBottom) {
        if (!prevScrollInfo.fix) {
          scrollInfo.fix = true;
          return false;
        }
        return true;
      }

      return false;
    }

    return true;
  }
  // end of uh-inner page aside scroll scripts

  function initMainMenuToggle(config) {
    // site main menu toggle scripts

    // configuration //

    var uhInnerPage = document.querySelector('.uh-inner-page');
    // var bodyInner = uhInnerPage.querySelector('.uh-inner-page__inner');
    // var mainMenu = uhInnerPage.querySelector('.uh-inner-page__aside');
    // var mainMenuToggleButton = uhInnerPage.querySelector('.uh-inner-aside__toggle');
    var siteSearch = document.querySelector('.site-search');
    var siteMessages = document.querySelector('.site-messages');
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
      // var siteMessagesIsExtended = siteMessages.classList.contains(config.MODIFIERS.EXTENDED_SITE_MESSAGES);
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
        if (siteMessages) {
          siteMessages.classList.remove(config.MODIFIERS.EXTENDED_SITE_MESSAGES);
        }
        pageAside.classList.remove(config.MODIFIERS.COLLAPSED_ASIDE);
        mainMenu.classList.remove(config.MODIFIERS.COLLAPSED_MAIN_MENU);
        actionsMenu.classList.remove(config.MODIFIERS.COLLAPSED_ACTIONS_MENU);
        pageFooter.classList.remove(config.MODIFIERS.EXTENDED_FOOTER);
        if (components.length) {
          components.forEach(function (component) {
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
        if (siteMessages) {
          siteMessages.classList.add(config.MODIFIERS.EXTENDED_SITE_MESSAGES);
        }
        pageAside.classList.add(config.MODIFIERS.COLLAPSED_ASIDE);
        mainMenu.classList.add(config.MODIFIERS.COLLAPSED_MAIN_MENU);
        actionsMenu.classList.add(config.MODIFIERS.COLLAPSED_ACTIONS_MENU);
        pageFooter.classList.add(config.MODIFIERS.EXTENDED_FOOTER);
        if (components.length) {
          components.forEach(function (component) {
            setTimeout(function () {
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

  function initMainNavSubmenu(config) {
    // site main nav submenus initialization

    // configuration //

    var mainNav = document.querySelector('.' + config.TITLE);
    var mainNavLinks = mainNav.querySelectorAll('.' + config.ELEMENTS.LINK);  // NodeList

    // interface //

    utils.forEachNode(mainNavLinks, mainNavLinkCallback);

    // implementation details //

    function mainNavLinkCallback(index, node) {
      var parentMainNavItem = node.closest('.' + config.ELEMENTS.ITEM);
      var boundedMainNavSubmenu = parentMainNavItem.querySelector('.' + config.ELEMENTS.SUBMENU);

      node.addEventListener('click', function (evt) {
        toggleBoundedSubmenu(evt, boundedMainNavSubmenu);
      });
      node.addEventListener('keydown', function (evt) {
        if ([13, 32].indexOf(evt.keyCode) > -1) {
          toggleBoundedSubmenu(evt, boundedMainNavSubmenu);
        }
      });
    }

    function toggleBoundedSubmenu(evt, boundedSubmenu) {
      if (LOGGER.DETAILED) console.log('toggleBoundedSubmenu is called!');
      var openedSubmenu = document.querySelector('.' + config.MODIFIERS.SUBMENU_OPEN);

      if (openedSubmenu) {
        openedSubmenu.classList.remove(config.MODIFIERS.SUBMENU_OPEN);
        setSubmenuLinksTabindex(openedSubmenu, '-1');
      }

      if (boundedSubmenu && openedSubmenu !== boundedSubmenu) {
        evt.preventDefault();
        boundedSubmenu.classList.add(config.MODIFIERS.SUBMENU_OPEN);
        setSubmenuLinksTabindex(boundedSubmenu, '0');
      } else if (openedSubmenu !== boundedSubmenu) {
        evt.preventDefault();
      }
    }

    function setSubmenuLinksTabindex(submenu, tabindex) {
      var submenuLinks = submenu.querySelectorAll('.' + config.ELEMENTS.SUBMENU_LINK);  //NodeList
      utils.forEachNode(submenuLinks, function (index, node) {
        node.setAttribute('tabindex', tabindex);
      });
    }

  }

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

  function initSiteLoader(config) {
    // site-loader component scripts

    // configuration
    var siteLoader = document.querySelector('#' + config.TITLE);

    // interface
    uhInnerEventChannel.subscribe('siteLoader:show', showSiteLoaderHandler);
    uhInnerEventChannel.subscribe('siteLoader:hide', hideSiteLoaderHandler);

    // implementation details

    function showSiteLoaderHandler() {
      if (LOGGER.DETAILED) console.log('showSiteLoaderHandler:', showSiteLoaderHandler);
      if (!siteLoader.classList.contains(config.MODIFIERS.OPEN)) {
        siteLoader.classList.add(config.MODIFIERS.OPEN);
      }
    }

    function hideSiteLoaderHandler() {
      if (LOGGER.DETAILED) console.log('hideSiteLoaderHandler:', hideSiteLoaderHandler);
      siteLoader.classList.remove(config.MODIFIERS.OPEN);
    }
  }
  // end of site-loader component scripts


  function initSiteModal(config) {
    // site-modal scripts

    // configuration //
    var siteModals = document.querySelectorAll('.' + config.TITLE);  // NodeList
    var modalOpenButtons = document.querySelectorAll('[' + config.DATA.OPEN_MODAL_BUTTON + ']');  //NodeList


    // interface //

    utils.forEachNode(siteModals, siteModalCallback);
    utils.forEachNode(modalOpenButtons, modalOpenButtonCallback);

    function siteModalCallback(index, node) {
      var modalName = node.getAttribute(config.DATA.MODAL_NAME);

      var openEventName = modalName + ':open';
      var closeEventName = modalName + ':close';
      var errorEventName = modalName + ':error';
      uhInnerEventChannel.subscribe(openEventName, siteModalOpenObserver);
      uhInnerEventChannel.subscribe(closeEventName, siteModalCloseObserver);
      uhInnerEventChannel.subscribe(errorEventName, siteModalErrorObserver);

      // // Кнопок для открытия одного и того же модального окна может быть много:
      // var modalOpenButtons = document.querySelectorAll('[' + config.DATA.OPEN_MODAL_BUTTON + '=' + modalName + ']');  //NodeList
      // utils.forEachNode(modalOpenButtons, modalOpenButtonCallback);

      var modalCloseButton = node.querySelector('.' + config.ELEMENTS.CLOSE);
      var modalCancelButton = node.querySelector('.' + config.ELEMENTS.CONTROLS_CANCEL);
      var modalSubmitButton = node.querySelector('.' + config.ELEMENTS.CONTROLS_SUBMIT);
      modalCloseButton.addEventListener('click', closeModalClickHandler);
      modalCancelButton.addEventListener('click', closeModalClickHandler);
      modalSubmitButton.addEventListener('click', closeModalClickHandler);
      modalCloseButton.addEventListener('keydown', closeModalKeydownHandler);
      modalCancelButton.addEventListener('keydown', closeModalKeydownHandler);
      modalSubmitButton.addEventListener('keydown', closeModalKeydownHandler);
    }

    function modalOpenButtonCallback(index, node) {
      node.addEventListener('click', openModalClickHandler);
      node.addEventListener('keydown', openModalKeydownHandler);
    }


    // implementation details //

    function siteModalOpenObserver(evt) {
      var siteModal = document.querySelector('[' + config.DATA.MODAL_NAME + '=' + evt.modalName + ']');
      siteModal.classList.remove(config.MODIFIERS.CLOSED);
      siteModal.classList.add(config.MODIFIERS.OPEN);
    }

    function siteModalCloseObserver(evt) {
      var siteModal = evt.modalElement;
      siteModal.classList.remove(config.MODIFIERS.OPEN);
      siteModal.classList.add(config.MODIFIERS.CLOSED);
    }

    function siteModalErrorObserver(evt) {
      var siteModal = evt.modalElement;
      siteModal.classList.add(config.MODIFIERS.ERROR);
    }


    function closeModalClickHandler(evt) {
      // evt.preventDefault();
      closeModal(evt.currentTarget);
    }

    function closeModalKeydownHandler(evt) {
      var isEnterOrSpaceKeyPressed = [13, 32].indexOf(evt.keyCode) > -1;
      if (isEnterOrSpaceKeyPressed) {
        // evt.preventDefault();
        closeModal(evt.currentTarget);
      }
    }

    function closeModal(innerClosingButton) {
      var modalElement = innerClosingButton.closest('.' + config.TITLE);
      var modalName = modalElement.getAttribute(config.DATA.MODAL_NAME);

      var closeEventName = modalName + ':close';

      uhInnerEventChannel.publish(closeEventName, {
        modalElement: modalElement
      });
    }


    function errorModal(modalElement) {
      var modalName = modalElement.getAttribute(config.DATA.MODAL_NAME);

      var errorEventName = modalName + ':error';

      uhInnerEventChannel.publish(errorEventName, {
        modalElement: modalElement
      });
    }


    function openModalClickHandler(evt) {
      evt.preventDefault();
      openModal(evt.currentTarget);
    }

    function openModalKeydownHandler(evt) {
      var isEnterOrSpaceKeyPressed = [13, 32].indexOf(evt.keyCode) > -1;
      if (isEnterOrSpaceKeyPressed) openModal(evt.currentTarget);
    }

    function openModal(openButton) {
      var modalName = openButton.getAttribute(config.DATA.OPEN_MODAL_BUTTON);
      var openEventName = modalName + ':open';

      uhInnerEventChannel.publish(openEventName, {
        modalName: modalName
      });
    }

  }
  // end of site-modal scripts


  return CONFIGURATION;

  /////////
  // END //
  /////////

})(GLOBAL_SETTINGS, UTILS, jQuery);
