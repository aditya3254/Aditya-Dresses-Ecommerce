import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';

const Shop = () => {
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState('');

  useEffect(() => {
    fetch('/api/products')
      .then(res => res.json())
      .then(data => {
        setProducts(data);
        setLoading(false);
      });
  }, []);

  const addToCart = (product) => {
    fetch('/api/cart', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(product)
    })
    .then(res => res.json())
    .then(data => {
      setNotification(`Added ${product.name} to Cart`);
      setTimeout(() => setNotification(''), 3000);
      window.dispatchEvent(new Event('cartUpdated'));
    });
  };

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="shop-page container">
      <motion.h1 
        className="page-title"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        Collection
      </motion.h1>

      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '3rem' }}>
        <input 
          type="text" 
          placeholder="Search collections (e.g. Sarees, Suits)..." 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{ width: '100%', maxWidth: '500px', padding: '1rem 1.5rem', background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--text)', borderRadius: '50px', fontSize: '1rem', outline: 'none' }}
        />
      </div>
      
      {notification && (
        <div style={{ position: 'fixed', top: '100px', right: '20px', background: 'var(--gold)', color: '#000', padding: '1rem', borderRadius: '4px', zIndex: 999 }}>
          {notification}
        </div>
      )}

      {loading ? (
        <div style={{ textAlign: 'center', margin: '5rem 0' }}>Loading luxury...</div>
      ) : (
        <div className="catalog-grid">
          {filteredProducts.length === 0 ? (
            <p style={{ gridColumn: '1 / -1', textAlign: 'center', color: 'var(--text-muted)' }}>No products found matching "{searchQuery}"</p>
          ) : (
            filteredProducts.map(product => (
              <motion.div 
                key={product.id} 
                className="product-card"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div className="product-image">
                  <img src={product.image} alt={product.name} />
                </div>
                <div className="product-info" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <h3 style={{ fontSize: '1.1rem', margin: 0 }}>{product.name}</h3>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ background: '#388e3c', color: 'white', padding: '2px 6px', borderRadius: '4px', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '2px', fontWeight: 'bold' }}>
                      4.{(Math.random() * (9 - 2) + 2).toFixed(1)} <Star size={12} fill="white" />
                    </span>
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>({Math.floor(Math.random() * 5000) + 100})</span>
                    <img src="https://static-assets-web.flixcart.com/fk-p-linchpin-web/fk-cp-zion/img/fa_62673a.png" alt="assured" height="15" style={{ marginLeft: 'auto' }} />
                  </div>
                  
                  <div style={{ display: 'flex', alignItems: 'flex-end', gap: '0.5rem', marginTop: '0.5rem' }}>
                    <span className="price" style={{ margin: 0 }}>₹{product.price}</span>
                    <span style={{ color: 'var(--text-muted)', textDecoration: 'line-through', fontSize: '0.85rem' }}>₹{Math.floor(product.price * 1.5)}</span>
                    <span style={{ color: '#388e3c', fontWeight: 'bold', fontSize: '0.85rem' }}>33% off</span>
                  </div>
                  
                  <button className="add-to-cart" onClick={() => addToCart(product)} style={{ marginTop: '1rem' }}>Add to Bag</button>
                </div>
              </motion.div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default Shop;
