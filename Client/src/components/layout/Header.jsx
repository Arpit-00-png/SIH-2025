import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Home, MessageCircle, Building2, Briefcase, Bell } from 'lucide-react'
import './Header.css'

const Header = () => {
  const location = useLocation()

  const navItems = [
    { path: '/', label: 'Home', icon: Home },
    { path: '/chatbot', label: 'AI Chat', icon: MessageCircle },
    { path: '/colleges', label: 'Colleges', icon: Building2 },
    { path: '/careers', label: 'Careers', icon: Briefcase },
    { path: '/alerts', label: 'Alerts', icon: Bell }
  ]

  return (
    <header className="header">
      <div className="header-container">
        <div className="logo">
          <h2>CareerGuide</h2>
        </div>
        <nav className="nav">
          {navItems.map(({ path, label, icon: Icon }) => (
            <Link
              key={path}
              to={path}
              className={`nav-link ${location.pathname === path ? 'active' : ''}`}
            >
              <Icon size={20} />
              <span>{label}</span>
            </Link>
          ))}
        </nav>
      </div>
    </header>
  )
}

export default Header 