import { DataSet } from 'vis';

function parseNodes(people, companies) {
  const bigCompanies = companies.filter(company => !!company.data.owners);
  const nodeCompanies = bigCompanies.map(({ id, label, childCompanies }) => ({
    id,
    label,
    childCompanies,
  }));

  const nodePeople = people.map(({ id, label }) => ({ id, label }));

  return new DataSet([...nodeCompanies, ...nodePeople]);
}

function parseEdges(people) {
  const edges = people
    .map(({ id, data }) => {
      const { owns, relatives } = data;

      const ownEdges = owns.map(companyId => ({
        from: id,
        to: companyId,
        stam: 'bla',
      }));
      const relationEdges = relatives.map(({ id: relativeId }) => ({
        from: id,
        to: relativeId,
      }));

      return [...ownEdges, ...relationEdges];
    })
    .flat()
    .reduce((uniqueEdges, currEdge) => {
      if (
        uniqueEdges.some(
          ({ to, from }) => to === currEdge.from && from === currEdge.to,
        )
      ) {
        return uniqueEdges;
      }
      return uniqueEdges.concat(currEdge);
    }, []);
  return new DataSet(edges);
}

export function parseNetwork(people, companies) {
  const nodes = parseNodes(people, companies);
  const edges = parseEdges(people, companies);

  return { nodes, edges };
}
