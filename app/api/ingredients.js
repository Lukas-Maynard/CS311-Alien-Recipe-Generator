import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const ingredients = await prisma.ingredient.findMany({
        include: {
          tags: true,
        },
      });
      res.status(200).json(
        ingredients.map((ingredient) => ({
          id: ingredient.id,
          name: ingredient.name,
          tags: ingredient.tags.map((tag) => tag.name),
        }))
      );
    } catch (error) {
      console.error('Error fetching ingredients:', error);
      res.status(500).json({ error: 'Failed to fetch ingredients' });
    }
  } else if (req.method === 'POST') {
    const { name, tagIds } = req.body;

    if (!name || !tagIds || !Array.isArray(tagIds)) {
      return res.status(400).json({ error: 'Invalid input' });
    }

    try {
      const ingredient = await prisma.ingredient.create({
        data: {
          name,
          tags: {
            connect: tagIds.map((id) => ({ id })),
          },
        },
      });

      const ingredientWithTags = await prisma.ingredient.findUnique({
        where: { id: ingredient.id },
        include: { tags: true },
      });

      res.status(201).json({
        id: ingredientWithTags.id,
        name: ingredientWithTags.name,
        tags: ingredientWithTags.tags.map((tag) => tag.name),
      });
    } catch (error) {
      console.error('Error adding ingredient:', error);
      res.status(500).json({ error: 'Failed to add ingredient' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
