import { useGraph } from '../state/useGraphStore';
import GraphControlsPanel from './panels/GraphControlsPanel';
import PathFinderPanel from './panels/PathFinderPanel';
import ComparisonPanel from './panels/ComparisonPanel';
import VisualizationPanel from './panels/VisualizationPanel';
import SettingsPanel from './panels/SettingsPanel';

/**
 * RightPanel — Dynamic content panel that changes based on sidebar selection
 */
const panelTitles = {
  graph: 'Graph Controls',
  pathfinder: 'Path Finder',
  comparison: 'Algorithm Comparison',
  visualization: 'Visualization',
  settings: 'Settings',
};

const panelIcons = {
  graph: '📐',
  pathfinder: '🎯',
  comparison: '📊',
  visualization: '▶️',
  settings: '⚙️',
};

export default function RightPanel() {
  const { activePanel } = useGraph();

  const renderPanel = () => {
    switch (activePanel) {
      case 'graph': return <GraphControlsPanel />;
      case 'pathfinder': return <PathFinderPanel />;
      case 'comparison': return <ComparisonPanel />;
      case 'visualization': return <VisualizationPanel />;
      case 'settings': return <SettingsPanel />;
      default: return <GraphControlsPanel />;
    }
  };

  return (
    <div className="right-panel">
      {/* Panel Header */}
      <div className="panel-header">
        <span className="panel-header-icon">{panelIcons[activePanel]}</span>
        <h2 className="panel-header-title">{panelTitles[activePanel]}</h2>
      </div>

      {/* Panel Content */}
      <div className="panel-content" key={activePanel}>
        {renderPanel()}
      </div>
    </div>
  );
}
