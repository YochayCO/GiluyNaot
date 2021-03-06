async function fetchAPI(query, { variables } = {}) {
  const res = await fetch(`${process.env.STRAPAPOO_URL}/graphql`, {
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
    console.error('Failed to fetch API');
    return [];
  }

  return json.data;
}

export async function getNetwork() {
  const data = await fetchAPI(
    `#graphql
    query Network {
      people {
        id
        name
        picture {
          url
        }
      }
      companies {
        id
        name
        is_comm
        picture {
          url
        }
        parent_relation {
          id
        }
      }
      companyOwnerships {
        id
        level
        parent {
          id
          name
        }
        subsidiary {
          id
          name
        }
      }
      ownerships {
        id
        level
        owner {
          id
          name
        }
        company {
          id
          name
        }
      }
      relationships {
        id
        relationType
        relative_1 {
          id
          name
        }
        relative_2 {
          id
          name
        }
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
  return data;
}
