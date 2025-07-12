import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/common/Header/Header';
import Footer from './components/common/Footer/Footer';
import Home from './pages/Home';
import CustomerPortal from './pages/CustomerPortal';
import BarberPortal from './pages/BarberPortal';
import BarbershopDetails from './pages/BarbershopDetails';
import Settings from './pages/Settings';
import './styles/variables.css';
import './App.css';

function App() {
  return (
    <Router>
      <div className="app">
        <Header />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/customer" element={<CustomerPortal />} />
            <Route path="/barber" element={<BarberPortal />} />
            <Route path="/shops/:shopId" element={<BarbershopDetails />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
