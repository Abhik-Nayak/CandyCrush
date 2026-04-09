// Candy types and game constants
export const CANDY_COLORS = [
  { name: "red", emoji: "🔴", gradient: "from-red-400 to-red-600", glow: "shadow-red-500/50" },
  { name: "blue", emoji: "🔵", gradient: "from-blue-400 to-blue-600", glow: "shadow-blue-500/50" },
  { name: "green", emoji: "🟢", gradient: "from-green-400 to-green-600", glow: "shadow-green-500/50" },
  { name: "yellow", emoji: "🟡", gradient: "from-yellow-300 to-yellow-500", glow: "shadow-yellow-500/50" },
  { name: "purple", emoji: "🟣", gradient: "from-purple-400 to-purple-600", glow: "shadow-purple-500/50" },
  { name: "orange", emoji: "🟠", gradient: "from-orange-400 to-orange-600", glow: "shadow-orange-500/50" },
] as const;

export const BOARD_SIZE = 8;
export const MATCH_MIN = 3;

export type CandyType = (typeof CANDY_COLORS)[number];

export interface Cell {
  id: string;
  candy: CandyType;
  row: number;
  col: number;
  isMatched: boolean;
  isNew: boolean;
  isFalling: boolean;
}

export type Board = Cell[][];

let idCounter = 0;
export function generateId(): string {
  return `candy-${Date.now()}-${idCounter++}`;
}

export function randomCandy(): CandyType {
  return CANDY_COLORS[Math.floor(Math.random() * CANDY_COLORS.length)];
}

export function createCell(row: number, col: number, candy?: CandyType): Cell {
  return {
    id: generateId(),
    candy: candy || randomCandy(),
    row,
    col,
    isMatched: false,
    isNew: false,
    isFalling: false,
  };
}

export function createBoard(): Board {
  const board: Board = [];
  for (let row = 0; row < BOARD_SIZE; row++) {
    board[row] = [];
    for (let col = 0; col < BOARD_SIZE; col++) {
      // Avoid creating initial matches
      let candy = randomCandy();
      while (createsMatch(board, row, col, candy)) {
        candy = randomCandy();
      }
      board[row][col] = createCell(row, col, candy);
    }
  }
  return board;
}

function createsMatch(board: Board, row: number, col: number, candy: CandyType): boolean {
  // Check horizontal
  if (
    col >= 2 &&
    board[row][col - 1]?.candy.name === candy.name &&
    board[row][col - 2]?.candy.name === candy.name
  ) {
    return true;
  }
  // Check vertical
  if (
    row >= 2 &&
    board[row - 1]?.[col]?.candy.name === candy.name &&
    board[row - 2]?.[col]?.candy.name === candy.name
  ) {
    return true;
  }
  return false;
}

export function isAdjacent(
  r1: number,
  c1: number,
  r2: number,
  c2: number
): boolean {
  return Math.abs(r1 - r2) + Math.abs(c1 - c2) === 1;
}

export function cloneBoard(board: Board): Board {
  return board.map((row) =>
    row.map((cell) => ({ ...cell }))
  );
}

export function swapCells(board: Board, r1: number, c1: number, r2: number, c2: number): Board {
  const newBoard = cloneBoard(board);
  const temp = { ...newBoard[r1][c1] };
  newBoard[r1][c1] = { ...newBoard[r2][c2], row: r1, col: c1 };
  newBoard[r2][c2] = { ...temp, row: r2, col: c2 };
  return newBoard;
}

export function findMatches(board: Board): [number, number][] {
  const matched = new Set<string>();

  // Horizontal matches
  for (let row = 0; row < BOARD_SIZE; row++) {
    for (let col = 0; col <= BOARD_SIZE - MATCH_MIN; col++) {
      const candy = board[row][col].candy.name;
      let count = 1;
      while (col + count < BOARD_SIZE && board[row][col + count].candy.name === candy) {
        count++;
      }
      if (count >= MATCH_MIN) {
        for (let k = 0; k < count; k++) {
          matched.add(`${row},${col + k}`);
        }
      }
    }
  }

  // Vertical matches
  for (let col = 0; col < BOARD_SIZE; col++) {
    for (let row = 0; row <= BOARD_SIZE - MATCH_MIN; row++) {
      const candy = board[row][col].candy.name;
      let count = 1;
      while (row + count < BOARD_SIZE && board[row + count][col].candy.name === candy) {
        count++;
      }
      if (count >= MATCH_MIN) {
        for (let k = 0; k < count; k++) {
          matched.add(`${row + k},${col}`);
        }
      }
    }
  }

  return Array.from(matched).map((s) => {
    const [r, c] = s.split(",").map(Number);
    return [r, c] as [number, number];
  });
}

export function markMatches(board: Board): { board: Board; matchCount: number } {
  const matches = findMatches(board);
  if (matches.length === 0) return { board, matchCount: 0 };

  const newBoard = cloneBoard(board);
  for (const [r, c] of matches) {
    newBoard[r][c].isMatched = true;
  }
  return { board: newBoard, matchCount: matches.length };
}

export function removeMatchesAndDrop(board: Board): Board {
  const newBoard = cloneBoard(board);

  for (let col = 0; col < BOARD_SIZE; col++) {
    // Collect non-matched cells from bottom to top
    const remaining: Cell[] = [];
    for (let row = BOARD_SIZE - 1; row >= 0; row--) {
      if (!newBoard[row][col].isMatched) {
        remaining.push(newBoard[row][col]);
      }
    }

    // Fill column from bottom
    for (let row = BOARD_SIZE - 1; row >= 0; row--) {
      const idx = BOARD_SIZE - 1 - row;
      if (idx < remaining.length) {
        newBoard[row][col] = {
          ...remaining[idx],
          row,
          col,
          isFalling: remaining[idx].row !== row,
        };
      } else {
        // New candy drops from top
        newBoard[row][col] = {
          ...createCell(row, col),
          isNew: true,
          isFalling: true,
        };
      }
    }
  }

  return newBoard;
}

export function clearAnimationFlags(board: Board): Board {
  return board.map((row) =>
    row.map((cell) => ({
      ...cell,
      isNew: false,
      isFalling: false,
      isMatched: false,
    }))
  );
}

export function hasValidMoves(board: Board): boolean {
  for (let row = 0; row < BOARD_SIZE; row++) {
    for (let col = 0; col < BOARD_SIZE; col++) {
      // Try swap right
      if (col < BOARD_SIZE - 1) {
        const swapped = swapCells(board, row, col, row, col + 1);
        if (findMatches(swapped).length > 0) return true;
      }
      // Try swap down
      if (row < BOARD_SIZE - 1) {
        const swapped = swapCells(board, row, col, row + 1, col);
        if (findMatches(swapped).length > 0) return true;
      }
    }
  }
  return false;
}
