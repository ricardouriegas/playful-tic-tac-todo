
import TodoList from "@/components/TodoList";
import { Link } from "react-router-dom";
import { Gamepad2 } from "lucide-react";
import { Button } from "@/components/ui/button";

const Tasks = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-mint-50 p-6">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold">
            <span className="text-gray-700">Lista de</span>
            <span className="text-mint-500 ml-2">Tareas</span>
          </h1>
          <Link to="/game">
            <Button variant="outline" className="gap-2">
              <Gamepad2 className="w-4 h-4" />
              Jugar TicTacToe
            </Button>
          </Link>
        </div>
        
        <div className="animate-fade-in max-w-md mx-auto">
          <TodoList />
        </div>
      </div>
    </div>
  );
};

export default Tasks;
