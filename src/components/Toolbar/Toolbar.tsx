import React, { useEffect, useRef, useState } from 'react';
import './Toolbar.scss';

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
    'pattern1.jpg',
    'pattern2.jpg',
    'pattern3.jpg',
    'pattern4.jpg',
    'pattern5.jpg',
    'pattern6.jpg',
    'pattern7.jpg',
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
                <img src="src/assets/icons/add.svg" alt="Add" /> Add Shape
            </button>
            <button onClick={() => onSelectTool('select')}>
                <img src="src/assets/icons/select.svg" alt="Select" /> Select
            </button>
            <div className="undo-redo">
                <button onClick={onUndo}>
                    <img src="src/assets/icons/undo.svg" alt="Undo" /> Undo
                </button>
                <button onClick={onRedo}>
                    <img src="src/assets/icons/redo.svg" alt="Redo" /> Redo
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
                        style={{ backgroundImage: `url(/src/assets/images/${pattern})` }}
                    ></div>
                ))}
            </div>
            <button onClick={onDeleteShape}>
                <img src="src/assets/icons/delete.svg" alt="Delete" /> Delete Shape
            </button>
        </div>
    );
};

export default Toolbar;