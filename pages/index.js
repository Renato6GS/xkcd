import Head from 'next/head';
import Link from 'next/link';
import fs from 'fs/promises';
import Image from 'next/image';

import { Header } from 'components/Header';
import Footer from 'components/Footer';

export default function Home({ latestComics }) {
  return (
    <div>
      <Head>
        <title>xkcd - Comics for developers</title>
        <meta name='description' content='Comics for Developers' />
        <link rel='icon' href='/favicon.ico' />
      </Head>

      <Header />

      <main>
        <h2 className='text-3xl font-bold text-center mb-10'>Latest Comics</h2>
        <section className='grid grid-cols-1 gap-4 max-w-md m-auto sm:grid-cols-2 md:grid-cols-3'>
          {latestComics.map((comic) => {
            return (
              <Link key={comic.id} href={`/comic/${comic.id}`}>
                <a className='mb-4 pb-4 m-auto'>
                  <h3 className='font-bold text-sm text-center'>{comic.title}</h3>
                  <Image
                    width='300'
                    height='300'
                    layout='intrinsic'
                    objectFit='contain'
                    src={comic.img}
                    alt={comic.alt}
                  />
                </a>
              </Link>
            );
          })}
        </section>
      </main>
      <Footer />
    </div>
  );
}

export async function getStaticProps(context) {
  const files = await fs.readdir('./comics');
  const latestComicsFiles = files.slice(-8, files.length);

  const promisesReadFiles = latestComicsFiles.map(async (file) => {
    const content = await fs.readFile(`./comics/${file}`, 'utf8');
    return JSON.parse(content);
  });

  // Cuidado con el Promise.all porque si uno falla, se rechazará todo
  const latestComics = await Promise.all(promisesReadFiles);

  return {
    props: {
      latestComics,
    },
  };
}
