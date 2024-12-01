import { useCallback, useEffect, useRef, useState } from 'react';

function Board({
  setScore,
  score,
  setHighScore,
  highScore,
}: {
  score: number;
  setScore: React.Dispatch<React.SetStateAction<number>>;
  highScore: number;
  setHighScore: React.Dispatch<React.SetStateAction<number>>;
}) {
  const getInitialBlockList = () =>
    Array.from({ length: 4 }, (_, r) =>
      Array.from({ length: 4 }, (_, c) => ({ r, c })),
    )
      .flat()
      .sort(() => Math.random() - 0.5)
      .slice(0, 2)
      .map(({ r, c }, ID) => ({
        r,
        c,
        v: 1,
        merged: false,
        ID,
        toZero: false,
      }));
  const blockID = useRef<number>(2);

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
  >(getInitialBlockList);

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
  const newGame = useCallback(() => {
    blockID.current = 2;

    setClear(false);
    setBlockList(getInitialBlockList);
    setScore(0);
  }, [setScore]);
  useEffect(() => {
    newGame();
  }, [newGame]);
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
            if (score !== 0) {
              setScore(score + add);
              setHighScore(Math.max(highScore, score + add));
            } else {
              setScore(add);
              setHighScore(add);
            }
          }
        });
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [blockList, highScore, score, setHighScore, setScore]);
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
            {blockList
              .toSorted((b1, b2) => b1.ID - b2.ID)
              .map((obj) => {
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
                  merge = 'animate-[grow_0.3s]';
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
                      className={`absolute top-0 left-0 w-[125px] h-[125px] rounded-xl cursor-default transition-all duration-150 ease-in-out origin-center`}
                      style={{
                        transform: `translate(${12 * (obj.c + 1) + 125 * obj.c}px, ${12 * (obj.r + 1) + 125 * obj.r}px)`,
                        zIndex: z,
                      }}
                      key={obj.ID}
                    >
                      <div
                        className={`flex items-center w-full h-full ${colorString} ${merge} ${delay} rounded-xl cursor-default`}
                      >
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

export default Board;
