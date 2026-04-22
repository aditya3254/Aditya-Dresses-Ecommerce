import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Truck, MapPin, CreditCard } from 'lucide-react';

const Cart = () => {
  const [cart, setCart] = useState([]);
  const [checkoutStep, setCheckoutStep] = useState('cart'); // 'cart', 'address', 'payment'
  const [orderComplete, setOrderComplete] = useState(false);
  const [shippingDetails, setShippingDetails] = useState({ name: '', email: '', phone: '', address: '' });

  useEffect(() => {
    fetchCart();
    
    // Auto-fill from logged in user
    const loggedUser = localStorage.getItem('user');
    if (loggedUser) {
      const user = JSON.parse(loggedUser);
      setShippingDetails(prev => ({ ...prev, name: user.name, email: user.email }));
    }
  }, []);

  const fetchCart = () => {
    fetch('/api/cart')
      .then(res => res.json())
      .then(data => setCart(data));
  };

  const removeFromCart = (cartId) => {
    fetch(`/api/cart/${cartId}`, { method: 'DELETE' })
      .then(res => res.json())
      .then(data => {
        setCart(data.cart);
        window.dispatchEvent(new Event('cartUpdated'));
      });
  };

  const processPayment = (method) => {
    fetch('/api/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        paymentMethod: method,
        shippingDetails
      })
    })
    .then(res => res.json())
    .then(data => {
      setOrderComplete(data.orderId);
      setCart([]);
      setCheckoutStep('cart');
      window.dispatchEvent(new Event('cartUpdated'));
    });
  };

  const total = cart.reduce((sum, item) => sum + item.price, 0);

  if (orderComplete) {
    return (
      <div className="cart-page container" style={{ textAlign: 'center', padding: '150px 20px', minHeight: '80vh' }}>
        <h1 style={{ color: 'var(--gold)', marginBottom: '1rem', fontSize: '3rem' }}>Order Placed!</h1>
        <p style={{ fontSize: '1.2rem', marginBottom: '2rem' }}>Thank you for shopping at Aditya Dresses.</p>
        
        <div style={{ background: 'var(--surface)', padding: '2rem', borderRadius: '8px', display: 'inline-block', border: '1px solid var(--gold)', marginBottom: '2rem' }}>
          <p style={{ color: 'var(--text)', fontSize: '1.5rem', fontWeight: 'bold' }}>Tracking ID: {orderComplete}</p>
        </div>
        
        <p style={{ color: 'var(--text-muted)' }}>You can track your order status live in the Track Order section.</p>
      </div>
    );
  }

  return (
    <div className="cart-page container" style={{ minHeight: '80vh' }}>
      <motion.h1 
        className="page-title"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        Secure Checkout
      </motion.h1>
      
      {cart.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '5rem', background: 'var(--surface)', borderRadius: '4px' }}>
          <p>Your bag is empty.</p>
        </div>
      ) : (
        <div className="cart-layout">
          <div className="checkout-steps" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            
            {/* Step 1: Cart Items */}
            <div style={{ background: 'var(--surface)', border: `1px solid ${checkoutStep === 'cart' ? 'var(--gold)' : 'var(--border)'}`, borderRadius: '8px', padding: '2rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
                <div style={{ background: 'var(--primary)', color: 'black', width: '30px', height: '30px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>1</div>
                <h2 style={{ fontSize: '1.5rem', color: checkoutStep === 'cart' ? 'var(--gold)' : 'var(--text)' }}>Order Summary</h2>
              </div>
              
              {checkoutStep === 'cart' && (
                <>
                  <div className="cart-items">
                    {cart.map(item => (
                      <div key={item.cartId} className="cart-item">
                        <img src={item.image} alt={item.name} />
                        <div className="cart-item-details">
                          <h3>{item.name}</h3>
                          <p className="cart-item-price">₹{item.price}</p>
                          <button className="remove-btn" onClick={() => removeFromCart(item.cartId)}>Remove</button>
                        </div>
                      </div>
                    ))}
                  </div>
                  <button className="btn-primary" style={{ marginTop: '2rem' }} onClick={() => setCheckoutStep('address')}>Continue</button>
                </>
              )}
              {checkoutStep !== 'cart' && <p style={{ color: 'var(--text-muted)' }}>{cart.length} items verified.</p>}
            </div>

            {/* Step 2: Delivery Address */}
            <div style={{ background: 'var(--surface)', border: `1px solid ${checkoutStep === 'address' ? 'var(--gold)' : 'var(--border)'}`, borderRadius: '8px', padding: '2rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
                <div style={{ background: 'var(--primary)', color: 'black', width: '30px', height: '30px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>2</div>
                <h2 style={{ fontSize: '1.5rem', color: checkoutStep === 'address' ? 'var(--gold)' : 'var(--text)' }}>Delivery Address</h2>
              </div>

              {checkoutStep === 'address' && (
                <form onSubmit={(e) => { e.preventDefault(); setCheckoutStep('payment'); }} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <input type="text" placeholder="Full Name" required value={shippingDetails.name} onChange={e => setShippingDetails({...shippingDetails, name: e.target.value})} style={{ padding: '1rem', background: 'transparent', border: '1px solid var(--border)', color: 'var(--text)', borderRadius: '4px' }} />
                  <input type="email" placeholder="Email Address" required value={shippingDetails.email} onChange={e => setShippingDetails({...shippingDetails, email: e.target.value})} style={{ padding: '1rem', background: 'transparent', border: '1px solid var(--border)', color: 'var(--text)', borderRadius: '4px' }} />
                  <input type="tel" placeholder="Phone Number" required value={shippingDetails.phone} onChange={e => setShippingDetails({...shippingDetails, phone: e.target.value})} style={{ padding: '1rem', background: 'transparent', border: '1px solid var(--border)', color: 'var(--text)', borderRadius: '4px' }} />
                  <textarea placeholder="Complete Delivery Address (Pin, Landmark, etc.)" required value={shippingDetails.address} onChange={e => setShippingDetails({...shippingDetails, address: e.target.value})} rows="3" style={{ padding: '1rem', background: 'transparent', border: '1px solid var(--border)', color: 'var(--text)', borderRadius: '4px' }}></textarea>
                  
                  <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                    <button type="submit" className="btn-primary">Deliver Here</button>
                    <button type="button" className="btn-outline" onClick={() => setCheckoutStep('cart')}>Back</button>
                  </div>
                </form>
              )}
              {checkoutStep === 'payment' && <p style={{ color: 'var(--text-muted)' }}>{shippingDetails.name} - {shippingDetails.address}</p>}
            </div>

            {/* Step 3: Payment Options */}
            <div style={{ background: 'var(--surface)', border: `1px solid ${checkoutStep === 'payment' ? 'var(--gold)' : 'var(--border)'}`, borderRadius: '8px', padding: '2rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
                <div style={{ background: 'var(--primary)', color: 'black', width: '30px', height: '30px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>3</div>
                <h2 style={{ fontSize: '1.5rem', color: checkoutStep === 'payment' ? 'var(--gold)' : 'var(--text)' }}>Payment Options</h2>
              </div>

              {checkoutStep === 'payment' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <button className="btn-outline" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }} onClick={() => processPayment('UPI')}><CreditCard size={20} /> Pay via UPI (GPay / PhonePe)</button>
                  <button className="btn-outline" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }} onClick={() => processPayment('Card')}><CreditCard size={20} /> Credit / Debit Card</button>
                  <button className="btn-outline" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }} onClick={() => processPayment('COD')}><Truck size={20} /> Cash on Delivery</button>
                  
                  <button className="btn-outline" style={{ marginTop: '1rem', border: 'none', color: 'var(--text-muted)' }} onClick={() => setCheckoutStep('address')}>Go Back</button>
                </div>
              )}
            </div>
            
          </div>
          
          <div className="cart-summary" style={{ height: 'fit-content' }}>
            <h2>Price Details</h2>
            <div className="summary-row">
              <span>Price ({cart.length} items)</span>
              <span>₹{total}</span>
            </div>
            <div className="summary-row">
              <span>Delivery Charges</span>
              <span style={{ color: 'var(--gold)' }}>FREE</span>
            </div>
            <div className="summary-total" style={{ borderTop: '1px dashed var(--border)', borderBottom: '1px dashed var(--border)', padding: '1rem 0', margin: '1rem 0' }}>
              <span>Total Payable</span>
              <span>₹{total}</span>
            </div>
            <p style={{ color: 'var(--gold)', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <img src="https://static-assets-web.flixcart.com/fk-p-linchpin-web/fk-cp-zion/img/shield_b33c0c.svg" alt="secure" width="20" /> 
              Safe and Secure Payments.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
