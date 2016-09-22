'use strict';

(function() {

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
    elementData.top = element.scrollTop;  // у position:fixed;top:0 - всегда 0
    // elementData.height = element.clientHeight;  // некорректно показывает для position:fixed без фиксированной высоты - размер вьюпорта + размер маргина
    elementData.containerHeight = document.body.clientHeight;
    // elementData.getBottom = function() {  // использует некорректные величины, поэтому комменчу как бесполезное
    //   return this.top + this.height;
    // };

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
    // console.log('  getScrollDirection is called!');
    var scrollSize = prevScrollInfo.value - scrollTop;  // отрицательное значение - скролл вниз, положительное - вверх
    var scrollDirection = (scrollSize < 0) ? 'down' : 'up';

    var info = {
      value: scrollTop,
      size: scrollSize,
      direction: scrollDirection,
      fix: prevScrollInfo.fix
    };

    // console.log('    * prevScrollInfo: ', prevScrollInfo);
    // console.log('    * info: ', info);
    return info;
  };


  /**
   * @param {HTMLElement} element
   * @return {Boolean}
   */
  var isElementContentHeightMoreThanViewport = function(viewportData, elementData) {
    // console.log('  isElementHeightMoreThanViewport is called!');

    // console.log('    elementData.top ===', elementData.top);
    // console.log('    elementData.lastChildTop ===', elementData.lastChildTop);
    // console.log('    elementData.lastChildHeight ===', elementData.lastChildHeight);
    // console.log('    elementData.getLastChildBottom() ===', elementData.getLastChildBottom());
    // console.log('    elementData.getElementContentHeight() ===', elementData.getElementContentHeight());
    // console.log('    elementData.getElementHeight() ===', elementData.getElementHeight());
    // console.log('    viewportData.height ===', viewportData.height);
    if (elementData.getElementContentHeight() > viewportData.height) {
      // console.log('    * element content height does not fit into viewport height, return true');
      return true;
    }
    // console.log('    * element content height fits into viewport height, return false');
    return false;
  };


  var shouldScrollUp = function(viewportData, elementData, scrollInfo) {  // прокрутка вверх === опускаем блок вниз, за границу вьюпорта
    // console.log('  shouldScrollUp is called!');
    if (elementData.innerOffsetTop) {
      return true;
    } else if (prevScrollInfo.fix) {
      scrollInfo.fix = false;
      return true;
    }
    return false;
  };


  var shouldScrollDown = function(viewportData, elementData, scrollInfo) {  // прокрутка вниз === поднимаем блок вверх, за границу вьюпорта
    // console.log('  shouldScrollDown is called!');
    if (viewportData.top + elementData.lastChildViewportBottom > viewportData.getBottom() &&
        elementData.containerHeight >= elementData.getElementHeight() + Math.abs(scrollInfo.size)) {
      if (!prevScrollInfo.fix) {
        scrollInfo.fix = true;
        return false;
      }
      return true;
    }
    //  else if (viewportData.top + elementData.lastChildViewportBottom <= viewportData.getBottom()) {
    //   console.log('     OUCH!!!!!!!!!!!!!!!!!!!! bottom of block content is highter then viewport bottom');
    //   console.log('     last child bottom = ', elementData.getLastChildBottom());
    //   console.log('     viewport bottom = ', viewportData.getBottom());
    // } else if (elementData.containerHeight < elementData.getElementHeight() + Math.abs(scrollInfo.size)) {
    //   console.log('     OUCH!!!!!!!!!!!!!!!!!!!!  container gonna grow if add bigger margins');
    //   console.log('     container height =', elementData.containerHeight);
    //   console.log('     element content height =', elementData.getElementHeight());
    //   console.log('     scroll size =', Math.abs(scrollInfo.size));
    //
    // }
    return false;
  };


  var initAdditionalInfoScroll = function() {
    // console.log('initAdditionalInfoScroll was called!');

    var additionalInfoPanel = document.querySelector('#scrollable-panel--fixed');

    var onWindowScroll = function() {
      // console.log('\n----- onWindowScroll callback is called!');

      var viewportData = getViewportYPositionData();
      var elementData = getElementYPositionData(additionalInfoPanel, 'marginTop');
      var scrollInfo = getScrollInfo(viewportData.top);

      if (isElementContentHeightMoreThanViewport(viewportData, elementData) &&
          window.innerWidth > 767) {
        var newMarginValue = parseFloat(additionalInfoPanel.style.marginTop || 0, 10) + scrollInfo.size;
        if (scrollInfo.direction === 'down' &&
            shouldScrollDown(viewportData, elementData, scrollInfo)) {
          additionalInfoPanel.style.marginTop = newMarginValue + 'px';
        } else if (scrollInfo.direction === 'up' &&
            shouldScrollUp(viewportData, elementData, scrollInfo)) {
          additionalInfoPanel.style.marginTop = (newMarginValue >= 0) ? '' : newMarginValue + 'px';
        }
      } else if (!isElementContentHeightMoreThanViewport(viewportData, elementData) &&
          additionalInfoPanel.style.marginTop) {
        additionalInfoPanel.style.marginTop = '';
      }

      prevScrollInfo = scrollInfo;  // запоминаем значения скролла внутри области видимости этого модуля
    };

    var onWindowResize = function() {
      // console.log('\n----- onWindowResize callback is called!');

      var viewportData = getViewportYPositionData();
      // var elementData = getElementYPositionData(additionalInfoPanel, 'marginTop');
      var scrollInfo = getScrollInfo(viewportData.top);

      if (window.innerWidth <= 767 && !isXsViewport) {
        console.log('removing scroll listener');
        console.log('window width =', window.innerWidth);
        window.removeEventListener('scroll', onWindowScroll);
        additionalInfoPanel.style.marginTop = '';
        isXsViewport = true;
      } else if (window.innerWidth > 767 && isXsViewport) {
        console.log('adding scroll listener');
        console.log('window width =', window.innerWidth);
        window.addEventListener('scroll', onWindowScroll);
        additionalInfoPanel.style.marginTop = '';
        isXsViewport = false;
      }

      prevScrollInfo = scrollInfo;  // запоминаем значения скролла внутри области видимости этого модуля
    };

    window.addEventListener('scroll', onWindowScroll);
    window.addEventListener('resize', onWindowResize);
  };

  initAdditionalInfoScroll();

})();
