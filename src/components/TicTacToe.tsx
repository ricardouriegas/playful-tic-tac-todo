
import { useState, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { RotateCcw } from 'lucide-react';

type CellValue = 'X' | 'O' | null;
type GameState = 'playing' | 'won' | 'draw';

const TicTacToe = () => {
  const [board, setBoard] = useState<CellValue[]>(Array(9).fill(null));
  const [isPlayerTurn, setIsPlayerTurn] = useState(true);
  const [gameState, setGameState] = useState<GameState>('playing');
  const { toast } = useToast();

  const checkWinner = (squares: CellValue[]): CellValue | null => {
    const lines = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
      [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
      [0, 4, 8], [2, 4, 6] // diagonals
    ];

    for (const [a, b, c] of lines) {
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return squares[a];
      }
    }
    return null;
  };

  const isBoardFull = (squares: CellValue[]): boolean => {
    return squares.every(square => square !== null);
  };

  const getAIMove = (squares: CellValue[]): number => {
    // Try to win
    for (let i = 0; i < 9; i++) {
      if (!squares[i]) {
        const boardCopy = [...squares];
        boardCopy[i] = 'O';
        if (checkWinner(boardCopy) === 'O') return i;
      }
    }

    // Block player's winning move
    for (let i = 0; i < 9; i++) {
      if (!squares[i]) {
        const boardCopy = [...squares];
        boardCopy[i] = 'X';
        if (checkWinner(boardCopy) === 'X') return i;
      }
    }

    // Take center if available
    if (!squares[4]) return 4;

    // Take any available corner
    const corners = [0, 2, 6, 8];
    const availableCorners = corners.filter(i => !squares[i]);
    if (availableCorners.length > 0) {
      return availableCorners[Math.floor(Math.random() * availableCorners.length)];
    }

    // Take any available side
    const sides = [1, 3, 5, 7];
    const availableSides = sides.filter(i => !squares[i]);
    if (availableSides.length > 0) {
      return availableSides[Math.floor(Math.random() * availableSides.length)];
    }

    return -1;
  };

  const handleClick = (index: number) => {
    if (board[index] || !isPlayerTurn || gameState !== 'playing') return;

    const newBoard = [...board];
    newBoard[index] = 'X';
    setBoard(newBoard);
    setIsPlayerTurn(false);
  };

  useEffect(() => {
    if (!isPlayerTurn && gameState === 'playing') {
      const checkGameState = () => {
        const winner = checkWinner(board);
        if (winner) {
          setGameState('won');
          toast({
            title: winner === 'X' ? '¡Has ganado!' : '¡La computadora ha ganado!',
            className: 'bg-mint-500 text-white',
          });
          return true;
        }
        if (isBoardFull(board)) {
          setGameState('draw');
          toast({
            title: '¡Empate!',
            description: 'El juego ha terminado en empate.',
            className: 'bg-gray-500 text-white',
          });
          return true;
        }
        return false;
      };

      if (!checkGameState()) {
        setTimeout(() => {
          const aiMove = getAIMove(board);
          if (aiMove !== -1) {
            const newBoard = [...board];
            newBoard[aiMove] = 'O';
            setBoard(newBoard);
          }
          setIsPlayerTurn(true);
        }, 500);
      }
    }
  }, [board, isPlayerTurn, gameState]);

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setIsPlayerTurn(true);
    setGameState('playing');
  };

  return (
    <div className="w-full max-w-md mx-auto p-6 glass-panel rounded-2xl">
      <div className="mb-4 text-center">
        <h2 className="text-2xl font-semibold mb-2">TicTacToe</h2>
        <p className="text-sm text-gray-600">
          {gameState === 'playing' 
            ? (isPlayerTurn ? 'Tu turno' : 'Turno de la computadora')
            : (gameState === 'draw' ? 'Empate' : `${checkWinner(board) === 'X' ? '¡Has ganado!' : '¡La computadora ha ganado!'}`)}
        </p>
      </div>
      <div className="grid grid-cols-3 gap-2 mb-4">
        {board.map((cell, index) => (
          <button
            key={index}
            onClick={() => handleClick(index)}
            className={`
              h-24 w-full rounded-lg text-3xl font-bold
              transition-all duration-200 cell-hover
              ${cell ? 'bg-white/60' : 'bg-white/40'}
              ${gameState === 'playing' && !cell && isPlayerTurn ? 'hover:bg-white/50' : ''}
              ${cell === 'X' ? 'text-mint-500' : 'text-gray-700'}
            `}
            disabled={!isPlayerTurn || gameState !== 'playing'}
          >
            <span className="animate-scale-in">{cell}</span>
          </button>
        ))}
      </div>
      <Button
        onClick={resetGame}
        className="w-full bg-mint-500 hover:bg-mint-600 text-white"
      >
        <RotateCcw className="w-4 h-4 mr-2" />
        Reiniciar juego
      </Button>
    </div>
  );
};

export default TicTacToe;
