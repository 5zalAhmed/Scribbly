import React, { useState } from 'react';

const BrushControl = ({ onBrushChange }) => {
    const [brushSize, setBrushSize] = useState(5);
    const [brushColor, setBrushColor] = useState('#000000');

    const handleSizeChange = (event) => {
        const size = event.target.value;
        setBrushSize(size);
        onBrushChange(size, brushColor);
    };

    const handleColorChange = (event) => {
        const color = event.target.value;
        setBrushColor(color);
        onBrushChange(brushSize, color);
    };

    return (
        <div className="brush-control">
            <label>
                Brush Size:
                <input
                    type="range"
                    min="1"
                    max="50"
                    value={brushSize}
                    onChange={handleSizeChange}
                />
            </label>
            <label>
                Brush Color:
                <input
                    type="color"
                    value={brushColor}
                    onChange={handleColorChange}
                />
            </label>
        </div>
    );
};

export default BrushControl;