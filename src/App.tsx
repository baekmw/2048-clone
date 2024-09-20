import './App.css';

import {
  type MutableRefObject,
  type RefObject,
  useEffect,
  useRef,
  useState,
} from 'react';

// q: console.log(배열); 배열 수정; 을 실행하면 수정된 후의 배열이 log에 찍힘.
// 이는 참조형 자료의 특성인가? 브라우저로 인한 약간의 delay 속에 배열 수정이 먼저 일어나게 되고, 해당 주소만을 불러오는 브라우저는 수정된 이후의 값을 print하는 거?

function App() {
  const [blockList, setBlockList] = useState<
    { r: number; c: number; v: number; ref; deltaRow: number }[]
  >([
    {
      r: Math.floor(Math.random() * 4),
      c: Math.floor(Math.random() * 4),
      v: 1,
      ref: useRef(null),
      deltaRow: 0,
    },
    {
      r: Math.floor(Math.random() * 4),
      c: Math.floor(Math.random() * 4),
      v: 1,
      ref: useRef(null),
      deltaRow: 0,
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

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent): void => {
      const key = e.key;
      if (key === 'ArrowUp') {
        let colList: number[] = [];
        let copy = blockList.map((block) => {
          colList.push(block.c);
          return {
            ...block,
            ref: block.ref,
          };
        });
        copy = copy.sort((a, b) => a.r - b.r);
        colList = [...new Set(colList)];

        colList.forEach((col) => {
          let done1: boolean = false;
          let done2: boolean = false;

          while (!done1 || !done2) {
            done2 = true;
            let settingRow: number = 0;
            const values: number[] = [];
            copy.forEach((obj) => {
              if (obj.c === col) {
                obj.deltaRow += obj.r - settingRow;
                if (obj.r - settingRow === 0) {
                  done1 = true;
                }
                obj.r = settingRow;
                settingRow += 1;
                values.push(obj.v);
              }
            });
            values.forEach((v, i) => {
              if (values[i + 1] !== undefined && values[i + 1] === v) {
                copy.forEach((obj) => {
                  if (obj.r === i) {
                    obj.v += 1;
                  } else if (obj.r === i + 1) {
                    obj.v = 0;
                  }
                });
                done2 = false;
              }
            });
          }
        });
        copy = copy.map((dat) => {
          if (dat.v !== 0) {
            return dat;
          }
        });
        setBlockList(copy);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [blockList]);

  // // const [board, setBoard] = useState<number[][]>([
  // //   [0, 0, 1, 0],
  // //   [0, 0, 0, 0],
  // //   [0, 0, 0, 0],
  // //   [0, 0, 2, 0],
  // // ]);
  // // const boardCol: [][] = [[], [], [], []];
  // // boardCol.forEach((col, i) => {
  // //   col.push(board.map((row): number => row[i]));
  // // });

  // // useEffect(() => {
  // //   const handleKeyDown = (e: KeyboardEvent): void => {
  // //     const key = e.key;
  // //     if (key === 'ArrowUp') {
  // //       // up arrow

  // //       const copy = board.map((row) => [...row]); // 2차원 배열의 깊은 복사
  // //       const colArray = [[], [], [], []];
  // //       colArray = copy.map((row) => {
  // //         // 각 column을 따로 보기로 함.

  // //         const colArray: Array<number> = [3, 2, 1, 0].map((r) => {
  // //           // 해당 column에 대한 세로 모양 배열의 선언

  // //           const row = copy[r];

  // //           // 이하 구문은 row, row[col]이 undefined일 가능성이 있다는 typescript를 달래려는 노력
  // //           if (row !== undefined && row[col] !== undefined) {
  // //             return row[col];
  // //           } else {
  // //             return 0;
  // //           }
  // //         });

  // //         let done = false;
  // //         while (!done) {
  // //           // 근접한 두 값을 비교하여 이동 혹은 더할 것인데, 이러한 연산이 모두 완료될 때까지 반복한다.

  // //           done = true;

  // //           [3, 2, 1].forEach((i) => {
  // //             // colArray를 역으로 순회하며 두 값씩 비교하여 계산
  // //             let blockNow = colArray[i];
  // //             const blockComp = colArray[i - 1];
  // //             if (blockComp !== undefined && blockNow !== undefined) {
  // //               if (blockNow < blockComp && blockNow === 0) {
  // //                 // 빈 칸을 건너뛰어 위로 올리기

  // //                 [colArray[i], colArray[i - 1]] = [blockComp, blockNow];
  // //                 done = false;
  // //               } else if (blockNow === blockComp && blockNow !== 0) {
  // //                 // 같은 수는 더하기

  // //                 blockNow += 1;
  // //                 colArray[i] = blockNow;
  // //                 colArray[i - 1] = 0;
  // //               }
  // //             }
  // //           });
  // //         }

  // //         [0, 1, 2, 3].forEach((i) => {
  // //           // colArray는 이 반복문 속의 column에 대해서만 정의된 것이므로, 반복문 안에서 복사본을 수정해야 한다.

  // //           if (copy[i] !== undefined) {
  // //             const block = colArray[3 - i];
  // //             if (block !== undefined) {
  // //               copy[i][col] = block;
  // //             }
  // //           }
  // //         });
  // //         // col array를 실제 state에 반영해야 함.
  // //       });
  // //       let [i, j] = [
  // //         Math.floor(Math.random() * 4),
  // //         Math.floor(Math.random() * 4),
  // //       ];

  // //       // undefined type error 해결 구문

  // //       if (Array.isArray(copy[i])) {
  // //         while (copy[i][j] !== 0) {
  // //           [i, j] = [
  // //             Math.floor(Math.random() * 4),
  // //             Math.floor(Math.random() * 4),
  // //           ];
  // //         }

  // //         copy[i][j] = 1;
  // //       }
  // //       setBoard(copy);
  // //     } else if (key === 'ArrowDown') {
  // //       // down arrow
  // //       const copy = board.map((row) => [...row]); // 2차원 배열의 깊은 복사

  // //       [0, 1, 2, 3].forEach((col) => {
  // //         // 각 column을 따로 보기로 함.

  // //         const colArray: Array<number> = [3, 2, 1, 0].map((r) => {
  // //           // 해당 column에 대한 세로 모양 배열의 선언

  // //           const row = copy[r];

  // //           // 이하 구문은 row, row[col]이 undefined일 가능성이 있다는 typescript를 달래려는 노력
  // //           if (row !== undefined && row[col] !== undefined) {
  // //             return row[col];
  // //           } else {
  // //             return 0;
  // //           }
  // //         });

  // //         let done = false;
  // //         while (!done) {
  // //           // 근접한 두 값을 비교하여 이동 혹은 더할 것인데, 이러한 연산이 모두 완료될 때까지 반복한다.

  // //           done = true;

  // //           [0, 1, 2].forEach((i) => {
  // //             // colArray를 역으로 순회하며 두 값씩 비교하여 계산
  // //             let blockNow = colArray[i];
  // //             const blockComp = colArray[i + 1];
  // //             if (blockComp !== undefined && blockNow !== undefined) {
  // //               if (blockNow < blockComp && blockNow === 0) {
  // //                 // 빈 칸을 건너뛰어 위로 올리기

  // //                 [colArray[i], colArray[i + 1]] = [blockComp, blockNow];
  // //                 done = false;
  // //               } else if (blockNow === blockComp && blockNow !== 0) {
  // //                 // 같은 수는 더하기

  // //                 blockNow += 1;
  // //                 colArray[i] = blockNow;
  // //                 colArray[i + 1] = 0;
  // //               }
  // //             }
  // //           });
  // //         }

  // //         [0, 1, 2, 3].forEach((i) => {
  // //           // colArray는 이 반복문 속의 column에 대해서만 정의된 것이므로, 반복문 안에서 복사본을 수정해야 한다.

  // //           if (copy[i] !== undefined) {
  // //             const block = colArray[3 - i];
  // //             if (block !== undefined) {
  // //               copy[i][col] = block;
  // //             }
  // //           }
  // //         });
  // //         // col array를 실제 state에 반영해야 함.
  // //       });
  // //       let [i, j] = [
  // //         Math.floor(Math.random() * 4),
  // //         Math.floor(Math.random() * 4),
  // //       ];

  // //       // undefined type error 해결 구문

  // //       if (Array.isArray(copy[i])) {
  // //         while (copy[i][j] !== 0) {
  // //           [i, j] = [
  // //             Math.floor(Math.random() * 4),
  // //             Math.floor(Math.random() * 4),
  // //           ];
  // //         }

  // //         copy[i][j] = 1;
  // //       }
  // //       setBoard(copy);
  // //     } else if (key === 'ArrowRight') {
  // //       // right arrow
  // //       let copy = Array.from(
  // //         { length: 4 },
  // //         () => Array(4).fill(0) as number[],
  // //       );
  // //       // rows와 cols에 맞게 배열을 초기화 (예를 들어 4x4 배열이라면 Array(4).fill(0)과 같은 방식으로 초기화)

  // //       copy = board.map((row) => [...row]); // 2차원 배열의 깊은 복사

  // //       [0, 1, 2, 3].forEach((row) => {
  // //         // 각 column을 따로 보기로 함.

  // //         let done = false;
  // //         while (!done) {
  // //           // 근접한 두 값을 비교하여 이동 혹은 더할 것인데, 이러한 연산이 모두 완료될 때까지 반복한다.

  // //           done = true;

  // //           [3, 2, 1].forEach((i) => {
  // //             // colArray를 역으로 순회하며 두 값씩 비교하여 계산
  // //             let blockNow = copy[row][i];
  // //             const blockComp = copy[row][i - 1];
  // //             if (blockComp !== undefined && blockNow !== undefined) {
  // //               if (blockNow < blockComp && blockNow === 0) {
  // //                 // 빈 칸을 건너뛰어 위로 올리기

  // //                 [copy[row][i], copy[row][i - 1]] = [blockComp, blockNow];
  // //                 done = false;
  // //               } else if (blockNow === blockComp && blockNow !== 0) {
  // //                 // 같은 수는 더하기

  // //                 blockNow += 1;
  // //                 copy[row][i] = blockNow;
  // //                 copy[row][i - 1] = 0;
  // //               }
  // //             }
  // //           });
  // //         }
  // //         // col array를 실제 state에 반영해야 함.
  // //       });
  // //       let [i, j] = [
  // //         Math.floor(Math.random() * 4),
  // //         Math.floor(Math.random() * 4),
  // //       ];

  // //       // undefined type error 해결 구문

  // //       if (Array.isArray(copy[i])) {
  // //         while (copy[i][j] !== 0) {
  // //           [i, j] = [
  // //             Math.floor(Math.random() * 4),
  // //             Math.floor(Math.random() * 4),
  // //           ];
  // //         }

  // //         copy[i][j] = 1;
  // //       }
  // //       setBoard(copy);
  // //     } else if (key === 'ArrowLeft') {
  // //       // left arrow
  // //     }
  // //   };
  // //   window.addEventListener('keydown', handleKeyDown);
  // //   return () => {
  // //     window.removeEventListener('keydown', handleKeyDown);
  // //   };
  // // }, [board]);

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
        <div className="grid grid-cols-4 grid-rows-4 w-[35rem] h-[35rem] p-3 gap-3 rounded-2xl bg-zinc-300 shadow-xl">
          {Array.from({ length: 16 }, (_, i) => i).map((_, index) => {
            return (
              <div
                className="col-span-1 relative bg-zinc-200 rounded-xl shadow-lg"
                key={index}
              >
                {index}
                {blockList.map((obj, j) => {
                  if (obj.r === Math.floor(index / 4) && obj.c === index % 4) {
                    let colorString = '';
                    color.forEach((cl, i) => {
                      if (i + 1 === obj.v) {
                        colorString = cl;
                      }
                    });
                    return (
                      <div
                        className={`absolute inset-0 rounded-xl ${colorString} cursor-default animate-fadeIn`}
                        key={j}
                      >
                        <div className="flex items-center w-full h-full">
                          <p className="w-full text-center text-6xl text-white font-black">
                            {2 ** obj.v}
                          </p>
                          {Math.floor(index / 4)},{index % 4}, {obj.r}, {obj.c},{' '}
                          {JSON.stringify(obj)}
                        </div>
                      </div>
                    );
                  }
                })}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default App;
