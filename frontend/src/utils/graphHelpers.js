/**
 * Graph helper utilities — transforms between different graph representations
 */

/**
 * Convert nodes + edges arrays into Cytoscape elements format
 */
export function toCytoscapeElements(nodes, edges, blockedEdges = []) {
  const blockedSet = new Set(blockedEdges.map(e => `${e.source}-${e.target}`));

  const cyNodes = nodes.map(n => ({
    data: { id: n.id, label: n.label || n.id },
    position: { x: n.x || Math.random() * 600, y: n.y || Math.random() * 400 }
  }));

  const cyEdges = edges.map((e, i) => {
    const edgeKey = `${e.source}-${e.target}`;
    const reverseKey = `${e.target}-${e.source}`;
    const isBlocked = blockedSet.has(edgeKey) || blockedSet.has(reverseKey);
    return {
      data: {
        id: `e${i}`,
        source: e.source,
        target: e.target,
        weight: e.weight,
        label: `${e.weight}`,
        blocked: isBlocked
      }
    };
  });

  return [...cyNodes, ...cyEdges];
}

/**
 * Generate a unique node ID based on existing nodes
 */
export function generateNodeId(existingNodes) {
  const locations = [
    'Building A', 'Building B', 'Building C', 'Building D',
    'Parking', 'Garden', 'Gym', 'Clinic',
    'Workshop', 'Seminar Hall', 'IT Block', 'Staff Room',
    'Gate 2', 'Gate 3', 'Playground', 'Bus Stop'
  ];
  const usedIds = new Set(existingNodes.map(n => n.id));
  for (const loc of locations) {
    if (!usedIds.has(loc)) return loc;
  }
  return `Node ${existingNodes.length + 1}`;
}

/**
 * Validate that source and destination exist in the graph
 */
export function validatePath(nodes, source, destination) {
  const nodeIds = new Set(nodes.map(n => n.id));
  if (!nodeIds.has(source)) return `Source "${source}" not found in graph`;
  if (!nodeIds.has(destination)) return `Destination "${destination}" not found in graph`;
  if (source === destination) return 'Source and destination must be different';
  return null;
}

/**
 * Get edge between two nodes
 */
export function getEdgeBetween(edges, source, target) {
  return edges.find(e =>
    (e.source === source && e.target === target) ||
    (e.source === target && e.target === source)
  );
}
