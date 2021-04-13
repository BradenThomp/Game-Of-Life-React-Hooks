import React, { useState } from 'react';
import './App.css';
import { Game } from './Components/Game';
import { PauseButton } from './Components/PauseButton';

function App() {
  const [isPaused, setIsPaused] = useState(true);

  return (
    <div>
      <Game isPaused={isPaused} height={80} width={160} cellSize={10}/>
      <PauseButton isPaused={isPaused} setIsPaused={setIsPaused}/>
    </div>
  );
}

export default App;
