import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  const { name, tag } = req.query;

  try {
    const recipes = await prisma.recipe.findMany({
      where: {
        AND: [
          name
            ? { name: { contains: name, mode: 'insensitive' } }
            : undefined,
          tag
            ? {
                tags: {
                  some: { name: { contains: tag, mode: 'insensitive' } },
                },
              }
            : undefined,
        ],
      },
      include: {
        tags: true, // Include tags to display
      },
    });

    res.status(200).json(
      recipes.map((recipe) => ({
        id: recipe.id,
        name: recipe.name,
        image: recipe.image,
        steps: recipe.steps,
        likes: recipe.likes,
        tags: recipe.tags.map((tag) => tag.name),
      }))
    );
  } catch (error) {
    console.error('Error fetching recipes:', error);
    res.status(500).json({ error: 'Error fetching recipes' });
  }
}
