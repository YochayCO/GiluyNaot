function parseNodes(people, companies) {
  // TODO: better positioning
  let x1 = 100;
  let x2 = 100;
  const nodeCompanies = companies
    .filter((company) => !!company.data.owners)
    .map(({ id, name }) => {
      x1 += 200;
      return {
        id,
        name,
        marker: { radius: 50, symbol: 'square' },
        plotX: x1,
        plotY: 350,
      };
    });
  const nodePeople = people.map(({ id, name }) => {
    x2 += 100;
    return {
      id,
      name,
      marker: { radius: 40 },
      plotX: x2,
      plotY: 70,
      mass: 1,
    };
  });

  return [...nodeCompanies, ...nodePeople];
}

function parseEdges(people) {
  const edges = people
    .map(({ id, data }) => {
      const { owns, relatives } = data;

      const ownEdges = owns.map((companyId) => ({
        from: id,
        to: companyId,
        custom: { label: 'owns' },
      }));
      const relationEdges = relatives.map(({ id: relativeId, relation }) => ({
        from: id,
        to: relativeId,
        custom: { label: relation },
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
  return edges;
}

export function parseNetwork(people, companies) {
  const data = parseEdges(people, companies);
  const nodes = parseNodes(people, companies);

  return { data, nodes };
}
