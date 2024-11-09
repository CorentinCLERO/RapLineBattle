// src/pages/api/songs.ts
import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../prismaClient';

export default async function POST(req: NextApiRequest, res: NextApiResponse) {
    const { artist, song_name, lyrics } = req.body;

    try {
      const newSong = await prisma.song.create({
        data: {
          artist,
          song_name,
          lyrics,
        },
      });
      res.status(201).json(newSong);
    } catch (error) {
      console.error('=>>>> Error creating song:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      res.status(500).json({ error: 'Erreur lors de la création de la chanson', details: errorMessage });
    }
}