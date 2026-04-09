"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import {
  Board,
  createBoard,
  swapCells,
  findMatches,
  markMatches,
  removeMatchesAndDrop,
  clearAnimationFlags,
  isAdjacent,
  hasValidMoves,
  BOARD_SIZE,
} from "@/utils/gameLogic";

export type GamePhase =
  | "idle"
  | "selected"
  | "swapping"
  | "matching"
  | "falling"
  | "gameover";

export interface GameState {
  board: Board;
  score: number;
  moves: number;
  level: number;
  targetScore: number;
  combo: number;
  phase: GamePhase;
  selected: { row: number; col: number } | null;
  hintCells: [number, number][] | null;
  showLevelComplete: boolean;
}

const POINTS_PER_CANDY = 10;
const COMBO_MULTIPLIER = 1.5;
const MOVES_PER_LEVEL = 30;
const BASE_TARGET = 1000;

function getTargetScore(level: number): number {
  return BASE_TARGET + (level - 1) * 500;
}

export function useGameState() {
  const [state, setState] = useState<GameState>(() => ({
    board: createBoard(),
    score: 0,
    moves: MOVES_PER_LEVEL,
    level: 1,
    targetScore: getTargetScore(1),
    combo: 0,
    phase: "idle",
    selected: null,
    hintCells: null,
    showLevelComplete: false,
  }));

  const processingRef = useRef(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const clearTimeouts = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  useEffect(() => {
    return () => clearTimeouts();
  }, [clearTimeouts]);

  const processMatches = useCallback((board: Board, currentCombo: number, currentScore: number, currentMoves: number, level: number, targetScore: number) => {
    const matches = findMatches(board);
    if (matches.length === 0) {
      // No more matches — end cascade
      processingRef.current = false;
      const cleanBoard = clearAnimationFlags(board);

      if (currentScore >= targetScore) {
        setState((prev) => ({
          ...prev,
          board: cleanBoard,
          score: currentScore,
          combo: 0,
          phase: "idle",
          showLevelComplete: true,
        }));
        return;
      }

      if (currentMoves <= 0 || !hasValidMoves(cleanBoard)) {
        setState((prev) => ({
          ...prev,
          board: cleanBoard,
          score: currentScore,
          combo: 0,
          phase: "gameover",
        }));
        return;
      }

      setState((prev) => ({
        ...prev,
        board: cleanBoard,
        score: currentScore,
        combo: 0,
        phase: "idle",
      }));
      return;
    }

    // Mark matches
    const { board: markedBoard, matchCount } = markMatches(board);
    const comboBonus = currentCombo > 0 ? Math.floor(COMBO_MULTIPLIER * currentCombo) : 1;
    const points = matchCount * POINTS_PER_CANDY * comboBonus;
    const newScore = currentScore + points;
    const newCombo = currentCombo + 1;

    setState((prev) => ({
      ...prev,
      board: markedBoard,
      score: newScore,
      combo: newCombo,
      phase: "matching",
    }));

    // After match animation, drop and repeat
    timeoutRef.current = setTimeout(() => {
      const droppedBoard = removeMatchesAndDrop(markedBoard);
      setState((prev) => ({
        ...prev,
        board: droppedBoard,
        phase: "falling",
      }));

      timeoutRef.current = setTimeout(() => {
        const cleanBoard = clearAnimationFlags(droppedBoard);
        processMatches(cleanBoard, newCombo, newScore, currentMoves, level, targetScore);
      }, 350);
    }, 300);
  }, []);

  const handleCellClick = useCallback(
    (row: number, col: number) => {
      if (processingRef.current) return;
      if (state.phase === "gameover") return;

      setState((prev) => {
        if (prev.phase === "idle" || prev.phase === "selected") {
          if (!prev.selected) {
            return { ...prev, selected: { row, col }, phase: "selected", hintCells: null };
          }

          const { row: sr, col: sc } = prev.selected;

          // Clicking same cell deselects
          if (sr === row && sc === col) {
            return { ...prev, selected: null, phase: "idle" };
          }

          // Not adjacent — select new cell
          if (!isAdjacent(sr, sc, row, col)) {
            return { ...prev, selected: { row, col }, phase: "selected" };
          }

          // Adjacent — attempt swap
          const swapped = swapCells(prev.board, sr, sc, row, col);
          const matches = findMatches(swapped);

          if (matches.length === 0) {
            // Invalid swap — swap back visually (just deselect)
            return { ...prev, selected: null, phase: "idle" };
          }

          // Valid swap
          processingRef.current = true;
          const newMoves = prev.moves - 1;

          // Process cascade asynchronously
          setTimeout(() => {
            processMatches(swapped, 0, prev.score, newMoves, prev.level, prev.targetScore);
          }, 50);

          return {
            ...prev,
            board: swapped,
            selected: null,
            moves: newMoves,
            phase: "swapping",
            hintCells: null,
          };
        }
        return prev;
      });
    },
    [state.phase, processMatches]
  );

  const resetGame = useCallback(() => {
    clearTimeouts();
    processingRef.current = false;
    setState({
      board: createBoard(),
      score: 0,
      moves: MOVES_PER_LEVEL,
      level: 1,
      targetScore: getTargetScore(1),
      combo: 0,
      phase: "idle",
      selected: null,
      hintCells: null,
      showLevelComplete: false,
    });
  }, [clearTimeouts]);

  const nextLevel = useCallback(() => {
    clearTimeouts();
    processingRef.current = false;
    const newLevel = state.level + 1;
    setState({
      board: createBoard(),
      score: 0,
      moves: MOVES_PER_LEVEL,
      level: newLevel,
      targetScore: getTargetScore(newLevel),
      combo: 0,
      phase: "idle",
      selected: null,
      hintCells: null,
      showLevelComplete: false,
    });
  }, [clearTimeouts, state.level]);

  const showHint = useCallback(() => {
    if (processingRef.current || state.phase !== "idle") return;

    for (let row = 0; row < BOARD_SIZE; row++) {
      for (let col = 0; col < BOARD_SIZE; col++) {
        if (col < BOARD_SIZE - 1) {
          const swapped = swapCells(state.board, row, col, row, col + 1);
          if (findMatches(swapped).length > 0) {
            setState((prev) => ({
              ...prev,
              hintCells: [
                [row, col],
                [row, col + 1],
              ],
            }));
            return;
          }
        }
        if (row < BOARD_SIZE - 1) {
          const swapped = swapCells(state.board, row, col, row + 1, col);
          if (findMatches(swapped).length > 0) {
            setState((prev) => ({
              ...prev,
              hintCells: [
                [row, col],
                [row + 1, col],
              ],
            }));
            return;
          }
        }
      }
    }
  }, [state.board, state.phase]);

  return {
    ...state,
    handleCellClick,
    resetGame,
    nextLevel,
    showHint,
  };
}
