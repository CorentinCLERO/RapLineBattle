'use client';

import { Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

export default function Home() {
  const [isLoading, setIsLoading] = useState(false)
  return (
    <div className="grid gap-40 justify-center content-center h-dvh">
      <h1 className="text-8xl">Rhymes</h1>
      <div className='grid justify-center'>
        <button className='border-none border-2 rounded-full px-5 py-2 text-xl bg-stone-500 hover:bg-stone-700 text-white disabled:bg-slate-300' onClick={() => setIsLoading(true)} disabled={isLoading}>
          {isLoading ? 
            <div className='flex gap-5'>
            <Loader2 className="animate-spin" />
            Chargement...
            </div> :
            <Link href="/songList">Choisir une musique</Link>
          }
        </button>
      </div>
    </div>
  );
}
