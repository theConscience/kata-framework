'use strict';

(function() {

  function supportsTemplate() {
    return 'content' in document.createElement('template');
  }

  function scrollTo(element, to, duration) {
    if (duration <= 0) return;
    var difference = to - element.scrollTop;
    var perTick = difference / duration * 10;

    setTimeout(function() {
      element.scrollTop = element.scrollTop + perTick;
      if (element.scrollTop === to) return;
      scrollTo(element, to, duration - 10);
    }, 10);
  }


  var initUploadablePartners = function() {
    var uploadablePartners = document.querySelector('#uploadable--our-partners');
    var uploadablePartnersList = uploadablePartners.querySelector('.uploadable__list');
    var uploadablePartnersLoadButton = uploadablePartners.querySelector('.uploadable__load-button');
    var t_partnerLogo = document.querySelector('#template--partner-logo');

    var uploadablePartnersLoad = function() {
      if (supportsTemplate) {
        var t_partnerLogo_item = t_partnerLogo.content.querySelector('.cards-list__item');
      } else {
        var t_partnerLogo_item = t_partnerLogo.querySelector('.cards-list__item');
      }
      var t_partnerLogo_image = t_partnerLogo_item.querySelector('.cards-list__image');

      //-- *A* -- this part will be rewrited for ajax response data
      //-- (please, use template tag for html-template instances):
      var loadedItems = [
        {
          "src": "./images/img-logo-baltimore.jpg",
          "width": "120",
          "height": "46",
          "alt": "baltimore"
        }, {
          "src": "./images/img-logo-houston.jpg",
          "width": "117",
          "height": "36",
          "alt": "houston"
        }, {
          "src": "./images/img-logo-salt-lake.jpg",
          "width": "108",
          "height": "84",
          "alt": "salt lake city"
        }, {
          "src": "./images/img-logo-phoenix.jpg",
          "width": "131",
          "height": "63",
          "alt": "phoenix"
        }, {
          "src": "./images/img-logo-rapid-city.jpg",
          "width": "140",
          "height": "76",
          "alt": "rapid city"
        }, {
          "src": "./images/img-logo-phoenix.jpg",
          "width": "131",
          "height": "63",
          "alt": "phoenix"
        }, {
          "src": "./images/img-logo-rapid-city.jpg",
          "width": "140",
          "height": "76",
          "alt": "rapid city"
        }
      ];
      var loadedItemsCount = loadedItems.length; // length of data items which are recieved via JSON

      var newPartnerListItems = [];
      for (var i = 0; i < loadedItemsCount; i++) {
        t_partnerLogo_image.setAttribute('src', loadedItems[i].src);
        t_partnerLogo_image.setAttribute('width', loadedItems[i].width);
        t_partnerLogo_image.setAttribute('height', loadedItems[i].height);
        t_partnerLogo_image.setAttribute('alt', loadedItems[i].alt);
        //-- *A* -- end of AJAX rewrited part
        newPartnerListItems[i] = t_partnerLogo_item.cloneNode(true);
        uploadablePartnersList.appendChild(newPartnerListItems[i]);
      }

      newPartnerListItems.forEach(function(item) {
        setTimeout(function() {
          item.setAttribute('data-ajax-load-status', 'loaded');
        }, 10);
      });
    };

    var onUploadablePartnersLoadButtonClick = function(evt) {
      evt.preventDefault();
      uploadablePartnersLoad();
    };

    var onUploadablePartnersLoadButtonKeyDown = function(evt) {
      if ([13, 32].indexOf(evt.keyCode) > -1) {
        evt.prefentDefault();
        uploadablePartnersLoad();
      }
    };

    uploadablePartnersLoadButton.addEventListener('click', onUploadablePartnersLoadButtonClick);
    uploadablePartnersLoadButton.addEventListener('keydown', onUploadablePartnersLoadButtonKeyDown);
  };


  var initUploadableClientsReplies = function() {
    var uploadableClientsReplies = document.querySelector('#uploadable--clients-replies');
    var uploadableClientsRepliesList = uploadableClientsReplies.querySelector('.uploadable__list');
    var uploadableClientsRepliesLoadButton = uploadableClientsReplies.querySelector('.uploadable__load-button');
    var t_clientReply = document.querySelector('#template--client-reply');

    var uploadableClientsRepliesLoad = function() {
      if (supportsTemplate) {
        var t_clientReply_item = t_clientReply.content.querySelector('.feature-item');
      } else {
        var t_clientReply_item = t_clientReply.querySelector('.feature-item');
      }
      var t_clientReply_pictureWrapper = t_clientReply_item.querySelector('.feature-item__picture-wrapper');
      var t_clientReply_picture = t_clientReply_item.querySelector('.feature-item__picture');
      var t_clientReply_title = t_clientReply_item.querySelector('.feature-item__title');
      var t_clientReply_subTitleValue = t_clientReply_item.querySelector('.feature-item__sub-title-value');
      var t_clientReply_content = t_clientReply_item.querySelector('.feature-item__content');

      //-- *A* -- this part will be rewrited for ajax response data
      //-- (please, use template tag for html-template instances):
      var loadedItems = [
        {
          "src": "./images/img-logo-chateau-monfort.jpg",
          "width": "97",
          "height": "97",
          "alt": "chateau monfort",
          "imageBorderType": "light",
          "title": "Михаил Григорьев",
          "subTitleValue": "TopHotel",
          "content": "Угол курса поступательно учитывает периодический ротор. Степень свободы принципиально переворачивает дифференциальный гиротахометр."
        }, {
          "src": "./images/img-logo-como-shambala.jpg",
          "width": "148",
          "height": "99",
          "alt": "como shambala",
          "imageBorderType": "dark",
          "title": "Григорий Успенский",
          "subTitleValue": "Coral Travel",
          "content": "Угол курса поступательно учитывает периодический ротор. Степень свободы принципиально переворачивает дифференциальный гиротахометр. Время набора максимальной скорости, обобщая изложенное, колебательно даёт более простую систему дифференциальных"
        }, {
          "src": "./images/img-logo-wa.jpg",
          "width": "133",
          "height": "98",
          "alt": "w a",
          "imageBorderType": "dark",
          "title": "Василий Уткин",
          "subTitleValue": "Tez Tour",
          "content": "Время набора максимальной скорости, обобщая изложенное, колебательно даёт"
        }, {
          "src": "./images/img-logo-wa.jpg",
          "width": "133",
          "height": "98",
          "alt": "w a",
          "imageBorderType": "dark",
          "title": "Василий Уткин",
          "subTitleValue": "Tez Tour",
          "content": "Время набора максимальной скорости, обобщая изложенное, колебательно даёт"
        }, {
          "src": "./images/img-logo-chateau-monfort.jpg",
          "width": "97",
          "height": "97",
          "alt": "chateau monfort",
          "imageBorderType": "light",
          "title": "Михаил Григорьев",
          "subTitleValue": "TopHotel",
          "content": "Угол курса поступательно учитывает периодический ротор. Степень свободы принципиально переворачивает дифференциальный гиротахометр. "
        }, {
          "src": "./images/img-logo-como-shambala.jpg",
          "width": "148",
          "height": "99",
          "alt": "como shambala",
          "imageBorderType": "dark",
          "title": "Григорий Успенский",
          "subTitleValue": "Coral Travel",
          "content": "Угол курса поступательно учитывает периодический ротор. Степень свободы принципиально переворачивает дифференциальный гиротахометр. Время набора максимальной скорости, обобщая изложенное, колебательно даёт более простую систему дифференциальных"
        }, {
          "src": "./images/img-logo-chateau-monfort.jpg",
          "width": "97",
          "height": "97",
          "alt": "chateau monfort",
          "imageBorderType": "light",
          "title": "Михаил Григорьев",
          "subTitleValue": "TopHotel",
          "content": "Угол курса поступательно учитывает периодический ротор. Степень свободы принципиально переворачивает дифференциальный гиротахометр. "
        }
      ];
      var loadedItemsCount = loadedItems.length; // length of data items which are recieved via JSON

      var newClientsRepliesListItems = [];
      for (var i = 0; i < loadedItemsCount; i++) {
        t_clientReply_picture.setAttribute('src', loadedItems[i].src);
        t_clientReply_picture.setAttribute('width', loadedItems[i].width);
        t_clientReply_picture.setAttribute('height', loadedItems[i].height);
        t_clientReply_picture.setAttribute('alt', loadedItems[i].alt);
        t_clientReply_pictureWrapper.classList.remove('box--bordered--dark');
        t_clientReply_pictureWrapper.classList.remove('box--bordered--light');
        t_clientReply_pictureWrapper.classList.add('box--bordered--' + loadedItems[i].imageBorderType);
        t_clientReply_title.innerHTML = loadedItems[i].title;
        t_clientReply_subTitleValue.innerHTML = loadedItems[i].subTitleValue;
        t_clientReply_content.innerHTML = loadedItems[i].content;
        //-- *A* -- end of AJAX rewrited part
        newClientsRepliesListItems[i] = t_clientReply_item.cloneNode(true);
        uploadableClientsRepliesList.appendChild(newClientsRepliesListItems[i]);
      }

      newClientsRepliesListItems.forEach(function(item) {
        setTimeout(function() {
          item.setAttribute('data-ajax-load-status', 'loaded');
        }, 10);
      });
    };

    var onUploadableClientsRepliesLoadButtonClick = function(evt) {
      evt.preventDefault();
      uploadableClientsRepliesLoad();
    };

    var onUploadableClientsRepliesLoadButtonKeyDown = function(evt) {
      if ([13, 32].indexOf(evt.keyCode) > -1) {
        evt.prefentDefault();
        uploadableClientsRepliesLoad();
      }
    };

    uploadableClientsRepliesLoadButton.addEventListener('click', onUploadableClientsRepliesLoadButtonClick);
    uploadableClientsRepliesLoadButton.addEventListener('keydown', onUploadableClientsRepliesLoadButtonKeyDown);
  };


  var initBackToTopButton = function() {
    var backToTopButton = document.querySelector('#back-to-top');
    var backToTopButtonAnchor = backToTopButton.hash;
    var elementToScroll = document.querySelector(backToTopButtonAnchor);

    var backToTop = function() {
      scrollTo(document.body, elementToScroll.offsetTop, 600);
    };

    var onBackToTopButtonClick = function(evt) {
      evt.preventDefault();
      backToTop();
    };

    var onBackToTopButtonKeyDown = function(evt) {
      if ([13, 32].indexOf(evt.keyCode) > -1) {
        evt.preventDefault();
        backToTop();
      }
    };

    backToTopButton.addEventListener('click', onBackToTopButtonClick);
    backToTopButton.addEventListener('keydown', onBackToTopButtonKeyDown);
  };


  var initCompanyTypeMenuToggle = function() {
    var companyTypeMenu = document.querySelector('.menu-company-type');
    var companyTypeMenuToggleButton = companyTypeMenu.querySelector('.menu-company-type__header-switch');
    // var companyTypeMenuTogglable = companyTypeMenu.querySelector('.menu-company-type__content');

    var companyTypeMenuToggle = function() {
      if (companyTypeMenu.classList.contains('menu-company-type--opened')) {
        companyTypeMenu.classList.remove('menu-company-type--opened');
      } else {
        companyTypeMenu.classList.add('menu-company-type--opened');
      }
    };

    var onCompanyTypeMenuToggleButtonClick = function(evt) {
      evt.preventDefault();
      companyTypeMenuToggle();
    };

    var onCompanyTypeMenuToggleButtonKeyDown = function(evt) {
      if ([13, 32].indexOf(evt.keyCode) > -1) {
        evt.preventDefault();
        companyTypeMenuToggle();
      }
    };

    companyTypeMenuToggleButton.addEventListener('click', onCompanyTypeMenuToggleButtonClick);
    companyTypeMenuToggleButton.addEventListener('keydown', onCompanyTypeMenuToggleButtonKeyDown);
  };





  var isXsViewport = false;

  var prevScrollInfo = {
    direction: null,
    size: 0,
    value: 0,
    fix: false
  };


  var getViewportYPositionData = function() {
    var viewportData = {};
    viewportData.top = window.pageYOffset || document.documentElement.scrollTop;
    viewportData.height = document.documentElement.clientHeight;
    viewportData.getBottom = function() {
      return this.top + this.height;
    };

    return viewportData;
  };


  var getElementYPositionData = function(element, offsetCssProperty) {
    var elementData = {};
    var elementOffsets = element.getBoundingClientRect();
    elementData.viewportTop = elementOffsets.top;
    elementData.top = element.scrollTop;
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
    elementData.getLastChildBottom = function() {
      return this.lastChildTop + this.lastChildHeight;
    };

    elementData.getElementContentHeight = function() {
      return this.getLastChildBottom() - this.firstChildTop;
    };

    elementData.getElementHeight = function() {
      return this.getLastChildBottom() - this.top;
    };

    elementData.innerOffsetTop = parseInt(element.style[offsetCssProperty] || 0, 10);

    return elementData;
  };


  var getScrollInfo = function(scrollTop) {
    var scrollSize = prevScrollInfo.value - scrollTop;  // отрицательное значение - скролл вниз, положительное - вверх
    var scrollDirection = (scrollSize < 0) ? 'down' : 'up';

    var info = {
      value: scrollTop,
      size: scrollSize,
      direction: scrollDirection,
      fix: prevScrollInfo.fix
    };

    return info;
  };


  /**
   * @param {HTMLElement} element
   * @return {Boolean}
   */
  var isElementContentHeightMoreThanViewport = function(viewportData, elementData) {
    if (elementData.getElementContentHeight() > viewportData.height) {
      return true;
    }
    return false;
  };


  var shouldScrollUp = function(viewportData, elementData, scrollInfo) {  // прокрутка вверх === опускаем блок вниз, за границу вьюпорта
    if (elementData.innerOffsetTop) {
      return true;
    } else if (prevScrollInfo.fix) {
      scrollInfo.fix = false;
      return true;
    }
    return false;
  };


  var shouldScrollDown = function(viewportData, elementData, scrollInfo) {  // прокрутка вниз === поднимаем блок вверх, за границу вьюпорта
    if (viewportData.top + elementData.lastChildViewportBottom > viewportData.getBottom() &&
        elementData.containerHeight >= elementData.getElementHeight() + Math.abs(scrollInfo.size)) {
      if (!prevScrollInfo.fix) {
        scrollInfo.fix = true;
        return false;
      }
      return true;
    }

    return false;
  };


  var initCompanyTypeMenuScroll = function() {

    var companyTypeMenuPanel = document.querySelector('#scrollable-panel--fixed');

    var onWindowScroll = function() {
      var viewportData = getViewportYPositionData();
      var elementData = getElementYPositionData(companyTypeMenuPanel, 'marginTop');
      var scrollInfo = getScrollInfo(viewportData.top);

      if (isElementContentHeightMoreThanViewport(viewportData, elementData) &&
          window.innerWidth > 767) {
        var newMarginValue = parseFloat(companyTypeMenuPanel.style.marginTop || 0, 10) + scrollInfo.size;
        if (scrollInfo.direction === 'down' &&
            shouldScrollDown(viewportData, elementData, scrollInfo)) {
          companyTypeMenuPanel.style.marginTop = newMarginValue + 'px';
        } else if (scrollInfo.direction === 'up' &&
            shouldScrollUp(viewportData, elementData, scrollInfo)) {
          companyTypeMenuPanel.style.marginTop = (newMarginValue >= 0) ? '' : newMarginValue + 'px';
        }
      } else if (!isElementContentHeightMoreThanViewport(viewportData, elementData) &&
          companyTypeMenuPanel.style.marginTop) {
        companyTypeMenuPanel.style.marginTop = '';
      }

      prevScrollInfo = scrollInfo;  // запоминаем значения скролла внутри области видимости этого модуля
    };

    var onWindowResize = function() {
      var viewportData = getViewportYPositionData();
      var scrollInfo = getScrollInfo(viewportData.top);

      if (window.innerWidth <= 767 && !isXsViewport) {
        console.log('removing scroll listener');
        console.log('window width =', window.innerWidth);
        window.removeEventListener('scroll', onWindowScroll);
        companyTypeMenuPanel.style.marginTop = '';
        isXsViewport = true;
      } else if (window.innerWidth > 767 && isXsViewport) {
        console.log('adding scroll listener');
        console.log('window width =', window.innerWidth);
        window.addEventListener('scroll', onWindowScroll);
        companyTypeMenuPanel.style.marginTop = '';
        isXsViewport = false;
      }

      prevScrollInfo = scrollInfo;  // запоминаем значения скролла внутри области видимости этого модуля
    };

    window.addEventListener('scroll', onWindowScroll);
    window.addEventListener('resize', onWindowResize);
  };


  initUploadablePartners();
  initUploadableClientsReplies();
  initBackToTopButton();
  initCompanyTypeMenuToggle();
  initCompanyTypeMenuScroll();

})();
