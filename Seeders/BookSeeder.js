import { PrismaClient } from "@prisma/client";
import { faker } from "@faker-js/faker";

const prisma = new PrismaClient();

async function main() {
  const books = [];
  const isbnSet = new Set();

  while (books.length < 100) {
    const isbn = faker.string.numeric(13);

    if (!isbnSet.has(isbn)) {
      isbnSet.add(isbn);

      books.push({
        title: faker.lorem.words(3),
        author: faker.person.fullName(),
        isbn: isbn,
        available_quantity: faker.number.int({ min: 0, max: 20 }),
        shelf_location: `Shelf ${faker.number.int({ min: 1, max: 10 })}-${faker.number.int({ min: 1, max: 50 })}`,
      });
    }
  }

  await prisma.book.createMany({
    data: books,
  });

  console.log("✅ 100 books seeded with unique ISBNs");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
