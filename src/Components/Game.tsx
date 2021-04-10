import React, { useCallback, useEffect, useRef, useState } from 'react';

export function Game(){
  const [cells] = useState(() => {
    let cells = new Array<Array<boolean>>(160);
    for(let i = 0; i < cells.length; i++){
      cells[i] = new Array<boolean>(160);
      for(let j = 0; j < cells[i].length; j++){
        cells[i][j] = true;
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
    let i = Math.floor(event.clientX / 5);
    let j = Math.floor(event.clientY / 5);
    cells[i][j] = !cells[i][j];
    drawCell(i, j, cells[i][j], context);
  }

  const drawCell = useCallback((i: number, j: number, isAlive: boolean, context: CanvasRenderingContext2D) => {
    context.fillStyle = isAlive ? '#FFF' : '#000';
    context.fillRect(i*5, j*5, 5, 5);
  }, []);

  const draw = useCallback((context: CanvasRenderingContext2D, cells: Array<Array<boolean>>) => {
    for(let i = 0; i< cells.length; i++){
      for(let j = 0; j < cells.length; j++){
        drawCell(i, j, cells[i][j], context);
      }
    }
  }, [drawCell]);

  useEffect(() => {
    let context = getCanvasContext();
    let animationFrameId : number;
    let tickCount = 0;
    let updateAtTick = 400;
    
    const tick = () =>{
      tickCount++;
      if(tickCount % updateAtTick === 0){
        tickCount = 0;
        for(let i = 0; i < cells.length; i++){
          for(let j = 0; j < cells[i].length; j++){
            cells[i][j] = !cells[i][j];
          }
        }
        draw(context, cells);
      }
      animationFrameId = window.requestAnimationFrame(tick);
    }
    tick();

    return () => {
      window.cancelAnimationFrame(animationFrameId);
    }

  }, [draw, cells]);

  return (
    <canvas ref={canvasRef} onMouseDown={canvasMouseDown} height="800" width="800"/>
  );
}