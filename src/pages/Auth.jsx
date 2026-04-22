import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [message, setMessage] = useState('');
  
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const loggedUser = localStorage.getItem('user');
    if (loggedUser) {
      const parsedUser = JSON.parse(loggedUser);
      setUser(parsedUser);
      fetchUserOrders(parsedUser.email);
    }
  }, []);

  const fetchUserOrders = (email) => {
    fetch(`/api/user/orders/${email}`)
      .then(res => res.json())
      .then(data => setOrders(data))
      .catch(console.error);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const endpoint = isLogin ? '/api/login' : '/api/signup';
    
    fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    })
    .then(res => res.json())
    .then(data => {
      if (data.error) {
        setMessage(data.error);
      } else {
        localStorage.setItem('user', JSON.stringify(data.user));
        setUser(data.user);
        fetchUserOrders(data.user.email);
      }
    })
    .catch(() => setMessage('Error connecting to server.'));
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
    setOrders([]);
  };

  if (user) {
    return (
      <div className="container" style={{ padding: '6rem 1rem', minHeight: '80vh' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
          <h2 style={{ fontSize: '2.5rem', color: 'var(--gold)' }}>Hello, {user.name}</h2>
          <button className="btn-outline" onClick={handleLogout}>Log Out</button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '2rem' }}>
          <div style={{ background: 'var(--surface)', padding: '2rem', borderRadius: '8px', border: '1px solid var(--border)' }}>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', color: 'var(--text)' }}>My Orders</h3>
            {orders.length === 0 ? (
              <p style={{ color: 'var(--text-muted)' }}>You haven't placed any orders yet.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {orders.map(order => (
                  <div key={order.orderId} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.03)', padding: '1rem', borderRadius: '4px' }}>
                    <div>
                      <p style={{ fontWeight: 'bold' }}>{order.orderId}</p>
                      <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>{new Date(order.date).toLocaleDateString()} • {order.items.length} Items</p>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <p style={{ color: 'var(--gold)' }}>{order.status}</p>
                      <p>₹{order.total}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container" style={{ paddingTop: '150px', minHeight: '80vh', display: 'flex', justifyContent: 'center' }}>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ background: 'var(--surface)', padding: '4rem', borderRadius: '8px', maxWidth: '500px', width: '100%', border: '1px solid var(--border)', height: 'fit-content' }}
      >
        <h2 style={{ fontSize: '2rem', marginBottom: '2rem', color: 'var(--gold)', textAlign: 'center' }}>
          {isLogin ? 'Welcome Back' : 'Create Account'}
        </h2>

        {message && <p style={{ color: 'var(--gold)', marginBottom: '1rem', textAlign: 'center' }}>{message}</p>}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {!isLogin && (
            <input 
              type="text" 
              placeholder="Full Name" 
              required
              value={formData.name}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
              style={{ padding: '1rem', background: 'transparent', border: '1px solid var(--border)', color: 'var(--text)', borderRadius: '4px' }}
            />
          )}
          <input 
            type="email" 
            placeholder="Email Address" 
            required
            value={formData.email}
            onChange={e => setFormData({ ...formData, email: e.target.value })}
            style={{ padding: '1rem', background: 'transparent', border: '1px solid var(--border)', color: 'var(--text)', borderRadius: '4px' }}
          />
          <input 
            type="password" 
            placeholder="Password" 
            required
            value={formData.password}
            onChange={e => setFormData({ ...formData, password: e.target.value })}
            style={{ padding: '1rem', background: 'transparent', border: '1px solid var(--border)', color: 'var(--text)', borderRadius: '4px' }}
          />
          <button type="submit" className="btn-primary" style={{ marginTop: '1rem' }}>
            {isLogin ? 'Sign In' : 'Sign Up'}
          </button>
        </form>

        <div style={{ marginTop: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <span 
            style={{ color: 'var(--gold)', cursor: 'pointer' }}
            onClick={() => { setIsLogin(!isLogin); setMessage(''); }}
          >
            {isLogin ? 'Sign Up' : 'Log In'}
          </span>
        </div>
      </motion.div>
    </div>
  );
};

export default Auth;
