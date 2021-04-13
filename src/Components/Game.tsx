import React, { useCallback, useEffect, useRef, useState } from 'react';

interface Props {
  isPaused: boolean;
  width: number;
  height: number;
  cellSize: number;
}

export function Game(props: Props){
  const [cells, setCells] = useState(() => {
    let cells = new Array<Array<boolean>>(props.width);
    for(let i = 0; i < cells.length; i++){
      cells[i] = new Array<boolean>(props.height);
      for(let j = 0; j < cells[i].length; j++){
        cells[i][j] = false;
      }
    }
    return cells;
  }); 

  const canvasRef = useRef(null);

  const getCanvasContext = () => {
    const canvas =  canvasRef.current;
    if(canvas == null){
      throw new Error('Could not get canvas context');
    }
    return (canvas as HTMLCanvasElement).getContext('2d') as CanvasRenderingContext2D;
  }
  
  const canvasMouseDown = (event: React.MouseEvent<HTMLCanvasElement>) =>{
    let context = getCanvasContext();
    let i = Math.floor(event.clientX / props.cellSize);
    let j = Math.floor(event.clientY / props.cellSize);
    cells[i][j] = !cells[i][j];
    drawCell(i, j, cells[i][j], props.cellSize, context);
  }

  const drawCell = useCallback((i: number, j: number, isAlive: boolean, cellSize:number, context: CanvasRenderingContext2D) => {
    const borderWidth = 0.25;
    context.fillStyle = '#808080';
    context.fillRect(i*cellSize, j*cellSize, cellSize, cellSize);
    context.fillStyle = isAlive ? '#FFF' : '#000';
    context.fillRect(i*cellSize + borderWidth, j*cellSize + borderWidth, cellSize - borderWidth*2, cellSize - borderWidth*2);
  }, []);

  const render = useCallback((context: CanvasRenderingContext2D, cells: Array<Array<boolean>>, cellSize:number) => {
    for(let i = 0; i< cells.length; i++){
      for(let j = 0; j < cells.length; j++){
        drawCell(i, j, cells[i][j], cellSize, context);
      }
    }
  }, [drawCell]);

  const getNumberOfNeighbours = useCallback((x: number, y: number, cells: Array<Array<boolean>>) => {
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
  }, []);

  const getNextGeneration = useCallback(( cells: Array<Array<boolean>>):Array<Array<boolean>> => {
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
  }, [getNumberOfNeighbours]);

  useEffect(() => {
    let context = getCanvasContext();
    let animationFrameId : number;
    let tickCount = 0;
    let updateAtTick = 50;
    
    const tick = () =>{
      tickCount++;
      if(tickCount % updateAtTick === 0){
        tickCount = 0;
        setCells(getNextGeneration(cells));
        render(context, cells, props.cellSize);
      }
      animationFrameId = window.requestAnimationFrame(tick);
    }
    if(!props.isPaused){
      tick();
    }

    return () => {
      window.cancelAnimationFrame(animationFrameId);
    }

  }, [render, getNextGeneration, cells, props, setCells]);
  
  useEffect(() => {
    let context = getCanvasContext();
    render(context, cells, props.cellSize);
  }, [render, cells, props]);


  return (
    <canvas ref={canvasRef} onMouseDown={canvasMouseDown} height={props.height * props.cellSize} width={props.width * props.cellSize}/>
  );
}