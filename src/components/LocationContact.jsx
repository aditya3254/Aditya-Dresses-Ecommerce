import React from 'react';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';
import { motion } from 'framer-motion';

const LocationContact = () => {
  return (
    <section id="contact" className="contact-section">
      <h2 className="title-section">Visit Us</h2>
      
      <div className="contact-container">
        <motion.div 
          className="contact-info"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="info-item">
            <MapPin className="contact-icon" />
            <div>
              <h3>Location</h3>
              <p>Sikta<br/>Bihar, 845307</p>
            </div>
          </div>
          
          <div className="info-item">
            <Phone className="contact-icon" />
            <div>
              <h3>Phone</h3>
              <p>+91 9973106599</p>
            </div>
          </div>

          <div className="info-item">
            <Mail className="contact-icon" />
            <div>
              <h3>Proprietor</h3>
              <p>Mr. Anil Prasad</p>
            </div>
          </div>

          <div className="info-item">
            <Clock className="contact-icon" />
            <div>
              <h3>Opening Hours</h3>
              <p>Mon - Sun: 9:00 AM - 8:00 PM</p>
            </div>
          </div>
        </motion.div>

        <motion.div 
          className="contact-map"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
        >
          <iframe 
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14275.601955054174!2d84.7335!3d27.2!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3993510065ad07cb%3A0xc6b8bf586f1e6fbe!2sSikta%2C%20Bihar!5e0!3m2!1sen!2sin!4v1713800000000!5m2!1sen!2sin" 
            width="100%" 
            height="100%" 
            style={{ border: 0 }} 
            allowFullScreen="" 
            loading="lazy" 
            referrerPolicy="no-referrer-when-downgrade"
            title="Store Location"
          ></iframe>
        </motion.div>
      </div>
    </section>
  );
};

export default LocationContact;
