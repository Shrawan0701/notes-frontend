import React, { useEffect, useState } from 'react';
import { getNotes, createNote, updateNote, deleteNote } from './api';

export default function App() {
  const [notes, setNotes] = useState([]);
  const [text, setText] = useState('');

  useEffect(() => {
    load();
  }, []);

  async function load() {
    const data = await getNotes();
    setNotes(data);
  }

  async function addNote() {
    if (!text.trim()) return;
    await createNote({ content: text });
    setText('');
    load();
  }

  async function editNote(id, newContent) {
    await updateNote(id, { content: newContent });
    load();
  }

  async function removeNote(id) {
    await deleteNote(id);
    load();
  }

  
  async function shareNote(id) {
    const res = await fetch(`${import.meta.env.VITE_API_BASE}/${id}/share`, {
      method: 'POST',
    });
    if (res.ok) {
      load(); 
    }
  }

  return (
    <div className="container">
      <h1>Notes App</h1>

      <div>
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Write a note..."
        />
        <button onClick={addNote}>Add</button>
      </div>

      <ul>
        {notes.map((n) => (
          <li key={n.id}>
            <input
              value={n.content}
              onChange={(e) => editNote(n.id, e.target.value)}
            />
            <button onClick={() => removeNote(n.id)}>Delete</button>
            <button onClick={() => shareNote(n.id)}>Share</button>

            {n.slug && (
              <a
                href={`${import.meta.env.VITE_API_BASE}/public/${n.slug}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                View Shared Note
              </a>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
