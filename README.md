# Notes Platform by NIMARS v 0.1.0

Простое full-stack приложение для работы с заметками (todo): создание, просмотр, редактирование, отметка выполнения и удаление.

Проект сделан как тестовое задание.

## Стек

Backend:

- Node.js, TypeScript
- Express
- Prisma + PostgreSQL
- Zod (валидация входных данных)
- Swagger UI (документация API)

Frontend:

- Vue 3 + TypeScript
- Vite
- Axios

## Функциональность

Backend:

- CRUD API для сущности Note
- Валидация запросов через Zod
- Middleware для логирования запросов
- Глобальный обработчик ошибок
- Документация API в Swagger UI
- Миграции и сидинг базы данных через Prisma

Frontend:

- Форма создания и редактирования заметки
- Список заметок с возможностью:
  - пометить заметку выполненной
  - отредактировать
  - удалить
- Сортировка списка по дате создания и по заголовку
- Поиск по заголовку и содержанию заметки
- Обработка состояний загрузки и ошибок

## Сущность Note

Модель в базе данных:

- id: Int, первичный ключ, автоинкремент
- title: String, обязательное поле, максимум 255 символов
- content: String, текст заметки
- isDone: Boolean, флаг выполнения, по умолчанию false
- createdAt: DateTime, дата создания
- updatedAt: DateTime, дата обновления

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
│       │   └── note.controller.ts
│       ├── docs
│       │   └── swagger.ts
│       ├── middlewares
│       │   ├── errorHandler.ts
│       │   ├── logger.ts
│       │   └── validate.ts
│       ├── routes
│       │   └── note.routes.ts
│       ├── schemas
│       │   └── note.schema.ts
│       └── services
│           └── note.service.ts
└── frontend
    ├── src
    │   ├── api
    │   │   └── notes.ts
    │   ├── components
    │   │   ├── NoteForm.vue
    │   │   └── NoteList.vue
    │   ├── types
    │   │   └── note.ts
    │   ├── App.vue
    │   └── main.ts
    └── vite.config.ts
````

## Как запустить

### Требования

- Node.js 20+
- npm или pnpm
- PostgreSQL

### Настройка базы данных

Создать пользователя и базу данных, например:

- пользователь: `notefstest`
- база: `notefsdb`

Пример роли и базы (можно через pgAdmin или psql):

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
```

Выполнить миграции и сид:

```bash
npx prisma migrate dev --name init_notes
npx prisma db seed   # или npm run seed, если скрипт настроен
```

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

## API обзор

Базовый URL API:

- `http://localhost:3000/api`

Основные эндпоинты:

- `GET /notes`
  Получить список заметок.

- `GET /notes/:id`
  Получить одну заметку по id.

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

## Валидация и обработка ошибок

- Все входные данные валидируются через Zod.

- Для тела запросов и параметров маршрута используются отдельные схемы.

- При ошибке валидации возвращается ответ с кодом 400 и структурой:

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

- Глобальный обработчик ошибок также обрабатывает ошибки Prisma и возвращает 404 при отсутствии записи.

## Архитектура backend

- `controllers` содержат HTTP-обработчики и не знают о деталях хранения данных.
- `services` инкапсулируют работу с базой через Prisma.
- `schemas` описывают форму данных через Zod.
- `middlewares`:

  - `logger` выводит информацию о запросах и времени ответа.
  - `validate` проверяет данные на основе схем Zod.
  - `errorHandler` обрабатывает все необработанные ошибки.
- `docs/swagger.ts` содержит описание OpenAPI.

## Архитектура frontend

Основные части:

- `types/note.ts`
  Описывает интерфейсы `Note`, `CreateNoteDto` и `UpdateNoteDto`.

- `api/notes.ts`
  Axios-клиент для работы с backend:

  - `fetchNotes`
  - `fetchNote`
  - `createNote`
  - `updateNote`
  - `deleteNote`

- `components/NoteForm.vue`
  Форма создания и редактирования заметки.
  Поддерживает:

  - создание новой заметки
  - редактирование существующей
  - переключение флага `isDone` на форме

- `components/NoteList.vue`
  Список заметок:

  - чекбокс для изменения `isDone`
  - кнопка редактирования
  - кнопка удаления
  - отображение дат создания и обновления

- `App.vue`
  Контейнер, который:

  - загружает заметки при монтировании
  - хранит состояние списка, выбранной заметки для редактирования
  - реализует сортировку и поиск
  - передает обработчики в `NoteForm` и `NoteList`
