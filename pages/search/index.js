import React from 'react';

export default function Search() {
  return <div>Search</div>;
}

export async function getServerSideProps(context) {
  const { query } = context;
  const { search } = query;

  // LLamar a la api de Algolia para buscar los resultados

  return {
    props: {},
  };
}
