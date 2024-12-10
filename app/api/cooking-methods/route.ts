import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma'; // Ensure you have the Prisma client set up

// GET all cooking methods
export async function GET() {
  try {
    const methods = await prisma.cookingMethod.findMany();
    return NextResponse.json(methods.map((method) => method.name));
  } catch (error) {
    return NextResponse.error();
  }
}

// POST a new cooking method
export async function POST(request: Request) {
  const { name } = await request.json();

  try {
    const newMethod = await prisma.cookingMethod.create({
      data: {
        name,
      },
    });
    return NextResponse.json(newMethod);
  } catch (error) {
    return NextResponse.error();
  }
}
