'use client';

import React, { useMemo, useState } from 'react';
import { Input } from "@/components/ui/input"
import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback } from 'react';
import debounce from 'lodash.debounce';
import Link from 'next/link';
// import logoSvg from '@/assets/logo.svg';
import Image from 'next/image';

interface HeaderProps {
  displaySearchBar?: boolean;
  song?: string;
}

function Header({ displaySearchBar = false, song }: HeaderProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [inputValue, setInputValue] = useState(searchParams?.get('search') || '');

  const debouncedUpdate = useMemo(
    () =>
      debounce((term: string, params: URLSearchParams, routerPush: (url: string, options: { scroll: boolean }) => void) => {
        if (term.trim()) {
          params.set('search', term.trim());
        } else {
          params.delete('search');
        }
        routerPush(`?${params.toString()}`, { scroll: false });
      }, 300),
    []
  );

  const updateURL = useCallback(
    (term: string) => {
      const params = new URLSearchParams(searchParams?.toString());
      debouncedUpdate(term, params, router.push);
    },
    [searchParams, router.push, debouncedUpdate]
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    updateURL(newValue);
  };

  return (
    <div className='border-b'>
      <div className='flex h-20 ms-5 me-10 justify-between'>
          <Link href="/" className='flex'>
            <Image
              src="/logo.svg"
              alt="Logo"
              width={40}
              height={40}
              className='content-center'
            />          
            <div className='content-center ms-5 text-3xl'>Rhymes</div>
          </Link>
        {displaySearchBar && <div className='content-center rounded-lg text-black'>
          <Input type="text" placeholder="Rechercher..." onChange={handleInputChange} value={inputValue} />
        </div>}
        {song && <div className='content-center text-xl'>{song}</div>}
      </div>
    </div>
  );
}

export default Header;