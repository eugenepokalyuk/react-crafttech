import React, { useState } from 'react';
import './Toolbar.scss';

import IconAdd from '../../assets/icons/add.svg';
import IconCollapse from '../../assets/icons/collapse.svg';
import IconDelete from '../../assets/icons/delete.svg';
import IconExpand from '../../assets/icons/expand.svg';
import IconRedo from '../../assets/icons/redo.svg';
import IconSelect from '../../assets/icons/select.svg';
import IconUndo from '../../assets/icons/undo.svg';

import PatternOne from '../../assets/images/pattern1.jpg';
import PatternTwo from '../../assets/images/pattern2.jpg';
import PatternThree from '../../assets/images/pattern3.jpg';
import PatternFour from '../../assets/images/pattern4.jpg';
import PatternFive from '../../assets/images/pattern5.jpg';
import PatternSix from '../../assets/images/pattern6.jpg';
import PatternSeven from '../../assets/images/pattern7.jpg';

interface ToolbarProps {
    onAddShape: () => void;
    onSelectTool: (tool: string) => void;
    onUndo: () => void;
    onRedo: () => void;
    shapesList: { type: string; label: string }[];
    selectedShapeType: string;
    onShapeTypeChange: (type: string) => void;
    onPatternChange: (pattern: string) => void;
    onDeleteShape: () => void;
}

const patterns = [
    PatternOne,
    PatternTwo,
    PatternThree,
    PatternFour,
    PatternFive,
    PatternSix,
    PatternSeven,
];

const Toolbar: React.FC<ToolbarProps> = ({
    onAddShape,
    onSelectTool,
    onUndo,
    onRedo,
    shapesList,
    selectedShapeType,
    onShapeTypeChange,
    onPatternChange,
    onDeleteShape,
}) => {
    const [collapsed, setCollapsed] = useState<boolean>(false);

    return (
        <>
            <div className={`toolbar ${collapsed ? 'collapsed' : ''}`}>
                <div className="toolbar-header">
                    <span>Toolbar</span>
                    <button className="collapse-btn" onClick={() => setCollapsed(true)}>
                        <img src={IconCollapse} alt="Collapse" />
                    </button>
                </div>
                {!collapsed && (
                    <>
                        <div className="shape-select">
                            <label htmlFor="shape-select">Choose a shape:</label>
                            <select
                                id="shape-select"
                                value={selectedShapeType}
                                onChange={(e) => onShapeTypeChange(e.target.value)}
                            >
                                <option value="">Select</option>
                                {shapesList.map((shape) => (
                                    <option key={shape.type} value={shape.type}>
                                        {shape.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <button onClick={onAddShape}>
                            <img src={IconAdd} alt="Add" /> Add Shape
                        </button>
                        <button onClick={() => onSelectTool('select')}>
                            <img src={IconSelect} alt="Select" /> Select
                        </button>
                        <div className="undo-redo">
                            <button onClick={onUndo}>
                                <img src={IconUndo} alt="Undo" /> Undo
                            </button>
                            <button onClick={onRedo}>
                                <img src={IconRedo} alt="Redo" /> Redo
                            </button>
                        </div>
                        <div className="toolbar-header">
                            Backgrounds
                        </div>
                        <div className="pattern-select">
                            {patterns.map((pattern, index) => (
                                <div
                                    key={index}
                                    className="pattern-circle"
                                    onClick={() => onPatternChange(pattern)}
                                    style={{ backgroundImage: `url(${pattern})` }}
                                ></div>
                            ))}
                        </div>
                        <button onClick={onDeleteShape}>
                            <img src={IconDelete} alt="Delete" /> Delete Shape
                        </button>
                    </>
                )}
            </div>
            {collapsed && (
                <button className="expand-btn" onClick={() => setCollapsed(false)}>
                    <img src={IconExpand} alt="Expand" />
                </button>
            )}
        </>
    );
};

export default Toolbar;