import { PrismaClient } from "@prisma/client";
import { faker } from "@faker-js/faker";

const prisma = new PrismaClient();

async function main() {
  const tasks = [];

  for (let i = 0; i < 200; i++) {
    tasks.push({
      id: faker.string.uuid(), // Sinh mã UUID giả
      title: faker.lorem.sentence(), // Sinh tiêu đề giả
      description: faker.lorem.paragraph(), // Sinh mô tả giả
      date: faker.date.soon().toISOString(), // Sinh ngày giả trong tương lai gần
      isCompleted: faker.datatype.boolean(), // Ngẫu nhiên true/false
      isImportant: faker.datatype.boolean(), // Ngẫu nhiên true/false
      createdAt: faker.date.past().toISOString(), // Ngày tạo giả
      updatedAt: faker.date.recent().toISOString(), // Ngày cập nhật giả
      userId: "user_2p4IT2TEKIdmkgTB7kb6oJNvYls", // Sinh userId giả
    });
  }

  console.log("Inserting 1000 fake tasks...");

  // Sử dụng `createMany` để tạo nhiều task cùng lúc
  await prisma.task.createMany({
    data: tasks,
   //  skipDuplicates: true, // Bỏ qua dữ liệu trùng lặp
  });

  console.log("Fake tasks inserted successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
