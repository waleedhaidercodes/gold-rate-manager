import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import GoldRates from './pages/GoldRates';
import Investments from './pages/Investments';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100 font-sans text-gray-900">
        <nav className="bg-blue-600 text-white shadow-md">
          <div className="container mx-auto px-4 py-3 flex justify-between items-center">
            <Link to="/" className="text-xl font-bold">Gold Manager</Link>
            <div className="space-x-4">
              <Link to="/" className="hover:text-blue-200">Dashboard</Link>
              <Link to="/rates" className="hover:text-blue-200">Rates</Link>
              <Link to="/investments" className="hover:text-blue-200">Investments</Link>
            </div>
          </div>
        </nav>

        <main className="container mx-auto px-4 py-6">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/rates" element={<GoldRates />} />
            <Route path="/investments" element={<Investments />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
