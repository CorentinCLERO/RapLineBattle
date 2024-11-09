import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../prismaClient';

export default async function GET(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

    try {
      const song = await prisma.song.findUnique({
        where: {
          id: id?.toString()
        }
      });

      res.status(200).json(song);
    } catch (error) {
      console.error('=>>>> Error get song:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      res.status(500).json({ error: 'Erreur lors de la récupération du song', details: errorMessage });
    }
}