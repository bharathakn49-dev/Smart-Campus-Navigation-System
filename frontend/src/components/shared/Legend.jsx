/**
 * Legend — Color legend for graph visualization states
 */
export default function Legend() {
  const items = [
    { color: '#6366f1', label: 'Default Node' },
    { color: '#f59e0b', label: 'Visited / Processing' },
    { color: '#f97316', label: 'Currently Active' },
    { color: '#10b981', label: 'Shortest Path' },
    { color: '#ef4444', label: 'Blocked Edge', dashed: true },
  ];

  return (
    <div className="legend-grid">
      {items.map((item, i) => (
        <div key={i} className="legend-item">
          <div
            className="legend-dot"
            style={{
              background: item.dashed ? 'transparent' : item.color,
              border: item.dashed ? `2px dashed ${item.color}` : 'none',
              borderRadius: item.dashed ? '3px' : '50%',
            }}
          />
          <span>{item.label}</span>
        </div>
      ))}
    </div>
  );
}
