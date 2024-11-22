'use client';

import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

export default function Home() {
  const [isLoading, setIsLoading] = useState(false)
  return (
    <div className="grid gap-40 justify-center content-center h-dvh">
<div className='relative flex items-center justify-center h-[200px] group'>
  <h1 className="text-8xl font-bold z-10 transition-all duration-300 group-hover:tracking-wider text-stone-500">
    Rhymes
  </h1>
  <Image
    src="/logo.svg"
    alt="Logo"
    width={200}
    height={200}
    className='absolute transition-transform duration-300 group-hover:scale-110 colo'
  /> 
</div>
      <div className='grid justify-center'>
        <Button onClick={() => setIsLoading(true)} disabled={isLoading}>
          {isLoading ? 
            <div className='flex gap-5'>
            <Loader2 className="animate-spin" />
            Chargement...
            </div> :
            <Link href="/songList">Choisir une musique</Link>
          }
        </Button>
      </div>
    </div>
  );
}
