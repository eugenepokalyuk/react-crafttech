/* eslint-disable @typescript-eslint/no-explicit-any */
import { KonvaEventObject } from 'konva/lib/Node';
import React, { useEffect, useRef, useState } from 'react';
import { Arrow, Circle, Ellipse, Layer, Line, Rect, RegularPolygon, Stage, Star, Text, Transformer } from 'react-konva';
import Toolbar from '../Toolbar/Toolbar';
import './Canvas.scss';

const shapesList = [
    { type: 'rect', label: 'Rectangle' },
    { type: 'circle', label: 'Circle' },
    { type: 'line', label: 'Line' },
    { type: 'ellipse', label: 'Ellipse' },
    { type: 'text', label: 'Text' },
    { type: 'arrow', label: 'Arrow' },
    { type: 'star', label: 'Star' },
    { type: 'polygon', label: 'Polygon' },
];

const Canvas: React.FC = () => {
    const [shapes, setShapes] = useState<any[]>([]);
    const [tool, setTool] = useState<string>('select');
    const [selectedShapeId, setSelectedShapeId] = useState<string | null>(null);
    const [selectedShapeType, setSelectedShapeType] = useState<string>('');
    const [history, setHistory] = useState<any[][]>([]);
    const [historyIndex, setHistoryIndex] = useState<number>(-1);
    const [backgroundPattern, setBackgroundPattern] = useState<string>('pattern1.jpg');
    const stageRef = useRef<any>(null);
    const transformerRef = useRef<any>(null);

    useEffect(() => {
        const stage = stageRef.current;
        const transformer = transformerRef.current;

        if (transformer) {
            const selectedNode = stage.findOne(`#${selectedShapeId}`);
            if (selectedNode) {
                transformer.nodes([selectedNode]);
                transformer.getLayer().batchDraw();
            } else {
                transformer.nodes([]);
                transformer.getLayer().batchDraw();
            }
        }
    }, [selectedShapeId]);

    const handleAddShape = () => {
        if (!selectedShapeType) return;

        const id = `${selectedShapeType}-${shapes.length + 1}`;
        const newShape = {
            id,
            type: selectedShapeType,
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
            zIndex: shapes.length,
        };
        const newShapes = [...shapes, newShape];
        setShapes(newShapes);
        updateHistory(newShapes);
    };

    const handleSelectShape = (_e: KonvaEventObject<MouseEvent>, id: string) => {
        if (tool === 'select') {
            setSelectedShapeId(id);
        }
    };

    const handleStageMouseDown = (e: KonvaEventObject<MouseEvent>) => {
        const clickedOnEmpty = e.target === e.target.getStage();
        if (clickedOnEmpty) {
            setSelectedShapeId(null);
        }
    };

    const handleDragEnd = (e: KonvaEventObject<DragEvent>, id: string) => {
        const newShapes = shapes.map((shape, index) => {
            if (shape.id === id) {
                return {
                    ...shape,
                    x: e.target.x(),
                    y: e.target.y(),
                    zIndex: shapes.length,
                };
            } else {
                return {
                    ...shape,
                    zIndex: index,
                };
            }
        });
        setShapes(newShapes);
        updateHistory(newShapes);
    };

    const handleTransformEnd = (e: KonvaEventObject<Event>, id: string) => {
        const node = e.target;
        const newShapes = shapes.map((shape) => {
            if (shape.id === id) {
                return {
                    ...shape,
                    x: node.x(),
                    y: node.y(),
                    rotation: node.rotation(),
                    scaleX: node.scaleX(),
                    scaleY: node.scaleY(),
                };
            }
            return shape;
        });
        setShapes(newShapes);
        updateHistory(newShapes);
    };

    const handleWheel = (e: any) => {
        e.evt.preventDefault();
        const scaleBy = 1.1;
        const stage = stageRef.current;
        const oldScale = stage.scaleX();
        const mousePointTo = {
            x: stage.getPointerPosition().x / oldScale - stage.x() / oldScale,
            y: stage.getPointerPosition().y / oldScale - stage.y() / oldScale,
        };

        const newScale =
            e.evt.deltaY > 0 ? oldScale * scaleBy : oldScale / scaleBy;
        stage.scale({ x: newScale, y: newScale });

        const newPos = {
            x: -(mousePointTo.x - stage.getPointerPosition().x / newScale) * newScale,
            y: -(mousePointTo.y - stage.getPointerPosition().y / newScale) * newScale,
        };
        stage.position(newPos);
        stage.batchDraw();
    };

    const updateHistory = (newShapes: any[]) => {
        const newHistory = history.slice(0, historyIndex + 1);
        newHistory.push(newShapes);
        setHistory(newHistory);
        setHistoryIndex(newHistory.length - 1);
    };

    const undo = () => {
        if (historyIndex > 0) {
            setShapes(history[historyIndex - 1]);
            setHistoryIndex(historyIndex - 1);
        }
    };

    const redo = () => {
        if (historyIndex < history.length - 1) {
            setShapes(history[historyIndex + 1]);
            setHistoryIndex(historyIndex + 1);
        }
    };

    const handlePatternChange = (pattern: string) => {
        setBackgroundPattern(pattern);
    };

    const handleDeleteShape = () => {
        if (selectedShapeId) {
            const newShapes = shapes.filter(shape => shape.id !== selectedShapeId);
            setShapes(newShapes);
            setSelectedShapeId(null);
            updateHistory(newShapes);
        }
    };

    return (
        <div className="canvas-container" style={{ backgroundImage: `url(src/assets/images/${backgroundPattern})` }}>
            <Toolbar
                onAddShape={handleAddShape}
                onSelectTool={setTool}
                onUndo={undo}
                onRedo={redo}
                shapesList={shapesList}
                selectedShapeType={selectedShapeType}
                onShapeTypeChange={setSelectedShapeType}
                onPatternChange={handlePatternChange}
                onDeleteShape={handleDeleteShape}
            />
            <div className="ruler-horizontal">
                {Array.from({ length: Math.ceil(window.innerWidth / 50) }, (_, i) => (
                    <span key={i}>{i * 50}</span>
                ))}
            </div>
            <div className="ruler-vertical">
                {Array.from({ length: Math.ceil(window.innerHeight / 50) }, (_, i) => (
                    <span key={i}>{i * 50}</span>
                ))}
            </div>
            <Stage
                width={window.innerWidth}
                height={window.innerHeight}
                draggable
                onWheel={handleWheel}
                ref={stageRef}
                className="stage"
                onMouseDown={handleStageMouseDown}
            >
                <Layer>
                    {shapes
                        .sort((a, b) => a.zIndex - b.zIndex)
                        .map((shape) => {
                            switch (shape.type) {
                                case 'rect':
                                    return (
                                        <Rect
                                            key={shape.id}
                                            id={shape.id}
                                            x={shape.x}
                                            y={shape.y}
                                            width={100}
                                            height={100}
                                            fill={selectedShapeId === shape.id ? 'blue' : 'green'}
                                            draggable
                                            onDragEnd={(e) => handleDragEnd(e, shape.id)}
                                            onTransformEnd={(e) => handleTransformEnd(e, shape.id)}
                                            onClick={(e) => handleSelectShape(e, shape.id)}
                                        />
                                    );
                                case 'circle':
                                    return (
                                        <Circle
                                            key={shape.id}
                                            id={shape.id}
                                            x={shape.x}
                                            y={shape.y}
                                            radius={50}
                                            fill={selectedShapeId === shape.id ? 'blue' : 'red'}
                                            draggable
                                            onDragEnd={(e) => handleDragEnd(e, shape.id)}
                                            onTransformEnd={(e) => handleTransformEnd(e, shape.id)}
                                            onClick={(e) => handleSelectShape(e, shape.id)}
                                        />
                                    );
                                case 'line':
                                    return (
                                        <Line
                                            key={shape.id}
                                            id={shape.id}
                                            points={[shape.x, shape.y, shape.x + 100, shape.y]}
                                            stroke={selectedShapeId === shape.id ? 'blue' : 'black'}
                                            draggable
                                            onDragEnd={(e) => handleDragEnd(e, shape.id)}
                                            onTransformEnd={(e) => handleTransformEnd(e, shape.id)}
                                            onClick={(e) => handleSelectShape(e, shape.id)}
                                        />
                                    );
                                case 'ellipse':
                                    return (
                                        <Ellipse
                                            key={shape.id}
                                            id={shape.id}
                                            x={shape.x}
                                            y={shape.y}
                                            radiusX={50}
                                            radiusY={25}
                                            fill={selectedShapeId === shape.id ? 'blue' : 'yellow'}
                                            draggable
                                            onDragEnd={(e) => handleDragEnd(e, shape.id)}
                                            onTransformEnd={(e) => handleTransformEnd(e, shape.id)}
                                            onClick={(e) => handleSelectShape(e, shape.id)}
                                        />
                                    );
                                case 'text':
                                    return (
                                        <Text
                                            key={shape.id}
                                            id={shape.id}
                                            x={shape.x}
                                            y={shape.y}
                                            text="Konva Text"
                                            fontSize={20}
                                            fill={selectedShapeId === shape.id ? 'blue' : 'black'}
                                            draggable
                                            onDragEnd={(e) => handleDragEnd(e, shape.id)}
                                            onTransformEnd={(e) => handleTransformEnd(e, shape.id)}
                                            onClick={(e) => handleSelectShape(e, shape.id)}
                                        />
                                    );
                                case 'arrow':
                                    return (
                                        <Arrow
                                            key={shape.id}
                                            id={shape.id}
                                            points={[shape.x, shape.y, shape.x + 100, shape.y]}
                                            stroke={selectedShapeId === shape.id ? 'blue' : 'black'}
                                            fill={selectedShapeId === shape.id ? 'blue' : 'black'}
                                            draggable
                                            onDragEnd={(e) => handleDragEnd(e, shape.id)}
                                            onTransformEnd={(e) => handleTransformEnd(e, shape.id)}
                                            onClick={(e) => handleSelectShape(e, shape.id)}
                                        />
                                    );
                                case 'star':
                                    return (
                                        <Star
                                            key={shape.id}
                                            id={shape.id}
                                            x={shape.x}
                                            y={shape.y}
                                            numPoints={5}
                                            innerRadius={20}
                                            outerRadius={40}
                                            fill={selectedShapeId === shape.id ? 'blue' : 'red'}
                                            draggable
                                            onDragEnd={(e) => handleDragEnd(e, shape.id)}
                                            onTransformEnd={(e) => handleTransformEnd(e, shape.id)}
                                            onClick={(e) => handleSelectShape(e, shape.id)}
                                        />
                                    );
                                case 'polygon':
                                    return (
                                        <RegularPolygon
                                            key={shape.id}
                                            id={shape.id}
                                            x={shape.x}
                                            y={shape.y}
                                            sides={6}
                                            radius={50}
                                            fill={selectedShapeId === shape.id ? 'blue' : 'orange'}
                                            draggable
                                            onDragEnd={(e) => handleDragEnd(e, shape.id)}
                                            onTransformEnd={(e) => handleTransformEnd(e, shape.id)}
                                            onClick={(e) => handleSelectShape(e, shape.id)}
                                        />
                                    );
                                default:
                                    return null;
                            }
                        })}
                    <Transformer ref={transformerRef} />
                </Layer>
            </Stage>
        </div>
    );
};

export default Canvas;