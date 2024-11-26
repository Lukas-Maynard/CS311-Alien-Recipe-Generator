import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding the database...');

  // Create Tags
  const spicy = await prisma.tag.create({ data: { name: 'Spicy' } });
  const sweet = await prisma.tag.create({ data: { name: 'Sweet' } });
  const savory = await prisma.tag.create({ data: { name: 'Savory' } });

  // Create Ingredients
  const chicken = await prisma.ingredient.create({
    data: { 
      name: 'Chicken', 
      tags: { connect: [{ id: savory.id }, { id: spicy.id }] } 
    },
  });

  const honey = await prisma.ingredient.create({
    data: { 
      name: 'Honey', 
      tags: { connect: [{ id: sweet.id }] } 
    },
  });

  // Create Cooking Methods
  await prisma.cookingMethod.createMany({
    data: [
      { name: 'Grilling' },
      { name: 'Baking' },
      { name: 'Frying' },
    ],
  });

  // Create Cooking Steps
  await prisma.cookingStep.createMany({
    data: [
      { template: 'Heat [ingredient] in a pan until golden brown.' },
      { template: 'Mix [ingredient] with a pinch of salt and cook for 10 minutes.' },
    ],
  });

  // Create Recipes
  const grilledChicken = await prisma.recipe.create({
    data: {
      name: 'Grilled Chicken with Honey Glaze',
      steps: 'Heat Chicken on grill. Brush with Honey while cooking.',
      likes: 10,
      tags: { connect: [{ id: savory.id }, { id: sweet.id }] },
    },
  });

  console.log('Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
