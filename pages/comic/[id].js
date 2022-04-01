import React from 'react';
import Head from 'next/head';
import Image from 'next/image';
import { Header } from 'components/Header.js';
import { readFile, stat, readdir } from 'fs/promises';
import Link from 'next/link';
import { basename } from 'path';

export default function Comic({ img, alt, title, width, height, nextId, prevId, hasNext, hasPrevious }) {
  return (
    <>
      <Head>
        <title>xkcd - Comics for developers</title>
        <meta name='description' content='Comics for Developers' />
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <Header />

      <main className='p-4'>
        <section className='max-w-lg m-auto'>
          <h1 className='font-bold text-xl text-center'>{title}</h1>
          <div className='max-w-xs m-auto mb-4'>
            <Image layout='responsive' width={width} height={height} src={img} alt={alt} />
          </div>
          <p>{alt}</p>

          <div className={`flex mt-4 font-bold ${hasPrevious ? 'justify-between' : 'justify-end'}`}>
            {hasPrevious && (
              <Link href={`/comic/${prevId}`}>
                <a className='text-gray-600'>Previous</a>
              </Link>
            )}
            {hasNext && (
              <Link href={`/comic/${nextId}`}>
                <a className='text-gray-600'>Next</a>
              </Link>
            )}
          </div>
        </section>
      </main>
    </>
  );
}

export async function getStaticPaths() {
  // Si tenemos un millón de IPs no vale la pena esto, porque se generaría un millón de páginas estáticas
  const files = await readdir('./comics');

  const paths = files.map((file) => {
    const id = basename(file, '.json');
    return { params: { id } };
  });

  return {
    paths,
    fallback: false,
  };
}

// ESTA ES LA FORMA EN LA QUE SI TE PASAN EL LINK DIRECTO, QUE OBTENGA LOS PROPS DESDE EL LINK
// Aquí podríamos haber hecho las peticiones a la api externa como lo hicimos en Node
// PERO, como estamos usando getStaticPrios, llamará a la API las 2000 veces en cada NPM build, cosa que no es bueno
// Otra cosa, al depender de una API de terceros, es eso, estamos dependiendo de otro, por eso fue bueno el scraper.
export async function getStaticProps({ params }) {
  const { id } = params;
  const content = await readFile(`./comics/${id}.json`, 'utf8');
  const comic = JSON.parse(content);

  // La paginación la podemos hacer (esta vez) porque sabemos los archivos
  const idNumber = +id;
  const prevId = idNumber - 1;
  const nextId = idNumber + 1;

  // Aquí está claro el ejemplo de Promise.allSettled, porque si uno falla, y el otro no, igual se aceptará.
  // Mientras que si fuera un Promise.all, si uno falla, ya se peta todos los demás.
  const [prevResult, nextResult] = await Promise.allSettled([
    stat(`./comics/${prevId}.json`),
    stat(`./comics/${nextId}.json`),
  ]);

  const hasPrevious = prevResult.status === 'fulfilled';
  const hasNext = nextResult.status === 'fulfilled';

  return {
    props: { hasNext, hasPrevious, nextId, prevId, ...comic },
  };
}
