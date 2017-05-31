'use strict';


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


  return {
    getHiddenClass: getHiddenClass,
    getActiveClass: getActiveClass,
    getInvalidClass: getInvalidClass,
    getValidClass: getValidClass,
    getMediaUrl: getMediaUrl,
    getStaticUrl: getStaticUrl,
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
    }
  };
})();


//////////////////////////////////////////
// Element prototype polifilled methods //
//////////////////////////////////////////

(function(e) {  // .matches polyfill, used by closest polyfill
  e.matches || (e.matches = e.matchesSelector || function(selector) {
    var matches = document.querySelectorAll(selector), th = this;
    return Array.prototype.some.call(matches, function(e) {
      return e === th;
    });
  });
})(Element.prototype);

(function(e) {  // .closest polyfill
  e.closest = e.closest || function(css) {
    var node = this;
    while (node) {
      if (node.matches(css)) return node;
      else node = node.parentElement;
    }
    return null;
  };
})(Element.prototype);


///////////////////////////
// Base template scripts //
///////////////////////////

(function(settings, utils) {
  console.log('Global settings:', settings);
  // some uh-inner scripts content

  var LOGGER = {  // helper object for logging outs
    IMPORTANT: true,
    DETAILED: true
  };

  ///////////////////
  // configuration //
  ///////////////////

  var CONFIGURATION = {
    mainMenuToggle: {
      stateClassNames: {
        // EXTENDED_INNER: 'uh-inner-page__inner--extended',
        EXTENDED_PAGE: 'uh-inner-page--extended',
        COLLAPSED_ASIDE: 'uh-inner-aside--collapsed',
        COLLAPSED_MAIN_MENU: 'main-nav--collapsed',
        COLLAPSED_ACTIONS_MENU: 'actions-nav--collapsed',
        EXTENDED_SITE_SEARCH: 'site-search--extended'
      }
    },
    siteLanguage: {
      stateClassNames: {
        OPEN: 'site-language--open'
      }
    },
    siteSearch: {
      stateClassNames: {
        EXTENDED_SITE_SEARCH: 'site-search--extended'
      }
    }
  };


  ///////////////
  // interface //
  ///////////////

  initMainMenuToggle(CONFIGURATION.mainMenuToggle);  // site main menu toggle button initialization
  initSiteLanguage(CONFIGURATION.siteLanguage);  // site-language component initialization
  initSiteSearch(CONFIGURATION.siteSearch);  // site-search component initialization


  ////////////////////////////
  // implementation details //
  ////////////////////////////

  function initMainMenuToggle(config) {  // site main menu toggle scripts

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
      var isEnterOrSpaceKey = ([13, 32].indexOf(evt.keyCode) > -1);
      if (isEnterOrSpaceKey) {
        evt.preventDefault();
        toggleMainMenu();
      }
    }

    function toggleMainMenu() {
      if (LOGGER.DETAILED) console.log('toggleMainMenu is called!');
      /* Old layout scripts:
        var mainMenuIsCollapsed = mainMenu.classList.contains(config.stateClassNames.COLLAPSED_MENU);
        var pageInnerIsExtended = bodyInner.classList.contains(config.stateClassNames.EXTENDED_INNER);
        if (mainMenuIsCollapsed && pageInnerIsExtended) {
          mainMenu.classList.remove(config.stateClassNames.COLLAPSED_MENU);
          bodyInner.classList.remove(config.stateClassNames.EXTENDED_INNER);
        } else if (!mainMenuIsCollapsed && !pageInnerIsExtended) {
          mainMenu.classList.add(config.stateClassNames.COLLAPSED_MENU);
          bodyInner.classList.add(config.stateClassNames.EXTENDED_INNER);
        } else {
          throw new Error('There is unexpected behaviour in uh main menu toggling logic.');
        }
      */
      var pageIsExtended = uhInnerPage.classList.contains(config.stateClassNames.EXTENDED_PAGE);
      var pageAsideIsCollapsed = pageAside.classList.contains(config.stateClassNames.COLLAPSED_ASIDE);
      var mainNavIsCollapsed = mainMenu.classList.contains(config.stateClassNames.COLLAPSED_MAIN_MENU);
      var actionsNavIsCollapsed = actionsMenu.classList.contains(config.stateClassNames.COLLAPSED_ACTIONS_MENU);
      var siteSearchIsExtended = siteSearch.classList.contains(config.stateClassNames.EXTENDED_SITE_SEARCH);
      if (pageIsExtended && siteSearchIsExtended && pageAsideIsCollapsed && mainNavIsCollapsed && actionsNavIsCollapsed) {
        extendMainMenu();
      } else if (!pageIsExtended && !siteSearchIsExtended && !pageAsideIsCollapsed && !mainNavIsCollapsed && !actionsNavIsCollapsed) {
        collapseMainMenu();
      } else {
        throw new Error('There is unexpected behaviour in uh main menu toggling logic.');
      }

      function extendMainMenu() {
        uhInnerPage.classList.remove(config.stateClassNames.EXTENDED_PAGE);
        siteSearch.classList.remove(config.stateClassNames.EXTENDED_SITE_SEARCH);
        pageAside.classList.remove(config.stateClassNames.COLLAPSED_ASIDE);
        mainMenu.classList.remove(config.stateClassNames.COLLAPSED_MAIN_MENU);
        actionsMenu.classList.remove(config.stateClassNames.COLLAPSED_ACTIONS_MENU);
        switchMainMenuToggleButtonValues();
      }

      function collapseMainMenu() {
        uhInnerPage.classList.add(config.stateClassNames.EXTENDED_PAGE);
        siteSearch.classList.add(config.stateClassNames.EXTENDED_SITE_SEARCH);
        pageAside.classList.add(config.stateClassNames.COLLAPSED_ASIDE);
        mainMenu.classList.add(config.stateClassNames.COLLAPSED_MAIN_MENU);
        actionsMenu.classList.add(config.stateClassNames.COLLAPSED_ACTIONS_MENU);
        switchMainMenuToggleButtonValues();
      }

      function switchMainMenuToggleButtonValues() {
        var mainMenuToggleButtonValue = mainMenuToggleButton.textContent;
        var mainMenuToggleButtonExtendedValue = mainMenuToggleButton.getAttribute('data-alternate-title');
        mainMenuToggleButton.textContent = mainMenuToggleButtonExtendedValue;
        mainMenuToggleButton.setAttribute('data-alternate-title', mainMenuToggleButtonValue);
        mainMenuToggleButton.setAttribute('title', mainMenuToggleButtonExtendedValue);
      }
    }
  }
  // end of site main menu toggle scripts

  function initSiteLanguage(config) {  // site-language component scripts

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
      var siteLanguageIsOpen = dispatchingComponent.classList.contains(config.stateClassNames.OPEN);

      if (siteLanguageIsOpen) {
        dispatchingComponent.classList.remove(config.stateClassNames.OPEN);
      } else {
        dispatchingComponent.classList.add(config.stateClassNames.OPEN);
      }
    }
  }
  // end of site-language component scripts

  function initSiteSearch(config) {  // site-search component scripts

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

})(GLOBAL_SETTINGS, UTILS);
