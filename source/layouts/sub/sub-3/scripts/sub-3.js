/* global GLOBAL_SETTINGS, UTILS */

'use strict';

(function(settings, utils) {
  console.log('Global settings:', settings);
  // some uh-inner subtemplate scripts content

  var LOGGER = {
    // helper object for logging outs
    IMPORTANT: true,
    DETAILED: true
  };

  ///////////////////
  // configuration //
  ///////////////////

  var CONFIGURATION = {
    pageMenuToggle: {
      stateClassNames: {
        ACTIVE_LINK: 'page-nav__menu-link--active',
        OPEN_SUBMENU: 'page-nav__togglable-panel--open'
      }
    },
    dropdownSimple: {
      stateClassNames: {}
    }
  };

  ///////////////
  // interface //
  ///////////////

  // uh-inner subtemplate components initialization
  initPageMenuToggle(CONFIGURATION.pageMenuToggle); // page menu toggle button initialization

  // global components initialization
  initDropdownSocial(CONFIGURATION.dropdownSocial); // dropdown-social component initialization
  initDropdownSimple(CONFIGURATION.dropdownSimple); // dropdown-simple component initialization

  ////////////////////////////
  // implementation details //
  ////////////////////////////

  function initPageMenuToggle(config) {
    // page menu toggle scripts

    // configuration //

    var pageMenuLinks = document.querySelectorAll('.page-nav__menu-link'); // NodeList

    // interface //

    utils.forEachNode(pageMenuLinks, menuLinkCallback); // iterating through pageMenuLinks NodeList object

    function menuLinkCallback(index, node) {
      // this callback is called for each node in pageMenuLinks NodeList
      node.addEventListener('click', menuLinkClickHandler);
      node.addEventListener('keydown', menuLinkKeydownHandler);
    }

    // implementation details //

    function menuLinkClickHandler(evt) {
      if (LOGGER.DETAILED) console.log('menuLinkClickHandler is called!');
      evt.preventDefault();
      togglePageMenu(evt.target);
    }

    function menuLinkKeydownHandler(evt) {
      if (LOGGER.DETAILED) console.log('menuLinkKeydownHandler is called!');
      if ([13, 32].indexOf(evt.keyCode) > -1) {
        evt.preventDefault();
        togglePageMenu(evt.target);
      }
    }

    function togglePageMenu(menuLink) {
      if (LOGGER.DETAILED) console.log('togglePageMenu is called!');
      if (LOGGER.DETAILED) console.log('menuLink:', menuLink);
      var menuItem = menuLink.closest('.page-nav__menu-item');
      var menuLinkIsActive = menuLink.classList.contains(config.stateClassNames.ACTIVE_LINK);
      var submenu = menuItem.querySelector('.page-nav__togglable-panel');
      if (submenu) {
        if (LOGGER.DETAILED) console.log('submenu:', submenu);
        var submenuIsOpen = submenu.classList.contains(config.stateClassNames.OPEN_SUBMENU);
        if (submenuIsOpen && menuLinkIsActive) {
          menuLink.classList.remove(config.stateClassNames.ACTIVE_LINK);
          submenu.classList.remove(config.stateClassNames.OPEN_SUBMENU);
          setSubmenuLinksTabindexes(submenu, '-1');
        } else if (!submenuIsOpen && !menuLinkIsActive) {
          switchOffActiveMenuLinks(config.stateClassNames.ACTIVE_LINK);
          menuLink.classList.add(config.stateClassNames.ACTIVE_LINK);
          closeAllSubmenus(config.stateClassNames.OPEN_SUBMENU);
          submenu.classList.add(config.stateClassNames.OPEN_SUBMENU);
          setSubmenuLinksTabindexes(submenu, '0');
        } else {
          throw new Error('There is unexpected behaviour in page menu toggling logic.');
        }
      } else {
        if (menuLinkIsActive) {
          menuLink.classList.remove(config.stateClassNames.ACTIVE_LINK);
        } else {
          switchOffActiveMenuLinks(config.stateClassNames.ACTIVE_LINK);
          menuLink.classList.add(config.stateClassNames.ACTIVE_LINK);
          closeAllSubmenus(config.stateClassNames.OPEN_SUBMENU);
        }
      }

      function switchOffActiveMenuLinks(activeClassName) {
        if (LOGGER.DETAILED) console.log('switchOffActiveMenuLinks is called!');
        var activeLinks = document.querySelectorAll('.' + activeClassName);
        utils.forEachNode(activeLinks, function(index, node) {
          node.classList.remove(activeClassName);
        });
      }

      function closeAllSubmenus(openClassName) {
        if (LOGGER.DETAILED) console.log('closeAllSubmenus is called!');
        var openedSubmenus = document.querySelectorAll('.' + openClassName);
        utils.forEachNode(openedSubmenus, function(index, node) {
          node.classList.remove(openClassName);
          setSubmenuLinksTabindexes(node, '-1');
        });
      }

      function setSubmenuLinksTabindexes(submenuElement, tabindex) {
        if (LOGGER.DETAILED) console.log('setSubmenuLinksTabindexes is called!');
        console.log('submenuElement:', submenuElement);
        console.log('tabindex:', tabindex);
        var submenuLinks = submenuElement.querySelectorAll('.page-nav__submenu-link');
        utils.forEachNode(submenuLinks, function(index, node) {
          node.setAttribute('tabindex', tabindex);
        });
      }
    }
  }
  // end of page menu toggle scripts

  function initDropdownSocial(config) {
    // dropdown-social component scripts

    // configuration //

    var dropdownSocialNodes = document.querySelectorAll('.dropdown-social'); // NodeList

    // interface //

    utils.forEachNode(dropdownSocialNodes, dropdownSocialNodeCallback);

    function dropdownSocialNodeCallback(index, node) {
      var dropdownSocialRadioControl = node.querySelector('.dropdown-social__open');
      dropdownSocialRadioControl.addEventListener('change', dropdownSocialRadioControlChangeHandler);
      var dropdownSocialButton = node.querySelector('.dropdown-social__button');
      dropdownSocialButton.addEventListener('keydown', dropdownSocialButtonKeydownHandler);
    }

    // implementation details //

    function dropdownSocialRadioControlChangeHandler(evt) {
      if (LOGGER.DETAILED) console.log('dropdownSocialStateRadioChangeHandler is called!');
      if (LOGGER.DETAILED) console.log(evt, evt.target.checked);
      var dropdownSocialNode = evt.target.closest('.dropdown-social');
      var dropdownSocialSubmenuLinks = dropdownSocialNode.querySelectorAll('.dropdown-social__submenu-link');
      utils.forEachNode(dropdownSocialSubmenuLinks, function(index, node) {
        if (evt.target.checked) {
          node.setAttribute('tabindex', 0);
        } else {
          node.setAttribute('tabindex', -1);
        }
      });
    }

    function dropdownSocialButtonKeydownHandler(evt) {
      if (LOGGER.DETAILED) console.log('dropdownSocialButtonKeydownHandler is called!');
      if ([13, 32].indexOf(evt.keyCode) > -1) {
        evt.preventDefault();
        var boundedRadioControlID = evt.target.getAttribute('for');
        var boundedRadioControl = document.querySelector('#' + boundedRadioControlID);
        if (boundedRadioControl) {
          var changeEvent = new Event('change', { bubbles: true, cancelable: false });
          boundedRadioControl.checked = boundedRadioControl.checked ? false : true;
          boundedRadioControl.dispatchEvent(changeEvent);
        } else {
          throw new Error(
            'There is no radiobutton bound to label with id #' + boundedRadioControlID + 'and for attribute.'
          );
        }
      }
    }
  }
  // end of dropdown-social component scripts

  function initDropdownSimple(config) {
    // dropdown-simple component scripts

    // configuration //

    var dropdownSimpleNodes = document.querySelectorAll('.dropdown-simple'); // NodeList

    // interface //
    utils.forEachNode(dropdownSimpleNodes, dropdownSimpleNodeCallback);

    function dropdownSimpleNodeCallback(index, node) {
      var dropdownSimpleRadioControl = node.querySelector('.dropdown-simple__open');
      dropdownSimpleRadioControl.addEventListener('change', dropdownSimpleRadioControlChangeHandler);
      var dropdownSimpleButton = node.querySelector('.dropdown-simple__button');
      dropdownSimpleButton.addEventListener('keydown', dropdownSimpleButtonKeydownHandler);
    }

    // implementation details //

    function dropdownSimpleRadioControlChangeHandler(evt) {
      if (LOGGER.DETAILED) console.log('dropdownSimpleRadioControlChangeHandler is called!');
      if (LOGGER.DETAILED) console.log(evt, evt.target.checked);
      var dropdownSimpleNode = evt.target.closest('.dropdown-simple');
      var dropdownSimpleSubmenuLinks = dropdownSimpleNode.querySelectorAll('.dropdown-simple__link');
      utils.forEachNode(dropdownSimpleSubmenuLinks, function(index, node) {
        if (evt.target.checked) {
          node.setAttribute('tabindex', 0);
        } else {
          node.setAttribute('tabindex', -1);
        }
      });
    }

    function dropdownSimpleButtonKeydownHandler(evt) {
      if (LOGGER.DETAILED) console.log('dropdownSimpleButtonKeydownHandler is called!');
      if ([13, 32].indexOf(evt.keyCode) > -1) {
        evt.preventDefault();
        var boundedRadioControlID = evt.target.getAttribute('for');
        var boundedRadioControl = document.querySelector('#' + boundedRadioControlID);
        if (boundedRadioControl) {
          var changeEvent = new Event('change', { bubbles: true, cancelable: false });
          boundedRadioControl.checked = boundedRadioControl.checked ? false : true;
          boundedRadioControl.dispatchEvent(changeEvent);
        } else {
          throw new Error(
            'There is no radiobutton bound to label with id #' + boundedRadioControlID + 'and for attribute.'
          );
        }
      }
    }
  }
  // end of dropdown-simple component scripts

  /////////
  // END //
  /////////
})(GLOBAL_SETTINGS, UTILS);
