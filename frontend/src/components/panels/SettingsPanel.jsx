import { useState, useEffect } from 'react';
import { useGraph } from '../../state/useGraphStore';
import { graphPresets } from '../../data/graphPresets';

/**
 * SettingsPanel — Theme toggle, reset, presets, about
 */
export default function SettingsPanel() {
  const { handleClearGraph, handleLoadPreset } = useGraph();

  const [dark, setDark] = useState(() => {
    const saved = localStorage.getItem('theme');
    return saved ? saved === 'dark' : true;
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light');
    localStorage.setItem('theme', dark ? 'dark' : 'light');
  }, [dark]);

  const handleResetApp = () => {
    if (window.confirm('Reset the entire application? This will clear the graph and all data.')) {
      handleClearGraph();
      localStorage.removeItem('campus_nav_graph');
    }
  };

  return (
    <div className="panel-sections">
      {/* Theme */}
      <div className="panel-card">
        <div className="panel-card-title">🎨 Appearance</div>
        <div className="theme-toggle-row">
          <div className="theme-info">
            <span className="theme-icon">{dark ? '🌙' : '☀️'}</span>
            <div>
              <div className="theme-name">{dark ? 'Dark Mode' : 'Light Mode'}</div>
              <div className="theme-desc">
                {dark ? 'Easy on the eyes' : 'Bright and clear'}
              </div>
            </div>
          </div>
          <button
            className="toggle-switch"
            onClick={() => setDark(d => !d)}
            id="theme-toggle"
            aria-label="Toggle theme"
          >
            <div className={`toggle-thumb ${dark ? 'active' : ''}`} />
          </button>
        </div>
      </div>

      {/* Quick Load */}
      <div className="panel-card">
        <div className="panel-card-title">🗺️ Quick Load Preset</div>
        <div className="preset-list">
          {graphPresets.map(preset => (
            <button
              key={preset.id}
              className="preset-item"
              onClick={() => handleLoadPreset(preset)}
            >
              <span className="preset-icon">{preset.icon}</span>
              <div className="preset-info">
                <span className="preset-name">{preset.name}</span>
                <span className="preset-desc">{preset.description}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Reset */}
      <div className="panel-card">
        <div className="panel-card-title">⚠️ Danger Zone</div>
        <button
          className="btn btn-danger btn-sm"
          onClick={handleResetApp}
          style={{ width: '100%' }}
        >
          🗑️ Reset Entire App
        </button>
        <p className="hint-text" style={{ marginTop: '8px' }}>
          Clears graph, saved data, and all results.
        </p>
      </div>

      {/* About */}
      <div className="panel-card">
        <div className="panel-card-title">ℹ️ About</div>
        <div className="about-section">
          <h4>Smart Campus Navigator</h4>
          <p>DAA Project — Shortest Path Algorithms</p>
          <div className="about-tags">
            <span className="badge badge-accent">Dijkstra</span>
            <span className="badge badge-accent">BFS</span>
            <span className="badge badge-accent">Bellman-Ford</span>
          </div>
          <p className="hint-text" style={{ marginTop: '12px' }}>
            Interactive graph visualization with step-by-step algorithm animation and comparison.
          </p>
        </div>
      </div>
    </div>
  );
}
