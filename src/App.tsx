import React, { useState } from 'react';
import { Game } from './Components/Game';
import { NavBar } from './Components/NavBar';

const DEFAULTCELLSIZE = 10;
const DEFAULTBORDERSIZE = 0.25;
const MINSCALEFACTOR = 0.25;
const MAXSCALEFACTOR = 2.0;
const NUMCOLUMNS = 1500;
const NUMROWS = 1000;
const MINTICKRATE = 10;
const MAXTICKRATE = 110;

function App() {
  const [isPaused, setIsPaused] = useState(true);
  const [isDrawMode, setIsDrawMode] = useState(true);
  const [currentTickRate, setCurrentTickRate] = useState(55);

  return (
    <div>
      <NavBar isPaused={isPaused} setIsPaused={setIsPaused} isDrawMode={isDrawMode} setIsDrawMode={setIsDrawMode} minTickRate={MINTICKRATE} maxTickRate={MAXTICKRATE} currentTickRate={currentTickRate} setCurrentTickRate={setCurrentTickRate}/>
      <Game isPaused={isPaused} isDrawMode={isDrawMode} numRows={NUMROWS} numColumns={NUMCOLUMNS} cellSize={DEFAULTCELLSIZE} borderSize={DEFAULTBORDERSIZE} maxScaleFactor={MAXSCALEFACTOR} minScaleFactor={MINSCALEFACTOR} tickRate={currentTickRate}/>
    </div>
  );
}

export default App;
