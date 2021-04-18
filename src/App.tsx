import React, { useState } from 'react';
import { Game } from './Components/Game';
import { PauseButton } from './Components/PauseButton';

const DEFAULTCELLSIZE = 10;
const DEFAULTBORDERSIZE = 0.25;
const MINSCALEFACTOR = 0.25;
const MAXSCALEFACTOR = 2.0;
const NUMCOLUMNS = 1000;
const NUMROWS = 1000;

function App() {
  const [isPaused, setIsPaused] = useState(true);

  return (
    <div>
      <Game isPaused={isPaused} numRows={NUMROWS} numColumns={NUMCOLUMNS} cellSize={DEFAULTCELLSIZE} borderSize={DEFAULTBORDERSIZE} maxScaleFactor={MAXSCALEFACTOR} minScaleFactor={MINSCALEFACTOR}/>
      <PauseButton isPaused={isPaused} setIsPaused={setIsPaused}/>
    </div>
  );
}

export default App;
