import { type Dispatch, type SetStateAction, useEffect } from 'react';

type blockListType = {
  rowIndex: number;
  columnIndex: number;
  value: number;
  merged: boolean;
  ID: number;
  toZero: boolean;
}[];

type BoardPropsType = {
  score: number;
  setScore: Dispatch<SetStateAction<number>>;
  highScore: number;
  setHighScore: Dispatch<SetStateAction<number>>;
  clear: boolean;
  setClear: Dispatch<SetStateAction<boolean>>;
  blockID: React.MutableRefObject<number>;
  blockList: blockListType;
  setBlockList: Dispatch<SetStateAction<blockListType>>;
  newGame: () => void;
};

const Board = ({
  setScore,
  score,
  setHighScore,
  highScore,
  clear,
  setClear,
  blockID,
  blockList,
  setBlockList,
  newGame,
}: BoardPropsType) => {
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
  let zIndex;

  useEffect(() => {
    newGame();
  }, [newGame]);

  useEffect(() => {
    let unused: { rowIndex: number; columnIndex: number }[] = [];
    let isMoved = false;
    let colList: number[] = [];
    let rowList: number[] = [];
    let maxValue = 1;
    let add = 0;

    let copiedBlockList = blockList.map((block) => {
      block.merged = false;
      colList.push(block.columnIndex);
      rowList.push(block.rowIndex);
      return {
        ...block,
      };
    });

    copiedBlockList = copiedBlockList.filter((dat) => {
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
        copiedBlockList = copiedBlockList.sort(
          (a, b) => a.rowIndex - b.rowIndex,
        );
        copiedBlockList = copiedBlockList.sort(
          (a, b) => a.columnIndex - b.columnIndex,
        );

        // block 이 존재하는 column에 대해서만 실행
        colList.forEach((col) => {
          let settingRow = 0;

          copiedBlockList.forEach((obj, i) => {
            // 모든 block 순회

            if (obj.columnIndex === col && !obj.toZero) {
              // 특정 column의 block 선택

              if (obj.rowIndex - settingRow !== 0) {
                // 움직이는 block이 존재할 때
                isMoved = true;
              }
              obj.rowIndex = settingRow;
              settingRow += 1;
              const next = copiedBlockList[i + 1];

              if (next !== undefined) {
                if (
                  next.columnIndex === col &&
                  next.value === obj.value &&
                  !next.merged
                ) {
                  obj.value += 1;
                  add += 2 ** obj.value;
                  next.rowIndex = obj.rowIndex;
                  next.toZero = true;
                  obj.merged = true;
                  isMoved = true;
                }
              }
            }
          });
        });
      } else if (e.key === 'ArrowDown') {
        // row 기준 ➡️ col 기준 오름차순 정렬
        copiedBlockList = copiedBlockList.sort(
          (a, b) => b.rowIndex - a.rowIndex,
        );
        copiedBlockList = copiedBlockList.sort(
          (a, b) => a.columnIndex - b.columnIndex,
        );

        // block 이 존재하는 column에 대해서만 실행
        colList.forEach((col) => {
          let settingRow = 3;

          copiedBlockList.forEach((obj, i) => {
            // 모든 block 순회

            if (obj.columnIndex === col && !obj.toZero) {
              // 특정 column의 block 선택

              if (settingRow - obj.rowIndex !== 0) {
                // 움직이는 block이 존재할 때
                isMoved = true;
              }
              obj.rowIndex = settingRow;
              settingRow -= 1;
              const next = copiedBlockList[i + 1];
              if (next !== undefined) {
                if (
                  next.columnIndex === col &&
                  next.value === obj.value &&
                  !next.merged
                ) {
                  obj.value += 1;
                  add += 2 ** obj.value;

                  next.rowIndex = obj.rowIndex;
                  next.toZero = true;
                  obj.merged = true;
                  isMoved = true;
                }
              }
            }
          });
        });
      } else if (e.key === 'ArrowRight') {
        // col 기준 ➡️ row 기준 오름차순 정렬
        copiedBlockList = copiedBlockList.sort(
          (a, b) => b.columnIndex - a.columnIndex,
        );
        copiedBlockList = copiedBlockList.sort(
          (a, b) => a.rowIndex - b.rowIndex,
        );

        // block 이 존재하는 row에 대해서만 실행
        rowList.forEach((row) => {
          let settingCol: number = 3;

          copiedBlockList.forEach((obj, i) => {
            // 모든 block 순회

            if (obj.rowIndex === row && !obj.toZero) {
              // 특정 row의 block 선택

              if (settingCol - obj.columnIndex !== 0) {
                // 움직이는 block이 존재할 때
                isMoved = true;
              }
              obj.columnIndex = settingCol;
              settingCol -= 1;
              const next = copiedBlockList[i + 1];
              if (next !== undefined) {
                if (
                  next.rowIndex === row &&
                  next.value === obj.value &&
                  !next.merged
                ) {
                  add += 2 ** obj.value;
                  obj.value += 1;
                  next.columnIndex = obj.columnIndex;
                  next.toZero = true;
                  obj.merged = true;
                  isMoved = true;
                }
              }
            }
          });
        });
      } else if (e.key === 'ArrowLeft') {
        // col 기준 ➡️ row 기준 오름차순 정렬
        copiedBlockList = copiedBlockList.sort(
          (a, b) => a.columnIndex - b.columnIndex,
        );
        copiedBlockList = copiedBlockList.sort(
          (a, b) => a.rowIndex - b.rowIndex,
        );

        // block 이 존재하는 row에 대해서만 실행
        rowList.forEach((row) => {
          let settingCol: number = 0;

          copiedBlockList.forEach((obj, i) => {
            // 모든 block 순회

            if (obj.rowIndex === row && !obj.toZero) {
              // 특정 row의 block 선택

              if (obj.columnIndex - settingCol !== 0) {
                // 움직이는 block이 존재할 때
                isMoved = true;
              }
              obj.columnIndex = settingCol;
              settingCol += 1;
              const next = copiedBlockList[i + 1];
              if (next !== undefined) {
                if (
                  next.rowIndex === row &&
                  next.value === obj.value &&
                  !next.merged
                ) {
                  obj.value += 1;
                  add += 2 ** obj.value;

                  next.columnIndex = obj.columnIndex;
                  next.toZero = true;
                  obj.merged = true;
                  isMoved = true;
                }
              }
            }
          });
        });
      }

      copiedBlockList.forEach((obj) => {
        maxValue = Math.max(maxValue, obj.value - 1);
        if (obj.value === 7) {
          setClear(true);
        }
      });
      Array.from({ length: 16 }, (_, i) => i).forEach((_, index) => {
        unused.push({
          rowIndex: Math.floor(index / 4),
          columnIndex: index % 4,
        });
      });
      unused = unused.filter(
        (dat) =>
          !copiedBlockList.some(
            (block) =>
              block.rowIndex === dat.rowIndex &&
              block.columnIndex === dat.columnIndex,
          ),
      );
      if (isMoved || isMoved) {
        const randomNum = Math.floor(Math.random() * unused.length);
        unused.forEach((block, i) => {
          if (i === randomNum) {
            copiedBlockList.push({
              rowIndex: block.rowIndex,
              columnIndex: block.columnIndex,
              value: Math.min(Math.floor(Math.random() * 3 + 1), maxValue),
              merged: false,
              ID: blockID.current,
              toZero: false,
            });
            blockID.current += 1;
            setBlockList(copiedBlockList);
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
  }, [
    blockID,
    blockList,
    highScore,
    score,
    setBlockList,
    setClear,
    setHighScore,
    setScore,
  ]);
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
                zIndex = obj.ID + 2;
                let delay = '';
                let merge = '';

                if (obj.toZero) {
                  zIndex = 1;
                }
                if (obj.ID === blockID.current - 1) {
                  delay = 'animate-[fadeIn_1s_forwards]';
                }
                if (obj.merged) {
                  merge = 'animate-[grow_0.3s]';
                }

                let colorString = '';
                color.forEach((selectedColor, i) => {
                  if (i === obj.value) {
                    colorString = selectedColor;
                  }
                });

                return (
                  <div key={obj.ID + 500}>
                    <div
                      className={`absolute top-0 left-0 w-[125px] h-[125px] rounded-xl cursor-default transition-all duration-150 ease-in-out origin-center`}
                      style={{
                        transform: `translate(${12 * (obj.columnIndex + 1) + 125 * obj.columnIndex}px, ${12 * (obj.rowIndex + 1) + 125 * obj.rowIndex}px)`,
                        zIndex: zIndex,
                      }}
                      key={obj.ID}
                    >
                      <div
                        className={`flex items-center w-full h-full ${colorString} ${merge} ${delay} rounded-xl cursor-default`}
                      >
                        <p className="w-full text-center text-6xl text-white font-black">
                          {2 ** obj.value}
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
};

export default Board;
