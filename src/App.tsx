import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Auth from './pages/Auth';
import Marketplace from './pages/Marketplace';
import Dashboard from './pages/Dashboard';
import Leaderboard from './pages/Leaderboard';
import ProductDetails from './pages/ProductDetails';
import ListItem from './pages/ListItem';
import { AuthProvider } from './contexts/AuthContext';
import { ProductProvider } from './contexts/ProductContext';
import Chatbot from './components/Chatbot';
import './index.css';

function App() {
  return (
    <AuthProvider>
      <ProductProvider>
        <Router>
          <div className="min-h-screen bg-gradient-to-br from-green-50 to-amber-50">
            <Navbar />
            <main className="container mx-auto px-4 py-8">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/auth" element={<Auth />} />
                <Route path="/marketplace" element={<Marketplace />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/leaderboard" element={<Leaderboard />} />
                <Route path="/product/:id" element={<ProductDetails />} />
                <Route path="/list-item" element={<ListItem />} />
              </Routes>
            </main>
            <Chatbot />
          </div>
        </Router>
      </ProductProvider>
    </AuthProvider>
  );
}

export default App;