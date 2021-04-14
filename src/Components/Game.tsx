import React, {useEffect, useRef, useState } from 'react';
import useWindowDimentions from './WindowDimensions';

const drawCell = (i: number, j: number, isAlive: boolean, cellSize:number, context: CanvasRenderingContext2D) => {
  context.fillStyle = isAlive ? '#FFF' : '#000';
  context.fillRect(i*cellSize, j*cellSize, cellSize, cellSize);
}

const renderCells = (canvas: HTMLCanvasElement, cells: Array<Array<boolean>>, cellSize:number) => {
  const context = canvas.getContext('2d') as CanvasRenderingContext2D;
  context.fillStyle = '#000';
  context.fillRect(0, 0, canvas.width, canvas.height);
  // TODO: Keep a list of live cells only so we don't have to loop through everything.
  for(let i = 0; i < cells.length; i++){
    if(i * cellSize > canvas.width){
      // Don't render cells off screen;
      break;
    }
    for(let j = 0; j < cells.length; j++){
      if(j * cellSize > canvas.height){
        // Don't render cells off screen;
        break;
      }
      if(cells[i][j]){
        // When completing a full re-rendering we only want to draw live cells.
        drawCell(i, j, cells[i][j], cellSize, context);
      }
    }
  }
}

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

interface Props {
  isPaused: boolean;
  numColumns: number;
  numRows: number;
  cellSize: number;
  borderSize: number
  minScaleFactor: number;
  maxScaleFactor: number;
}

export function Game(props: Props){
  const { height, width } = useWindowDimentions();
  
  const canvasRef = useRef(null);
  
  const [scaleFactor, setScaleFactor] = useState(1.0);
  
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
    }
    if(newScaleFactor < props.minScaleFactor){
      newScaleFactor = props.minScaleFactor;
    }
    setScaleFactor(newScaleFactor);
  }

  const canvasMouseDown = (event: React.MouseEvent<HTMLCanvasElement>) => {
    let context = getCanvasContext();
    const scaledCell = props.cellSize * scaleFactor;
    let i = Math.floor(event.clientX / scaledCell);
    let j = Math.floor(event.clientY / scaledCell);
    cells[i][j] = !cells[i][j];
    drawCell(i, j, cells[i][j], scaledCell, context);
  }

  useEffect(() => {
    let canvas = getCanvas();
    let animationFrameId : number;
    let tickCount = 0;
    let updateAtTick = 20;
    
    const tick = () =>{
      tickCount++;
      if(tickCount % updateAtTick === 0){
        tickCount = 0;
        setCells(getNextGeneration(cells));
        renderCells(canvas, cells, props.cellSize * scaleFactor);
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
  
  useEffect(() => {
    let canvas = getCanvas();
    renderCells(canvas, cells, props.cellSize * scaleFactor);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [height, width, scaleFactor]);

  return (
    <canvas ref={canvasRef} onClick={canvasMouseDown} onWheel={canvasScroll} height={height} width={width}/>
  );
}