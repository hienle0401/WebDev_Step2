import React, { useState, useEffect } from 'react';

const API_URL = 'http://localhost:5000/todos';

function App() {
  const [todos, setTodos] = useState([]);
  const [task, setTask] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editingTask, setEditingTask] = useState('');

  // Fetch Todos (GET)
  useEffect(() => {
    fetch(API_URL)
      .then(res => res.json())
      .then(data => setTodos(data));
  }, []);

  // Add Todo (POST)
  const addTodo = () => {
    if (!task.trim()) return;
    fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ task, completed: false }),
    })
      .then(res => res.json())
      .then(newTodo => {
        setTodos([...todos, newTodo]);
        setTask('');
      });
  };

  // Delete Todo (DELETE)
  const deleteTodo = (id) => {
    fetch(`${API_URL}/${id}`, { method: 'DELETE' })
      .then(() => setTodos(todos.filter(t => t.id !== id)));
  };

  // Toggle Completed (PATCH)
  const toggleComplete = (todo) => {
    fetch(`${API_URL}/${todo.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ completed: !todo.completed }),
    })
      .then(res => res.json())
      .then(updated => setTodos(todos.map(t => (t.id === updated.id ? updated : t))));
  };

  // Start Editing
  const startEdit = (todo) => {
    setEditingId(todo.id);
    setEditingTask(todo.task);
  };

  // Save Edit (PATCH) — Task #1
  const saveEdit = (id) => {
    if (!editingTask.trim()) return;
    fetch(`${API_URL}/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ task: editingTask }),
    })
      .then(res => res.json())
      .then(updated => {
        setTodos(todos.map(t => (t.id === updated.id ? updated : t)));
        setEditingId(null);
        setEditingTask('');
      });
  };

  // Cancel Edit
  const cancelEdit = () => {
    setEditingId(null);
    setEditingTask('');
  };

  const completedCount = todos.filter(t => t.completed).length;

  return (
    <div className="min-vh-100 bg-light py-5">
      <div className="container" style={{ maxWidth: '640px' }}>

        {/* Header */}
        <div className="text-center mb-4">
          <h1 className="fw-bold text-primary">My To-Do List</h1>
          <p className="text-muted">
            {completedCount} of {todos.length} tasks completed
          </p>
        </div>

        {/* Add Todo */}
        <div className="card shadow-sm mb-4">
          <div className="card-body">
            <div className="input-group">
              <input
                type="text"
                className="form-control"
                placeholder="Add a new task..."
                value={task}
                onChange={e => setTask(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && addTodo()}
              />
              <button className="btn btn-primary" onClick={addTodo}>
                Add
              </button>
            </div>
          </div>
        </div>

        {/* Todo List */}
        <div className="card shadow-sm">
          <ul className="list-group list-group-flush">
            {todos.length === 0 && (
              <li className="list-group-item text-center text-muted py-4">
                No tasks yet. Add one above!
              </li>
            )}
            {todos.map(todo => (
              <li key={todo.id} className="list-group-item">
                {editingId === todo.id ? (
                  /* Edit Mode */
                  <div className="d-flex gap-2 align-items-center">
                    <input
                      type="text"
                      className="form-control form-control-sm"
                      value={editingTask}
                      onChange={e => setEditingTask(e.target.value)}
                      onKeyDown={e => {
                        if (e.key === 'Enter') saveEdit(todo.id);
                        if (e.key === 'Escape') cancelEdit();
                      }}
                      autoFocus
                    />
                    <button
                      className="btn btn-success btn-sm"
                      onClick={() => saveEdit(todo.id)}
                    >
                      Save
                    </button>
                    <button
                      className="btn btn-secondary btn-sm"
                      onClick={cancelEdit}
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  /* View Mode */
                  <div className="d-flex align-items-center justify-content-between">
                    <div className="d-flex align-items-center gap-3">
                      <input
                        type="checkbox"
                        className="form-check-input"
                        checked={todo.completed}
                        onChange={() => toggleComplete(todo)}
                        style={{ width: '1.2em', height: '1.2em', cursor: 'pointer' }}
                      />
                      <span
                        className={todo.completed ? 'text-decoration-line-through text-muted' : ''}
                      >
                        {todo.task}
                      </span>
                    </div>
                    <div className="d-flex gap-2">
                      <button
                        className="btn btn-outline-warning btn-sm"
                        onClick={() => startEdit(todo)}
                      >
                        Edit
                      </button>
                      <button
                        className="btn btn-outline-danger btn-sm"
                        onClick={() => deleteTodo(todo.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>

        {/* Footer note */}
        {todos.length > 0 && (
          <p className="text-center text-muted mt-3 small">
            Check off tasks to mark them complete. Press <kbd>Enter</kbd> to save edits.
          </p>
        )}

      </div>
    </div>
  );
}

export default App;
