import React from 'react';
import BrushControl from './BrushControl';
import EraserControl from './EraserControl';
import SortLayersControl from './SortLayersControl';

const Toolbar = () => {
    return (
        <div className="toolbar">
            <BrushControl />
            <EraserControl />
            <SortLayersControl />
        </div>
    );
};

export default Toolbar;