import { useGraph } from '../../state/useGraphStore';

/**
 * PathFinderPanel — Source/Dest selection, algorithm picker, results display
 */
function formatAlgorithmName(algo) {
  const names = {
    'dijkstra': "Dijkstra's",
    'bfs': 'BFS',
    'bellman-ford': 'Bellman-Ford'
  };
  return names[algo] || algo;
}

export default function PathFinderPanel() {
  const {
    nodes,
    source,
    destination,
    algorithm,
    result,
    isRunning,
    dispatch,
    handleFindPath,
  } = useGraph();

  return (
    <div className="panel-sections">
      {/* Source / Destination */}
      <div className="panel-card">
        <div className="panel-card-title">📍 Route Selection</div>
        <div className="panel-form">
          <div>
            <label className="label" htmlFor="source-select">Source</label>
            <select
              className="input-field"
              id="source-select"
              value={source}
              onChange={e => dispatch({ type: 'SET_SOURCE', payload: e.target.value })}
            >
              <option value="">— Select Source —</option>
              {nodes.map(n => (
                <option key={n.id} value={n.id}>{n.label || n.id}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="label" htmlFor="dest-select">Destination</label>
            <select
              className="input-field"
              id="dest-select"
              value={destination}
              onChange={e => dispatch({ type: 'SET_DESTINATION', payload: e.target.value })}
            >
              <option value="">— Select Destination —</option>
              {nodes.map(n => (
                <option key={n.id} value={n.id}>{n.label || n.id}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Algorithm Selector */}
      <div className="panel-card">
        <div className="panel-card-title">🧠 Algorithm</div>
        <div className="panel-form">
          <select
            className="input-field"
            id="algo-select"
            value={algorithm}
            onChange={e => dispatch({ type: 'SET_ALGORITHM', payload: e.target.value })}
          >
            <option value="dijkstra">Dijkstra's Algorithm</option>
            <option value="bfs">BFS (Unweighted)</option>
            <option value="bellman-ford">Bellman-Ford</option>
          </select>

          <button
            className="btn btn-primary"
            onClick={handleFindPath}
            disabled={!source || !destination || isRunning}
            id="find-path"
            style={{ width: '100%' }}
          >
            {isRunning ? (
              <>
                <span className="spinner" /> Computing...
              </>
            ) : (
              '🚀 Find Shortest Path'
            )}
          </button>
        </div>
      </div>

      {/* Results */}
      {result && (
        <div className="panel-card animate-fade-in">
          <div className="panel-card-title">📊 Results</div>

          <div className="metrics-grid">
            <div className="metric-item" style={{ borderLeftColor: 'var(--accent)' }}>
              <span className="metric-label">🧠 Algorithm</span>
              <span className="metric-value">{formatAlgorithmName(result.algorithm)}</span>
            </div>
            <div className="metric-item" style={{ borderLeftColor: 'var(--success)' }}>
              <span className="metric-label">📏 Distance</span>
              <span className="metric-value">
                {result.distance >= 0 ? result.distance : 'No Path'}
              </span>
            </div>
            <div className="metric-item" style={{ borderLeftColor: 'var(--warning)' }}>
              <span className="metric-label">👁️ Visited</span>
              <span className="metric-value">{result.visitedNodes?.length || 0}</span>
            </div>
            <div className="metric-item" style={{ borderLeftColor: 'var(--info)' }}>
              <span className="metric-label">⚡ Time</span>
              <span className="metric-value">
                {result.executionTime ? `${result.executionTime.toFixed(3)} ms` : '—'}
              </span>
            </div>
          </div>

          {/* Path Display */}
          {result.path && result.path.length > 0 && (
            <div className="path-display">
              <span className="metric-label" style={{ marginBottom: '8px', display: 'block' }}>
                🛣️ Shortest Path
              </span>
              <div className="path-nodes">
                {result.path.map((node, i) => (
                  <span key={i} className="path-node-wrapper">
                    <span className="badge badge-success">{node}</span>
                    {i < result.path.length - 1 && (
                      <span className="path-arrow">→</span>
                    )}
                  </span>
                ))}
              </div>
            </div>
          )}

          {result.error && (
            <div className="error-box">
              ⚠️ {result.error}
            </div>
          )}
        </div>
      )}

      {/* Empty State */}
      {!result && (
        <div className="panel-card empty-state">
          <span className="empty-icon">🗺️</span>
          <p>Select source & destination, then click "Find Shortest Path" to see results.</p>
        </div>
      )}
    </div>
  );
}
