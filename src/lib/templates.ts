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
  {
    id: "next-app",
    name: "Next.js App",
    description: "Next.js full-stack application",
    files: [
      {
        name: "page.tsx",
        path: "app/page.tsx",
        language: "typescript",
        content: `export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">Next.js App</h1>
        <p className="text-gray-600 mb-6">
          Build modern full-stack applications with Next.js
        </p>
        <button className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold">
          Get Started
        </button>
      </div>
    </main>
  );
}`,
      },
      {
        name: "layout.tsx",
        path: "app/layout.tsx",
        language: "typescript",
        content: `import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Next.js App',
  description: 'Generated by create next app',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}`,
      },
    ],
  },
  {
    id: "express-api",
    name: "Express Backend",
    description: "Express.js REST API server",
    files: [
      {
        name: "server.js",
        path: "server.js",
        language: "javascript",
        content: `const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ message: 'Welcome to Express API' });
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'healthy', timestamp: new Date() });
});

app.post('/api/data', (req, res) => {
  const { data } = req.body;
  res.json({ received: data, processed: true });
});

app.listen(PORT, () => {
  console.log(\`Server running on port \${PORT}\`);
});`,
      },
      {
        name: "package.json",
        path: "package.json",
        language: "json",
        content: `{
  "name": "express-api",
  "version": "1.0.0",
  "description": "Express REST API",
  "main": "server.js",
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js"
  },
  "dependencies": {
    "express": "^4.18.2",
    "cors": "^2.8.5"
  },
  "devDependencies": {
    "nodemon": "^3.0.1"
  }
}`,
      },
    ],
  },
  {
    id: "vue-app",
    name: "Vue 3 App",
    description: "Vue 3 with Composition API",
    files: [
      {
        name: "App.vue",
        path: "src/App.vue",
        language: "html",
        content: `<template>
  <div class="min-h-screen bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center p-4">
    <div class="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center">
      <h1 class="text-4xl font-bold text-gray-800 mb-4">Vue 3 App</h1>
      <p class="text-gray-600 mb-6">
        Build interactive UIs with Vue 3
      </p>
      <button @click="count++" class="px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-semibold">
        Count: {{ count }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const count = ref(0);
</script>`,
      },
    ],
  },
  {
    id: "svelte-app",
    name: "Svelte App",
    description: "Svelte reactive component",
    files: [
      {
        name: "App.svelte",
        path: "src/App.svelte",
        language: "html",
        content: `<script>
  let count = 0;

  function increment() {
    count += 1;
  }
</script>

<main class="min-h-screen bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center p-4">
  <div class="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center">
    <h1 class="text-4xl font-bold text-gray-800 mb-4">Svelte App</h1>
    <p class="text-gray-600 mb-6">
      Build blazing fast web apps with Svelte
    </p>
    <button on:click={increment} class="px-8 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition font-semibold">
      Count: {count}
    </button>
  </div>
</main>`,
      },
    ],
  },
  {
    id: "fullstack-app",
    name: "Full-Stack Project",
    description: "React frontend + Node backend",
    files: [
      {
        name: "App.tsx",
        path: "client/src/App.tsx",
        language: "typescript",
        content: `import React, { useState } from 'react';

function App() {
  const [data, setData] = useState('');

  const fetchData = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/data');
      const result = await response.json();
      setData(JSON.stringify(result));
    } catch (error) {
      setData('Error fetching data');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">Full-Stack App</h1>
        <button onClick={fetchData} className="px-8 py-3 bg-slate-800 text-white rounded-lg hover:bg-slate-900 transition font-semibold mb-4">
          Fetch Data
        </button>
        {data && <pre className="text-left text-sm bg-gray-100 p-4 rounded">{data}</pre>}
      </div>
    </div>
  );
}

export default App;`,
      },
      {
        name: "server.js",
        path: "server/server.js",
        language: "javascript",
        content: `const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

app.get('/api/data', (req, res) => {
  res.json({
    message: 'Data from backend',
    timestamp: new Date().toISOString(),
  });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(\`Backend running on port \${PORT}\`);
});`,
      },
    ],
  },
];

export const getTemplate = (id: string): Template | undefined => {
  return templates.find(t => t.id === id);
};