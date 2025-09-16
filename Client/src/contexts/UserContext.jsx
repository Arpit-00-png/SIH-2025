// contexts/UserContext.jsx
import React, { createContext, useContext, useState, useEffect } from "react";

const UserContext = createContext(null);

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // AI results cache
  const [aiSkills, setAiSkills] = useState(null);
  const [aiCourses, setAiCourses] = useState(null);
  const [aiCareers, setAiCareers] = useState(null);

  // ✅ Load profile from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem("userProfile");
      if (saved) {
        setUser(JSON.parse(saved));
      }
    } catch (err) {
      console.error("Failed to load user profile:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // ✅ Save profile automatically when user changes
  useEffect(() => {
    if (user) {
      try {
        localStorage.setItem("userProfile", JSON.stringify(user));
      } catch (err) {
        console.error("Failed to save user profile:", err);
      }
    }
  }, [user]);

  // ✅ Merge updates (e.g., from quiz results)
  const updateUser = (updates) => {
    setUser((prev) => ({
      ...(prev || {}),
      ...updates,
    }));
  };

  const login = (data) => {
    setUser(data);
  };

  const logout = () => {
    setUser(null);
    setAiSkills(null);
    setAiCourses(null);
    setAiCareers(null);
    try {
      localStorage.removeItem("userProfile");
    } catch (err) {
      console.error("Failed to clear user profile on logout:", err);
    }
  };

  const value = {
    user,
    updateUser,
    login,
    logout,
    isLoading,
    aiSkills,
    setAiSkills,
    aiCourses,
    setAiCourses,
    aiCareers,
    setAiCareers,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};
