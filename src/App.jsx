import React, { useState, useEffect } from 'react';

function App() {

  const [todos, setTodos] = useState([]);
  const [task, setTask] = useState('');
  const API_URL = 'http://localhost:4000/todos';

  // Fetch Todos (GET)
  useEffect(() => {
    fetch(API_URL)
    .then(res => res.json())
    .then(data => setTodos(data))
    .catch(err => console.error('Error fetching todos:', err));
  }, []);

  // Add Todo (POST)
  const addTodo = () => {
    if (!task.trim()) return; // Prevent empty tasks
    
    fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ task, completed: false })
    })
      .then(res => res.json())
      .then(newTodo => {
        setTodos([...todos, newTodo]);
        setTask(''); // Clear input after adding
      })
      .catch(err => console.error('Error adding todo:', err));
  };

    // Delete Todo (DELETE)
    const deleteTodo = (id) => {
      fetch(`${API_URL}/${id}`, { method: 'DELETE' })
        .then(() => setTodos(todos.filter(t => t.id !== id)))
        .catch(err => console.error('Error deleting todo:', err));
    };


  return (
    <div>

      <h1>To-Do List</h1>

      <input value={task} onChange={(e) => setTask(e.target.value)} />

      <button onClick={addTodo}>Add</button>

      <ul>
        {todos.map(t => (
          <li key={t.id}>
          {t.task} <button onClick={() => deleteTodo(t.id)}>Delete</button>
          </li>
        ))}
      </ul>

    </div>
  );
}

export default App;