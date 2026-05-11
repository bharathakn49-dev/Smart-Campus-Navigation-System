/**
 * Graph Routes — REST API endpoints for graph operations
 * 
 * POST /api/graph/path    — Compute shortest path
 * POST /api/graph/compare — Compare all algorithms
 * GET  /api/graph/sample  — Get sample campus graph
 */

const express = require('express');
const router = express.Router();

const dijkstra = require('../algorithms/dijkstra');
const bfs = require('../algorithms/bfs');
const bellmanFord = require('../algorithms/bellmanFord');
const sampleGraph = require('../data/sampleGraph.json');

/**
 * Convert edge list to adjacency list for algorithm processing
 */
function buildAdjacencyList(nodes, edges) {
  const graph = {};
  nodes.forEach(n => {
    graph[n.id] = [];
  });
  edges.forEach(e => {
    // Undirected graph — add both directions
    graph[e.source].push({ node: e.target, weight: e.weight });
    graph[e.target].push({ node: e.source, weight: e.weight });
  });
  return graph;
}

// ─── POST /api/graph/path ─────────────────────────────────────────────────────
router.post('/path', (req, res) => {
  try {
    const { nodes, edges, source, destination, algorithm, blockedEdges = [] } = req.body;

    if (!nodes || !edges || !source || !destination || !algorithm) {
      return res.status(400).json({
        error: 'Missing required fields: nodes, edges, source, destination, algorithm'
      });
    }

    const adjacencyList = buildAdjacencyList(nodes, edges);

    let result;
    switch (algorithm) {
      case 'dijkstra':
        result = dijkstra(adjacencyList, source, destination, blockedEdges);
        break;
      case 'bfs':
        result = bfs(adjacencyList, source, destination, blockedEdges);
        break;
      case 'bellman-ford':
        result = bellmanFord(adjacencyList, source, destination, blockedEdges);
        break;
      default:
        return res.status(400).json({ error: `Unknown algorithm: ${algorithm}` });
    }

    res.json(result);
  } catch (error) {
    console.error('Error computing path:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ─── POST /api/graph/compare ─────────────────────────────────────────────────
router.post('/compare', (req, res) => {
  try {
    const { nodes, edges, source, destination, blockedEdges = [] } = req.body;

    if (!nodes || !edges || !source || !destination) {
      return res.status(400).json({
        error: 'Missing required fields: nodes, edges, source, destination'
      });
    }

    const adjacencyList = buildAdjacencyList(nodes, edges);

    const results = {
      dijkstra: dijkstra(adjacencyList, source, destination, blockedEdges),
      bfs: bfs(adjacencyList, source, destination, blockedEdges),
      'bellman-ford': bellmanFord(adjacencyList, source, destination, blockedEdges)
    };

    res.json(results);
  } catch (error) {
    console.error('Error comparing algorithms:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ─── GET /api/graph/sample ───────────────────────────────────────────────────
router.get('/sample', (req, res) => {
  res.json(sampleGraph);
});

module.exports = router;
