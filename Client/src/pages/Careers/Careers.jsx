// src/pages/Careers/Careers.jsx
import React, { useState } from 'react';
import {
  TrendingUp,
  DollarSign,
  Users,
  Briefcase,
  Code,
  Brain,
  Cloud,
  Palette,
  BarChart,
  Megaphone,
  RefreshCw,
  Sparkles,
  Target
} from 'lucide-react';

import { generatePersonalizedCareers } from '../../services/geminiService.js';
import { useUser } from '../../contexts/UserContext.jsx';
import './Careers.css';

const Careers = () => {
  const { user, userStream, aiSkills, aiCourses, aiCareers, setAiCareers } = useUser();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Icon mapping
  const iconMap = {
    'briefcase': Briefcase,
    'trending-up': TrendingUp,
    'dollar-sign': DollarSign,
    'users': Users,
    'code': Code,
    'brain': Brain,
    'cloud': Cloud,
    'palette': Palette,
    'bar-chart': BarChart,
    'megaphone': Megaphone
  };

  // Fallback careers
  const getFallbackCareers = () => [
    {
      title: 'Software Engineer',
      description: 'Design and develop software applications and systems',
      salary: '₹8-15 LPA',
      demand: 'High',
      skills: ['Programming', 'Problem Solving', 'Teamwork'],
      growth: 'Excellent growth prospects in tech',
      matchScore: 75,
      personalizedReason: 'Strong demand in current market',
      icon: 'code'
    },
    {
      title: 'Data Scientist',
      description: 'Analyze complex data to help organizations make decisions',
      salary: '₹10-20 LPA',
      demand: 'Very High',
      skills: ['Statistics', 'Machine Learning', 'Python'],
      growth: 'Rapidly growing field with AI/ML boom',
      matchScore: 80,
      personalizedReason: 'High demand for data skills across industries',
      icon: 'trending-up'
    }
  ];

  // Refresh personalized recommendations
  const refreshCareers = async () => {
    if (!user) {
      setAiCareers(getFallbackCareers());
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const careerData = await generatePersonalizedCareers(user, 6);

      if (Array.isArray(careerData) && careerData.length > 0) {
        setAiCareers(careerData);
      } else {
        setAiCareers(getFallbackCareers());
      }
    } catch (err) {
      console.error('Error refreshing careers:', err);
      setError(err?.message || 'AI service error');
      setAiCareers(aiCareers?.length ? aiCareers : getFallbackCareers());
    } finally {
      setLoading(false);
    }
  };

  // helpers for UI
  const getDemandColor = (demand) => {
    const colors = {
      'Very High': 'demand-very-high',
      'High': 'demand-high',
      'Medium': 'demand-medium',
      'Low': 'demand-low'
    };
    return colors[demand] || 'demand-medium';
  };

  const getMatchScoreColor = (score) => {
    if (score >= 85) return 'match-excellent';
    if (score >= 70) return 'match-good';
    if (score >= 55) return 'match-fair';
    return 'match-poor';
  };

  const CareerCard = ({ career }) => {
    const IconComponent = iconMap[career.icon] || Briefcase;

    return (
      <div className="career-card enhanced">
        <div className="career-header">
          <div className="career-icon">
            <IconComponent size={32} />
          </div>
          <div className="career-title-section">
            <h3>{career.title}</h3>
            {typeof career.matchScore !== 'undefined' && (
              <div className="match-score">
                <Target size={16} />
                <span className={`score ${getMatchScoreColor(career.matchScore)}`}>
                  {Math.round(career.matchScore)}% Match
                </span>
              </div>
            )}
          </div>
        </div>

        <div className="career-content">
          <p className="career-description">{career.description}</p>

          {career.personalizedReason && (
            <div className="personalized-reason">
              <Sparkles size={16} />
              <p>{career.personalizedReason}</p>
            </div>
          )}

          <div className="career-stats">
            <div className="stat">
              <span className="stat-label">Salary Range</span>
              <span className="stat-value salary">{career.salary}</span>
            </div>
            <div className="stat">
              <span className="stat-label">Market Demand</span>
              <span className={`stat-value ${getDemandColor(career.demand)}`}>
                {career.demand}
              </span>
            </div>
          </div>

          <div className="career-skills">
            <h4>Key Skills</h4>
            <div className="skills-list">
              {career.skills?.map((skill, index) => (
                <span key={index} className="skill-tag">{skill}</span>
              ))}
            </div>
          </div>

          {career.growth && (
            <div className="growth-info">
              <TrendingUp size={16} />
              <span>{career.growth}</span>
            </div>
          )}
        </div>
      </div>
    );
  };
  console.log("aiCourses from context:", aiCourses);
  return (

    <div className="careers-container automated">
      <div className="careers-header enhanced">
        <h1>AI-Powered Career Recommendations</h1>
        <p>Get personalized career suggestions based on your profile, interests, and current market trends</p>

        {userStream && (
          <p className="mt-2"><strong>Your Stream:</strong> {userStream}</p>
        )}

        {aiSkills && (
          <p className="mt-2"><strong>Key Skills:</strong> {aiSkills.join(', ')}</p>
        )}

        {aiCourses && aiCourses.length > 0 && (
          <div className="mt-2">
            <strong>Recommended Courses:</strong>
            <ul className="course-list">
              {aiCourses.map((c, index) => (
                <li key={index}>
                  <span className="course-name">{c.course}</span>
                  {c.score && <span className="course-score"> ({c.score}% Match)</span>}
                  {c.reason && <p className="course-reason">{c.reason}</p>}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {error && (
        <div className="error-message">
          <p>AI Service Error: {error}</p>
          <p>Showing cached or fallback recommendations instead.</p>
        </div>
      )}

      <div className="refresh-section">
        <button onClick={refreshCareers} disabled={loading} className="refresh-button">
          <RefreshCw size={18} className={loading ? 'spinning' : ''} />
          <span>{loading ? 'Generating...' : 'Refresh Recommendations'}</span>
        </button>
      </div>

      {loading && (
        <div className="loading-state">
          <div className="spinner"></div>
          <p>AI is analyzing your profile and generating recommendations...</p>
        </div>
      )}

      {!loading && aiCareers && aiCareers.length > 0 && (
        <div className="careers-grid enhanced">
          {aiCareers.map((career, index) => (
            <CareerCard key={`${career.title}-${index}`} career={career} />
          ))}
        </div>
      )}

      {!loading && (!aiCareers || aiCareers.length === 0) && (
        <div className="empty-state">
          <Briefcase size={64} />
          <p>No recommendations found. Try refreshing or updating your profile.</p>
          <button onClick={refreshCareers} className="retry-button">Try Again</button>
        </div>
      )}
    </div>
  );
};

export default Careers;
