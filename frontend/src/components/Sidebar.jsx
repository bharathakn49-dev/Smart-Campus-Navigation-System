import { useGraph } from '../state/useGraphStore';

/**
 * Sidebar — Left vertical navigation with icons and labels
 */
const navItems = [
  { key: 'graph', icon: '📐', label: 'Graph' },
  { key: 'pathfinder', icon: '🎯', label: 'Path' },
  { key: 'comparison', icon: '📊', label: 'Compare' },
  { key: 'visualization', icon: '▶️', label: 'Visualize' },
  { key: 'settings', icon: '⚙️', label: 'Settings' },
];

export default function Sidebar() {
  const { activePanel, dispatch } = useGraph();

  return (
    <aside className="sidebar">
      {/* Branding */}
      <div className="sidebar-brand">
        <div className="sidebar-logo">🗺️</div>
        <div className="sidebar-brand-text">
          <span className="sidebar-title">Smart Campus</span>
          <span className="sidebar-subtitle">Navigator</span>
        </div>
      </div>

      <div className="sidebar-divider" />

      {/* Navigation Items */}
      <nav className="sidebar-nav">
        {navItems.map(item => (
          <button
            key={item.key}
            className={`sidebar-item ${activePanel === item.key ? 'active' : ''}`}
            onClick={() => dispatch({ type: 'SET_ACTIVE_PANEL', payload: item.key })}
            title={item.label}
            id={`nav-${item.key}`}
          >
            <span className="sidebar-icon">{item.icon}</span>
            <span className="sidebar-label">{item.label}</span>
            {activePanel === item.key && <div className="sidebar-indicator" />}
          </button>
        ))}
      </nav>

      {/* Footer */}
      <div className="sidebar-footer">
        <div className="sidebar-badge">DAA Project</div>
      </div>
    </aside>
  );
}
