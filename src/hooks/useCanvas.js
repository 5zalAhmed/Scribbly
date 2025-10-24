import { useEffect, useRef, useState } from 'react';

export const useCanvas = () => {
  const canvasRef = useRef(null);
  const ctxRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState('#ffffff');
  const [brushSize, setBrushSize] = useState(4);
  const [mode, setMode] = useState('pen');
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const [snapshot, setSnapshot] = useState(null);
  const [hasDrawing, setHasDrawing] = useState(false);

  const initCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true }); // Enable alpha channel
    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;

    // Set integer dimensions to avoid sub-pixel rendering
    const width = Math.floor(rect.width);
    const height = Math.floor(rect.height);

    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    canvas.width = width * dpr;
    canvas.height = height * dpr;

    // Scale all drawing operations by DPR
    ctx.scale(dpr, dpr);

    // Fill background with solid color
    ctx.fillStyle = '#121212';
    ctx.fillRect(0, 0, width, height);

    // Anti-aliasing settings
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = color;
    ctx.lineWidth = brushSize;
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    ctx.miterLimit = 1;

    ctxRef.current = ctx;
  };

  useEffect(() => {
    initCanvas();
    const onResize = () => initCanvas();
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  useEffect(() => {
    if (!ctxRef.current) return;
    ctxRef.current.strokeStyle = color;
    ctxRef.current.lineWidth = brushSize;
  }, [color, brushSize]);

  const pointerIsPrimary = (e) => {
    if (!e) return false;
    if (e.pointerType === 'mouse') {
      if (typeof e.buttons === 'number') return (e.buttons & 1) === 1;
      return e.button === 0;
    }
    return true;
  };

  const getPointerPos = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  };

  const startDrawing = (e) => {
    if (!pointerIsPrimary(e)) return;
    try { e.preventDefault(); } catch (err) {}
    if (!canvasRef.current.contains(e.target)) return;

    const pos = getPointerPos(e);
    setStartPos(pos);
    setIsDrawing(true);

    const ctx = ctxRef.current;
    if (!ctx) return;

    if (mode === 'eraser') {
        ctx.globalCompositeOperation = 'destination-out';
        ctx.strokeStyle = 'rgba(0,0,0,1)';
    } else {
        ctx.globalCompositeOperation = 'source-over';
        ctx.strokeStyle = color;
    }
    
    ctx.lineWidth = mode === 'eraser' ? Math.max(10, brushSize * 2) : brushSize;

    // Take snapshot for shape drawing
    if (mode !== 'pen' && mode !== 'eraser') {
        const canvas = canvasRef.current;
        setSnapshot(ctx.getImageData(0, 0, canvas.width, canvas.height));
    } else {
        ctx.beginPath();
        ctx.moveTo(pos.x, pos.y);
    }

    try { canvasRef.current.setPointerCapture?.(e.pointerId); } catch (err) {}
    if (!hasDrawing) setHasDrawing(true);
  };

  const draw = (e) => {
    if (!isDrawing) return;
    if (!pointerIsPrimary(e)) return;
    const ctx = ctxRef.current;
    if (!ctx) return;

    try { e.preventDefault(); } catch (err) {}
    const pos = getPointerPos(e);

    if (mode === 'pen' || mode === 'eraser') {
        if (mode === 'eraser') {
            ctx.globalCompositeOperation = 'destination-out';
            ctx.strokeStyle = 'rgba(0,0,0,1)';
        }
        ctx.lineTo(pos.x, pos.y);
        ctx.stroke();
    } else if (snapshot) {
        // Restore snapshot before drawing shape
        ctx.putImageData(snapshot, 0, 0);
        ctx.beginPath();
        ctx.strokeStyle = color;

        switch (mode) {
            case 'rectangle':
                const width = pos.x - startPos.x;
                const height = pos.y - startPos.y;
                ctx.strokeRect(startPos.x, startPos.y, width, height);
                break;
            case 'circle':
                const radius = Math.hypot(pos.x - startPos.x, pos.y - startPos.y);
                ctx.beginPath();
                ctx.arc(startPos.x, startPos.y, radius, 0, Math.PI * 2);
                ctx.stroke();
                break;
            case 'line':
                ctx.beginPath();
                ctx.moveTo(startPos.x, startPos.y);
                ctx.lineTo(pos.x, pos.y);
                ctx.stroke();
                break;
            case 'triangle':
                ctx.beginPath();
                ctx.moveTo(startPos.x + (pos.x - startPos.x) / 2, startPos.y);
                ctx.lineTo(pos.x, pos.y);
                ctx.lineTo(startPos.x, pos.y);
                ctx.closePath();
                ctx.stroke();
                break;
            case 'diamond':
                const centerX = (startPos.x + pos.x) / 2;
                const centerY = (startPos.y + pos.y) / 2;
                ctx.beginPath();
                ctx.moveTo(centerX, startPos.y);
                ctx.lineTo(pos.x, centerY);
                ctx.lineTo(centerX, pos.y);
                ctx.lineTo(startPos.x, centerY);
                ctx.closePath();
                ctx.stroke();
                break;
            default:
                break;
        }
    }
  };

  const stopDrawing = (e) => {
    try { 
        if (e && e.pointerId) canvasRef.current.releasePointerCapture?.(e.pointerId); 
    } catch (err) {}
    
    if (!ctxRef.current) { 
        setIsDrawing(false); 
        return; 
    }

    // Final shape drawing if needed
    if (mode !== 'pen' && mode !== 'eraser' && e) {
        draw(e);
    }

    ctxRef.current.globalCompositeOperation = 'source-over';
    ctxRef.current.closePath();
    setIsDrawing(false);
    setSnapshot(null);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = ctxRef.current;
    if (!canvas || !ctx) return;
    const rect = canvas.getBoundingClientRect();
    ctx.clearRect(0, 0, rect.width, rect.height);
    ctx.fillStyle = '#121212';
    ctx.fillRect(0, 0, rect.width, rect.height);
    setHasDrawing(false);
  };

  return {
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
  };
};

const Whiteboard = () => {
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
    hasDrawing,
    startPos,
    isDrawing
  } = useCanvas();

  const [isDarkMode, setIsDarkMode] = useState(true);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.setAttribute('data-theme', isDarkMode ? 'light' : 'dark');
  };

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  return (
    <div className={`whiteboard-root ${isDarkMode ? 'dark' : 'light'}`}>
      <div className="toolbar">
        <button onClick={clearCanvas}>Clear</button>
        <button onClick={toggleTheme} aria-label={`Switch to ${isDarkMode ? 'light' : 'dark'} mode`}>
          {isDarkMode ? '☀️' : '🌙'}
        </button>
        {/* Add more toolbar buttons as needed */}
      </div>
      <canvas
        ref={canvasRef}
        onPointerDown={startDrawing}
        onPointerMove={draw}
        onPointerUp={stopDrawing}
        className="whiteboard-canvas"
      />
      {/* Add any additional UI elements here */}
    </div>
  );
};

export default Whiteboard;