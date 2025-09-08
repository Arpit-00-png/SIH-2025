import React from 'react'
import { TrendingUp, DollarSign, Users, Briefcase } from 'lucide-react'
import './Careers.css'

const Careers = () => {
  const careers = [
    {
      id: 1,
      title: 'Software Engineer',
      description: 'Design and develop software applications and systems',
      salary: '₹8-15 LPA',
      demand: 'High',
      skills: ['Programming', 'Problem Solving', 'Teamwork'],
      icon: Briefcase
    },
    {
      id: 2,
      title: 'Data Scientist',
      description: 'Analyze complex data to help organizations make decisions',
      salary: '₹10-20 LPA',
      demand: 'Very High',
      skills: ['Statistics', 'Machine Learning', 'Python'],
      icon: TrendingUp
    },
    {
      id: 3,
      title: 'Product Manager',
      description: 'Lead product development and strategy',
      salary: '₹12-25 LPA',
      demand: 'High',
      skills: ['Leadership', 'Strategy', 'Communication'],
      icon: Users
    },
    {
      id: 4,
      title: 'Investment Banker',
      description: 'Help companies raise capital and make investments',
      salary: '₹15-30 LPA',
      demand: 'Medium',
      skills: ['Finance', 'Analytics', 'Networking'],
      icon: DollarSign
    }
  ]

  return (
    <div className="careers-container">
      <div className="careers-header">
        <h1>Career Opportunities</h1>
        <p>Explore potential career paths based on your interests and skills</p>
      </div>

      <div className="careers-grid">
        {careers.map(career => (
          <div key={career.id} className="career-card">
            <div className="career-icon">
              <career.icon size={32} />
            </div>
            <div className="career-content">
              <h3>{career.title}</h3>
              <p className="career-description">{career.description}</p>
              
              <div className="career-stats">
                <div className="stat">
                  <span className="stat-label">Salary Range</span>
                  <span className="stat-value">{career.salary}</span>
                </div>
                <div className="stat">
                  <span className="stat-label">Market Demand</span>
                  <span className={`stat-value demand-${career.demand.toLowerCase().replace(' ', '-')}`}>
                    {career.demand}
                  </span>
                </div>
              </div>

              <div className="career-skills">
                <h4>Key Skills</h4>
                <div className="skills-list">
                  {career.skills.map((skill, index) => (
                    <span key={index} className="skill-tag">{skill}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Careers