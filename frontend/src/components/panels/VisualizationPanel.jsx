import { useGraph } from '../../state/useGraphStore';

/**
 * VisualizationPanel — Step-by-step and auto-play controls
 */
export default function VisualizationPanel() {
  const {
    steps,
    currentStepIndex,
    vizMode,
    isPlaying,
    speed,
    dispatch,
    handleNextStep,
    handlePrevStep,
    handlePlay,
    handlePause,
    handleResetSteps,
  } = useGraph();

  const hasSteps = steps && steps.length > 0;
  const currentStep = hasSteps ? (steps[currentStepIndex] || {}) : {};
  const progress = hasSteps ? ((currentStepIndex + 1) / steps.length) * 100 : 0;

  return (
    <div className="panel-sections">
      {/* Mode Toggle */}
      <div className="panel-card">
        <div className="panel-card-title">🎬 Mode</div>
        <div className="mode-toggle">
          <button
            className={`mode-btn ${vizMode === 'step' ? 'active' : ''}`}
            onClick={() => dispatch({ type: 'SET_VIZ_MODE', payload: 'step' })}
          >
            Step-by-Step
          </button>
          <button
            className={`mode-btn ${vizMode === 'auto' ? 'active' : ''}`}
            onClick={() => dispatch({ type: 'SET_VIZ_MODE', payload: 'auto' })}
          >
            Auto Play
          </button>
        </div>
      </div>

      {hasSteps ? (
        <>
          {/* Progress */}
          <div className="panel-card">
            <div className="panel-card-title">📊 Progress</div>
            <div className="viz-progress-bar">
              <div
                className="viz-progress-fill"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="viz-step-info">
              <span className="badge badge-accent">
                {currentStepIndex + 1}/{steps.length}
              </span>
              <span className="viz-step-message">
                {currentStep.message || 'Ready — press Play or Next'}
              </span>
            </div>
          </div>

          {/* Controls */}
          <div className="panel-card">
            <div className="panel-card-title">🎮 Controls</div>
            {vizMode === 'step' ? (
              <div className="panel-btn-group">
                <div className="panel-btn-row">
                  <button
                    className="btn btn-outline btn-sm"
                    onClick={handlePrevStep}
                    disabled={currentStepIndex <= 0}
                    style={{ flex: 1 }}
                  >
                    ◀ Prev
                  </button>
                  <button
                    className="btn btn-primary btn-sm"
                    onClick={handleNextStep}
                    disabled={currentStepIndex >= steps.length - 1}
                    style={{ flex: 1 }}
                  >
                    Next ▶
                  </button>
                </div>
                <button
                  className="btn btn-outline btn-sm"
                  onClick={handleResetSteps}
                  style={{ width: '100%' }}
                >
                  ↺ Reset
                </button>
              </div>
            ) : (
              <div className="panel-btn-group">
                <div className="panel-btn-row">
                  <button
                    className={`btn btn-sm ${isPlaying ? 'btn-danger' : 'btn-success'}`}
                    onClick={isPlaying ? handlePause : handlePlay}
                    style={{ flex: 1 }}
                  >
                    {isPlaying ? '⏸ Pause' : '▶ Play'}
                  </button>
                  <button
                    className="btn btn-outline btn-sm"
                    onClick={handleResetSteps}
                    style={{ flex: 1 }}
                  >
                    ↺ Reset
                  </button>
                </div>

                {/* Speed Slider */}
                <div className="speed-control">
                  <label className="label">
                    Speed: {speed}ms per step
                  </label>
                  <input
                    type="range"
                    min="100"
                    max="2000"
                    step="100"
                    value={speed}
                    onChange={e => dispatch({ type: 'SET_SPEED', payload: Number(e.target.value) })}
                    className="speed-slider"
                  />
                  <div className="speed-labels">
                    <span>Fast</span>
                    <span>Slow</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </>
      ) : (
        <div className="panel-card empty-state">
          <span className="empty-icon">▶️</span>
          <p>Run a shortest path algorithm first to enable step-by-step visualization.</p>
          <p className="hint-text" style={{ marginTop: '8px' }}>
            Go to "Path" → select source & destination → Find Path
          </p>
        </div>
      )}
    </div>
  );
}
