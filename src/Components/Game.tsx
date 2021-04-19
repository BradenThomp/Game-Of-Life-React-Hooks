import React, {useEffect, useRef, useState } from 'react';
import useWindowDimentions from './WindowDimensions';
import '../index.css'


/**
 * Draws a Game Of Life cell onto the rendering context.
 * @param context The context to render on.
 * @param i The cell's i position.
 * @param j The cell's j position.
 * @param isAlive States if the cell being rendered is alive or dead.
 * @param cellSize The size of the side of the cell to render.
 * @param scaleFactor The scale factor to apply on rendering.
 * @param xTranslation The X Translation to apply on rendering.
 * @param yTranslation The Y Translation to apply on rendering.
 */
const drawCell = (context: CanvasRenderingContext2D, i: number, j: number, isAlive: boolean, cellSize:number, scaleFactor:number, xTranslation:number, yTranslation:number) => {
  context.fillStyle = isAlive ? '#FFF' : '#000';
  const x = ((i * cellSize) - xTranslation) * scaleFactor;
  const y = ((j * cellSize) - yTranslation) * scaleFactor;
  context.fillRect(x, y, cellSize * scaleFactor, cellSize * scaleFactor);
}

/**
 * Renders all cell's in the Game Of Life onto the canvas.
 * @param canvas The html canvas to render the game onto.
 * @param cells The cells to render on screen.
 * @param cellSize The size that the cells will be rendered with.
 * @param scaleFactor The scale factor to apply when rendering.
 * @param xTranslation The X Translation to apply on rendering.
 * @param yTranslation The Y Translation to apply on rendering.
 */
const renderCells = (canvas: HTMLCanvasElement, cells: Array<Array<boolean>>, cellSize:number, scaleFactor:number, xTranslation:number, yTranslation:number) => {
  const context = canvas.getContext('2d') as CanvasRenderingContext2D;
  context.fillStyle = '#000';
  context.fillRect(0, 0, canvas.width, canvas.height);
  // TODO: Keep a list of live cells only so we don't have to loop through everything.
  // TODO: only iterate over cells on screen.
  for(let i = 0; i < cells.length; i++){
    for(let j = 0; j < cells.length; j++){
      if(cells[i][j]){
        // When completing a full re-rendering we only want to draw live cells.
        drawCell(context, i, j, cells[i][j], cellSize, scaleFactor, xTranslation, yTranslation);
      }
    }
  }
}

/**
 * Gets the number of alive neighbours a cell has.
 * @param x The X location of the cell to check for neighbours. (index value 0, 1, 2...)
 * @param y The Y location of the cell to check for neighbours. (index value 0, 1, 2...)
 * @param cells All the cells on the board.
 * @returns The number of neighbours of the specified cell.
 */
const getNumberOfNeighbours = (x: number, y: number, cells: Array<Array<boolean>>) => {
  const xMin = x - 1 >= 0 ? x - 1 : 0;
  const xMax = x + 1 < cells.length ? x + 1 : cells.length - 1;
  const yMin = y - 1 >= 0 ? y - 1 : 0;
  const yMax = y + 1 < cells[0].length ? y + 1 : cells[0].length - 1;

  let numNeighbours = 0;
  for(let i = xMin; i <= xMax; i++){
    for(let j = yMin; j <= yMax; j++){
      if(i === x && j === y){
        continue;
      }
      if(cells[i][j]){
        numNeighbours++;
      }
    }
  }
  return numNeighbours;
}

/**
 * Calculates the next generation of cells.
 * @param cells The previous (current) generation of cells.
 * @returns The next generation of cells.
 */
const getNextGeneration = ( cells: Array<Array<boolean>>):Array<Array<boolean>> => {
  let nextGeneration = new Array<Array<boolean>>(cells.length);
  for(let i = 0; i < cells.length; i++){
    nextGeneration[i] = new Array<boolean>(cells[i].length);
    for(let j = 0; j < cells[i].length; j++){
      const numNeighbours = getNumberOfNeighbours(i, j, cells);   
      if(numNeighbours === 2 && cells[i][j]){
        nextGeneration[i][j] = true;
      }
      else if(numNeighbours === 3){
        nextGeneration[i][j] = true;
      }
      else{
        nextGeneration[i][j] = false;
      }
    }
  }
  return nextGeneration;
}

/**
 * Panning translation. Can be used for X or Y values.
 * Calculates the translation to perform based on previous and current mouse postions.
 * @param currentPos The current mouse position.
 * @param startingPos The previous mouse position.
 * @param windowSize The size of the window (Height or Width).
 * @param cellSize The size of the cells rendered.
 * @param numCells The number of cells in a row or column.
 * @param scaleFactor The scaling factor used to draw the game.
 * @returns The new translation.
 */
const calculateTranslation = (currentPos: number, startingPos: number, windowSize:number, cellSize:number, numCells: number, scaleFactor: number) =>{
  let translation = -1 * (currentPos - startingPos);
  if(translation < 0){
    translation = 0;
  } 
  const max = -1 * ((windowSize / scaleFactor) - ((numCells - 1) * cellSize));
  if(translation + windowSize > max){
    translation = max - windowSize;
  }
  return translation;
}

interface Props {
  isPaused: boolean;
  isDrawMode: boolean;
  numColumns: number;
  numRows: number;
  cellSize: number;
  borderSize: number
  minScaleFactor: number;
  maxScaleFactor: number;
  tickRate: number;
}

export function Game(props: Props){
  const { height, width } = useWindowDimentions();
  
  const canvasRef = useRef(null);
  
  const [scaleFactor, setScaleFactor] = useState(1.0);
  const [xTranslation, setXTranslation] = useState(((props.numColumns * props.cellSize) / 2) - width);
  const [yTranslation, setYTranslation] = useState(((props.numRows * props.cellSize) / 2) - height);
  const [panStartX, setPanStartX] = useState(0);
  const [panStartY, setPanStartY] = useState(0);
  const [isMouseDown, setIsMouseDown] = useState(false);
  const [previouslyDrawnCell, setPreviouslyDrawnCell] = useState([-1, -1]);
  
  const [cells, setCells] = useState(() => {
    let cells = new Array<Array<boolean>>(props.numColumns);
    for(let i = 0; i < cells.length; i++){
      cells[i] = new Array<boolean>(props.numRows);
      for(let j = 0; j < cells[i].length; j++){
        cells[i][j] = false;
      }
    }
    return cells;
  }); 

  const getCanvas = () => {
    const canvas =  canvasRef.current;
    if(canvas == null){
      throw new Error('Could not get canvas context');
    }

    return canvas;
  }

  const getCanvasContext = () => {
    const canvas = getCanvas();
    return (canvas as HTMLCanvasElement).getContext('2d') as CanvasRenderingContext2D;
  }
  
  const canvasScroll = (event: React.WheelEvent<HTMLCanvasElement>) => {
    const scrollSpeed = 0.01;
    let newScaleFactor = scaleFactor + (event.deltaY * scrollSpeed * -1);
    if(newScaleFactor > props.maxScaleFactor){
      newScaleFactor = props.maxScaleFactor;
      setScaleFactor(newScaleFactor);
      return;
    }
    if(newScaleFactor < props.minScaleFactor){
      newScaleFactor = props.minScaleFactor;
      setScaleFactor(newScaleFactor);
      return;
    }

    setScaleFactor(newScaleFactor);
    const xMax = -1 * ((width / newScaleFactor) - ((props.numColumns - 1) * props.cellSize));
    if(xTranslation + width > xMax){
      setXTranslation(xMax - width);
    }

    const yMax = -1 * ((height / newScaleFactor) - ((props.numRows - 1) * props.cellSize));
    if(yTranslation + height > yMax){
      setYTranslation(yMax - height);
    }
  }

  const canvasMouseMove = (event: React.MouseEvent<HTMLCanvasElement>) => {
    if(isMouseDown && !props.isDrawMode){
      const xTranslation = calculateTranslation(event.clientX, panStartX, width, props.cellSize, props.numColumns, scaleFactor);
      setXTranslation(xTranslation);
      const yTranslation = calculateTranslation(event.clientY, panStartY, height, props.cellSize, props.numRows, scaleFactor);
      setYTranslation(yTranslation);
    }
    else if(isMouseDown && props.isDrawMode){
      let context = getCanvasContext();
      let i = Math.floor(((event.clientX / scaleFactor) + xTranslation) / props.cellSize);
      let j = Math.floor(((event.clientY / scaleFactor) + yTranslation) / props.cellSize);
      if(previouslyDrawnCell[0] === i && previouslyDrawnCell[1] === j){
        return;
      }
      setPreviouslyDrawnCell([i, j]);
      cells[i][j] = !cells[i][j];
      drawCell(context, i, j, cells[i][j], props.cellSize, scaleFactor, xTranslation, yTranslation);
    }
  }

  const canvasMouseDown = (event: React.MouseEvent<HTMLCanvasElement>) => {
    if(props.isDrawMode){
      let context = getCanvasContext();
      let i = Math.floor(((event.clientX / scaleFactor) + xTranslation) / props.cellSize);
      let j = Math.floor(((event.clientY / scaleFactor) + yTranslation) / props.cellSize);
      cells[i][j] = !cells[i][j];
      setPreviouslyDrawnCell([i, j]);
      drawCell(context, i, j, cells[i][j], props.cellSize, scaleFactor, xTranslation, yTranslation);
    }
    else {
      setPanStartX(event.clientX + xTranslation);
      setPanStartY(event.clientY + yTranslation);
    }
    setIsMouseDown(true);
  }

  const canvasMouseUp = (event: React.MouseEvent<HTMLCanvasElement>) => {
    setIsMouseDown(false);
  }

  /**
   * Game renderer. Constantly refreshes.
   */
  useEffect(() => {
    let canvas = getCanvas();
    let animationFrameId : number;
    let tickCount = 0;
    let updateAtTick = props.tickRate;
    
    const tick = () =>{
      tickCount++;
      if(tickCount % updateAtTick === 0){
        tickCount = 0;
        setCells(getNextGeneration(cells));
        renderCells(canvas, cells, props.cellSize, scaleFactor, xTranslation, yTranslation);
      }
      animationFrameId = window.requestAnimationFrame(tick);
    }
    if(!props.isPaused){
      tick();
    }

    return () => {
      window.cancelAnimationFrame(animationFrameId);
    }
  });
  
  /**
   * Refresh Renderer. Called when a rendering value is updated.
   */
  useEffect(() => {
    let canvas = getCanvas();
    renderCells(canvas, cells, props.cellSize, scaleFactor, xTranslation, yTranslation);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [height, width, scaleFactor, xTranslation, yTranslation, props.isPaused]);

  return (
    <canvas className={props.isDrawMode ? 'drawingCursor' : 'panningCursor'} ref={canvasRef} onMouseDown={canvasMouseDown} onMouseUp={canvasMouseUp} onMouseMove={canvasMouseMove} onWheel={canvasScroll} height={height} width={width}/>
  );
}