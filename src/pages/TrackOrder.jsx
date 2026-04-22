import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Truck, Package, PackageOpen } from 'lucide-react';

const TrackOrder = () => {
  const [orderId, setOrderId] = useState('');
  const [order, setOrder] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const trackOrder = (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    fetch(`/api/orders/${orderId}`)
      .then(res => {
        if (!res.ok) throw new Error('Order not found');
        return res.json();
      })
      .then(data => {
        setOrder(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setOrder(null);
        setLoading(false);
      });
  };

  const getStepStatus = (stepName) => {
    if (!order) return 'pending';
    const status = order.status || 'Processing';
    const flow = ['Processing', 'Shipped', 'Delivered'];
    const currentIndex = flow.indexOf(status);
    const stepIndex = flow.indexOf(stepName);
    
    if (stepIndex < currentIndex) return 'completed';
    if (stepIndex === currentIndex) return 'active';
    return 'pending';
  };

  return (
    <div className="container" style={{ padding: '6rem 1rem', minHeight: '80vh', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ width: '100%', maxWidth: '600px', background: 'var(--surface)', padding: '3rem', borderRadius: '8px', border: '1px solid var(--border)' }}
      >
        <h2 style={{ fontSize: '2rem', marginBottom: '1rem', color: 'var(--gold)', textAlign: 'center' }}>Track Your Order</h2>
        <p style={{ textAlign: 'center', color: 'var(--text-muted)', marginBottom: '2rem' }}>Enter your order ID (e.g., ORD-123456) to track its status.</p>

        <form onSubmit={trackOrder} style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
          <input 
            type="text" 
            placeholder="Order ID" 
            value={orderId}
            onChange={(e) => setOrderId(e.target.value)}
            style={{ flex: 1, padding: '1rem', background: 'transparent', border: '1px solid var(--border)', color: 'var(--text)', borderRadius: '4px' }}
            required
          />
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Searching...' : 'Track'}
          </button>
        </form>

        {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}

        {order && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{ marginTop: '3rem', paddingTop: '2rem', borderTop: '1px solid var(--border)' }}
          >
            <h3 style={{ marginBottom: '0.5rem', color: 'var(--text)' }}>Order {order.orderId}</h3>
            <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>Placed on {new Date(order.date).toLocaleDateString()}</p>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', position: 'relative', marginBottom: '3rem' }}>
              <div style={{ position: 'absolute', top: '15px', left: '10%', right: '10%', height: '2px', background: 'var(--border)', zIndex: 0 }}></div>
              
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 1 }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: getStepStatus('Processing') !== 'pending' ? 'var(--gold)' : 'var(--surface)', border: '2px solid var(--gold)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Package size={16} color="#000" />
                </div>
                <span style={{ marginTop: '0.5rem', fontSize: '0.85rem' }}>Processing</span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 1 }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: getStepStatus('Shipped') !== 'pending' ? 'var(--gold)' : 'var(--surface)', border: '2px solid var(--gold)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Truck size={16} color={getStepStatus('Shipped') !== 'pending' ? '#000' : 'var(--gold)'} />
                </div>
                <span style={{ marginTop: '0.5rem', fontSize: '0.85rem' }}>Shipped</span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 1 }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: getStepStatus('Delivered') !== 'pending' ? 'var(--gold)' : 'var(--surface)', border: '2px solid var(--gold)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <PackageOpen size={16} color={getStepStatus('Delivered') !== 'pending' ? '#000' : 'var(--gold)'} />
                </div>
                <span style={{ marginTop: '0.5rem', fontSize: '0.85rem' }}>Delivered</span>
              </div>
            </div>

            <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '1.5rem', borderRadius: '8px' }}>
              <h4 style={{ marginBottom: '1rem', color: 'var(--gold)' }}>Order Details</h4>
              {order.items.map((item, idx) => (
                <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <span>{item.name}</span>
                  <span>₹{item.price}</span>
                </div>
              ))}
              <div style={{ borderTop: '1px solid var(--border)', marginTop: '1rem', paddingTop: '1rem', display: 'flex', justifyContent: 'space-between' }}>
                <strong>Total Paid ({order.paymentDetails})</strong>
                <strong>₹{order.total}</strong>
              </div>
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default TrackOrder;
