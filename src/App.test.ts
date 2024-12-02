import { renderHook, act } from '@testing-library/react-hooks';
import { describe, it, expect } from 'vitest';
import { useState, useCallback, useRef } from 'react';

describe('newGame function', () => {
  it('should reset the game state', () => {
    const { result } = renderHook(() => {
      const [score, setScore] = useState<number>(10);
      const [clear, setClear] = useState<boolean>(true);
      const [blockList, setBlockList] = useState<
        {
          rowIndex: number;
          columnIndex: number;
          value: number;
          merged: boolean;
          ID: number;
          toZero: boolean;
        }[]
      >([
        {
          rowIndex: 0,
          columnIndex: 0,
          value: 2,
          merged: false,
          ID: 1,
          toZero: false,
        },
      ]);
      const blockID = useRef<number>(5);

      const getInitialBlockList = () =>
        Array.from({ length: 4 }, (_, rowIndex) =>
          Array.from({ length: 4 }, (_, columnIndex) => ({
            rowIndex,
            columnIndex,
          })),
        )
          .flat()
          .sort(() => Math.random() - 0.5)
          .slice(0, 2)
          .map(({ rowIndex, columnIndex }, ID) => ({
            rowIndex,
            columnIndex,
            value: 1,
            merged: false,
            ID,
            toZero: false,
          }));

      const newGame = useCallback(() => {
        blockID.current = 2;
        setClear(false);
        setBlockList(getInitialBlockList());
        setScore(0);
      }, []);

      return { score, clear, blockList, blockID, newGame };
    });

    act(() => {
      result.current.newGame();
    });

    expect(result.current.score).toBe(0);
    expect(result.current.clear).toBe(false);
    expect(result.current.blockList.length).toBe(2);
    expect(result.current.blockID.current).toBe(2);
  });
});
