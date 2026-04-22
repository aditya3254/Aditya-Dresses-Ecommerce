import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import LocationContact from '../components/LocationContact';

const Home = () => {
  return (
    <>
      <section className="hero-section">
        <div className="hero-content">
          <motion.h1 
            className="page-title"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            style={{ marginBottom: '1rem' }}
          >
            ADITYA DRESSES
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            style={{ fontSize: '1.25rem', color: 'var(--text-muted)', marginBottom: '3rem' }}
          >
            The Ultimate Destination For Readymade Premium Wear.
          </motion.p>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="hero-buttons"
          >
            <Link to="/shop" className="btn-primary">Explore Collection</Link>
          </motion.div>
        </div>
      </section>

      <section className="special-offers">
        <div className="container">
          <h2 className="section-title">End Of Season Sale</h2>
          <div className="offer-grid">
            <div className="offer-card">
              <h3 style={{ fontSize: '2rem', color: 'var(--gold)', marginBottom: '1rem' }}>50% OFF</h3>
              <p style={{ color: 'var(--text-muted)' }}>On premium menswear. Step into luxury.</p>
            </div>
            <div className="offer-card">
              <h3 style={{ fontSize: '2rem', color: 'var(--gold)', marginBottom: '1rem' }}>Buy 2 Get 1</h3>
              <p style={{ color: 'var(--text-muted)' }}>On exclusive bridal collections. Start your journey.</p>
            </div>
          </div>
        </div>
      </section>

      <LocationContact />
    </>
  );
};

export default Home;
