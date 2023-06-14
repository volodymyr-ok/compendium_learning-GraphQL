const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  //   const newLink = await prisma.link.create({
  //     data: {
  //       description: 'Fullstack tutorial for GraphQL',
  //       url: 'www.howtographql.com',
  //     },
  //   });
  //   const delLink = await prisma.link.delete({
  //     where: {
  //       id: 2,
  //     },
  //   });

  const allLinks = await prisma.link.findMany();
  console.log(allLinks);
}

main()
  .catch(e => {
    throw e;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
