import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../prismaClient';

export default async function GET(req: NextApiRequest, res: NextApiResponse) {

    try {
      const artists = await prisma.song.groupBy({
        by: ['artist'],
        orderBy: {
          artist: 'asc'
        }
      });

      const artistsWithSongs = await Promise.all(
        artists.map(async ({ artist }) => {
          const songs = await prisma.song.findMany({
            where: { artist },
            select: {
              id: true,
              song_name: true
            },
            orderBy: {
              song_name: 'asc'
            }
          });

          return {
            artist,
            songs: songs.map(song => ({
              id: song.id,
              song_name: song.song_name,
            }))
          };
        })
      );

      res.status(200).json(artistsWithSongs);
    } catch (error) {
      console.error('=>>>> Error get song list:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      res.status(500).json({ error: 'Erreur lors de la récupération des songs', details: errorMessage });
    }
}