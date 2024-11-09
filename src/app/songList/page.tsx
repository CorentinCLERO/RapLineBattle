'use client';

import React, { useEffect, useState } from 'react';
import Header from '../../components/Header';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

type songList = [
  {
    artist: string,
    songs: [{
      id: string,
      song_name: string
    }]
  }
]

function Page() {
  const searchParams = useSearchParams();
  const [songsList, setSongsList] = useState<songList | null>(null)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const search = searchParams?.get('search') || ''

  useEffect(() => {
    fetch("/api/songsList")
      .then(res => res.json())
      .then(res => setSongsList(res))
      .catch(() => console.error("Echec de la requête"))
  }, []);

  return (
    <>
      <Header />
      <div className='m-5'>
        <div className='text-2xl'>Liste de musiques :</div>
        {songsList && songsList.map((songs, index) => (
          <div key={`${index}-${songs.artist}`} className='mt-5'>
            <div className='mb-2'>{songs.artist}</div>
            <div className='flex gap-4'>
              {songs.songs.map((song, index) => (
                <Link key={`${index}-${song.id}`} href={`/rapGame/${song.id}`}>
                  <div className='border border-black py-2 px-5 rounded-full'>
                    {song.song_name}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

export default Page;