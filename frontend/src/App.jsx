import { useState, useCallback, useRef, useEffect } from 'react';
import { GraphProvider } from './state/useGraphStore';
import Sidebar from './components/Sidebar';
import GraphCanvas from './components/GraphCanvas';
import RightPanel from './components/RightPanel';
import './index.css';

const MIN_PANEL = 280;
const MAX_PANEL = 500;
const DEFAULT_PANEL = parseInt(localStorage.getItem('panelWidth')) || 340;

function App() {
  const [panelWidth, setPanelWidth] = useState(DEFAULT_PANEL);
  const [isResizing, setIsResizing] = useState(false);
  const startXRef = useRef(0);
  const startWidthRef = useRef(DEFAULT_PANEL);

  const onMouseDown = useCallback((e) => {
    e.preventDefault();
    setIsResizing(true);
    startXRef.current = e.clientX;
    startWidthRef.current = panelWidth;
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';
  }, [panelWidth]);

  useEffect(() => {
    if (!isResizing) return;

    const onMouseMove = (e) => {
      const delta = startXRef.current - e.clientX;
      const newWidth = Math.min(MAX_PANEL, Math.max(MIN_PANEL, startWidthRef.current + delta));
      setPanelWidth(newWidth);
    };

    const onMouseUp = () => {
      setIsResizing(false);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
      localStorage.setItem('panelWidth', String(panelWidth));
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };
  }, [isResizing, panelWidth]);

  return (
    <GraphProvider>
      <div
        className={`app-shell ${isResizing ? 'is-resizing' : ''}`}
        style={{ gridTemplateColumns: `var(--sidebar-width) 1fr 0px ${panelWidth}px` }}
      >
        <Sidebar />
        <main className="graph-main">
          <GraphCanvas />
        </main>

        {/* Resize Handle */}
        <div
          className={`resize-handle ${isResizing ? 'active' : ''}`}
          onMouseDown={onMouseDown}
        >
          <div className="resize-handle-line" />
        </div>

        <RightPanel />
      </div>
    </GraphProvider>
  );
}

export default App;
