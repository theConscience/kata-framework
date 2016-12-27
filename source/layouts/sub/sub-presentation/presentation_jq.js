/* global GLOBAL_SETTINGS */

'use strict';

var PRESENTATION_UTILS_MODULE = (function(settings) {

  var supportsTemplate = function() {
    return 'content' in document.createElement('template');
  };


  var _renderPartners = function(partnersItems, // контекст
                                 template,  // шаблон
                                 containerToAppend) {  // контейнер, в конец которого рендерим контекст + шаблон
    var templateItem = null;
    if (supportsTemplate()) {
      templateItem = template.content.querySelector('.cards-list__item');
    } else {
      templateItem = template.querySelector('.cards-list__item');
    }
    var templateImage = templateItem.querySelector('.cards-list__image');
    var partnersCount = partnersItems.length;
    var newPartnerListItems = [];

    for (var i = 0; i < partnersCount; i++) {
      templateImage.setAttribute('src', partnersItems[i].logo_img || '');
      templateImage.setAttribute('width', '120');
      templateImage.setAttribute('alt', partnersItems[i].to_unicode);
      // рендерим в шаблон
      newPartnerListItems[i] = templateItem.cloneNode(true);
      containerToAppend.appendChild(newPartnerListItems[i]);
    }

    newPartnerListItems.forEach(function(item) {
      setTimeout(function() {
        item.setAttribute('data-ajax-load-status', 'loaded');
      }, 10);
    });
  };


  var $uploadablePartnersLoad = function(uploadablePartners,
                                         uploadablePartnersLoadItemsCount,
                                         uploadablePartnersLoadUrl,
                                         uploadablePartnersList,
                                         uploadablePartnersLoadButton,
                                         t_partnerLogo) {
    var uploadablePartnersLastLoadedItem = parseInt(uploadablePartners.getAttribute('data-last-loaded-item'), 10);

    var sendData = {
      'load_items_count': uploadablePartnersLoadItemsCount,
      'loading_start_number': uploadablePartnersLastLoadedItem
    };

    $.ajax({
      url: uploadablePartnersLoadUrl,
      data: $.param(sendData),  // сериализуем объект JS в строку для тела POST-запроса
      type: 'POST',
      dataType: 'json'
    }).done(function(jsonResponse) {
      console.log(jsonResponse);

      if (jsonResponse.objects.length > 0) {
        _renderPartners(jsonResponse.objects,  // данные, которыми заполняем шаблон
                        t_partnerLogo,  // шаблон, который рендерим
                        uploadablePartnersList);  // куда добавляем отрендеренные элементы

        // меняем счётчики подгрузки
        if (!uploadablePartnersLoadItemsCount) {  // если почему-то вдруг у uploadable не было значения - добавляем дефолтное
          uploadablePartners.setAttribute('data-load-items-count', jsonResponse.load_items_count);
        }
        // увеличиваем значение data-атрибута на количество загруженных объектов (расчёт делается на бэкэнде):
        uploadablePartners.setAttribute('data-last-loaded-item', jsonResponse.last_item_number);
      } else {
        if (!uploadablePartnersLoadButton.classList.contains(settings.getHiddenClass())) {
          uploadablePartnersLoadButton.classList.add(settings.getHiddenClass());
        }
      }

    }).fail(function(xhr, status, errorThrown) {
      console.log( 'Error: ' + errorThrown );
      console.log( 'Status: ' + status );
      console.dir( xhr );
    }).always(function() {
      console.log( 'Request completed!' );
    });

  };



  var _renderClientsReplies = function(clientRepliesItems, // контекст
                                       template,  // шаблон
                                       containerToAppend) {  // контейнер, в конец которого рендерим контекст + шаблон
    var templateItem = null;
    if (supportsTemplate()) {
      templateItem = template.content.querySelector('.feature-item');
    } else {
      templateItem = template.querySelector('.feature-item');
    }
    var templateItemPictureWrapper = templateItem.querySelector('.feature-item__picture-wrapper');
    var templateItemPicture = templateItem.querySelector('.feature-item__picture');
    var templateItemTitle = templateItem.querySelector('.feature-item__title');
    var templateItemSubTitleValue = templateItem.querySelector('.feature-item__sub-title-value');
    var templateItemContent = templateItem.querySelector('.feature-item__content');
    var clientRepliesCount = clientRepliesItems.length;

    var newClientsRepliesListItems = [];
    for (var i = 0; i < clientRepliesCount; i++) {
      templateItemPicture.setAttribute('src', clientRepliesItems[i].user_profile.company.logo_img || '');
      templateItemPicture.setAttribute('width', '97');
      // templateItemPicture.setAttribute('height', clientRepliesItems[i].height);
      templateItemPicture.setAttribute('alt', clientRepliesItems[i].user_profile.company.to_unicode);
      templateItemPictureWrapper.classList.remove('box--bordered--dark');
      templateItemPictureWrapper.classList.remove('box--bordered--light');
      templateItemPictureWrapper.classList.add('box--bordered--' + clientRepliesItems[i].image_border_color);
      templateItemTitle.innerHTML = clientRepliesItems[i].user_profile.to_unicode;
      templateItemSubTitleValue.innerHTML = clientRepliesItems[i].user_profile.company.to_unicode;
      templateItemContent.innerHTML = clientRepliesItems[i].translated_content;

      newClientsRepliesListItems[i] = templateItem.cloneNode(true);
      containerToAppend.appendChild(newClientsRepliesListItems[i]);
    }

    newClientsRepliesListItems.forEach(function(item) {
      setTimeout(function() {
        item.setAttribute('data-ajax-load-status', 'loaded');
      }, 10);
    });
  };


  var $uploadableClientsRepliesLoad = function(uploadableClientsReplies,
                                               uploadableClientsRepliesLoadItemsCount,
                                               uploadableClientsRepliesLoadUrl,
                                               uploadableClientsRepliesList,
                                               uploadableClientsRepliesLoadButton,
                                               t_clientReply) {
    var uploadableClientsRepliesLastLoadedItem = parseInt(uploadableClientsReplies.getAttribute('data-last-loaded-item'), 10);

    var sendData = {
      'load_items_count': uploadableClientsRepliesLoadItemsCount,
      'loading_start_number': uploadableClientsRepliesLastLoadedItem
    };

    $.ajax({
      url: uploadableClientsRepliesLoadUrl,
      data: $.param(sendData),  // сериализуем объект JS в строку для тела POST-запроса
      type: 'POST',
      dataType: 'json'
    }).done(function(jsonResponse) {
      console.log(jsonResponse);

      if (jsonResponse.objects.length > 0) {
        _renderClientsReplies(jsonResponse.objects,  // данные, которыми заполняем шаблон
                              t_clientReply,  // шаблон, который рендерим
                              uploadableClientsRepliesList);  // куда добавляем отрендеренные элементы
        // меняем счётчики подгрузки
        if (!uploadableClientsRepliesLoadItemsCount) {
          uploadableClientsReplies.setAttribute('data-load-items-count', jsonResponse.load_items_count);
        }
        // увеличиваем значение data-атрибута на количество загруженных объектов (расчёт делается на бэкэнде):
        uploadableClientsReplies.setAttribute('data-last-loaded-item', jsonResponse.last_item_number);
      } else {
        if (!uploadableClientsRepliesLoadButton.classList.contains(settings.getHiddenClass())) {
          uploadableClientsRepliesLoadButton.classList.add(settings.getHiddenClass());
        }
      }

    }).fail(function(xhr, status, errorThrown) {
      console.log( 'Error: ' + errorThrown );
      console.log( 'Status: ' + status );
      console.dir( xhr );
    }).always(function() {
      console.log( 'Request completed!' );
    });
  };


  // публичные переменные, возвращаемые из модуля
  return {
    $uploadablePartnersLoad: $uploadablePartnersLoad,
    $uploadableClientsRepliesLoad: $uploadableClientsRepliesLoad,
    // supportsTemplate: supportsTemplate  // пока никому не нужно
  };

})(GLOBAL_SETTINGS);
