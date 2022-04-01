import React from 'react';
import Link from 'next/link';

export function Header() {
  return (
    <header className='flex justify-between items-center p-4 max-w-xl m-auto'>
      <h1 className='font-bold'>
        <Link href='/'>
          <a className='transition hover:opacity-80'>
            next<span className='font-light'>xkcd</span>
          </a>
        </Link>
      </h1>
      <nav>
        <ul className='flex flex-row gap-2'>
          <li className='text-sm'>
            <Link href='/'>
              <a className='font-semibold'>Home</a>
            </Link>
          </li>
          <li className='text-sm'>
            <Link href='/about'>
              <a className='font-semibold'>About</a>
            </Link>
          </li>
          <li className='text-sm'>
            <Link href='/search'>
              <a className='font-semibold'>Search</a>
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}
