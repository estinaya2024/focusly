import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, Check, ListTodo, Sparkle } from 'lucide-react';
import penguinImg from '../assets/penguin.png';

interface Todo {
  id: string;
  text: string;
  completed: boolean;
}

const TodoList: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>(() => {
    const saved = localStorage.getItem('focus-todos');
    return saved ? JSON.parse(saved) : [
      { id: '1', text: 'Initialize neural sanctuary 🌿', completed: true },
      { id: '2', text: 'Complete aesthetic transition ✨', completed: false }
    ];
  });
  const [input, setInput] = useState('');

  useEffect(() => {
    localStorage.setItem('focus-todos', JSON.stringify(todos));
  }, [todos]);

  const addTodo = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      setTodos([{ id: Date.now().toString(), text: input.trim(), completed: false }, ...todos]);
      setInput('');
    }
  };

  const toggleTodo = (id: string) => {
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  const deleteTodo = (id: string) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  const allDone = todos.length > 0 && todos.every(t => t.completed);

  return (
    <div className="hud-panel h-full flex flex-col p-6 gap-6 border-white/10">

      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/5 pb-5">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 flex items-center justify-center bg-white text-black rounded-xl shadow-lg">
            <ListTodo size={16} strokeWidth={3} />
          </div>
          <div>
            <h3 className="hud-mono !text-[9px] !text-black tracking-widest">Focus Objectives</h3>
            <div className="flex items-center gap-2">
              <p className="hud-mono !text-[7px]">
                {todos.filter(t => !t.completed).length} Pending
              </p>
              {todos.some(t => t.completed) && (
                <button 
                  onClick={() => setTodos(todos.filter(t => !t.completed))}
                  className="hud-mono !text-[7px] text-red-500/60 hover:text-red-500 transition-colors lowercase"
                >
                  • Clear Completed
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Mascot */}
        <div className="w-12 h-12 relative character-companion">
          <img
            src={penguinImg}
            alt="Mascot"
            className={`w-full h-full object-contain transition-all duration-700 ${allDone ? 'scale-110' : 'opacity-80'}`}
          />
        </div>
      </div>

      {/* Input Section */}
      <form onSubmit={addTodo} className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="New initiative..."
          className="hud-input !py-2.5 !text-xs flex-1"
        />
        <button type="submit" className="hud-btn hud-btn-primary !p-2 rounded-xl h-10 w-10">
          <Plus size={18} />
        </button>
      </form>

      {/* Todo Items */}
      <div className="flex-1 overflow-y-auto custom-scrollbar pr-1 flex flex-col gap-1.5 relative min-h-[150px]">
        <AnimatePresence mode="popLayout">
          {todos.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center"
            >
              <Sparkle size={24} className="text-white/5 mb-3" />
              <p className="hud-mono !text-[8px]">All Clear • Nature Reclaimed</p>
            </motion.div>
          ) : (
            todos.map(todo => (
              <motion.div
                layout
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                key={todo.id}
                className={`group flex items-center gap-3 p-3 rounded-xl border border-white/5 transition-all ${todo.completed
                  ? 'bg-transparent opacity-20'
                  : 'bg-white/[0.03] hover:bg-white/[0.08] hover:border-white/10 shadow-sm'
                  }`}
              >
                <button
                  onClick={() => toggleTodo(todo.id)}
                  className={`w-5 h-5 rounded-lg flex items-center justify-center transition-all border shrink-0 ${todo.completed
                    ? 'bg-white border-white text-black'
                    : 'bg-white/5 border-white/10 text-transparent hover:border-white'
                    }`}
                >
                  <Check size={12} strokeWidth={4} />
                </button>
                <span className={`flex-1 text-[12px] font-medium tracking-tight truncate ${todo.completed ? 'text-black/30 line-through' : 'text-black'}`}>
                  {todo.text}
                </span>
                <button
                  onClick={() => deleteTodo(todo.id)}
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-hud-muted hover:text-red-400 hover:bg-red-400/10 transition-all opacity-0 group-hover:opacity-100"
                >
                  <Trash2 size={14} />
                </button>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default TodoList;
