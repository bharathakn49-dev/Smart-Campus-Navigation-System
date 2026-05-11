/**
 * Bellman-Ford Algorithm — Shortest Path with Negative Weight Support
 * Time Complexity: O(V × E)
 * 
 * Handles negative edge weights.
 * Detects negative weight cycles.
 * Returns detailed steps for frontend visualization.
 */

function bellmanFord(graph, source, destination, blockedEdges = []) {
  const startTime = performance.now();
  const steps = [];
  const visitedNodes = [];
  const dist = {};
  const prev = {};

  // Build blocked edge set
  const blockedSet = new Set(blockedEdges.map(e => `${e.source}-${e.target}`));

  // Collect all nodes and edges
  const nodes = Object.keys(graph);
  const edges = [];

  nodes.forEach(node => {
    (graph[node] || []).forEach(({ node: neighbor, weight }) => {
      edges.push({ source: node, target: neighbor, weight });
    });
  });

  // Initialize distances
  nodes.forEach(node => {
    dist[node] = Infinity;
    prev[node] = null;
  });
  dist[source] = 0;

  steps.push({
    type: 'init',
    message: `Initialize: Set distance of "${source}" to 0, all others to ∞. Total edges: ${edges.length}`,
    distances: { ...dist },
    currentNode: source
  });

  const V = nodes.length;

  // Relax edges V-1 times
  for (let i = 0; i < V - 1; i++) {
    let updated = false;

    steps.push({
      type: 'iteration',
      message: `─── Iteration ${i + 1} of ${V - 1} ───`,
      distances: { ...dist },
      iteration: i + 1
    });

    for (const { source: u, target: v, weight } of edges) {
      // Skip blocked edges
      const edgeKey1 = `${u}-${v}`;
      const edgeKey2 = `${v}-${u}`;
      if (blockedSet.has(edgeKey1) || blockedSet.has(edgeKey2)) continue;

      if (dist[u] !== Infinity && dist[u] + weight < dist[v]) {
        dist[v] = dist[u] + weight;
        prev[v] = u;
        updated = true;

        if (!visitedNodes.includes(u)) visitedNodes.push(u);
        if (!visitedNodes.includes(v)) visitedNodes.push(v);

        steps.push({
          type: 'relax',
          message: `Relax edge "${u}" → "${v}": distance updated to ${dist[v]}`,
          currentNode: u,
          edge: { source: u, target: v },
          distances: { ...dist },
          visitedNodes: [...visitedNodes]
        });
      }
    }

    // Early termination if no updates occurred
    if (!updated) {
      steps.push({
        type: 'early-stop',
        message: `No updates in iteration ${i + 1}, algorithm converged early`,
        distances: { ...dist }
      });
      break;
    }
  }

  // Check for negative weight cycles
  for (const { source: u, target: v, weight } of edges) {
    const edgeKey1 = `${u}-${v}`;
    const edgeKey2 = `${v}-${u}`;
    if (blockedSet.has(edgeKey1) || blockedSet.has(edgeKey2)) continue;

    if (dist[u] !== Infinity && dist[u] + weight < dist[v]) {
      const executionTime = performance.now() - startTime;
      steps.push({
        type: 'negative-cycle',
        message: `⚠ Negative weight cycle detected involving edge "${u}" → "${v}"`,
        edge: { source: u, target: v },
        distances: { ...dist }
      });
      return {
        path: [],
        distance: -1,
        visitedNodes,
        steps,
        executionTime: parseFloat(executionTime.toFixed(3)),
        algorithm: 'bellman-ford',
        error: 'Negative weight cycle detected'
      };
    }
  }

  // Reconstruct path
  const path = [];
  let current = destination;
  while (current !== null) {
    path.unshift(current);
    current = prev[current];
  }

  if (path[0] !== source) {
    const executionTime = performance.now() - startTime;
    steps.push({
      type: 'no-path',
      message: `No path exists from "${source}" to "${destination}"`,
      distances: { ...dist }
    });
    return {
      path: [],
      distance: -1,
      visitedNodes,
      steps,
      executionTime: parseFloat(executionTime.toFixed(3)),
      algorithm: 'bellman-ford'
    };
  }

  const executionTime = performance.now() - startTime;

  steps.push({
    type: 'complete',
    message: `Shortest path found: ${path.join(' → ')} with distance ${dist[destination]}`,
    path: [...path],
    distances: { ...dist },
    visitedNodes: [...visitedNodes]
  });

  return {
    path,
    distance: dist[destination],
    visitedNodes,
    steps,
    executionTime: parseFloat(executionTime.toFixed(3)),
    algorithm: 'bellman-ford'
  };
}

module.exports = bellmanFord;
