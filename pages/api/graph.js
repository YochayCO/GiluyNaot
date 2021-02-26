const gremlin = require('gremlin');
const { traversal } = gremlin.process.AnonymousTraversalSource;
const { DriverRemoteConnection } = gremlin.driver;

const g = traversal().withRemote(
  new DriverRemoteConnection('ws://localhost:8182/gremlin'),
);

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const honGraph = await getGraph();
    console.log(honGraph);
    return res.status(200).json({ graph: honGraph });
  }

  return res.status(404).end();
}

export async function getGraph() {
  return g.V().toList();
}