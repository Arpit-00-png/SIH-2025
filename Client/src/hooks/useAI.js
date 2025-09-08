import { useState } from 'react';
import { 
  chatWithAI, 
  analyzeQuizResults, 
  getCollegeRecommendations, 
  getCareerInsights,
  generateSmartAlerts 
} from '../services/geminiService';

export const useAI = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const chat = async (message, history = []) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await chatWithAI(message, history);
      return response;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const analyzeQuiz = async (answers) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await analyzeQuizResults(answers);
      return response;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const getColleges = async (profile) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await getCollegeRecommendations(profile);
      return response;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const getCareer = async (careerName) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await getCareerInsights(careerName);
      return response;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const getAlerts = async (profile, date) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await generateSmartAlerts(profile, date);
      return response;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    chat,
    analyzeQuiz,
    getColleges,
    getCareer,
    getAlerts,
    isLoading,
    error
  };
}; 