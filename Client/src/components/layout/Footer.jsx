import React from 'react'
import { Heart } from 'lucide-react'
import './Footer.css'

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <p>
          Made with <Heart size={16} className="heart-icon" /> for your career journey
        </p>
        <p>&copy; 2024 CareerGuide. All rights reserved.</p>
      </div>
    </footer>
  )
}

export default Footer
