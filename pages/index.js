import React from 'react';
import Head from 'next/head';
import PropTypes from 'prop-types';
import Header from '../components/Header';
import OwnershipNetwork from '../components/OwnershipNetwork';
import { getNetwork } from '../lib/api';

export default function Home({
  deployMode,
  people,
  companies,
  companyOwnerships,
  ownerships,
  relationships,
}) {
  return (
    <div className="container">
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <Header />

        <OwnershipNetwork
          deployMode={deployMode}
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
  deployMode: PropTypes.string,
  people: PropTypes.array,
  companies: PropTypes.array,
  companyOwnerships: PropTypes.array,
  ownerships: PropTypes.array,
  relationships: PropTypes.array,
};

export async function getServerSideProps() {
  const deployMode = process.env.DEPLOY_MODE || 'development';
  const { people, companies, companyOwnerships, ownerships, relationships } =
    (await getNetwork()) || [];

  return {
    props: {
      deployMode,
      people,
      companies,
      companyOwnerships,
      ownerships,
      relationships,
    },
  };
}
