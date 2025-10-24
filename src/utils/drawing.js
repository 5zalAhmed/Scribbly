export const startDrawing = (ctx, x, y) => {
    ctx.beginPath();
    ctx.moveTo(x, y);
};

export const draw = (ctx, x, y) => {
    ctx.lineTo(x, y);
    ctx.stroke();
};

export const stopDrawing = (ctx) => {
    ctx.closePath();
};

export const setStrokeStyle = (ctx, color, width) => {
    ctx.strokeStyle = color;
    ctx.lineWidth = width;
};

export const clearCanvas = (ctx, canvas) => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
};