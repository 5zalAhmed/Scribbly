import React, { createContext, useState } from 'react';

export const CanvasContext = createContext();

export const CanvasProvider = ({ children }) => {
    const [canvasState, setCanvasState] = useState({
        drawings: [],
        currentDrawing: null,
        brushSize: 5,
        eraserSize: 10,
    });

    const addDrawing = (drawing) => {
        setCanvasState((prevState) => ({
            ...prevState,
            drawings: [...prevState.drawings, drawing],
        }));
    };

    const clearCanvas = () => {
        setCanvasState((prevState) => ({
            ...prevState,
            drawings: [],
        }));
    };

    const setCurrentDrawing = (drawing) => {
        setCanvasState((prevState) => ({
            ...prevState,
            currentDrawing: drawing,
        }));
    };

    const setBrushSize = (size) => {
        setCanvasState((prevState) => ({
            ...prevState,
            brushSize: size,
        }));
    };

    const setEraserSize = (size) => {
        setCanvasState((prevState) => ({
            ...prevState,
            eraserSize: size,
        }));
    };

    return (
        <CanvasContext.Provider
            value={{
                canvasState,
                addDrawing,
                clearCanvas,
                setCurrentDrawing,
                setBrushSize,
                setEraserSize,
            }}
        >
            {children}
        </CanvasContext.Provider>
    );
};