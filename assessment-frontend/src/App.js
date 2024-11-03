// src/App.js
import React from 'react';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import Assessment from './components/Assessment/Assessment';
import './styles/App.css'; // Import global App styles

function App() {
  return (
    <div className="App">
      <Header />
      <div className="content">
        <Assessment />
      </div>
      <Footer />
    </div>
  );
}

export default App;
