import React from 'react';
import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import AnwarAdmin from './pages/AnwarAdmin';

const App: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/anwar" element={<AnwarAdmin />} />
    </Routes>
  );
};

export default App;
