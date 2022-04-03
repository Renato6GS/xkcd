import React, { useState, useRef } from 'react';
import Link from 'next/link';

export function Header() {
  const [results, setResults] = useState([]);
  const searchRef = useRef();
  const q = searchRef.current?.value;

  const handleChange = () => {
    q = searchRef.current?.value;
    fetch(`/api/search?q=${q}`)
      .then((res) => res.json())
      .then((searchResults) => {
        setResults(searchResults);
      });
  };

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
          <li>
            <Link href='/'>
              <a className='font-semibold'>Home</a>
            </Link>
          </li>

          <li>
            <input
              className='px-4 py-1 border border-gray-400 rounded-3xl text-xs'
              ref={searchRef}
              type='search'
              onChange={handleChange}
            />
            <div className='relative z-10'>
              {Boolean(results.length) && (
                <div className='absolute top-0 left-0 bg-white'>
                  <ul className='w-full border border-gray-50 rounded-lg shadow-xl z-1 overflow-hidden'>
                    <li className='m-0' key='all-results'>
                      <Link href={`search?q=${q}`}>
                        <a className='block px-2 py-1 overflow-hidden text-sm italic font-semibold text-blue-700 hover:bg-slate-200 text-ellipsis whitespace-nowrap'>
                          Ver más resultados
                        </a>
                      </Link>
                    </li>

                    {results.map((result) => {
                      return (
                        <li className='m-0' key={result.id}>
                          <Link href={`/comic/${result.id}`}>
                            <a className='block px-2 py-1 text-sm font-semibold hover:bg-slate-200 overflow-ellipsis whitespace-nowrap'>
                              {result.title}
                            </a>
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              )}
            </div>
          </li>
        </ul>
      </nav>
    </header>
  );
}

// https://www.twitch.tv/videos/1436441915?filter=archives&sort=time
