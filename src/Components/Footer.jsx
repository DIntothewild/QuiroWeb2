import React from 'react';
import './Footer.css'; // Asegúrate de tener este archivo de estilos

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-section">
          <h3>Sobre Nosotros</h3>
          <p>
            Somos un centro de terapias dedicado a brindar bienestar y relajación. 
            Nuestro equipo profesional está listo para ofrecerte una experiencia única.
          </p>
        </div>
        <div className="footer-section">
          <h3>Contacto</h3>
          <p>Email: <a href="mailto:info@miempresa.com">info@miempresa.com</a></p>
          <p>Teléfono: +34 123 456 789</p>
        </div>
        <div className="footer-section">
          <h3>Síguenos</h3>
          <div className="social-media">
            <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer">
              Facebook
            </a>
            <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer">
              Instagram
            </a>
            <a href="https://www.twitter.com" target="_blank" rel="noopener noreferrer">
              Twitter
            </a>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; 2024 Mi Empresa de Terapias. Todos los derechos reservados.</p>
      </div>
    </footer>
  );
};

export default Footer;
