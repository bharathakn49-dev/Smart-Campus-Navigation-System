/**
 * API helper — communicates with the backend REST API
 */

const API_BASE = import.meta.env.VITE_API_BASE_URL || '/api';

/**
 * Find shortest path using a specific algorithm
 */
export async function findShortestPath({ nodes, edges, source, destination, algorithm, blockedEdges = [] }) {
  const response = await fetch(`${API_BASE}/graph/path`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ nodes, edges, source, destination, algorithm, blockedEdges })
  });
  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.error || 'API request failed');
  }
  return response.json();
}

/**
 * Compare all algorithms
 */
export async function compareAlgorithms({ nodes, edges, source, destination, blockedEdges = [] }) {
  const response = await fetch(`${API_BASE}/graph/compare`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ nodes, edges, source, destination, blockedEdges })
  });
  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.error || 'API request failed');
  }
  return response.json();
}

/**
 * Fetch sample campus graph
 */
export async function fetchSampleGraph() {
  const response = await fetch(`${API_BASE}/graph/sample`);
  if (!response.ok) throw new Error('Failed to fetch sample graph');
  return response.json();
}
