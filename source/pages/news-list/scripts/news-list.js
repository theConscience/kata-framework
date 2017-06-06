/* global GLOBAL_SETTINGS, UTILS */

'use strict';

(function(settings, utils) {
  console.log('Global settings:', settings);
  // some uh-inner subtemplate scripts content

  var LOGGER = {  // helper object for logging outs
    IMPORTANT: true,
    DETAILED: true
  };

  ///////////////////
  // configuration //
  ///////////////////

  var CONFIGURATION = {
    newsSlider: {
      stateClassNames: {
        ACTIVE_LINK: 'page-nav__menu-link--active',
        OPEN_SUBMENU: 'page-nav__togglable-panel--open',
      },
      stateStyles: {
        backgroundImageURL: ''
      }
    }
  };


  ///////////////
  // interface //
  ///////////////

  initNewsSlider(CONFIGURATION.newsSlider);  // news slider initialization


  ////////////////////////////
  // implementation details //
  ////////////////////////////

  function initNewsSlider(config) {  // news slider scripts

    // configuration //

    var pageMenuLinks = document.querySelectorAll('.page-nav__menu-link');  // NodeList


    // interface //

    utils.forEachNode(pageMenuLinks, menuLinkCallback);  // iterating through pageMenuLinks NodeList object

    function menuLinkCallback(index, node) {  // this callback is called for each node in pageMenuLinks NodeList
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

})(GLOBAL_SETTINGS, UTILS);
