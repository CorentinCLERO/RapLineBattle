import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../prismaClient';

export default async function POST(req: NextApiRequest, res: NextApiResponse) {
  const { name, email, password } = req.body;
  // Ensure email and name are unique
  const existingUser = await prisma.user.findFirst({
    where: {
      OR: [
        { email },
        { name },
      ],
    },
  });
  
  if (existingUser) {
    return res.status(400).json({ error: 'Email ou nom déjà utilisé' });
  }

  try {
    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password,
      },
    });
    res.status(201).json(newUser);
  } catch (error) {
    console.error('=>>>> Error creating user:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    res.status(500).json({ error: 'Erreur lors de la création de l\'utilisateur', details: errorMessage });
  }
}