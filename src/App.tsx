import './App.css';

import { useState } from 'react';

import Board from './Board';

function App() {
  const [score, setScore] = useState<number>(0);
  const [highScore, setHighScore] = useState<number>(0);

  return (
    <div className="flex justify-center h-screen w-screen bg-zinc-100">
      <div className="flex flex-col justify-center w-[35rem] h-full gap-6">
        <div className="w-full h-fit">
          <div className="flex justify-between">
            <p className="mb-8 font-black text-7xl text-blue-500">128</p>
            <div className="flex h-full w-fit gap-3">
              <div className="flex flex-col justify-center items-center h-16 w-[5rem] bg-blue-400/95 rounded-xl shadow-xl font-bold">
                <p className="text-md text-white/70">SCORE</p>
                <p
                  className="text-xl text-white animate-[ping_0.5s]"
                  key={score}
                >
                  {score}
                </p>
              </div>
              <div className="flex flex-col justify-center items-center h-16 w-[5rem] bg-blue-400/95 rounded-xl shadow-xl font-bold">
                <p className="text-md text-white/70">BEST</p>
                <p
                  className="text-xl text-white animate-[ping_0.5s]"
                  key={highScore}
                >
                  {highScore}
                </p>
              </div>
            </div>
          </div>
          <div className="flex justify-between items-end">
            <div className="text-md text-zinc-400 font-semibold">
              <p>Join the tiles, get to 128!</p>
              <div className="flex gap-3 underline">
                <button>How to play?</button>
                <p className="cursor-default">|</p>
                <button>Give feedback</button>
              </div>
            </div>
            <div>
              <button
                className="w-[7rem] h-10 rounded-lg shadow-xl text-white font-semibold bg-blue-500 hover:bg-blue-600 hover:scale-105 duration-200"
                onClick={() => {
                  setScore(0);
                }}
              >
                New Game
              </button>
            </div>
          </div>
        </div>
        <Board
          setScore={setScore}
          score={score}
          setHighScore={setHighScore}
          highScore={highScore}
        ></Board>
      </div>
    </div>
  );
}

export default App;
