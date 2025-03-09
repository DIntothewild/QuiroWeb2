import React from 'react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-section">
          <h2>Sobre Nosotros</h2>
          <p>Somos un centro de terapias dedicado a brindar bienestar y relajación.</p>
        </div>

        <div className="footer-section">
          <h2>Contacto</h2>
          <p>Email: <a href="mailto:info@miempresa.com">info@miempresa.com</a></p>
          <p>Teléfono: +34 123 456 789</p>
        </div>

        <div className="footer-section">
          <h2>Síguenos</h2>
          <div className="social-icons">
            <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer">
              <i className="fab fa-facebook"></i>
            </a>
            <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer">
              <i className="fab fa-instagram"></i>
            </a>
            <a href="https://wa.me/34123456789" target="_blank" rel="noopener noreferrer">
              <i className="fab fa-whatsapp"></i>
            </a>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        © 2024 Mi Empresa de Terapias. Todos los derechos reservados.
      </div>
    </footer>
  );
};

export default Footer;