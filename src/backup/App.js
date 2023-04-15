import './App.css';
import React from 'react';
import Home from './components/Home';
import Note from './components/Note';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import 'tachyons';
// createContext.provider
function App() {
  return (
    <div className="App">
      {/* <header className="App-header"> */}
      <h1 className='title'>notesbook</h1>
      <BrowserRouter className="App">
        <Routes className="App-header">
          <Route path='/' element={<Home />} />
          <Route path='/:id' element={<Note />} />
        </Routes>
      </BrowserRouter>
      {/* </header> */}
    </div>
  );
}

export default App;
