import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.note.createMany({
    data: [
      {
        title: "Идеи для нового проекта",
        content: "Мини-приложение заметок, простой CRUD, Vue + Node.",
      },
      {
        title: "Планы на неделю",
        content: "Закончить учебный проект, сходить в спортзал, купить книги.",
      },
      {
        title: "Список фильмов для просмотра",
        content: "Интерстеллар, Начало, Марсианин, Остров проклятых.",
      },
      {
        title: "Напоминание",
        content: "Проверить настройки сервера и обновить зависимости.",
      },
      {
        title: "Мысли",
        content: "Иногда важно просто выписать идеи, чтобы освободить голову.",
      }
    ],
  });

  console.log("Seeding completed (notes created)!");
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (err) => {
    console.error(err);
    await prisma.$disconnect();
    process.exit(1);
  });
