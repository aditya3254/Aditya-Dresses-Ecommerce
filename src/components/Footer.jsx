import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="footer-section">
      <div className="footer-content">
        <div className="footer-brand">
          <h2>ADITYA DRESSES</h2>
          <p>Everything Available In Readymade.</p>
          <br/>
          <p style={{ color: "var(--gold-accent)", fontSize: "0.9rem" }}>Proprietor: ANIL PRASAD</p>
        </div>
        <div className="footer-links">
          <h3>Quick Links</h3>
          <Link to="/">Home</Link>
          <Link to="/shop">Shop Collection</Link>
          <Link to="/cart">My Cart</Link>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} Aditya Dresses. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
