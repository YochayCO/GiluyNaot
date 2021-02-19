async function fetchAPI(query, { variables } = {}) {
  console.log(JSON.stringify({ query, variables }));
  const res = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_API_URL}/graphql`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query,
      variables,
    }),
  });

  const json = await res.json();
  if (json.errors) {
    console.error(json.errors);
    throw new Error('Failed to fetch API');
  }

  return json.data;
}

export async function getAllPeople() {
  const data = await fetchAPI(
    `#graphql
    query People($where: JSON){
      people(sort: "name", limit: 10, where: $where) {
        id
        name
      }
    }
  `,
    {
      variables: {
        where: {
          ...{},
        },
      },
    },
  );
  return data?.people;
}
