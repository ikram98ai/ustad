const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  await prisma.profession.createMany({
    data: [
      { title: "Plumber" },
      { title: "Electrician" },
      { title: "Mechanic" },
      { title: "Teacher" },
      { title: "Doctor" },
      { title: "Chef" },    ],
  });

  console.log("Data inserted successfully");
}

main()
  .catch((e) => {
    throw e;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
