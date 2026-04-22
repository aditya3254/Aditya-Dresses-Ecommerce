import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, User, Menu, X } from 'lucide-react';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [cartCount, setCartCount] = useState(0);

  const fetchCartCount = () => {
    fetch('/api/cart')
      .then(res => res.json())
      .then(data => setCartCount(data.length))
      .catch(() => setCartCount(0));
  };

  useEffect(() => {
    fetchCartCount();
    window.addEventListener('cartUpdated', fetchCartCount);
    
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('cartUpdated', fetchCartCount);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      <div className="nav-container">
        <Link to="/" className="logo">ADITYA</Link>
        
        <div className={`nav-links ${mobileMenu ? 'active' : ''}`}>
          <Link to="/" onClick={() => setMobileMenu(false)}>Home</Link>
          <Link to="/shop" onClick={() => setMobileMenu(false)}>Shop</Link>
          <Link to="/track" onClick={() => setMobileMenu(false)}>Track Order</Link>
          <Link to="/auth" onClick={() => setMobileMenu(false)}>Account</Link>
        </div>

        <div className="nav-icons">
          <Link to="/cart" className="cart-icon-wrapper">
            <ShoppingBag className="icon" style={{color: 'var(--text)'}} />
            {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
          </Link>
          <Link to="/auth">
            <User className="icon" style={{color: 'var(--text)'}} />
          </Link>
          <div className="mobile-toggle" onClick={() => setMobileMenu(!mobileMenu)}>
            {mobileMenu ? <X color="var(--text)" /> : <Menu color="var(--text)" />}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
