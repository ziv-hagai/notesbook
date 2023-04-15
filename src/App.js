import './App.css';
import React from 'react';
import Home from './components/Home';
import HomeTwo from './backup/HomeTwo';
import Note from './components/Note';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import 'tachyons';
import { useState, createContext } from 'react';

export const Context = createContext();

function App() {
  const [notes, setNotes] = useState([]);
  const [isNew, setIsNew] = useState(false);
  const [edit, setEdit] = useState(false);

  return (
    <Context.Provider value={{ notes, setNotes, isNew, setIsNew, edit, setEdit }}>

      <header className="App-header">
        <h1 className='title'>notesbook</h1>
        <BrowserRouter className="App">
          <Routes className="App-header">
            <Route path='/' element={<Home />} />
            <Route path='/:id' element={<Note />} />
          </Routes>
        </BrowserRouter>
      </header>
    </Context.Provider >

  );
}

export default App;
