# to do:

- сурсмапы некорректно генерятся (buildStylusPages), когда запускается таск buildPages сразу для всех страниц(без указания конкретной страницы) - создаются сурсмапы только для последней, но их количество равно количеству страниц, просто они перезатирают друг-друга поверх, и получается в итоге один файл (который был последний) и он попадает в папку последней старницы (в этом смысле кажется всё корректно) | временное решение - использовать ключи --bn, --sn, --pn с именем базы/саба/страницы, и генерить для каждой страницы отдельно.  `?????`

- папки баз и сабов в source лежат внутри папки страниц - это неудобно, нужно вынести их на один уровень с pages. Но чтобы исправить - нужно будет переписать много путей в .jade / .styl файлах, и возможно ещё где-то в .js (harvestBoundedAssets.js, gulpfile.js, smartDestRename.js)  `+++`
  - jade  `+++`
    - extends (extends):
        изменились только для страниц (pages/pagename)
          (у блоков и сабов связь осталась такая же как и была, т.к. их взаимное расположение не изменилось)
        extends ../../layouts/sub/name/name -> ../../layouts/sub/name/name
        т.е. теперь нужно подниматься на один уровень выше
    - includes (include):
        изменились только для миксинов страниц (pages/pagename/blocks/_mixins.jade_):
        include ../../layouts/sub/sub-2/blocks/_mixins.jade_ -> ../../../layouts/sub/sub-2/blocks/_mixins.jade_
        тоже нужно подниматься на один уровень выше
  -stylus  `+++`
    - imports (@import):
        изменились только для хэлперов страниц (pagename/styles/helpers)
        @import '../../../layouts/sub/sub-2/styles/helpers/_variables'_ -> '../../../../layouts/sub/sub-2/styles/helpers/_variables'_
        тоже поднимаемся на 1 уровень выше.
  -gulpfile.js  `+++`
    - переменные путей
        src_bases = 'source/pages/layouts/base' -> 'source/layouts/base'
        src_subs = 'source/pages/layouts/sub' -> 'source/layouts/sub'
        и множество других путей
        src_js_bases, src_js_subs и т.п.
        По сути нужно 'source/pages/layouts' везде заменить на 'source/layouts'
        кроме такого типа случаев:
          `var src_css_pages = [
              'source/pages/' + (envOptions.pageName || '**') + '/styles/*.css',
              '!source/pages/layouts/**/*' `


- папку generated_content переименовать в build, поправить harvestBoundedAssets.js  `+++`
  и gulpfile.js и проверить что это не влияет на smartDestRename.js !!!  `?????`

- gulpfile.js вычистить от лишних тасков, которые остались от human answers `+++`


- усовершенствовать и поправить pages/template `+++`

- понять что нужно, для быстрой генерации новой базы / саба / страницы ->
-> написать скрипт, который будет заниматься автоматической генерацией
      Может быть что-то в духе - указываем название страницы, и её связи
      (промежуточный и базовый шаблоны) - если они уже есть, то просто генерится
      папка страницы, с правильными extend/include//import блоками;
      Если одного или обоих из них нет - они должны создаться, и все связи должны
      проставиться верно.
      (Можно предусмотреть возможность создавать несколько разновидностей этих пакетов)


- улучшить таски по сбору ассетов/дистрибутивов чтобы они были логичны...

- подумать как нужно собирать страницу + её ресурсы (типо как я делал её для архива) ->
-> и сделать скрипт, который будет это делать быстро и автоматически


- добавить rupture примеси, bem-jade и другие приблуды, из CSSSR-Generator'а

- подумать как можно использовать Компоненты  `?????`
  - пока вариант 1 (тупой) - добавлять jade(html)-реализацию через include в
    нужном месте конкретной страницы, а для подключения статики компонента -
    создать файлы с линками/скриптами, которые в свою очередь будут ссылаться
    на правильное расположение ресурсов Компонента в папке build/components/componentname
    (т.е. не копировать ассеты компонента внутрь папки Страницы) и добавить эти файлы с
    линками через инклюды в jade. Для каждого компонента будет два файла:
    componentname-script.jade и componentname-link.jade. Которые будут лежать в
    папке source/componentname/blocks

- разобраться с иконками в head, сделать для них таск

- подумать, можно ли так написать таск, чтобы при изменении base или sub template'а -
  пересобирались все, связанные с ними страницы, ну или хотя бы просто все страницы...
  Т.е. неудобно каждый раз идти в базовый, или промежуточный, и после сохранения обновлений
  в них - пересохранять страницу, чтобы увидить изменения. 
