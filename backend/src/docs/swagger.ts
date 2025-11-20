export const swaggerSpec = {
    openapi: "3.0.0",
    info: {
      title: "notes-platform-by-nimars",
      version: "0.1.0",
      description: "Тестовое задание для Techworks [https://github.com/TechworksDev]",
    },
    servers: [
      {
        url: "http://localhost:3000",
      },
    ],
    components: {
      schemas: {
        Note: {
          type: "object",
          properties: {
            id: { type: "integer", example: 1 },
            title: { type: "string", example: "Идеи для нового проекта" },
            content: {
              type: "string",
              example: "Мини-приложение заметок, простой CRUD, Vue + Node.",
            },
            isDone: { type: "boolean", example: false },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" },
          },
          required: ["id", "title", "content", "isDone", "createdAt", "updatedAt"],
        },
        CreateNoteDto: {
          type: "object",
          properties: {
            title: { type: "string" },
            content: { type: "string" },
            isDone: { type: "boolean" },
          },
          required: ["title"],
        },
        UpdateNoteDto: {
          type: "object",
          properties: {
            title: { type: "string" },
            content: { type: "string" },
            isDone: { type: "boolean" },
          },
        },
        ErrorResponse: {
          type: "object",
          properties: {
            message: { type: "string" },
            details: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  path: { type: "string" },
                  message: { type: "string" },
                },
              },
            },
          },
        },
      },
    },
    paths: {
      "/api/notes": {
        get: {
          summary: "Get all notes",
          responses: {
            200: {
              description: "List of notes",
              content: {
                "application/json": {
                  schema: {
                    type: "array",
                    items: { $ref: "#/components/schemas/Note" },
                  },
                },
              },
            },
          },
        },
        post: {
          summary: "Create a new note",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/CreateNoteDto" },
              },
            },
          },
          responses: {
            201: {
              description: "Created note",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/Note" },
                },
              },
            },
            400: {
              description: "Validation error",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/ErrorResponse" },
                },
              },
            },
          },
        },
      },
      "/api/notes/{id}": {
        get: {
          summary: "Get note by id",
          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              schema: { type: "integer" },
            },
          ],
          responses: {
            200: {
              description: "Note",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/Note" },
                },
              },
            },
            404: { description: "Not found" },
          },
        },
        patch: {
          summary: "Update note",
          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              schema: { type: "integer" },
            },
          ],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/UpdateNoteDto" },
              },
            },
          },
          responses: {
            200: {
              description: "Updated note",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/Note" },
                },
              },
            },
            400: { description: "Validation error" },
            404: { description: "Not found" },
          },
        },
        delete: {
          summary: "Delete note",
          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              schema: { type: "integer" },
            },
          ],
          responses: {
            204: { description: "Deleted" },
            404: { description: "Not found" },
          },
        },
      },
    },
  };
  