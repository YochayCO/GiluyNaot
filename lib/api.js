import Axios from 'axios';
import Nookies from 'nookies';

const internals = {};

async function fetchAPI(query, { variables } = {}) {
  const authorizationHeaders = internals.jwt
    ? { Authorization: `Bearer ${internals.jwt}` }
    : {};

  const res = await fetch(`${process.env.STRAPAPOO_URL}/graphql`, {
    method: 'POST',
    headers: {
      ...authorizationHeaders,
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

export async function getUser() {
  const data = await fetchAPI(
    `#graphql
    query getUser {
      me {
        username
        role {
          name
          type
        }
      }
    }
  `,
    {
      variables: {},
    },
  );

  return data.me;
}

export async function loginAndInitAPI(ctx) {
  let { jwt } = Nookies.get(ctx);
  let user;
  if (jwt) {
    internals.jwt = jwt;
    user = await getUser();
  } else {
    const loginPayload = {
      identifier: process.env.STRAPAPOO_USER,
      password: process.env.STRAPAPOO_PASSWORD,
    };
    const { data } = await Axios.post(
      `${process.env.STRAPAPOO_URL}/auth/local`,
      loginPayload,
    );
    jwt = data.jwt;
    user = data.user;
    // Nookies works with ssr. Cookie has one month to expire (maxAge)
    Nookies.set(ctx, 'jwt', jwt, {
      maxAge: 30 * 24 * 60 * 60,
      path: '/',
    });
  }
  internals.jwt = jwt;

  return user;
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
      variables: {},
    },
  );
  return data;
}
