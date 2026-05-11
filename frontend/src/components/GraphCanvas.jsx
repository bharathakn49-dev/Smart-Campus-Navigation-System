import { useEffect, useRef, useCallback, useState } from 'react';
import cytoscape from 'cytoscape';
import { toCytoscapeElements } from '../utils/graphHelpers';
import { useGraph } from '../state/useGraphStore';

/**
 * GraphCanvas — Interactive graph visualization using Cytoscape.js
 *
 * Supports:
 * - Click to add nodes
 * - Click two nodes to connect with edge
 * - Drag to reposition nodes
 * - Right-click edge to block/unblock or modify weight
 * - Visual highlighting for algorithm steps
 * - Theme-aware edge labels (dark text on light mode, light text on dark mode)
 */
export default function GraphCanvas() {
  const {
    nodes,
    edges,
    blockedEdges,
    highlightState,
    edgeCreationMode,
    pendingSource,
    handleAddNode,
    handleNodeClickForEdge,
    handleBlockEdge,
    handleUnblockEdge,
    handleUpdateWeight,
    handleNodePositionChange,
  } = useGraph();

  const containerRef = useRef(null);
  const cyRef = useRef(null);
  const [nodeCount, setNodeCount] = useState(0);

  // ─── Fit graph to view ─────────────────────────────────────────────────────
  const fitToView = useCallback(() => {
    const cy = cyRef.current;
    if (cy && cy.nodes().length > 0) {
      cy.animate({ fit: { eles: cy.elements(), padding: 50 }, duration: 400, easing: 'ease-in-out-cubic' });
    }
  }, []);

  // ─── Get theme-aware styles ────────────────────────────────────────────────
  const getThemeStyles = useCallback(() => {
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    return {
      edgeLabelColor: isDark ? '#e2e8f0' : '#1e293b',
      edgeLabelBg: isDark ? '#1e293b' : '#f1f5f9',
      edgeLabelBgOpacity: isDark ? 0.85 : 0.9,
    };
  }, []);

  // ─── Build Cytoscape style array ───────────────────────────────────────────
  const getCytoscapeStyle = useCallback(() => {
    const theme = getThemeStyles();
    return [
      // ─── Default Node ────────────────────────────────────────────────
      {
        selector: 'node',
        style: {
          'label': 'data(label)',
          'text-valign': 'center',
          'text-halign': 'center',
          'background-color': '#6366f1',
          'color': '#ffffff',
          'font-size': '10px',
          'font-weight': '600',
          'font-family': 'Inter, sans-serif',
          'width': '50px',
          'height': '50px',
          'border-width': '3px',
          'border-color': '#818cf8',
          'text-wrap': 'wrap',
          'text-max-width': '60px',
          'overlay-padding': '6px',
          'transition-property': 'background-color, border-color, width, height',
          'transition-duration': '0.3s'
        }
      },
      // ─── Default Edge ────────────────────────────────────────────────
      {
        selector: 'edge',
        style: {
          'label': 'data(label)',
          'width': 3,
          'line-color': '#64748b',
          'target-arrow-color': '#64748b',
          'curve-style': 'bezier',
          'font-size': '12px',
          'font-weight': '700',
          'font-family': 'Inter, sans-serif',
          'color': theme.edgeLabelColor,
          'text-background-color': theme.edgeLabelBg,
          'text-background-opacity': theme.edgeLabelBgOpacity,
          'text-background-padding': '5px',
          'text-background-shape': 'roundrectangle',
          'text-margin-y': '-10px',
          'transition-property': 'line-color, width',
          'transition-duration': '0.3s'
        }
      },
      // ─── Visited Node (algorithm) ─────────────────────────────────
      {
        selector: 'node.visited',
        style: {
          'background-color': '#f59e0b',
          'border-color': '#fbbf24',
          'color': '#1e293b'
        }
      },
      // ─── Current Node (algorithm) ─────────────────────────────────
      {
        selector: 'node.current',
        style: {
          'background-color': '#f97316',
          'border-color': '#fb923c',
          'width': '60px',
          'height': '60px',
          'color': '#ffffff',
          'border-width': '4px'
        }
      },
      // ─── Path Node (final) ───────────────────────────────────────
      {
        selector: 'node.path',
        style: {
          'background-color': '#10b981',
          'border-color': '#34d399',
          'width': '58px',
          'height': '58px',
          'color': '#ffffff',
          'border-width': '4px',
          'overlay-color': '#10b981',
          'overlay-opacity': 0.15
        }
      },
      // ─── Path Edge (final) ───────────────────────────────────────
      {
        selector: 'edge.path-edge',
        style: {
          'line-color': '#10b981',
          'width': 7,
          'color': '#34d399',
          'text-background-color': '#064e3b',
          'overlay-color': '#10b981',
          'overlay-opacity': 0.12
        }
      },
      // ─── Current Edge (relaxing) ─────────────────────────────────
      {
        selector: 'edge.current-edge',
        style: {
          'line-color': '#f97316',
          'width': 5,
          'color': '#fb923c'
        }
      },
      // ─── Blocked Edge ────────────────────────────────────────────
      {
        selector: 'edge.blocked',
        style: {
          'line-color': '#ef4444',
          'line-style': 'dashed',
          'width': 3,
          'color': '#f87171',
          'opacity': 0.7,
          'text-background-color': '#7f1d1d'
        }
      },
      // ─── Pending Source (edge creation) ──────────────────────────
      {
        selector: 'node.pending-source',
        style: {
          'border-color': '#fbbf24',
          'border-width': '5px',
          'background-color': '#6366f1'
        }
      },
      // ─── Hover Effects ──────────────────────────────────────────
      {
        selector: 'node:active',
        style: {
          'overlay-color': '#818cf8',
          'overlay-opacity': 0.2
        }
      }
    ];
  }, [getThemeStyles]);

  // ─── Initialize Cytoscape ──────────────────────────────────────────────────
  useEffect(() => {
    if (!containerRef.current) return;

    const cy = cytoscape({
      container: containerRef.current,
      elements: [],
      style: getCytoscapeStyle(),
      layout: { name: 'preset' },
      userZoomingEnabled: true,
      userPanningEnabled: true,
      boxSelectionEnabled: false,
      minZoom: 0.3,
      maxZoom: 3
    });

    cyRef.current = cy;

    return () => {
      cy.destroy();
    };
  }, []);

  // ─── Watch for theme changes and re-apply styles ───────────────────────────
  useEffect(() => {
    const observer = new MutationObserver(() => {
      const cy = cyRef.current;
      if (cy) {
        cy.style().fromJson(getCytoscapeStyle()).update();
      }
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme']
    });

    return () => observer.disconnect();
  }, [getCytoscapeStyle]);

  // ─── Update elements when nodes/edges change ──────────────────────────────
  useEffect(() => {
    const cy = cyRef.current;
    if (!cy) return;

    const elements = toCytoscapeElements(nodes, edges, blockedEdges);

    // Preserve positions of existing nodes
    const existingPositions = {};
    cy.nodes().forEach(n => {
      existingPositions[n.id()] = n.position();
    });

    const hadNodes = cy.nodes().length > 0;
    cy.elements().remove();
    cy.add(elements);

    // Restore positions
    cy.nodes().forEach(n => {
      if (existingPositions[n.id()]) {
        n.position(existingPositions[n.id()]);
      }
    });

    // Style blocked edges
    cy.edges().forEach(edge => {
      if (edge.data('blocked')) {
        edge.addClass('blocked');
      }
    });

    // Auto-fit when loading a whole new graph (node count changed dramatically)
    const newCount = nodes.length;
    if (!hadNodes && newCount > 0) {
      setTimeout(() => fitToView(), 50);
    }
    setNodeCount(newCount);
  }, [nodes, edges, blockedEdges, fitToView]);

  // ─── Handle highlighting from algorithm visualization ─────────────────────
  useEffect(() => {
    const cy = cyRef.current;
    if (!cy) return;

    // Reset all classes
    cy.elements().removeClass('visited current path path-edge current-edge');

    if (!highlightState) return;

    const { visitedNodes = [], currentNode = '', path = [], currentEdge = null } = highlightState;

    // Highlight visited nodes
    visitedNodes.forEach(nodeId => {
      const node = cy.getElementById(nodeId);
      if (node.length) node.addClass('visited');
    });

    // Highlight current node
    if (currentNode) {
      const node = cy.getElementById(currentNode);
      if (node.length) {
        node.removeClass('visited');
        node.addClass('current');
      }
    }

    // Highlight current edge being relaxed
    if (currentEdge) {
      cy.edges().forEach(edge => {
        const src = edge.data('source');
        const tgt = edge.data('target');
        if (
          (src === currentEdge.source && tgt === currentEdge.target) ||
          (src === currentEdge.target && tgt === currentEdge.source)
        ) {
          edge.addClass('current-edge');
        }
      });
    }

    // Highlight final path
    if (path.length > 1) {
      path.forEach(nodeId => {
        const node = cy.getElementById(nodeId);
        if (node.length) {
          node.removeClass('visited current');
          node.addClass('path');
        }
      });

      for (let i = 0; i < path.length - 1; i++) {
        cy.edges().forEach(edge => {
          const src = edge.data('source');
          const tgt = edge.data('target');
          if (
            (src === path[i] && tgt === path[i + 1]) ||
            (src === path[i + 1] && tgt === path[i])
          ) {
            edge.addClass('path-edge');
          }
        });
      }
    }
  }, [highlightState]);

  // ─── Event handlers ────────────────────────────────────────────────────────
  useEffect(() => {
    const cy = cyRef.current;
    if (!cy) return;

    // Click on canvas background — add node
    const onTapCanvas = (e) => {
      if (e.target !== cy) return;
      if (edgeCreationMode) return;
      const pos = e.position;
      handleAddNode?.(pos.x, pos.y);
    };

    // Click on node — for edge creation
    const onTapNode = (e) => {
      const nodeId = e.target.id();
      if (edgeCreationMode) {
        handleNodeClickForEdge?.(nodeId);
      }
    };

    // Drag end — update node position
    const onDragFree = (e) => {
      const node = e.target;
      const pos = node.position();
      handleNodePositionChange?.(node.id(), pos.x, pos.y);
    };

    // Right-click on edge — context menu
    const onCxttapEdge = (e) => {
      e.originalEvent.preventDefault();
      const edge = e.target;
      const src = edge.data('source');
      const tgt = edge.data('target');
      const isBlocked = edge.data('blocked');

      const action = window.prompt(
        `Edge: ${src} ↔ ${tgt} (weight: ${edge.data('weight')})\n\n` +
        `Enter action:\n` +
        `1 — ${isBlocked ? 'Unblock' : 'Block'} this edge\n` +
        `2 — Change weight\n` +
        `Cancel — Do nothing`,
        '1'
      );

      if (action === '1') {
        if (isBlocked) {
          handleUnblockEdge?.(src, tgt);
        } else {
          handleBlockEdge?.(src, tgt);
        }
      } else if (action === '2') {
        const newWeight = window.prompt('Enter new weight:', edge.data('weight'));
        if (newWeight !== null && !isNaN(Number(newWeight))) {
          handleUpdateWeight?.(src, tgt, Number(newWeight));
        }
      }
    };

    cy.on('tap', onTapCanvas);
    cy.on('tap', 'node', onTapNode);
    cy.on('dragfree', 'node', onDragFree);
    cy.on('cxttap', 'edge', onCxttapEdge);

    return () => {
      cy.removeListener('tap', onTapCanvas);
      cy.removeListener('tap', 'node', onTapNode);
      cy.removeListener('dragfree', 'node', onDragFree);
      cy.removeListener('cxttap', 'edge', onCxttapEdge);
    };
  }, [edgeCreationMode, handleAddNode, handleNodeClickForEdge, handleBlockEdge, handleUnblockEdge, handleUpdateWeight, handleNodePositionChange]);

  // ─── Highlight pending source for edge creation ───────────────────────────
  useEffect(() => {
    const cy = cyRef.current;
    if (!cy) return;
    cy.nodes().removeClass('pending-source');
    if (pendingSource) {
      const node = cy.getElementById(pendingSource);
      if (node.length) node.addClass('pending-source');
    }
  }, [pendingSource]);

  return (
    <div className="graph-canvas-wrapper">
      <div ref={containerRef} className="cy-container" />

      {/* Fit button */}
      {nodeCount > 0 && (
        <button
          className="fit-btn"
          onClick={fitToView}
          title="Fit graph to view"
        >
          ⊞
        </button>
      )}

      {/* Instructions overlay */}
      <div className="canvas-badges">
        {edgeCreationMode ? (
          <span className="badge badge-warning canvas-badge">
            🔗 Edge Mode: Click two nodes to connect
          </span>
        ) : (
          <span className="badge badge-accent canvas-badge">
            📍 Click canvas to add node
          </span>
        )}
        <span className="badge canvas-badge canvas-badge-muted">
          Right-click edge → Block / Change weight
        </span>
      </div>
    </div>
  );
}
