import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma'; // Ensure you have the Prisma client set up

// GET all cooking steps
export async function GET() {
  try {
    const steps = await prisma.cookingStep.findMany();
    return NextResponse.json(steps.map((step) => step.template));
  } catch (error) {
    return NextResponse.error();
  }
}

// POST a new cooking step
export async function POST(request: Request) {
  const { template } = await request.json();

  try {
    const newStep = await prisma.cookingStep.create({
      data: {
        template,
      },
    });
    return NextResponse.json(newStep);
  } catch (error) {
    return NextResponse.error();
  }
}
