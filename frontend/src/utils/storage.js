/**
 * LocalStorage helpers for saving and loading graphs
 */

const STORAGE_KEY = 'campus_nav_graph';

/**
 * Save graph (nodes + edges) to localStorage
 */
export function saveGraph(nodes, edges) {
  try {
    const data = JSON.stringify({ nodes, edges, savedAt: new Date().toISOString() });
    localStorage.setItem(STORAGE_KEY, data);
    return true;
  } catch (e) {
    console.error('Failed to save graph:', e);
    return false;
  }
}

/**
 * Load graph from localStorage
 */
export function loadGraph() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to load graph:', e);
    return null;
  }
}

/**
 * Clear saved graph
 */
export function clearSavedGraph() {
  localStorage.removeItem(STORAGE_KEY);
}

/**
 * Check if a saved graph exists
 */
export function hasSavedGraph() {
  return localStorage.getItem(STORAGE_KEY) !== null;
}
