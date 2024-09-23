import './App.css';

import { useEffect, useRef, useState } from 'react';

// q: console.log(배열); 배열 수정; 을 실행하면 수정된 후의 배열이 log에 찍힘.
// 이는 참조형 자료의 특성인가? 브라우저로 인한 약간의 delay 속에 배열 수정이 먼저 일어나게 되고, 해당 주소만을 불러오는 브라우저는 수정된 이후의 값을 print하는 거?

function App() {
  const [score, setScore] = useState<number>(0);
  const highScore = useRef<number>(0);
  highScore.current = Math.max(highScore.current, score);

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
                  key={highScore.current}
                >
                  {highScore.current}
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
                  setScore(-1);
                }}
              >
                New Game
              </button>
            </div>
          </div>
        </div>
        <Board setScore={setScore} score={score}></Board>
      </div>
    </div>
  );
}

export default App;

function Board({
  setScore,
  score,
}: {
  score: number;
  setScore: React.Dispatch<React.SetStateAction<number>>;
}) {
  const blockID = useRef<number>(2);
  let [a1, b1, a2, b2] = [0, 0, 0, 0];
  while (a1 === a2 && b1 === b2) {
    [a1, b1, a2, b2] = [
      Math.floor(Math.random() * 3 + 1),
      Math.floor(Math.random() * 3 + 1),
      Math.floor(Math.random() * 3 + 1),
      Math.floor(Math.random() * 3 + 1),
    ];
  }
  const [clear, setClear] = useState<boolean>(false);
  const [blockList, setBlockList] = useState<
    {
      r: number;
      c: number;
      v: number;
      merged: boolean;
      ID: number;
      toZero: boolean;
    }[]
  >([
    {
      r: a1,
      c: b1,
      v: 1,
      merged: false,
      ID: 0,
      toZero: false,
    },
    {
      r: a2,
      c: b2,
      v: 1,
      merged: false,
      ID: 1,
      toZero: false,
    },
  ]);

  const color: string[] = [
    'bg-blue-200',
    'bg-blue-300',
    'bg-blue-400',
    'bg-blue-500',
    'bg-blue-600',
    'bg-blue-700',
    'bg-blue-800',
    'bg-blue-900',
  ];
  let z;
  const newGame = () => {
    blockID.current = 2;
    [a1, b1, a2, b2] = [0, 0, 0, 0];
    while (a1 === a2 && b1 === b2) {
      [a1, b1, a2, b2] = [
        Math.floor(Math.random() * 3 + 1),
        Math.floor(Math.random() * 3 + 1),
        Math.floor(Math.random() * 3 + 1),
        Math.floor(Math.random() * 3 + 1),
      ];
    }

    setClear(false);
    setBlockList([
      {
        r: a1,
        c: b1,
        v: 1,
        merged: false,
        ID: 0,
        toZero: false,
      },
      {
        r: a2,
        c: b2,
        v: 1,
        merged: false,
        ID: 1,
        toZero: false,
      },
    ]);
    setScore(0);
  };
  if (score === -1) {
    setTimeout(() => {
      setScore(0);
      newGame();
    }, 100);
  }
  useEffect(() => {
    let unused: { r: number; c: number }[] = [];
    let isMoved1 = false;
    let isMoved2 = false;
    let colList: number[] = [];
    let rowList: number[] = [];
    let maxV = 1;
    let add = 0;

    let copy = blockList.map((block) => {
      block.merged = false;
      colList.push(block.c);
      rowList.push(block.r);
      return {
        ...block,
      };
    });

    copy = copy.filter((dat) => {
      if (!dat.toZero) {
        return dat;
      }
    });

    // block 이 존재하는 column, row list
    colList = [...new Set(colList)];
    rowList = [...new Set(rowList)];

    const handleKeyDown = (e: KeyboardEvent): void => {
      if (e.key === 'ArrowUp') {
        // row 기준 ➡️ col 기준 오름차순 정렬
        copy = copy.sort((a, b) => a.r - b.r);
        copy = copy.sort((a, b) => a.c - b.c);

        // block 이 존재하는 column에 대해서만 실행
        colList.forEach((col) => {
          let done1: boolean = false;
          let done2: boolean = false;

          while (!done1 && !done2) {
            done1 = true;
            done2 = true;
            let settingRow: number = 0;

            copy.forEach((obj, i) => {
              // 모든 block 순회

              if (obj.c === col && !obj.toZero) {
                // 특정 column의 block 선택

                if (obj.r - settingRow !== 0) {
                  // 움직이는 block이 존재할 때
                  done1 = false;
                  isMoved1 = true;
                }
                obj.r = settingRow;
                settingRow += 1;
                const next = copy[i + 1];

                if (next !== undefined) {
                  if (next.c === col && next.v === obj.v && !next.merged) {
                    obj.v += 1;
                    add += 2 ** obj.v;
                    next.r = obj.r;
                    next.toZero = true;
                    obj.merged = true;
                    done2 = false;
                    isMoved2 = true;
                  }
                }
              }
            });
          }
        });
      } else if (e.key === 'ArrowDown') {
        // row 기준 ➡️ col 기준 오름차순 정렬
        copy = copy.sort((a, b) => b.r - a.r);
        copy = copy.sort((a, b) => a.c - b.c);

        // block 이 존재하는 column에 대해서만 실행
        colList.forEach((col) => {
          let done1: boolean = false;
          let done2: boolean = false;

          while (!done1 && !done2) {
            done1 = true;
            done2 = true;
            let settingRow: number = 3;

            copy.forEach((obj, i) => {
              // 모든 block 순회

              if (obj.c === col && !obj.toZero) {
                // 특정 column의 block 선택

                if (settingRow - obj.r !== 0) {
                  // 움직이는 block이 존재할 때
                  done1 = false;
                  isMoved1 = true;
                }
                obj.r = settingRow;
                settingRow -= 1;
                const next = copy[i + 1];
                if (next !== undefined) {
                  if (next.c === col && next.v === obj.v && !next.merged) {
                    obj.v += 1;
                    add += 2 ** obj.v;

                    next.r = obj.r;
                    next.toZero = true;
                    obj.merged = true;
                    done2 = false;
                    isMoved2 = true;
                  }
                }
              }
            });
          }
        });
      } else if (e.key === 'ArrowRight') {
        // col 기준 ➡️ row 기준 오름차순 정렬
        copy = copy.sort((a, b) => b.c - a.c);
        copy = copy.sort((a, b) => a.r - b.r);

        // block 이 존재하는 row에 대해서만 실행
        rowList.forEach((row) => {
          let done1: boolean = false;
          let done2: boolean = false;

          while (!done1 && !done2) {
            done1 = true;
            done2 = true;
            let settingCol: number = 3;

            copy.forEach((obj, i) => {
              // 모든 block 순회

              if (obj.r === row && !obj.toZero) {
                // 특정 row의 block 선택

                if (settingCol - obj.c !== 0) {
                  // 움직이는 block이 존재할 때
                  done1 = false;
                  isMoved1 = true;
                }
                obj.c = settingCol;
                settingCol -= 1;
                const next = copy[i + 1];
                if (next !== undefined) {
                  if (next.r === row && next.v === obj.v && !next.merged) {
                    add += 2 ** obj.v;
                    obj.v += 1;
                    next.c = obj.c;
                    next.toZero = true;
                    obj.merged = true;
                    done2 = false;
                    isMoved2 = true;
                  }
                }
              }
            });
          }
        });
      } else if (e.key === 'ArrowLeft') {
        // col 기준 ➡️ row 기준 오름차순 정렬
        copy = copy.sort((a, b) => a.c - b.c);
        copy = copy.sort((a, b) => a.r - b.r);

        // block 이 존재하는 row에 대해서만 실행
        rowList.forEach((row) => {
          let done1: boolean = false;
          let done2: boolean = false;

          while (!done1 && !done2) {
            done1 = true;
            done2 = true;
            let settingCol: number = 0;

            copy.forEach((obj, i) => {
              // 모든 block 순회

              if (obj.r === row && !obj.toZero) {
                // 특정 row의 block 선택

                if (obj.c - settingCol !== 0) {
                  // 움직이는 block이 존재할 때
                  done1 = false;
                  isMoved1 = true;
                }
                obj.c = settingCol;
                settingCol += 1;
                const next = copy[i + 1];
                if (next !== undefined) {
                  if (next.r === row && next.v === obj.v && !next.merged) {
                    obj.v += 1;
                    add += 2 ** obj.v;

                    next.c = obj.c;
                    next.toZero = true;
                    obj.merged = true;
                    done2 = false;
                    isMoved2 = true;
                  }
                }
              }
            });
          }
        });
      }

      copy.forEach((obj) => {
        maxV = Math.max(maxV, obj.v - 1);
        if (obj.v === 7) {
          setClear(true);
        }
      });
      Array.from({ length: 16 }, (_, i) => i).forEach((_, index) => {
        unused.push({ r: Math.floor(index / 4), c: index % 4 });
      });
      unused = unused.filter(
        (dat) => !copy.some((block) => block.r === dat.r && block.c === dat.c),
      );
      if (isMoved1 || isMoved2) {
        const randomNum = Math.floor(Math.random() * unused.length);
        unused.forEach((block, i) => {
          if (i === randomNum) {
            copy.push({
              r: block.r,
              c: block.c,
              v: Math.min(Math.floor(Math.random() * 3 + 1), maxV),
              merged: false,
              ID: blockID.current,
              toZero: false,
            });
            blockID.current += 1;
            setBlockList(copy);
            setScore(score + add);
          }
        });
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [blockList, score, setScore]);
  return (
    <div className="grid relative grid-cols-4 grid-rows-4 w-[35rem] h-[35rem] p-3 gap-3 rounded-2xl bg-zinc-300 shadow-xl ">
      {clear && (
        <div className="absolute flex flex-col justify-center items-center inset-0 m-2 backdrop-blur-lg rounded-3xl z-[500] duration-300">
          <div className="mb-3 font-bold text-3xl text-white">🔥CLEAR🔥</div>
          <button
            className="w-[10rem] h-10 rounded-lg shadow-xl text-white font-semibold bg-orange-500 hover:bg-orange-600 hover:scale-105 duration-200"
            onClick={newGame}
          >
            New Game
          </button>
        </div>
      )}
      {Array.from({ length: 16 }, (_, i) => i).map((_, index) => {
        return (
          <div
            className="col-span-1 bg-zinc-200 rounded-xl shadow-lg"
            key={index + 2000}
          >
            {blockList.map((obj) => {
              z = obj.ID + 2;
              let delay = '';
              let merge = '';

              if (obj.toZero) {
                z = 1;
              }
              if (obj.ID === blockID.current - 1) {
                delay = 'animate-[fadeIn_1s_forwards]';
              }
              if (obj.merged) {
                merge = '';
              }

              let colorString = '';
              color.forEach((cl, i) => {
                if (i === obj.v) {
                  colorString = cl;
                }
              });

              return (
                <div key={obj.ID + 500}>
                  <div
                    className={`absolute top-0 left-0 w-[125px] h-[125px] ${colorString} rounded-xl cursor-default transition-all duration-150 ease-in-out origin-center ${delay} ${merge}`}
                    style={{
                      transform: `translate(${12 * (obj.c + 1) + 125 * obj.c}px, ${12 * (obj.r + 1) + 125 * obj.r}px)`,
                      zIndex: z,
                    }}
                    key={obj.ID}
                  >
                    <div className="flex items-center w-full h-full">
                      <p className="w-full text-center text-6xl text-white font-black">
                        {2 ** obj.v}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}
