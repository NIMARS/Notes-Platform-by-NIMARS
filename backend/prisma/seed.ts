import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash("password123", 10);

  const user = await prisma.user.upsert({
    where: { email: "test@example.com" },
    update: {},
    create: {
      email: "test@example.com",
      name: "Test User",
      passwordHash,
    },
  });

  // await prisma.note.deleteMany();

  await prisma.note.createMany({
    data: [
      {
        title: "Идеи для нового проекта",
        content: "Мини-приложение заметок, простой CRUD, Vue + Node.",
        userId: user.id,
      },
      {
        title: "Список покупок",
        content: "Молоко, хлеб, кофе",
        userId: user.id,
      },
    ],
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
