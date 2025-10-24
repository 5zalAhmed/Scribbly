import React, { useState, useEffect } from 'react';
import { useCanvas } from '../hooks/useCanvas';
import '../styles/whiteboard.css';

const SHAPES = {
  pen: { icon: '✏️', name: 'Pen' },
  eraser: { icon: '🧽', name: 'Eraser' },
  rectangle: { icon: '□', name: 'Rectangle' },
  circle: { icon: '○', name: 'Circle' },
  line: { icon: '।', name: 'Line' },
  triangle: { icon: '△', name: 'Triangle' },
  diamond: { icon: '◇', name: 'Diamond' },
  arrow: { icon: '➜', name: 'Arrow' },
  star: { icon: '☆', name: 'Star' }
};

const Whiteboard = () => {
  const [isToolbarOpen, setIsToolbarOpen] = useState(false);
  const {
    canvasRef,
    startDrawing,
    draw,
    stopDrawing,
    clearCanvas,
    setColor,
    setBrushSize,
    setMode,
    mode,
    color,
    brushSize,
    hasDrawing
  } = useCanvas();

  const [showWelcome, setShowWelcome] = useState(true);
  useEffect(() => { if (hasDrawing) setShowWelcome(false); }, [hasDrawing]);

  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') setIsToolbarOpen(false); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  return (
    <div className="whiteboard-root">
      {showWelcome && (
        <div className="welcome-overlay" aria-hidden={!showWelcome}>
          <h1>Welcome to Faizal Dashboard</h1>
          <p>Start drawing to begin</p>
        </div>
      )}

      <button
        className="menu-toggle"
        onClick={() => setIsToolbarOpen((s) => !s)}
        aria-expanded={isToolbarOpen}
        aria-label="Toggle tools"
      >
        {isToolbarOpen ? '✕' : '☰'}
      </button>

      <aside className={`toolbar ${isToolbarOpen ? 'open' : 'closed'}`} role="dialog" aria-hidden={!isToolbarOpen}>
        <div className="tools-wrapper">
          <div className="tool-group">
            <div className="tool-group-title">Tools</div>
            <div className="tool-buttons">
              <button
                title="Pen"
                onClick={() => setMode('pen')}
                className={`tool-btn ${mode === 'pen' ? 'active' : ''}`}
              >
                ✏️
              </button>
              <button
                title="Eraser"
                onClick={() => setMode('eraser')}
                className={`tool-btn ${mode === 'eraser' ? 'active' : ''}`}
              >
                🧽
              </button>
            </div>
          </div>

          <div className="tool-group">
            <div className="tool-group-title">Shapes</div>
            <div className="tool-buttons">
              {Object.entries(SHAPES)
                .filter(([k]) => !['pen', 'eraser'].includes(k))
                .map(([key, s]) => (
                  <button
                    key={key}
                    title={s.name}
                    onClick={() => setMode(key)}
                    className={`tool-btn ${mode === key ? 'active' : ''}`}
                  >
                    {s.icon}
                  </button>
                ))}
            </div>
          </div>

          <div className="tool-group">
            <div className="tool-group-title">Style</div>
            <div className="color-section">
              <div className="color-presets">
                {[
                  '#FFB3BA', // pastel pink
                  '#BAFFC9', // pastel green
                  '#BAE1FF', // pastel blue
                  '#FFFFBA', // pastel yellow
                  '#FFE4BA', // pastel orange
                ].map((presetColor) => (
                  <button
                    key={presetColor}
                    className={`color-preset ${presetColor === color ? 'active' : ''}`}
                    style={{ '--preset-color': presetColor }}
                    onClick={() => setColor(presetColor)}
                    title={presetColor}
                  />
                ))}
              </div>
              <div className="color-picker-wrapper">
                <div className="color-display" style={{ '--selected-color': color }}>
                  <input
                    type="color"
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                    className="color-input"
                    aria-label="Choose custom color"
                  />
                </div>
              </div>
            </div>
            <div className="size-control">
              <input
                className="brush-size"
                type="range"
                min="1"
                max="50"
                value={brushSize}
                onChange={(e) => setBrushSize(parseInt(e.target.value, 10))}
              />
              <div className="size-label">{brushSize}px</div>
            </div>
          </div>

          <div className="tool-group">
            <button className="clear-btn" onClick={clearCanvas}>Clear Canvas</button>
          </div>
        </div>
      </aside>

      <canvas
        ref={canvasRef}
        className="canvas"
        onPointerDown={startDrawing}
        onPointerMove={draw}
        onPointerUp={stopDrawing}
        onPointerCancel={stopDrawing}
        onPointerLeave={stopDrawing}
        onContextMenu={(e) => e.preventDefault()}
      />
    </div>
  );
};

export default Whiteboard;