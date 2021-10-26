import Axios from 'axios';
import Nookies from 'nookies';
import camelCase from 'lodash/camelCase';

const internals = {};

async function fetchAPI(query, { variables } = {}) {
  const cookies = Nookies.get();
  // cookies if client, internals if server. Could be written better? maybe
  const jwt = cookies.jwt || internals.jwt;
  const authorizationHeaders = jwt ? { Authorization: `Bearer ${jwt}` } : {};

  const options = {
    method: 'POST',
    headers: {
      ...authorizationHeaders,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query,
      variables,
    }),
  };

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_STRAPAPOO_URL}/graphql`,
    options,
  );

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
      `${process.env.NEXT_PUBLIC_STRAPAPOO_URL}/auth/local`,
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
        xPosition
        yPosition
        network_section_id
        picture {
          url
        }
      }
      companies {
        id
        name
        is_comm
        xPosition
        yPosition
        network_section_id
        picture {
          url
        }
        parent_relation {
          id
        }
        group_company {
          id
        }
      }
      companyOwnerships {
        id
        level
        parent {
          id
          name
          group_company {
            id
          }
        }
        subsidiary {
          id
          name
          group_company {
            id
          }
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
          group_company {
            id
          }
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

export async function changeNodePosition(nodeId, xPosition, yPosition) {
  const [entityName, id] = nodeId.split('_');
  if (entityName === 'groupCompany') return;

  const updateEntityMethodName = camelCase(`update ${entityName}`);
  const inputTypeName = camelCase(`update ${entityName} input`);

  const result = await fetchAPI(
    `#graphql
    mutation ${updateEntityMethodName} ($input: ${inputTypeName}) {
      ${updateEntityMethodName}(input: $input) {
        ${entityName} {
          id
          name
          xPosition
          yPosition
        }
      }
    }
  `,
    {
      variables: {
        input: {
          where: {
            id,
          },
          data: {
            xPosition,
            yPosition,
          },
        },
      },
    },
  );
  console.info('Updated node position: ', result);
}
