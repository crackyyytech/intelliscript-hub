export interface Template {
  id: string;
  name: string;
  description: string;
  files: {
    name: string;
    path: string;
    content: string;
    language: string;
  }[];
}

export const templates: Template[] = [
  {
    id: "blank",
    name: "Blank Project",
    description: "Start with an empty project",
    files: [
      {
        name: "App.tsx",
        path: "src/App.tsx",
        language: "typescript",
        content: `import React from 'react';

function App() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          Welcome to Your App
        </h1>
        <p className="text-gray-600">
          Start building something amazing!
        </p>
      </div>
    </div>
  );
}

export default App;`,
      },
    ],
  },
  {
    id: "react-counter",
    name: "React Counter",
    description: "Simple counter app with React hooks",
    files: [
      {
        name: "App.tsx",
        path: "src/App.tsx",
        language: "typescript",
        content: `import React from 'react';

function App() {
  const [count, setCount] = React.useState(0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          Counter App
        </h1>
        <div className="text-center mb-6">
          <div className="text-6xl font-bold text-blue-600 mb-4">
            {count}
          </div>
        </div>
        <div className="flex gap-4">
          <button
            onClick={() => setCount(count - 1)}
            className="flex-1 px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition font-semibold"
          >
            Decrease
          </button>
          <button
            onClick={() => setCount(0)}
            className="flex-1 px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition font-semibold"
          >
            Reset
          </button>
          <button
            onClick={() => setCount(count + 1)}
            className="flex-1 px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition font-semibold"
          >
            Increase
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;`,
      },
    ],
  },
  {
    id: "todo-app",
    name: "Todo List",
    description: "Interactive todo list application",
    files: [
      {
        name: "App.tsx",
        path: "src/App.tsx",
        language: "typescript",
        content: `import React from 'react';

interface Todo {
  id: number;
  text: string;
  completed: boolean;
}

function App() {
  const [todos, setTodos] = React.useState<Todo[]>([]);
  const [input, setInput] = React.useState('');

  const addTodo = () => {
    if (input.trim()) {
      setTodos([...todos, { id: Date.now(), text: input, completed: false }]);
      setInput('');
    }
  };

  const toggleTodo = (id: number) => {
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  const deleteTodo = (id: number) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-500 to-pink-500 p-8">
      <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-2xl p-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-8">My Todos</h1>
        
        <div className="flex gap-2 mb-6">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && addTodo()}
            placeholder="Add a new todo..."
            className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-purple-500"
          />
          <button
            onClick={addTodo}
            className="px-6 py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition font-semibold"
          >
            Add
          </button>
        </div>

        <div className="space-y-2">
          {todos.map(todo => (
            <div
              key={todo.id}
              className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
            >
              <input
                type="checkbox"
                checked={todo.completed}
                onChange={() => toggleTodo(todo.id)}
                className="w-5 h-5"
              />
              <span
                className={\`flex-1 \${todo.completed ? 'line-through text-gray-400' : 'text-gray-800'}\`}
              >
                {todo.text}
              </span>
              <button
                onClick={() => deleteTodo(todo.id)}
                className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition text-sm"
              >
                Delete
              </button>
            </div>
          ))}
        </div>

        {todos.length === 0 && (
          <p className="text-center text-gray-400 mt-8">No todos yet. Add one above!</p>
        )}
      </div>
    </div>
  );
}

export default App;`,
      },
    ],
  },
];

export const getTemplate = (id: string): Template | undefined => {
  return templates.find(t => t.id === id);
};