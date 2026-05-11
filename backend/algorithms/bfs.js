/**
 * BFS — Breadth-First Search for Unweighted Shortest Path
 * Time Complexity: O(V + E)
 * 
 * Treats all edges as having weight 1.
 * Returns detailed steps for frontend visualization.
 */

function bfs(graph, source, destination, blockedEdges = []) {
  const startTime = performance.now();
  const steps = [];
  const visitedNodes = [];
  const visited = new Set();
  const prev = {};
  const dist = {};

  // Build blocked edge set
  const blockedSet = new Set(blockedEdges.map(e => `${e.source}-${e.target}`));

  // Initialize
  const nodes = Object.keys(graph);
  nodes.forEach(node => {
    dist[node] = Infinity;
    prev[node] = null;
  });

  dist[source] = 0;
  visited.add(source);
  const queue = [source];

  steps.push({
    type: 'init',
    message: `Initialize: Start BFS from "${source}"`,
    distances: { ...dist },
    currentNode: source
  });

  while (queue.length > 0) {
    const current = queue.shift();
    visitedNodes.push(current);

    steps.push({
      type: 'visit',
      message: `Visit node "${current}" at distance ${dist[current]}`,
      currentNode: current,
      distances: { ...dist },
      visitedNodes: [...visitedNodes]
    });

    // Early termination
    if (current === destination) break;

    const neighbors = graph[current] || [];
    for (const { node: neighbor } of neighbors) {
      // Skip blocked edges
      const edgeKey1 = `${current}-${neighbor}`;
      const edgeKey2 = `${neighbor}-${current}`;
      if (blockedSet.has(edgeKey1) || blockedSet.has(edgeKey2)) {
        steps.push({
          type: 'blocked',
          message: `Edge "${current}" → "${neighbor}" is blocked, skipping`,
          currentNode: current,
          edge: { source: current, target: neighbor },
          distances: { ...dist }
        });
        continue;
      }

      if (!visited.has(neighbor)) {
        visited.add(neighbor);
        dist[neighbor] = dist[current] + 1;
        prev[neighbor] = current;
        queue.push(neighbor);

        steps.push({
          type: 'relax',
          message: `Discover "${neighbor}" via "${current}", distance = ${dist[neighbor]}`,
          currentNode: current,
          edge: { source: current, target: neighbor },
          distances: { ...dist },
          visitedNodes: [...visitedNodes]
        });
      }
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
      algorithm: 'bfs'
    };
  }

  const executionTime = performance.now() - startTime;

  steps.push({
    type: 'complete',
    message: `Shortest path found: ${path.join(' → ')} with distance ${dist[destination]} edges`,
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
    algorithm: 'bfs'
  };
}

module.exports = bfs;
