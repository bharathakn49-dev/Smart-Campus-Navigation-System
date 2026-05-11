import { useEffect, useRef } from 'react';
import { Chart, registerables } from 'chart.js';
import { useGraph } from '../../state/useGraphStore';

Chart.register(...registerables);

/**
 * ComparisonPanel — Compare all algorithms with table + chart + analysis
 */

const complexities = [
  { algo: "Dijkstra's Algorithm", time: 'O((V + E) log V)', space: 'O(V)', best: 'Weighted graphs, no negative edges', icon: '🏆', color: '#6366f1' },
  { algo: 'BFS', time: 'O(V + E)', space: 'O(V)', best: 'Unweighted graphs', icon: '🔍', color: '#3b82f6' },
  { algo: 'Bellman-Ford', time: 'O(V × E)', space: 'O(V)', best: 'Negative weights, cycle detection', icon: '⚡', color: '#f59e0b' }
];

const fmtName = a => ({ dijkstra: "Dijkstra", bfs: "BFS", "bellman-ford": "Bellman-Ford" }[a] || a);

export default function ComparisonPanel() {
  const {
    nodes,
    source,
    destination,
    comparisonData,
    isRunning,
    dispatch,
    handleCompare,
  } = useGraph();

  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    if (!comparisonData || !chartRef.current) return;
    if (chartInstance.current) chartInstance.current.destroy();

    const algos = Object.keys(comparisonData);
    const labels = algos.map(a => fmtName(a));
    const times = algos.map(a => comparisonData[a].executionTime || 0);
    const distances = algos.map(a => comparisonData[a].distance >= 0 ? comparisonData[a].distance : 0);

    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    const textColor = isDark ? '#94a3b8' : '#64748b';
    const gridColor = isDark ? 'rgba(148,163,184,0.1)' : 'rgba(148,163,184,0.15)';

    const ctx = chartRef.current.getContext('2d');
    chartInstance.current = new Chart(ctx, {
      type: 'bar',
      data: {
        labels,
        datasets: [
          {
            label: 'Time (ms)',
            data: times,
            backgroundColor: ['rgba(99,102,241,0.7)', 'rgba(59,130,246,0.7)', 'rgba(245,158,11,0.7)'],
            borderColor: ['#6366f1', '#3b82f6', '#f59e0b'],
            borderWidth: 2,
            borderRadius: 6
          },
          {
            label: 'Distance',
            data: distances,
            backgroundColor: ['rgba(16,185,129,0.7)', 'rgba(52,211,153,0.7)', 'rgba(110,231,183,0.7)'],
            borderColor: ['#10b981', '#34d399', '#6ee7b7'],
            borderWidth: 2,
            borderRadius: 6
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            labels: {
              color: textColor,
              font: { family: 'Inter', weight: '600', size: 11 }
            }
          }
        },
        scales: {
          x: { ticks: { color: textColor }, grid: { color: gridColor } },
          y: { ticks: { color: textColor }, grid: { color: gridColor } }
        }
      }
    });

    return () => { if (chartInstance.current) chartInstance.current.destroy(); };
  }, [comparisonData]);

  return (
    <div className="panel-sections">
      {/* Source / Destination */}
      <div className="panel-card">
        <div className="panel-card-title">📍 Route</div>
        <div className="panel-form">
          <div>
            <label className="label" htmlFor="cmp-source">Source</label>
            <select
              className="input-field"
              id="cmp-source"
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
            <label className="label" htmlFor="cmp-dest">Destination</label>
            <select
              className="input-field"
              id="cmp-dest"
              value={destination}
              onChange={e => dispatch({ type: 'SET_DESTINATION', payload: e.target.value })}
            >
              <option value="">— Select Destination —</option>
              {nodes.map(n => (
                <option key={n.id} value={n.id}>{n.label || n.id}</option>
              ))}
            </select>
          </div>
          <button
            className="btn btn-success"
            onClick={handleCompare}
            disabled={!source || !destination || isRunning}
            id="compare-all"
            style={{ width: '100%' }}
          >
            {isRunning ? (
              <>
                <span className="spinner" /> Comparing...
              </>
            ) : (
              '📊 Compare All Algorithms'
            )}
          </button>
        </div>
      </div>

      {/* Comparison Table */}
      {comparisonData && (
        <div className="panel-card animate-fade-in">
          <div className="panel-card-title">📋 Results</div>
          <div className="comparison-table-wrapper">
            <table className="comparison-table">
              <thead>
                <tr>
                  <th>Algorithm</th>
                  <th>Dist</th>
                  <th>Nodes</th>
                  <th>Time</th>
                </tr>
              </thead>
              <tbody>
                {Object.keys(comparisonData).map((algo, i) => {
                  const r = comparisonData[algo];
                  return (
                    <tr key={algo} style={{ animationDelay: `${i * 0.1}s` }}>
                      <td><span className="badge badge-accent">{fmtName(algo)}</span></td>
                      <td><strong>{r.distance >= 0 ? r.distance : '—'}</strong></td>
                      <td>{r.visitedNodes?.length || 0}</td>
                      <td>{r.executionTime?.toFixed(3) || '—'} ms</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Path Display per algorithm */}
          {Object.keys(comparisonData).map(algo => {
            const r = comparisonData[algo];
            if (!r.path || r.path.length === 0) return null;
            return (
              <div key={algo} className="path-display" style={{ marginTop: '8px' }}>
                <span className="metric-label">{fmtName(algo)} path:</span>
                <div className="path-nodes" style={{ marginTop: '4px' }}>
                  {r.path.map((node, i) => (
                    <span key={i} className="path-node-wrapper">
                      <span className="badge badge-success" style={{ fontSize: '0.6rem' }}>{node}</span>
                      {i < r.path.length - 1 && <span className="path-arrow">→</span>}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}

          {/* Chart */}
          <div style={{ height: '200px', marginTop: '16px' }}>
            <canvas ref={chartRef} />
          </div>
        </div>
      )}

      {/* Algorithm Analysis */}
      <div className="panel-card">
        <div className="panel-card-title">📈 Algorithm Analysis</div>
        <div className="analysis-cards">
          {complexities.map((c, i) => (
            <div key={i} className="analysis-item" style={{ borderTopColor: c.color }}>
              <div className="analysis-header">
                <span>{c.icon}</span>
                <span className="analysis-name">{c.algo}</span>
              </div>
              <div className="analysis-row">
                <span className="analysis-label">Time</span>
                <span className="analysis-value" style={{ color: c.color }}>{c.time}</span>
              </div>
              <div className="analysis-row">
                <span className="analysis-label">Space</span>
                <span className="analysis-value">{c.space}</span>
              </div>
              <div className="analysis-best">
                Best for: {c.best}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Empty State */}
      {!comparisonData && (
        <div className="panel-card empty-state">
          <span className="empty-icon">📊</span>
          <p>Select source & destination and click "Compare All" to see a side-by-side comparison.</p>
        </div>
      )}
    </div>
  );
}
