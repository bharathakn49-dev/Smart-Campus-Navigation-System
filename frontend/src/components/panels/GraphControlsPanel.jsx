import { useState } from 'react';
import { useGraph } from '../../state/useGraphStore';
import { graphPresets } from '../../data/graphPresets';
import Legend from '../shared/Legend';

/**
 * GraphControlsPanel — Node/Edge manipulation, Save/Load, Presets, Legend
 */
export default function GraphControlsPanel() {
  const {
    nodes,
    edges,
    edgeCreationMode,
    pendingSource,
    hasSaved,
    dispatch,
    handleSaveGraph,
    handleLoadGraphFromStorage,
    handleLoadPreset,
    handleLoadSample,
    handleClearGraph,
    resetVisualization,
  } = useGraph();

  const [showPresets, setShowPresets] = useState(false);

  const toggleEdgeMode = () => {
    dispatch({ type: 'SET_EDGE_MODE', payload: !edgeCreationMode });
    dispatch({ type: 'SET_PENDING_SOURCE', payload: null });
  };

  return (
    <div className="panel-sections">
      {/* Stats */}
      <div className="panel-card">
        <div className="panel-card-title">📈 Graph Stats</div>
        <div className="stats-row">
          <div className="stat-item">
            <span className="stat-value">{nodes.length}</span>
            <span className="stat-label">Nodes</span>
          </div>
          <div className="stat-item">
            <span className="stat-value">{edges.length}</span>
            <span className="stat-label">Edges</span>
          </div>
        </div>
      </div>

      {/* Edit Tools */}
      <div className="panel-card">
        <div className="panel-card-title">✏️ Edit Tools</div>
        <div className="panel-btn-group">
          <button
            className={`btn btn-sm ${edgeCreationMode ? 'btn-danger' : 'btn-outline'}`}
            onClick={toggleEdgeMode}
            id="toggle-edge-mode"
            style={{ width: '100%' }}
          >
            {edgeCreationMode ? '✕ Exit Edge Mode' : '🔗 Add Edge Mode'}
          </button>
          {edgeCreationMode && pendingSource && (
            <div className="info-badge">
              ⏳ Selected: <strong>{pendingSource}</strong> — click another node
            </div>
          )}
          <p className="hint-text">
            {edgeCreationMode
              ? 'Click two nodes on the canvas to connect them'
              : 'Click on the canvas to add a new node'}
          </p>
          <p className="hint-text">Right-click an edge → Block / Change weight</p>
        </div>
      </div>

      {/* Preset Graphs */}
      <div className="panel-card">
        <div className="panel-card-title">🗺️ Graph Templates</div>
        <div className="panel-btn-group">
          <button
            className="btn btn-outline btn-sm"
            onClick={() => setShowPresets(!showPresets)}
            style={{ width: '100%' }}
          >
            {showPresets ? '✕ Close Presets' : '📋 Choose Preset Graph'}
          </button>

          {showPresets && (
            <div className="preset-list">
              {graphPresets.map(preset => (
                <button
                  key={preset.id}
                  className="preset-item"
                  onClick={() => {
                    handleLoadPreset(preset);
                    setShowPresets(false);
                  }}
                >
                  <span className="preset-icon">{preset.icon}</span>
                  <div className="preset-info">
                    <span className="preset-name">{preset.name}</span>
                    <span className="preset-desc">{preset.description}</span>
                  </div>
                </button>
              ))}
            </div>
          )}

          <button
            className="btn btn-outline btn-sm"
            onClick={handleLoadSample}
            id="load-sample"
            style={{ width: '100%' }}
          >
            🏫 Load from Backend
          </button>
        </div>
      </div>

      {/* Save / Load */}
      <div className="panel-card">
        <div className="panel-card-title">💾 Save & Load</div>
        <div className="panel-btn-row">
          <button
            className="btn btn-outline btn-sm"
            onClick={handleSaveGraph}
            id="save-graph"
            style={{ flex: 1 }}
          >
            💾 Save
          </button>
          <button
            className="btn btn-outline btn-sm"
            onClick={handleLoadGraphFromStorage}
            disabled={!hasSaved}
            id="load-graph"
            style={{ flex: 1 }}
          >
            📂 Load
          </button>
        </div>
      </div>

      {/* Reset */}
      <div className="panel-card">
        <div className="panel-card-title">🔄 Reset</div>
        <div className="panel-btn-row">
          <button
            className="btn btn-outline btn-sm"
            onClick={resetVisualization}
            id="reset-sim"
            style={{ flex: 1 }}
          >
            Reset Viz
          </button>
          <button
            className="btn btn-danger btn-sm"
            onClick={handleClearGraph}
            id="clear-graph"
            style={{ flex: 1 }}
          >
            Clear All
          </button>
        </div>
      </div>

      {/* Legend */}
      <div className="panel-card">
        <div className="panel-card-title">🎨 Legend</div>
        <Legend />
      </div>
    </div>
  );
}
