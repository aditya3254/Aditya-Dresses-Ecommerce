import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Shop from './pages/Shop';
import Cart from './pages/Cart';
import Auth from './pages/Auth';
import TrackOrder from './pages/TrackOrder';

function App() {
  return (
    <div className="App">
      <Navbar />
      <div className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/track" element={<TrackOrder />} />
        </Routes>
      </div>
      <Footer />
    </div>
  );
}

export default App;
