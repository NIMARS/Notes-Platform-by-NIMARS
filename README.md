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
