
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Trash2, Check } from 'lucide-react';

interface Todo {
  id: string;
  text: string;
  completed: boolean;
}

type FilterType = 'all' | 'active' | 'completed';

const TodoList = () => {
  const [todos, setTodos] = useState<Todo[]>(() => {
    const saved = localStorage.getItem('todos');
    return saved ? JSON.parse(saved) : [];
  });
  const [newTodo, setNewTodo] = useState('');
  const [filter, setFilter] = useState<FilterType>('all');

  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);

  const addTodo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTodo.trim()) return;

    setTodos(prev => [
      {
        id: Date.now().toString(),
        text: newTodo.trim(),
        completed: false
      },
      ...prev
    ]);
    setNewTodo('');
  };

  const toggleTodo = (id: string) => {
    setTodos(prev =>
      prev.map(todo =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const deleteTodo = (id: string) => {
    setTodos(prev => prev.filter(todo => todo.id !== id));
  };

  const filteredTodos = todos.filter(todo => {
    if (filter === 'active') return !todo.completed;
    if (filter === 'completed') return todo.completed;
    return true;
  });

  return (
    <div className="w-full max-w-md mx-auto p-6 glass-panel rounded-2xl">
      <h2 className="text-2xl font-semibold mb-4 text-center">Lista de Tareas</h2>
      
      <form onSubmit={addTodo} className="flex gap-2 mb-4">
        <Input
          type="text"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          placeholder="Nueva tarea..."
          className="flex-1"
        />
        <Button type="submit" className="bg-mint-500 hover:bg-mint-600">
          <Plus className="w-4 h-4" />
        </Button>
      </form>

      <div className="flex gap-2 mb-4">
        {(['all', 'active', 'completed'] as const).map((filterType) => (
          <Button
            key={filterType}
            onClick={() => setFilter(filterType)}
            variant={filter === filterType ? "default" : "outline"}
            className={`flex-1 ${filter === filterType ? 'bg-mint-500 hover:bg-mint-600' : ''}`}
          >
            {filterType === 'all' ? 'Todas' : filterType === 'active' ? 'Activas' : 'Completadas'}
          </Button>
        ))}
      </div>

      <div className="space-y-2">
        {filteredTodos.map(todo => (
          <div
            key={todo.id}
            className={`todo-item flex items-center gap-2 p-3 rounded-lg bg-white shadow-sm
              transition-all duration-200 ${todo.completed ? 'bg-mint-50' : ''}`}
          >
            <Button
              onClick={() => toggleTodo(todo.id)}
              variant="outline"
              size="sm"
              className={`min-w-[2rem] h-8 p-0 rounded-full border ${
                todo.completed 
                  ? 'border-mint-600 text-mint-600 bg-mint-50' 
                  : 'border-gray-300 text-gray-400 hover:border-mint-500 hover:text-mint-500'
              }`}
            >
              <Check className={`w-4 h-4 transition-all ${
                todo.completed ? 'opacity-100' : 'opacity-0'
              }`} />
            </Button>
            <span className={`flex-1 ${todo.completed ? 'line-through text-mint-700' : 'text-gray-700'}`}>
              {todo.text}
            </span>
            <Button
              onClick={() => deleteTodo(todo.id)}
              variant="ghost"
              size="sm"
              className="text-gray-400 hover:text-red-500"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TodoList;
