
import TicTacToe from "@/components/TicTacToe";
import { Link } from "react-router-dom";
import { ClipboardList } from "lucide-react";
import { Button } from "@/components/ui/button";

const Game = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-mint-50 p-6">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold">
            <span className="text-mint-500">Tic</span>
            <span className="text-gray-700">Tac</span>
            <span className="text-mint-500">Toe</span>
          </h1>
          <Link to="/tasks">
            <Button variant="outline" className="gap-2">
              <ClipboardList className="w-4 h-4" />
              Ver Tareas
            </Button>
          </Link>
        </div>
        
        <div className="animate-fade-in max-w-md mx-auto">
          <TicTacToe />
        </div>
      </div>
    </div>
  );
};

export default Game;
