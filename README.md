# Верстка - Медицинские осмотры

Доступно для просмотра на  https://julianickul.github.io/healthcheck/

## Используемые технологии
* Gulp 
* PUG 
* SCSS
* SVG
* Bootstrap 4.1
* BEM

## Рабочая среда
### Prerequisites
Необходима предустановка
- NodeJs
- Gulp, Gulp CLI

В корневой директории запустить команду:
```javascript
npm install
```

### Сборка
**Во избежание проблем с выполнением (запуском) скриптов рекомендуется запускать проект в режиме DEV. В PRODUCTION (после сборки `npm run build`) не подключается библиотека для локализации таблицы (dataTables_Ru.json), в консоли ошибки**

* ```npm run dev``` - Запускает проект в режиме разработки. При этом происходит первоначальная сборка проекта, запуск локального сервера, инициализация вотчеров
* ```npm run build``` - Сборка проекта для продакшена

## Файловая структура
```
healthcheck
├── dist
│   │   ├── assets
│   │   ├── Desktop
│   │   ├── TerminalAdmin
│   │   ├── TerminalClient
│   │   ├── UiKit
│   │   ├── index.html
├── src
│   ├── assets
│   │   ├── compiled
│   │   │   ├── css
│   │   │   ├── images
│   │   ├── src
│   │   │   ├── fonts
│   │   │   ├── images
│   ├── components
│   │   │   ├── Desktop
│   │   │   ├── Terminal
│   │   │   ├── UI
|   │   ├── js
|   │   ├── screens
│   │   │   ├── Desktop
│   │   │   ├── TerminalAdmin
│   │   │   ├── TerminalClient
│   │   │   ├── UiKit
├── .babelrc
├── .gitignore
├── gulpfile.js
├── package.json
├── README.md
```


* ```dist``` - Скомпилированные файлы
    * ```assets``` - шрифты, изображения, svg-спрайты
    * ```Desktop``` - html/css для *Администратор/Дежурный врач/Ламповщик*
    * ```TerminalAdmin``` - html/css для *Терминал/Административная панель*
    * ```TerminalClient``` - html/css для *Терминал/Клиентская панель*
    * ```UiKit``` - html/css для общих компонентов дизайна *Кнопки/Инпуты... и пр.*
* ```src``` - Исходный код:
    * ```assets``` - картинки/шрифты
        * ```compiled/css``` - НЕМИНИФИЦИРОВАННЫЕ стили для каждого представления (Desktop/TerminalClient/TerminalAdmin)
        * ```compiled/images``` - SVG-sprites
        * ```src/fonts``` - Все варианты шрифтов (woff/woff2/ttf/eot/svg)
        * ```src/images``` - НЕМИНИФИЦИРОВАННЫЕ SVG, оптимизированные изображения
    * ```components``` - компоненты для каждого типа представлений (*scss/pug*)
    * ```screens``` - собранные страницы (*pug*)
    
* ```.babelrc``` — Настройки для компиляции JS
* ```gulpfile.js```  — Файл сборки проекта
* ```package.json``` — Список зафисимостей, описание проекта, инструкции сборки


## Используемые сторонние скрипты
Для таблиц используется компонент **DataTables** ([https://datatables.net/](https://datatables.net/))

Для реализации чекбоксов в таблице используется [jQuery DataTables checkboxes](https://www.gyrocode.com/projects/jquery-datatables-checkboxes/)

Примеры использования:
* [jQuery DataTables: Row selection using checkboxes](https://www.gyrocode.com/articles/jquery-datatables-checkboxes/)
* [https://jsfiddle.net/gyrocode/snqw56dw/](https://jsfiddle.net/gyrocode/snqw56dw/)
* [jQuery DataTables: How to add a checkbox column](https://www.gyrocode.com/articles/jquery-datatables-how-to-add-a-checkbox-column/)


Для реализации календаря используeтся
* https://longbill.github.io/jquery-date-range-picker/
