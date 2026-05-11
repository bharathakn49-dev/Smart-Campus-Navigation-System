/**
 * Dijkstra's Algorithm — Shortest Path with Priority Queue (Min-Heap)
 * Time Complexity: O((V + E) log V)
 * 
 * Uses a binary min-heap for efficient extraction of the minimum distance node.
 * Returns detailed steps for frontend visualization.
 */

// ─── Min-Heap Priority Queue ──────────────────────────────────────────────────
class MinHeap {
  constructor() {
    this.heap = [];
  }

  push(node, priority) {
    this.heap.push({ node, priority });
    this._bubbleUp(this.heap.length - 1);
  }

  pop() {
    if (this.heap.length === 0) return null;
    const min = this.heap[0];
    const last = this.heap.pop();
    if (this.heap.length > 0) {
      this.heap[0] = last;
      this._sinkDown(0);
    }
    return min;
  }

  isEmpty() {
    return this.heap.length === 0;
  }

  _bubbleUp(idx) {
    while (idx > 0) {
      const parent = Math.floor((idx - 1) / 2);
      if (this.heap[parent].priority <= this.heap[idx].priority) break;
      [this.heap[parent], this.heap[idx]] = [this.heap[idx], this.heap[parent]];
      idx = parent;
    }
  }

  _sinkDown(idx) {
    const length = this.heap.length;
    while (true) {
      let smallest = idx;
      const left = 2 * idx + 1;
      const right = 2 * idx + 2;
      if (left < length && this.heap[left].priority < this.heap[smallest].priority) {
        smallest = left;
      }
      if (right < length && this.heap[right].priority < this.heap[smallest].priority) {
        smallest = right;
      }
      if (smallest === idx) break;
      [this.heap[smallest], this.heap[idx]] = [this.heap[idx], this.heap[smallest]];
      idx = smallest;
    }
  }
}

// ─── Dijkstra's Algorithm ─────────────────────────────────────────────────────
function dijkstra(graph, source, destination, blockedEdges = []) {
  const startTime = performance.now();
  const steps = [];
  const visitedNodes = [];
  const dist = {};
  const prev = {};
  const visited = new Set();

  // Build a set of blocked edges for O(1) lookup
  const blockedSet = new Set(blockedEdges.map(e => `${e.source}-${e.target}`));

  // Initialize distances to Infinity
  const nodes = Object.keys(graph);
  nodes.forEach(node => {
    dist[node] = Infinity;
    prev[node] = null;
  });
  dist[source] = 0;

  const pq = new MinHeap();
  pq.push(source, 0);

  steps.push({
    type: 'init',
    message: `Initialize: Set distance of ${source} to 0, all others to ∞`,
    distances: { ...dist },
    currentNode: source
  });

  while (!pq.isEmpty()) {
    const { node: current, priority: currentDist } = pq.pop();

    // Skip if already visited with a shorter distance
    if (visited.has(current)) continue;
    visited.add(current);
    visitedNodes.push(current);

    steps.push({
      type: 'visit',
      message: `Visit node "${current}" with distance ${currentDist}`,
      currentNode: current,
      distances: { ...dist },
      visitedNodes: [...visitedNodes]
    });

    // Early termination if we reached the destination
    if (current === destination) break;

    // Relax neighbors
    const neighbors = graph[current] || [];
    for (const { node: neighbor, weight } of neighbors) {
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

      if (visited.has(neighbor)) continue;

      const newDist = dist[current] + weight;
      if (newDist < dist[neighbor]) {
        dist[neighbor] = newDist;
        prev[neighbor] = current;
        pq.push(neighbor, newDist);

        steps.push({
          type: 'relax',
          message: `Relax edge "${current}" → "${neighbor}": distance updated to ${newDist}`,
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

  // If path doesn't start with source, no path exists
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
      algorithm: 'dijkstra'
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
    algorithm: 'dijkstra'
  };
}

module.exports = dijkstra;
