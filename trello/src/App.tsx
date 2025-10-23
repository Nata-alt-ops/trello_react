import React from 'react';
import logo from './logo.svg';
import { Trello } from './trello';
import { Header } from './header';
import './App.css';

function App() {
  return (
    <div className="App">
      <Header />
      <Trello />
    </div>
  );
}

export default App;
