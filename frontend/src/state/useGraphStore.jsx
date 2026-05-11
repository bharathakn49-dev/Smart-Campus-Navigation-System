import { createContext, useContext, useReducer, useCallback, useRef, useEffect, useState } from 'react';
import { findShortestPath, compareAlgorithms, fetchSampleGraph } from '../utils/api';
import { generateNodeId, validatePath } from '../utils/graphHelpers';
import { saveGraph as saveToStorage, loadGraph as loadFromStorage, hasSavedGraph } from '../utils/storage';

// ─── Context ─────────────────────────────────────────────────────────────────
const GraphContext = createContext(null);

// ─── Initial State ───────────────────────────────────────────────────────────
const initialState = {
  // Graph
  nodes: [],
  edges: [],
  blockedEdges: [],
  // Controls
  source: '',
  destination: '',
  algorithm: 'dijkstra',
  edgeCreationMode: false,
  pendingSource: null,
  isRunning: false,
  // Results
  result: null,
  comparisonData: null,
  highlightState: null,
  // Visualization
  steps: [],
  currentStepIndex: -1,
  vizMode: 'step',
  isPlaying: false,
  speed: 500,
  // UI
  activePanel: 'graph',
};

// ─── Reducer ─────────────────────────────────────────────────────────────────
function graphReducer(state, action) {
  switch (action.type) {
    case 'SET_NODES':
      return { ...state, nodes: action.payload };
    case 'SET_EDGES':
      return { ...state, edges: action.payload };
    case 'SET_BLOCKED_EDGES':
      return { ...state, blockedEdges: action.payload };
    case 'ADD_NODE':
      return { ...state, nodes: [...state.nodes, action.payload] };
    case 'ADD_EDGE':
      return { ...state, edges: [...state.edges, action.payload] };
    case 'UPDATE_EDGE_WEIGHT':
      return {
        ...state,
        edges: state.edges.map(e => {
          if (
            (e.source === action.payload.source && e.target === action.payload.target) ||
            (e.source === action.payload.target && e.target === action.payload.source)
          ) {
            return { ...e, weight: action.payload.weight };
          }
          return e;
        })
      };
    case 'BLOCK_EDGE':
      return { ...state, blockedEdges: [...state.blockedEdges, action.payload] };
    case 'UNBLOCK_EDGE':
      return {
        ...state,
        blockedEdges: state.blockedEdges.filter(e =>
          !(
            (e.source === action.payload.source && e.target === action.payload.target) ||
            (e.source === action.payload.target && e.target === action.payload.source)
          )
        )
      };
    case 'UPDATE_NODE_POSITION':
      return {
        ...state,
        nodes: state.nodes.map(n =>
          n.id === action.payload.id ? { ...n, x: action.payload.x, y: action.payload.y } : n
        )
      };
    case 'DELETE_NODE': {
      const nodeId = action.payload;
      return {
        ...state,
        nodes: state.nodes.filter(n => n.id !== nodeId),
        edges: state.edges.filter(e => e.source !== nodeId && e.target !== nodeId),
        blockedEdges: state.blockedEdges.filter(e => e.source !== nodeId && e.target !== nodeId),
        source: state.source === nodeId ? '' : state.source,
        destination: state.destination === nodeId ? '' : state.destination,
      };
    }
    case 'DELETE_EDGE':
      return {
        ...state,
        edges: state.edges.filter(e =>
          !(
            (e.source === action.payload.source && e.target === action.payload.target) ||
            (e.source === action.payload.target && e.target === action.payload.source)
          )
        ),
        blockedEdges: state.blockedEdges.filter(e =>
          !(
            (e.source === action.payload.source && e.target === action.payload.target) ||
            (e.source === action.payload.target && e.target === action.payload.source)
          )
        )
      };
    case 'SET_SOURCE':
      return { ...state, source: action.payload };
    case 'SET_DESTINATION':
      return { ...state, destination: action.payload };
    case 'SET_ALGORITHM':
      return { ...state, algorithm: action.payload };
    case 'SET_EDGE_MODE':
      return { ...state, edgeCreationMode: action.payload };
    case 'SET_PENDING_SOURCE':
      return { ...state, pendingSource: action.payload };
    case 'SET_RUNNING':
      return { ...state, isRunning: action.payload };
    case 'SET_RESULT':
      return { ...state, result: action.payload };
    case 'SET_COMPARISON':
      return { ...state, comparisonData: action.payload };
    case 'SET_HIGHLIGHT':
      return { ...state, highlightState: action.payload };
    case 'SET_STEPS':
      return { ...state, steps: action.payload };
    case 'SET_STEP_INDEX':
      return { ...state, currentStepIndex: action.payload };
    case 'SET_VIZ_MODE':
      return { ...state, vizMode: action.payload };
    case 'SET_PLAYING':
      return { ...state, isPlaying: action.payload };
    case 'SET_SPEED':
      return { ...state, speed: action.payload };
    case 'SET_ACTIVE_PANEL':
      return { ...state, activePanel: action.payload };
    case 'LOAD_GRAPH':
      return {
        ...state,
        nodes: action.payload.nodes,
        edges: action.payload.edges,
        blockedEdges: [],
        result: null,
        comparisonData: null,
        highlightState: null,
        steps: [],
        currentStepIndex: -1,
        isPlaying: false,
      };
    case 'CLEAR_GRAPH':
      return {
        ...state,
        nodes: [],
        edges: [],
        blockedEdges: [],
        source: '',
        destination: '',
        result: null,
        comparisonData: null,
        highlightState: null,
        steps: [],
        currentStepIndex: -1,
        isPlaying: false,
      };
    case 'RESET_VISUALIZATION':
      return {
        ...state,
        result: null,
        comparisonData: null,
        highlightState: null,
        steps: [],
        currentStepIndex: -1,
        isPlaying: false,
      };
    default:
      return state;
  }
}

// ─── Provider ────────────────────────────────────────────────────────────────
export function GraphProvider({ children }) {
  const [state, dispatch] = useReducer(graphReducer, initialState);
  const playIntervalRef = useRef(null);
  const [hasSaved, setHasSaved] = useState(false);

  useEffect(() => {
    setHasSaved(hasSavedGraph());
  }, []);

  // ─── Graph Manipulation ──────────────────────────────────────────────────
  const handleAddNode = useCallback((x, y) => {
    const id = generateNodeId(state.nodes);
    dispatch({ type: 'ADD_NODE', payload: { id, label: id, x, y } });
  }, [state.nodes]);

  const handleAddEdge = useCallback((sourceId, targetId, weight) => {
    const exists = state.edges.find(e =>
      (e.source === sourceId && e.target === targetId) ||
      (e.source === targetId && e.target === sourceId)
    );
    if (exists) return;
    dispatch({ type: 'ADD_EDGE', payload: { source: sourceId, target: targetId, weight } });
  }, [state.edges]);

  const handleNodeClickForEdge = useCallback((nodeId) => {
    if (!state.pendingSource) {
      dispatch({ type: 'SET_PENDING_SOURCE', payload: nodeId });
    } else {
      if (nodeId !== state.pendingSource) {
        const weight = window.prompt(`Weight for edge ${state.pendingSource} ↔ ${nodeId}:`, '1');
        if (weight !== null && !isNaN(Number(weight))) {
          handleAddEdge(state.pendingSource, nodeId, Number(weight));
        }
      }
      dispatch({ type: 'SET_PENDING_SOURCE', payload: null });
    }
  }, [state.pendingSource, handleAddEdge]);

  const handleBlockEdge = useCallback((src, tgt) => {
    dispatch({ type: 'BLOCK_EDGE', payload: { source: src, target: tgt } });
  }, []);

  const handleUnblockEdge = useCallback((src, tgt) => {
    dispatch({ type: 'UNBLOCK_EDGE', payload: { source: src, target: tgt } });
  }, []);

  const handleUpdateWeight = useCallback((src, tgt, newWeight) => {
    dispatch({ type: 'UPDATE_EDGE_WEIGHT', payload: { source: src, target: tgt, weight: newWeight } });
  }, []);

  const handleNodePositionChange = useCallback((nodeId, x, y) => {
    dispatch({ type: 'UPDATE_NODE_POSITION', payload: { id: nodeId, x, y } });
  }, []);

  const handleDeleteNode = useCallback((nodeId) => {
    dispatch({ type: 'DELETE_NODE', payload: nodeId });
  }, []);

  const handleDeleteEdge = useCallback((src, tgt) => {
    dispatch({ type: 'DELETE_EDGE', payload: { source: src, target: tgt } });
  }, []);

  // ─── Load Sample / Preset ────────────────────────────────────────────────
  const handleLoadSample = useCallback(async () => {
    try {
      const data = await fetchSampleGraph();
      dispatch({ type: 'LOAD_GRAPH', payload: data });
    } catch {
      alert('Failed to load sample graph. Is the backend running?');
    }
  }, []);

  const handleLoadPreset = useCallback((preset) => {
    dispatch({ type: 'LOAD_GRAPH', payload: { nodes: preset.nodes, edges: preset.edges } });
  }, []);

  // ─── Save / Load ─────────────────────────────────────────────────────────
  const handleSaveGraph = useCallback(() => {
    saveToStorage(state.nodes, state.edges);
    setHasSaved(true);
  }, [state.nodes, state.edges]);

  const handleLoadGraphFromStorage = useCallback(() => {
    const data = loadFromStorage();
    if (data) {
      dispatch({ type: 'LOAD_GRAPH', payload: data });
    }
  }, []);

  // ─── Find Path ───────────────────────────────────────────────────────────
  const handleFindPath = useCallback(async () => {
    const err = validatePath(state.nodes, state.source, state.destination);
    if (err) { alert(err); return; }
    dispatch({ type: 'SET_RUNNING', payload: true });
    dispatch({ type: 'SET_COMPARISON', payload: null });
    try {
      const activeEdges = state.edges.filter(e => {
        const blocked = state.blockedEdges.find(b =>
          (b.source === e.source && b.target === e.target) || (b.source === e.target && b.target === e.source)
        );
        return !blocked;
      });
      const res = await findShortestPath({
        nodes: state.nodes,
        edges: activeEdges,
        source: state.source,
        destination: state.destination,
        algorithm: state.algorithm,
        blockedEdges: state.blockedEdges
      });
      dispatch({ type: 'SET_RESULT', payload: res });
      dispatch({ type: 'SET_STEPS', payload: res.steps || [] });
      dispatch({ type: 'SET_STEP_INDEX', payload: -1 });
      dispatch({ type: 'SET_PLAYING', payload: false });
      dispatch({
        type: 'SET_HIGHLIGHT',
        payload: {
          visitedNodes: res.visitedNodes || [],
          path: res.path || [],
          currentNode: '',
          currentEdge: null
        }
      });
    } catch (err) {
      alert('Error: ' + err.message);
    } finally {
      dispatch({ type: 'SET_RUNNING', payload: false });
    }
  }, [state.nodes, state.edges, state.blockedEdges, state.source, state.destination, state.algorithm]);

  // ─── Compare ─────────────────────────────────────────────────────────────
  const handleCompare = useCallback(async () => {
    const err = validatePath(state.nodes, state.source, state.destination);
    if (err) { alert(err); return; }
    dispatch({ type: 'SET_RUNNING', payload: true });
    dispatch({ type: 'SET_RESULT', payload: null });
    try {
      const activeEdges = state.edges.filter(e => {
        const blocked = state.blockedEdges.find(b =>
          (b.source === e.source && b.target === e.target) || (b.source === e.target && b.target === e.source)
        );
        return !blocked;
      });
      const res = await compareAlgorithms({
        nodes: state.nodes,
        edges: activeEdges,
        source: state.source,
        destination: state.destination,
        blockedEdges: state.blockedEdges
      });
      dispatch({ type: 'SET_COMPARISON', payload: res });
      dispatch({ type: 'SET_STEPS', payload: [] });
      dispatch({ type: 'SET_HIGHLIGHT', payload: null });
    } catch (err) {
      alert('Error: ' + err.message);
    } finally {
      dispatch({ type: 'SET_RUNNING', payload: false });
    }
  }, [state.nodes, state.edges, state.blockedEdges, state.source, state.destination]);

  // ─── Reset / Clear ───────────────────────────────────────────────────────
  const resetVisualization = useCallback(() => {
    dispatch({ type: 'RESET_VISUALIZATION' });
    if (playIntervalRef.current) clearInterval(playIntervalRef.current);
  }, []);

  const handleClearGraph = useCallback(() => {
    dispatch({ type: 'CLEAR_GRAPH' });
    if (playIntervalRef.current) clearInterval(playIntervalRef.current);
  }, []);

  // ─── Step Controls ───────────────────────────────────────────────────────
  const applyStep = useCallback((index) => {
    if (index < 0 || index >= state.steps.length) return;
    const step = state.steps[index];
    dispatch({
      type: 'SET_HIGHLIGHT',
      payload: {
        visitedNodes: step.visitedNodes || [],
        currentNode: step.currentNode || '',
        currentEdge: step.edge || null,
        path: step.type === 'complete' ? (step.path || []) : []
      }
    });
  }, [state.steps]);

  const handleNextStep = useCallback(() => {
    const next = state.currentStepIndex + 1;
    if (next < state.steps.length) {
      dispatch({ type: 'SET_STEP_INDEX', payload: next });
      applyStep(next);
    }
  }, [state.currentStepIndex, state.steps.length, applyStep]);

  const handlePrevStep = useCallback(() => {
    const prev = state.currentStepIndex - 1;
    if (prev >= 0) {
      dispatch({ type: 'SET_STEP_INDEX', payload: prev });
      applyStep(prev);
    }
  }, [state.currentStepIndex, applyStep]);

  const handlePlay = useCallback(() => {
    dispatch({ type: 'SET_PLAYING', payload: true });
  }, []);

  const handlePause = useCallback(() => {
    dispatch({ type: 'SET_PLAYING', payload: false });
    if (playIntervalRef.current) clearInterval(playIntervalRef.current);
  }, []);

  const handleResetSteps = useCallback(() => {
    dispatch({ type: 'SET_STEP_INDEX', payload: -1 });
    dispatch({ type: 'SET_PLAYING', payload: false });
    dispatch({ type: 'SET_HIGHLIGHT', payload: null });
    if (playIntervalRef.current) clearInterval(playIntervalRef.current);
  }, []);

  // ─── Auto-play effect ────────────────────────────────────────────────────
  useEffect(() => {
    if (!state.isPlaying || state.steps.length === 0) return;
    playIntervalRef.current = setInterval(() => {
      dispatch((prev) => {
        // We can't dispatch a function with useReducer, so use a workaround
      });
    }, state.speed);

    // Use a separate approach: track via ref
    const interval = setInterval(() => {
      dispatch({ type: 'SET_STEP_INDEX', payload: '__INCREMENT__' });
    }, state.speed);

    playIntervalRef.current = interval;
    return () => clearInterval(interval);
  }, [state.isPlaying, state.speed, state.steps.length]);

  // Handle the increment step index specially
  // We need a different approach since useReducer doesn't support functional updates like useState
  // Let's use a ref to track current step during autoplay
  const stepIndexRef = useRef(state.currentStepIndex);
  stepIndexRef.current = state.currentStepIndex;

  useEffect(() => {
    if (!state.isPlaying || state.steps.length === 0) return;

    if (playIntervalRef.current) clearInterval(playIntervalRef.current);

    const interval = setInterval(() => {
      const next = stepIndexRef.current + 1;
      if (next >= state.steps.length) {
        dispatch({ type: 'SET_PLAYING', payload: false });
        clearInterval(interval);
        return;
      }
      dispatch({ type: 'SET_STEP_INDEX', payload: next });
    }, state.speed);

    playIntervalRef.current = interval;
    return () => clearInterval(interval);
  }, [state.isPlaying, state.speed, state.steps.length]);

  // Apply step when currentStepIndex changes
  useEffect(() => {
    if (state.currentStepIndex >= 0 && state.currentStepIndex < state.steps.length) {
      const step = state.steps[state.currentStepIndex];
      dispatch({
        type: 'SET_HIGHLIGHT',
        payload: {
          visitedNodes: step.visitedNodes || [],
          currentNode: step.currentNode || '',
          currentEdge: step.edge || null,
          path: step.type === 'complete' ? (step.path || []) : []
        }
      });
    }
  }, [state.currentStepIndex, state.steps]);

  const value = {
    ...state,
    hasSaved,
    dispatch,
    // Actions
    handleAddNode,
    handleAddEdge,
    handleNodeClickForEdge,
    handleBlockEdge,
    handleUnblockEdge,
    handleUpdateWeight,
    handleNodePositionChange,
    handleDeleteNode,
    handleDeleteEdge,
    handleLoadSample,
    handleLoadPreset,
    handleSaveGraph,
    handleLoadGraphFromStorage,
    handleFindPath,
    handleCompare,
    resetVisualization,
    handleClearGraph,
    handleNextStep,
    handlePrevStep,
    handlePlay,
    handlePause,
    handleResetSteps,
  };

  return (
    <GraphContext.Provider value={value}>
      {children}
    </GraphContext.Provider>
  );
}

// ─── Hook ────────────────────────────────────────────────────────────────────
export function useGraph() {
  const context = useContext(GraphContext);
  if (!context) {
    throw new Error('useGraph must be used within a GraphProvider');
  }
  return context;
}
