
import { useState, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { RotateCcw, Users, Monitor } from 'lucide-react';

type CellValue = 'X' | 'O' | null;
type GameState = 'playing' | 'won' | 'draw';
type GameMode = 'pvp' | 'cpu';

const TicTacToe = () => {
  const [board, setBoard] = useState<CellValue[]>(Array(9).fill(null));
  const [isXNext, setIsXNext] = useState(true);
  const [gameState, setGameState] = useState<GameState>('playing');
  const [gameMode, setGameMode] = useState<GameMode | null>(null);
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

  const checkGameState = (squares: CellValue[]) => {
    const winner = checkWinner(squares);
    if (winner) {
      setGameState('won');
      const winMessage = gameMode === 'cpu' 
        ? (winner === 'X' ? '¡Has ganado!' : '¡La computadora ha ganado!')
        : `¡Ha ganado el jugador ${winner}!`;
      toast({
        title: winMessage,
        className: 'bg-mint-500 text-white',
      });
      return true;
    }
    if (isBoardFull(squares)) {
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

  const handleClick = (index: number) => {
    if (board[index] || gameState !== 'playing' || !gameMode) return;
    
    if (gameMode === 'cpu' && !isXNext) return;

    const newBoard = [...board];
    newBoard[index] = isXNext ? 'X' : 'O';
    setBoard(newBoard);
    
    if (!checkGameState(newBoard)) {
      setIsXNext(!isXNext);
    }
  };

  useEffect(() => {
    if (gameMode === 'cpu' && !isXNext && gameState === 'playing') {
      setTimeout(() => {
        const aiMove = getAIMove(board);
        if (aiMove !== -1) {
          const newBoard = [...board];
          newBoard[aiMove] = 'O';
          setBoard(newBoard);
          
          if (!checkGameState(newBoard)) {
            setIsXNext(true);
          }
        }
      }, 500);
    }
  }, [board, isXNext, gameState, gameMode]);

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setIsXNext(true);
    setGameState('playing');
  };

  const selectGameMode = (mode: GameMode) => {
    setGameMode(mode);
    resetGame();
  };

  if (!gameMode) {
    return (
      <div className="w-full max-w-md mx-auto p-6 glass-panel rounded-2xl">
        <h2 className="text-2xl font-semibold mb-6 text-center">Selecciona el modo de juego</h2>
        <div className="space-y-4">
          <Button
            onClick={() => selectGameMode('pvp')}
            className="w-full bg-mint-500 hover:bg-mint-600 text-white h-16"
          >
            <Users className="w-6 h-6 mr-2" />
            Jugador vs Jugador
          </Button>
          <Button
            onClick={() => selectGameMode('cpu')}
            className="w-full bg-mint-500 hover:bg-mint-600 text-white h-16"
          >
            <Monitor className="w-6 h-6 mr-2" />
            Jugador vs Computadora
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto p-6 glass-panel rounded-2xl">
      <div className="mb-4 text-center">
        <h2 className="text-2xl font-semibold mb-2">TicTacToe</h2>
        <p className="text-sm text-gray-600">
          {gameState === 'playing' 
            ? (gameMode === 'cpu' 
                ? (isXNext ? 'Tu turno' : 'Turno de la computadora')
                : `Turno del jugador ${isXNext ? 'X' : 'O'}`)
            : (gameState === 'draw' 
                ? 'Empate' 
                : (gameMode === 'cpu' 
                    ? (checkWinner(board) === 'X' ? '¡Has ganado!' : '¡La computadora ha ganado!')
                    : `¡Ha ganado el jugador ${checkWinner(board)}!`))}
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
              ${cell ? 'bg-white shadow-md' : 'bg-white/90'}
              ${gameState === 'playing' && !cell && (gameMode === 'pvp' || isXNext) ? 'hover:bg-mint-50' : ''}
              ${cell === 'X' ? 'text-mint-600' : 'text-gray-800'}
              border-2 border-mint-100
            `}
            disabled={gameState !== 'playing' || (gameMode === 'cpu' && !isXNext)}
          >
            <span className="animate-scale-in">{cell}</span>
          </button>
        ))}
      </div>
      <div className="space-y-2">
        <Button
          onClick={resetGame}
          className="w-full bg-mint-500 hover:bg-mint-600 text-white"
        >
          <RotateCcw className="w-4 h-4 mr-2" />
          Reiniciar juego
        </Button>
        <Button
          onClick={() => setGameMode(null)}
          variant="outline"
          className="w-full"
        >
          Cambiar modo de juego
        </Button>
      </div>
    </div>
  );
};

export default TicTacToe;
