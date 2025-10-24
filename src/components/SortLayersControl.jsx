import React, { useContext } from 'react';
import { CanvasContext } from '../context/CanvasContext';

const SortLayersControl = () => {
    const { layers, setLayers } = useContext(CanvasContext);

    const sortLayers = () => {
        const sortedLayers = [...layers].sort((a, b) => a.order - b.order);
        setLayers(sortedLayers);
    };

    return (
        <div className="sort-layers-control">
            <button onClick={sortLayers}>Sort Layers</button>
        </div>
    );
};

export default SortLayersControl;