import React from 'react';
import Head from 'next/head';
import PropTypes from 'prop-types';
import OwnershipNetwork from '../components/OwnershipNetwork';
import { getNetwork } from '../lib/api';

export default function Home({
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
        <h1 className="title">גילוי נאות</h1>

        <OwnershipNetwork
          people={people}
          companies={companies}
          companyOwnerships={companyOwnerships}
          ownerships={ownerships}
          relationships={relationships}
        />
      </main>

      <style jsx>{`
        .container {
          min-height: 100vh;
          padding: 0 0.5rem;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
        }

        main {
          padding: 5rem 0;
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
        }

        .title {
          margin: 0;
          line-height: 1.15;
          font-size: 4rem;
          text-align: center;
        }
      `}</style>

      <style jsx global>{`
        html,
        body {
          padding: 0;
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
  people: PropTypes.array,
  companies: PropTypes.array,
  companyOwnerships: PropTypes.array,
  ownerships: PropTypes.array,
  relationships: PropTypes.array,
};

export async function getStaticProps() {
  const { people, companies, companyOwnerships, ownerships, relationships } =
    (await getNetwork()) || [];

  return {
    props: { people, companies, companyOwnerships, ownerships, relationships },
  };
}
