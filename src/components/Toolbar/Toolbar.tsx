import React, { useEffect, useRef, useState } from 'react';
import './Toolbar.scss';

import IconAdd from '../../assets/icons/add.svg';
import IconDelete from '../../assets/icons/delete.svg';
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
    PatternSeven
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
    const [dragging, setDragging] = useState<boolean>(false);
    const toolbarRef = useRef<HTMLDivElement>(null);
    const [position, setPosition] = useState<{ top: number; left: number }>({ top: 10, left: 10 });

    const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
        if ((e.target as HTMLDivElement).className === 'toolbar-header') {
            setDragging(true);
            document.body.style.cursor = 'grabbing';
        }
    };

    const handleMouseUp = () => {
        setDragging(false);
        document.body.style.cursor = 'default';
    };

    const handleMouseMove = (e: MouseEvent) => {
        if (dragging && toolbarRef.current) {
            setPosition({
                top: e.clientY - toolbarRef.current.clientHeight / 2,
                left: e.clientX - toolbarRef.current.clientWidth / 2,
            });
        }
    };

    useEffect(() => {
        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);

        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };
    }, [dragging]);

    return (
        <div
            className={`toolbar ${dragging ? 'dragging' : ''}`}
            ref={toolbarRef}
            style={{ top: position.top, left: position.left }}
            onMouseDown={handleMouseDown}
        >
            <div className="toolbar-header">
                <span>Toolbar</span>
                <span>:::</span>
            </div>
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
        </div>
    );
};

export default Toolbar;