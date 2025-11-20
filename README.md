# Notes Platform by NIMARS v0.2.0

Простое full-stack приложение для работы с заметками (todo): создание, просмотр, редактирование, отметка выполнения и удаление.  
Каждый пользователь видит только свои заметки после авторизации.

Проект сделан как тестовое задание.

## Стек

Backend:

- Node.js, TypeScript
- Express
- Prisma + PostgreSQL
- Zod (валидация входных данных)
- Swagger UI (документация API)
- JWT (аутентификация)
- bcrypt (хэширование паролей)

Frontend:

- Vue 3 + TypeScript
- Vite
- Axios

---

## Функциональность

### Backend функции

- **Пользователи**
  - Регистрация нового пользователя
  - Авторизация по email + пароль
  - Выдача JWT-токена
  - Получение текущего пользователя по токену (`/auth/me`)
  - Пароли хранятся в виде bcrypt-хэшей

- **Заметки (Note)**
  - CRUD API для сущности Note
  - Каждая заметка привязана к пользователю (по `userId`)
  - Все эндпоинты `/api/notes` доступны только при наличии валидного JWT
  - Пользователь видит и изменяет только свои заметки

- **Техническое**
  - Валидация запросов через Zod (body / params)
  - Middleware для логирования запросов
  - Глобальный обработчик ошибок
  - Документация API в Swagger UI
  - Миграции и сидинг базы данных через Prisma

### Frontend функции

- **Авторизация**
  - Форма входа/регистрации (переключатель режимов)
  - Сохранение JWT-токена в `localStorage`
  - Автоматическая подстановка `Authorization: Bearer ...` в запросы
  - Восстановление сессии при перезагрузке страницы через `/auth/me`
  - Выход из системы с очисткой токена и состояния

- **Работа с заметками**
  - Форма создания и редактирования заметки
  - Список заметок с возможностью:
    - пометить заметку выполненной
    - отредактировать
    - удалить (через кастомное модальное окно)
  - Сортировка списка:
    - по дате создания (новые сверху / старые сверху)
    - по заголовку (A–Z / Z–A)
  - Поиск по заголовку и содержанию
  - Фильтрация по статусу:
    - все
    - только активные
    - только выполненные
  - Пагинация:
    - выбор размера страницы (5 / 10 / 20)
    - переключение страниц
    - отображение диапазона записей (например, «Показаны 1–5 из 17»)

- **Интерфейс**
  - Переключение светлой/тёмной темы (с сохранением в `localStorage`)
  - Адаптивная верстка под смартфоны и различные размеры окна браузера
  - Кастомное модальное окно подтверждения удаления вместо `window.confirm`

---

## Сущности

### User

Модель пользователя в базе данных (упрощённо):

- `id: Int` — первичный ключ, автоинкремент
- `email: String` — уникальный email
- `name: String?` — имя (необязательно)
- `passwordHash: String` — хэш пароля (bcrypt)
- `createdAt: DateTime` — дата создания
- `updatedAt: DateTime` — дата обновления

### Note

Модель заметки:

- `id: Int` — первичный ключ, автоинкремент
- `title: String` — обязательное поле, максимум 255 символов
- `content: String` — текст заметки
- `isDone: Boolean` — флаг выполнения, по умолчанию `false`
- `createdAt: DateTime` — дата создания
- `updatedAt: DateTime` — дата обновления
- `userId: Int` — ссылка на пользователя
- `user: User` — связь с моделью пользователя (в Prisma)

---

## Структура проекта

```text
.
├── backend
│   ├── prisma
│   │   ├── schema.prisma
│   │   ├── seed.ts
│   │   └── migrations
│   └── src
│       ├── app.ts
│       ├── server.ts
│       ├── config
│       │   ├── env.ts
│       │   └── prisma.ts
│       ├── controllers
│       │   ├── auth.controller.ts
│       │   └── note.controller.ts
│       ├── docs
│       │   └── swagger.ts
│       ├── middlewares
│       │   ├── auth.ts
│       │   ├── errorHandler.ts
│       │   ├── logger.ts
│       │   └── validate.ts
│       ├── routes
│       │   ├── auth.routes.ts
│       │   └── note.routes.ts
│       ├── schemas
│       │   ├── auth.schema.ts
│       │   └── note.schema.ts
│       └── services
│           └── note.service.ts
└── frontend
    ├── src
    │   ├── api
    │   │   ├── client.ts
    │   │   ├── auth.ts
    │   │   └── notes.ts
    │   ├── components
    │   │   ├── AuthForm.vue
    │   │   ├── ConfirmDialog.vue
    │   │   ├── NoteForm.vue
    │   │   └── NoteList.vue
    │   ├── types
    │   │   └── note.ts
    │   ├── App.vue
    │   ├── main.ts
    │   └── style.css
    └── vite.config.ts
````

---

## Как запустить

### Требования

- Node.js 20+
- npm или pnpm
- PostgreSQL

### Настройка базы данных

Создать пользователя и базу данных, например:

- пользователь: `notefstest`
- база: `notefsdb`

Пример роли и базы (через pgAdmin или psql):

```sql
CREATE USER notefstest WITH PASSWORD 'your_password';
CREATE DATABASE notefsdb OWNER notefstest;
```

### Backend

Перейти в папку backend:

```bash
cd backend
npm install
```

Создать файл `.env`:

```env
DATABASE_URL="postgresql://notefstest:your_password@localhost:5432/notefsdb?schema=public"
PORT=3000
JWT_SECRET="super_secret_key_change_me"
```

Выполнить миграции и сид:

```bash
npx prisma migrate dev --name init_notes_and_users
npx prisma db seed   # или npm run seed, если настроен скрипт
```

> Seed создаёт тестового пользователя и несколько заметок.
> Пример пользователя:
>
> - email: `test@example.com`
> - пароль: `password123`

Запустить сервер разработки:

```bash
npm run dev
```

Сервер по умолчанию будет доступен по адресу:

- API: [http://localhost:3000](http://localhost:3000)
- Swagger UI: [http://localhost:3000/api-docs](http://localhost:3000/api-docs)

### Frontend

Перейти в папку frontend:

```bash
cd frontend
npm install
```

При необходимости задать URL API в `.env`:

```env
VITE_API_URL="http://localhost:3000/api"
```

Запустить dev сервер:

```bash
npm run dev
```

По умолчанию фронтенд будет доступен, например, по адресу:

- [http://localhost:5173](http://localhost:5173)

---

## API обзор

Базовый URL API:

- `http://localhost:3000/api`

### Auth

- `POST /auth/register`
  Регистрация нового пользователя.

  Тело запроса:

  ```json
  {
    "email": "user@example.com",
    "password": "password123",
    "name": "User Name"
  }
  ```

  Успешный ответ:

  ```json
  {
    "token": "jwt-token",
    "user": {
      "id": 1,
      "email": "user@example.com",
      "name": "User Name"
    }
  }
  ```

- `POST /auth/login`
  Авторизация.

  ```json
  {
    "email": "user@example.com",
    "password": "password123"
  }
  ```

  Ответ аналогичен `/auth/register` (токен + user).

- `GET /auth/me`
  Получить текущего пользователя.
  Требуется заголовок:

  ```http
  Authorization: Bearer <jwt-token>
  ```

### Notes

Все эндпоинты `/notes` требуют авторизации (`Authorization: Bearer ...`).

- `GET /notes`
  Получить список заметок текущего пользователя.

- `GET /notes/:id`
  Получить одну заметку по id (если она принадлежит текущему пользователю).

- `POST /notes`
  Создать заметку.

  Пример тела запроса:

  ```json
  {
    "title": "Идеи для нового проекта",
    "content": "Мини-приложение заметок, простой CRUD, Vue + Node.",
    "isDone": false
  }
  ```

- `PATCH /notes/:id`
  Частично обновить заметку.
  Можно передавать любые поля из `title`, `content`, `isDone`.

- `DELETE /notes/:id`
  Удалить заметку.

Документация в формате OpenAPI доступна по адресу:

- `GET /api-docs`

---

## Валидация и обработка ошибок

- Все входные данные валидируются через Zod.

- Для тела запросов и параметров маршрута используются отдельные схемы (`auth.schema.ts`, `note.schema.ts`).

- При ошибке валидации возвращается ответ с кодом `400` и структурой:

  ```json
  {
    "message": "Validation error",
    "details": [
      {
        "path": "title",
        "message": "title is required"
      }
    ]
  }
  ```

- При некорректном токене или его отсутствии:

  - `401 Unauthorized` с сообщением `"Unauthorized"` или `"Invalid token"`.

- При попытке зарегистрировать уже существующий email:

  - `409 Conflict` с сообщением `"User already exists"`.

- При неверном логине/пароле:

  - `401 Unauthorized` с сообщением `"Invalid email or password"`.

- Глобальный обработчик ошибок также обрабатывает ошибки Prisma и возвращает `404` при отсутствии записи.

---

## Архитектура backend

- `controllers` — HTTP-обработчики (auth и notes), не зависят от конкретной реализации хранения данных.
- `services` — инкапсулируют работу с базой через Prisma (например, `note.service.ts`).
- `schemas` — описывают форму данных через Zod (валидация body/params).
- `middlewares`:

  - `logger` — логирует запросы и время ответа.
  - `validate` — проверяет данные на основе схем Zod.
  - `auth` — проверяет JWT-токен и кладёт `user` в `req`.
  - `errorHandler` — обрабатывает все необработанные ошибки.
- `docs/swagger.ts` — описание OpenAPI для Swagger UI.

---

## Архитектура frontend

Основные части:

- `types/note.ts`
  Описывает интерфейсы `Note`, `CreateNoteDto` и `UpdateNoteDto`.

- `api/client.ts`
  Общий экземпляр Axios (`baseURL`, timeout) и функция `setAuthToken`.

- `api/auth.ts`
  Запросы аутентификации:

  - `registerUser`
  - `loginUser`
  - `getCurrentUser`

- `api/notes.ts`
  Работа с заметками:

  - `fetchNotes`
  - `fetchNote`
  - `createNote`
  - `updateNote`
  - `deleteNote`

- `components/AuthForm.vue`
  Форма входа/регистрации:

  - режимы "Вход" и "Регистрация"
  - валидация обязательных полей на клиенте
  - вывод ошибок авторизации/регистрации

- `components/NoteForm.vue`
  Форма создания и редактирования заметки:

  - заголовок, содержимое, флаг `isDone`
  - режимы "создание" и "редактирование"
  - блокировка уменьшения высоты `textarea` ниже комфортного размера

- `components/NoteList.vue`
  Список заметок:

  - чекбокс для изменения `isDone`
  - кнопки редактирования и удаления
  - отображение дат создания и обновления

- `components/ConfirmDialog.vue`
  Кастомное модальное окно:

  - подтверждение удаления заметки
  - отображение заголовка удаляемой заметки
  - закрытие по клику по фону или по кнопке "Отмена"

- `App.vue`
  Контейнер, который:

  - управляет темой (светлая/тёмная)
  - управляет авторизацией (token, currentUser)
  - загружает заметки после авторизации
  - хранит состояние списка и выбранной заметки для редактирования
  - реализует:

    - сортировку
    - поиск
    - фильтрацию по статусу
    - пагинацию
    - подтверждение удаления через `ConfirmDialog`

- `style.css`
  Общие стили, CSS-переменные для тем, базовая адаптивность.

---

## Возможные улучшения

- Пагинация и фильтрация на уровне API (сейчас реализованы на клиенте).
- Восстановление пароля / смена пароля.
- Подтверждение email.
- Деление заметок по спискам/проектам.
- Docker-compose для быстрого поднятия сервиса (PostgreSQL + backend + frontend) одной командой.
