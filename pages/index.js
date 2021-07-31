import React from 'react';
import Head from 'next/head';
import PropTypes from 'prop-types';
import Header from '../components/Header';
import OwnershipNetwork from '../components/OwnershipNetwork';
import { loginAndInitAPI, getNetwork } from '../lib/api';

export default function Home({
  user,
  people,
  companies,
  companyOwnerships,
  ownerships,
  relationships,
}) {
  if (!user) return null;

  return (
    <div className="container">
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <Header />

        <OwnershipNetwork
          user={user}
          people={people}
          companies={companies}
          companyOwnerships={companyOwnerships}
          ownerships={ownerships}
          relationships={relationships}
        />
      </main>

      <style jsx>{`
        .container {
          height: 100%;
        }
        main {
          display: flex;
          flex-flow: column;
          height: 100%;
        }
      `}</style>

      <style jsx global>{`
        html,
        body,
        #__next,
        .container {
          height: 100%;
          margin: 0;
          font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto,
            Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue,
            sans-serif;
        }

        * {
          box-sizing: border-box;
        }
      `}</style>
    </div>
  );
}

Home.propTypes = {
  user: PropTypes.shape({
    username: PropTypes.string,
    role: PropTypes.shape({
      name: PropTypes.string,
      type: PropTypes.string,
    }),
  }),
  people: PropTypes.array,
  companies: PropTypes.array,
  companyOwnerships: PropTypes.array,
  ownerships: PropTypes.array,
  relationships: PropTypes.array,
};

export async function getServerSideProps(ctx) {
  const user = await loginAndInitAPI(ctx);

  const { people, companies, companyOwnerships, ownerships, relationships } =
    (await getNetwork()) || [];

  return {
    props: {
      user,
      people,
      companies,
      companyOwnerships,
      ownerships,
      relationships,
    },
  };
}
