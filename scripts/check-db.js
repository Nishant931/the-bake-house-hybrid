const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const images = await prisma.image.findMany({ take: 5 });
  console.log('Images in DB:', JSON.stringify(images, null, 2));
  const products = await prisma.product.findMany({ take: 5, include: { images: true } });
  console.log('Products in DB:', JSON.stringify(products, null, 2));
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect());
