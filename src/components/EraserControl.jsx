import React from 'react';

const EraserControl = ({ eraserSize, setEraserSize }) => {
    const handleSizeChange = (event) => {
        setEraserSize(event.target.value);
    };

    return (
        <div className="eraser-control">
            <label htmlFor="eraser-size">Eraser Size:</label>
            <input
                type="range"
                id="eraser-size"
                min="1"
                max="100"
                value={eraserSize}
                onChange={handleSizeChange}
            />
            <span>{eraserSize}</span>
        </div>
    );
};

export default EraserControl;