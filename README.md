# Stellar Burgers

Учебный frontend-проект на `React` и `TypeScript` для сервиса заказа бургеров.

Приложение включает:
- конструктор бургеров
- список ингредиентов
- ленту заказов
- регистрацию и авторизацию
- личный кабинет пользователя
- защищённые роуты
- просмотр деталей ингредиентов и заказов

## Стек

- `React 18`
- `TypeScript`
- `Redux Toolkit`
- `React Router`
- `Webpack`
- `Jest`
- `Cypress`
- `Storybook`

## Запуск проекта

Установить зависимости:

```bash
npm install
```

Создать файл `.env` на основе `.env.example`:

```env
BURGER_API_URL=https://norma.education-services.ru/api
```

Запустить локальный сервер:

```bash
npm start
```

По умолчанию приложение открывается на `http://localhost:4000`.

## Доступные команды

Запуск dev-сервера:

```bash
npm start
```

Production build:

```bash
npm run build
```

Проверка линтером:

```bash
npm run lint
```

Автоисправление линтера:

```bash
npm run lint:fix
```

Запуск unit-тестов:

```bash
npm test
```

Запуск Cypress:

```bash
npm run cypress:open
```

Запуск Storybook:

```bash
npm run storybook
```

Сборка Storybook:

```bash
npm run build-storybook
```

## Структура проекта

- `src/components` — контейнерные и UI-компоненты
- `src/pages` — страницы приложения
- `src/services` — store, slices и async actions
- `src/utils` — API и вспомогательные функции
- `__tests__` — unit-тесты
- `cypress` — e2e-тесты

## Деплой

Проект настроен на деплой через `GitHub Actions` в `GitHub Pages`.

После пуша в ветку `main` или `review` workflow:
- устанавливает зависимости
- собирает проект
- публикует содержимое папки `dist`

Для GitHub Pages используется `HashRouter`, поэтому роуты корректно работают без серверной настройки rewrite.

## Макет и API

- Макет: [Figma](https://www.figma.com/file/vIywAvqfkOIRWGOkfOnReY/React-Fullstack_-%D0%9F%D1%80%D0%BE%D0%B5%D0%BA%D1%82%D0%BD%D1%8B%D0%B5-%D0%B7%D0%B0%D0%B4%D0%B0%D1%87%D0%B8-(3-%D0%BC%D0%B5%D1%81%D1%8F%D1%86%D0%B0)_external_link?type=design&node-id=0-1&mode=design)
- API: `https://norma.education-services.ru/api`
