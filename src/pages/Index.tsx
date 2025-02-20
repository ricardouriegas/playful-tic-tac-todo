
import TicTacToe from "@/components/TicTacToe";
import TodoList from "@/components/TodoList";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-mint-50 p-6">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-2">
          <span className="text-mint-500">Play</span> & <span className="text-gray-700">Organize</span>
        </h1>
        <p className="text-gray-600 text-center mb-12">
          Juega al TicTacToe mientras organizas tus tareas
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="animate-fade-in">
            <TicTacToe />
          </div>
          <div className="animate-fade-in [animation-delay:200ms]">
            <TodoList />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
