import './App.css';

import { type MutableRefObject, useEffect, useRef, useState } from 'react';

// q: console.log(배열); 배열 수정; 을 실행하면 수정된 후의 배열이 log에 찍힘.
// 이는 참조형 자료의 특성인가? 브라우저로 인한 약간의 delay 속에 배열 수정이 먼저 일어나게 되고, 해당 주소만을 불러오는 브라우저는 수정된 이후의 값을 print하는 거?

function App() {
  return (
    <div className="flex justify-center h-screen w-screen bg-zinc-100">
      <div className="flex flex-col justify-center w-[35rem] h-full gap-6">
        <div className="w-full h-fit">
          <div className="flex justify-between">
            <p className="mb-8 font-black text-7xl text-blue-500">128</p>
            <div className="flex h-full w-fit gap-3">
              <div className="flex flex-col justify-center items-center h-16 w-[5rem] bg-blue-400/95 rounded-xl shadow-xl font-bold">
                <p className="text-md text-white/70">score1</p>
                <p className="text-xl text-white">13</p>
              </div>
              <div className="flex flex-col justify-center items-center h-16 w-[5rem] bg-blue-400/95 rounded-xl shadow-xl font-bold">
                <p className="text-md text-white/70">score2</p>
                <p className="text-xl text-white">15</p>
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
              <button className="w-[7rem] h-10 rounded-lg shadow-xl text-white font-semibold bg-blue-500 hover:bg-blue-600 hover:scale-105 duration-200">
                New Game
              </button>
            </div>
          </div>
        </div>
        <Board></Board>
      </div>
    </div>
  );
}

export default App;

function Board() {
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
  // const [translateX, setTranslateX] = useState([
  //   [0, 0, 0, 0],
  //   [0, 0, 0, 0],
  //   [0, 0, 0, 0],
  //   [0, 0, 0, 0],
  // ]);
  // const [translateY, setTranslateY] = useState([
  //   [0, 0, 0, 0],
  //   [0, 0, 0, 0],
  //   [0, 0, 0, 0],
  //   [0, 0, 0, 0],
  // ]);
  let z;
  useEffect(() => {
    let isMoved1 = false;
    let isMoved2 = false;
    let colList: number[] = [];
    let rowList: number[] = [];
    let maxV = 1;
    const used: number[][] = [];

    let copy = blockList.map((block) => {
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
    // const newX = [...translateX];
    // const newY = [...translateY];
    // newX[a1][b1] = translateX[a1][b1] = 12 * (b1 + 1) + 125 * b1;
    // newX[a2][b2] = translateX[a2][b2] = 12 * (b2 + 1) + 125 * b2;
    // setTranslateX(newX);
    // newY[a1][b1] = translateY[a1][b1] = 12 * (b1 + 1) + 125 * b1;
    // newY[a2][b2] = translateY[a2][b2] = 12 * (b2 + 1) + 125 * b2;
    // setTranslateY(newY);

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

                if (
                  copy[i + 1] !== undefined &&
                  copy[i + 1].c === col &&
                  copy[i + 1].v === obj.v &&
                  !copy[i + 1]?.merged
                ) {
                  obj.v += 1;
                  copy[i + 1].r = obj.r;
                  copy[i + 1].toZero = true;
                  obj.merged = true;
                  done2 = false;
                  isMoved2 = true;
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

                if (
                  copy[i + 1] !== undefined &&
                  copy[i + 1].c === col &&
                  copy[i + 1].v === obj.v &&
                  !copy[i + 1]?.merged
                ) {
                  obj.v += 1;
                  copy[i + 1].r = obj.r;
                  copy[i + 1].toZero = true;
                  obj.merged = true;
                  done2 = false;
                  isMoved2 = true;
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

                if (
                  copy[i + 1] !== undefined &&
                  copy[i + 1].r === row &&
                  copy[i + 1].v === obj.v &&
                  !copy[i + 1]?.merged
                ) {
                  obj.v += 1;
                  copy[i + 1].c = obj.c;
                  copy[i + 1].toZero = true;
                  obj.merged = true;
                  done2 = false;
                  isMoved2 = true;
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

                if (
                  copy[i + 1] !== undefined &&
                  copy[i + 1].r === row &&
                  copy[i + 1].v === obj.v &&
                  !copy[i + 1]?.merged
                ) {
                  obj.v += 1;
                  copy[i + 1].c = obj.c;
                  copy[i + 1].toZero = true;
                  obj.merged = true;
                  done2 = false;
                  isMoved2 = true;
                }
              }
            });
          }
        });
      }

      copy.forEach((obj) => {
        obj.merged = false;
        used.push([obj.r, obj.c]);
        // newX[obj.r][obj.c] = translateX[obj.r][obj.c] =
        //   12 * (obj.c + 1) + 125 * obj.c;
        // setTranslateX(newX);
        // newY[obj.r][obj.c] = translateY[obj.r][obj.c] =
        //   12 * (obj.r + 1) + 125 * obj.r;
        // setTranslateY(newY);
        maxV = Math.max(maxV, obj.v - 1);
      });

      if (isMoved1 || isMoved2) {
        let [r, c] = [
          Math.floor(Math.random() * 4),
          Math.floor(Math.random() * 4),
        ];
        let isUsed = false;
        used.forEach((arr) => {
          if (JSON.stringify(arr) === JSON.stringify([r, c])) {
            isUsed = true;
          }
        });
        while (isUsed) {
          [r, c] = [
            Math.floor(Math.random() * 4),
            Math.floor(Math.random() * 4),
          ];
          isUsed = false;
          used.forEach((arr) => {
            if (JSON.stringify(arr) === JSON.stringify([r, c])) {
              isUsed = true;
            }
          });
        }

        copy.push({
          r: r,
          c: c,
          v: Math.min(Math.floor(Math.random() * 3 + 1), maxV),
          merged: false,
          ID: blockID.current,
          toZero: false,
        });
        blockID.current += 1;
        setBlockList(copy);
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [blockList]);

  return (
    <div className="grid relative grid-cols-4 grid-rows-4 w-[35rem] h-[35rem] p-3 gap-3 rounded-2xl bg-zinc-300 shadow-xl ">
      {Array.from({ length: 16 }, (_, i) => i).map((_, index) => {
        return (
          <div
            className="col-span-1 bg-zinc-200 rounded-xl shadow-lg"
            key={index}
          >
            {blockList.map((obj) => {
              z = Number(obj.ID) + 2;
              let delay = '';

              if (obj.toZero) {
                z = 1;
              }
              if (obj.ID === blockID.current) {
                delay = 'animate-fadeIn';
              }
              let colorString = '';
              color.forEach((cl, i) => {
                if (i === obj.v) {
                  colorString = cl;
                }
              });
              return (
                <div
                  className={`absolute top-0 left-0 w-[125px] h-[125px] ${colorString} rounded-xl cursor-default transition-all duration-150 ease-in-out ${delay}`}
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
              );
            })}
          </div>
        );
      })}
    </div>
  );
}
