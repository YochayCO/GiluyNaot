async function fetchAPI(query, { variables } = {}) {
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
    console.error('Failed to fetch API');
    return [];
  }

  return json.data;
}

export async function getNetwork() {
  const data = await fetchAPI(
    `#graphql
    query Network($where: JSON){
      people {
        id
        name
      }
      companies(limit: 10, where: $where) {
        id
        name
        is_comm
        parent_relation {
          id
        }
      }
      companyOwnerships {
        id
        percentage
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
        percentage
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
