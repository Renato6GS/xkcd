import React from 'react';
import Head from 'next/head';
import { Layout } from 'components/Layout';
import Image from 'next/image';
import Link from 'next/link';

import algoliasearch from 'algoliasearch/lite';
import { search } from 'services/search';

export default function Search({ query, results }) {
  return (
    <>
      <Head>
        <title>xkcd - Results for {query}</title>
        <meta name='description' content={`Search results for ${query}`} />
      </Head>
      {/* <Header /> */}
      <Layout>
        <h1>
          {results.length} Resultador para {query}
        </h1>
        {results.map((result, id) => {
          return (
            <Link href={`/comic/${result.id}`} key={result.id}>
              <a className='flex flex-row content-center justify-start bg-slate-300 hover:bg-slate-50'>
                <Image width='50' height='50' src={result.img} alt={result.alt} className='rounded-full' />
                <h2>{result.title}</h2>
              </a>
            </Link>
          );
        })}
      </Layout>
    </>
  );
}

export async function getServerSideProps(context) {
  const { query } = context;
  const { q = '' } = query;

  // Debemos darle a "q" un valor predefinido porque undefined no lo maneja. Puesto que esto lo serializa como JSON, y recordemos que JSON maneja pocos valores.
  // Next internamente hace: JSON.stringify(q), lo cual peta el funcionamiento

  // Esto es una mala práctica.
  // Porque esto lo que está haciendo una petición a nosotros mismos.
  // En lugar de llamar al microservicio, deberíamos extraer el microservicio a otro fichero.
  // Otro problema es que podría simplemente no funcionar, porque vercel podría desplegar un microservicio de un lado y el frontend de otro lado. Cosas del getServerSideProps y el getStaticProps
  // Estaría bien si se trata de un servicio externo y no nuestro.
  // Si lo hacemos así es como si nos estuvieramos llamando a nosotros mismos, nosotros mismo nos estamos haciendo un DDOS
  // const results = await fetch('http://localhost:3000/api/search?q=' + q).then((res) => res.json());

  // BUENA PRÁCTICA:
  // const client = algoliasearch('LKLRI4QTYT', '78e25dba645444b069b1e4fac10f0c30');
  // const index = client.initIndex('prod_comics');
  // const { hits } = await index.search(q, {
  //   attributesToRetrieve: ['id', 'title', 'img', 'alt'],
  //   hitsPerPage: 10,
  // });

  // fetch('external-host') // Bien
  // fetch('mismo-host') // Mal

  // Creo que está bien llamar a nuestros propios microservicios si es que lo estamos haciendo desde el cliente, así como lo hicimos con la barra de búsqueda

  const { results } = await search({ query: q });

  return {
    props: { query: q, results },
  };
}
