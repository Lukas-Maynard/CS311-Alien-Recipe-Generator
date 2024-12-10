const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Seeding the PostgreSQL database...');

  // Create Tags
  const spicy = await prisma.tag.create({ data: { name: 'Spicy' } });
  const sweet = await prisma.tag.create({ data: { name: 'Sweet' } });
  const savory = await prisma.tag.create({ data: { name: 'Savory' } });

  // Create Ingredients
  const chicken = await prisma.ingredient.create({
    data: { name: 'Chicken' },
  });

  const honey = await prisma.ingredient.create({
    data: { name: 'Honey' },
  });

  // Link Tags to Ingredients
  await prisma.ingredientTags.createMany({
    data: [
      { ingredient_id: chicken.id, tag_id: savory.id },
      { ingredient_id: chicken.id, tag_id: spicy.id },
      { ingredient_id: honey.id, tag_id: sweet.id },
    ],
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
    },
  });

  // Link Tags to Recipes
  await prisma.recipeTags.createMany({
    data: [
      { recipe_id: grilledChicken.id, tag_id: savory.id },
      { recipe_id: grilledChicken.id, tag_id: sweet.id },
    ],
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
