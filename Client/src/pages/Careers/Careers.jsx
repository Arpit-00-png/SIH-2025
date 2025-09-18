import React, { useState, useEffect } from 'react';
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
  const { user, userStream, aiSkills, aiCareers, setAiCareers } = useUser();

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

  // Lightweight fallback careers (reduced from 6 to 3 essential ones)
  const getFallbackCareers = () => [
    {
      title: 'Software Engineer',
      description: 'Build software applications and systems',
      salary: '₹8-15 LPA',
      demand: 'High',
      skills: ['Programming', 'Problem Solving'],
      matchScore: 75,
      personalizedReason: 'Strong market demand',
      icon: 'code'
    },
    {
      title: 'Data Analyst',
      description: 'Analyze data for business insights',
      salary: '₹6-12 LPA',
      demand: 'High', 
      skills: ['Analytics', 'Excel'],
      matchScore: 70,
      personalizedReason: 'Growing field across industries',
      icon: 'trending-up'
    },
    {
      title: 'Digital Marketing',
      description: 'Manage online marketing campaigns',
      salary: '₹4-10 LPA',
      demand: 'Medium',
      skills: ['Marketing', 'Content'],
      matchScore: 65,
      personalizedReason: 'Creative with good opportunities',
      icon: 'megaphone'
    }
  ];

  // Auto-generate on mount if no careers exist
  useEffect(() => {
    if (!aiCareers || aiCareers.length === 0) {
      refreshCareers();
    }
  }, []);

  // Optimized refresh function with minimal data
  const refreshCareers = async () => {
    setLoading(true);
    setError(null);

    try {
      // Create lightweight profile object with only essential data
      const minimalProfile = {
        stream: userStream || user?.education || 'General',
        interests: user?.interests?.slice(0, 3) || [],
        skills: aiSkills?.slice(0, 3) || user?.skills?.slice(0, 3) || [],
        location: user?.location || 'India',
        careerGoals: user?.careerGoals || ''
      };

      const careerData = await generatePersonalizedCareers(minimalProfile, 3);

      if (Array.isArray(careerData) && careerData.length > 0) {
        setAiCareers(careerData);
      } else {
        setAiCareers(getFallbackCareers());
      }
    } catch (err) {
      console.error('Career generation error:', err);
      setError('AI service temporarily unavailable');
      setAiCareers(getFallbackCareers());
    } finally {
      setLoading(false);
    }
  };

  // Simplified UI helpers
  const getDemandColor = (demand) => {
    const colors = { 'Very High': 'demand-very-high', 'High': 'demand-high', 'Medium': 'demand-medium' };
    return colors[demand] || 'demand-medium';
  };

  const getMatchScoreColor = (score) => {
    if (score >= 80) return 'match-excellent';
    if (score >= 65) return 'match-good';
    return 'match-fair';
  };

  const CareerCard = ({ career }) => {
    const IconComponent = iconMap[career.icon] || Briefcase;

    return (
      <div className="career-card enhanced">
        <div className="career-header">
          <div className="career-icon">
            <IconComponent size={28} />
          </div>
          <div className="career-title-section">
            <h3>{career.title}</h3>
            {career.matchScore && (
              <div className="match-score">
                <Target size={14} />
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
              <Sparkles size={14} />
              <p>{career.personalizedReason}</p>
            </div>
          )}

          <div className="career-stats">
            <div className="stat">
              <span className="stat-label">Salary</span>
              <span className="stat-value salary">{career.salary}</span>
            </div>
            <div className="stat">
              <span className="stat-label">Demand</span>
              <span className={`stat-value ${getDemandColor(career.demand)}`}>
                {career.demand}
              </span>
            </div>
          </div>

          <div className="career-skills">
            <h4>Key Skills</h4>
            <div className="skills-list">
              {career.skills?.slice(0, 4).map((skill, index) => (
                <span key={index} className="skill-tag">{skill}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="careers-container automated">
      <div className="careers-header enhanced">
        <h1>AI Career Recommendations</h1>
        <p>Personalized suggestions based on your profile and market trends</p>

        {userStream && <p className="mt-2"><strong>Stream:</strong> {userStream}</p>}
        {aiSkills?.length > 0 && (
          <p className="mt-2"><strong>Top Skills:</strong> {aiSkills.slice(0, 4).join(', ')}</p>
        )}
      </div>

      {error && (
        <div className="error-message">
          <p>{error}</p>
        </div>
      )}

      <div className="refresh-section">
        <button onClick={refreshCareers} disabled={loading} className="refresh-button">
          <RefreshCw size={16} className={loading ? 'spinning' : ''} />
          <span>{loading ? 'Generating...' : 'Refresh Recommendations'}</span>
        </button>
      </div>

      {loading && (
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Analyzing your profile...</p>
        </div>
      )}

      {!loading && aiCareers?.length > 0 && (
        <div className="careers-grid enhanced">
          {aiCareers.map((career, index) => (
            <CareerCard key={`${career.title}-${index}`} career={career} />
          ))}
        </div>
      )}

      {!loading && (!aiCareers || aiCareers.length === 0) && (
        <div className="empty-state">
          <Briefcase size={48} />
          <p>No recommendations found. Try refreshing.</p>
          <button onClick={refreshCareers} className="retry-button">Try Again</button>
        </div>
      )}
    </div>
  );
};

export default Careers;
