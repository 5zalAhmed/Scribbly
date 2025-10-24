const STORAGE_KEY = 'whiteboardDrawings';

export const saveDrawing = (drawing) => {
    const drawings = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    drawings.push(drawing);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(drawings));
};

export const loadDrawings = () => {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
};

export const clearDrawings = () => {
    localStorage.removeItem(STORAGE_KEY);
};