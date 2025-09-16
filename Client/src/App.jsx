import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { UserProvider, useUser } from './contexts/UserContext'
import Layout from './components/layout/Layout'
import Login from './pages/Login/Login'
import Register from './pages/Login/Register'
import Quiz from './pages/Quiz/Quiz'
import Home from './pages/Home/Home'
import Chatbot from './pages/Chatbot/Chatbot'
import Colleges from './pages/Colleges/Colleges'
import Careers from './pages/Careers/Careers'
import Alerts from './pages/Alerts/Alerts'
import CourseDetails from './pages/CourseDetails/CourseDetails'
import './App.css'

// A wrapper to protect routes
const ProtectedRoute = ({ children }) => {
  const { user } = useUser()
  return user ? children : <Navigate to="/login" replace />
}

const App = () => {
  return (
    <UserProvider>
      <Router>
        <div className="App">
          <Routes>
            {/* Public routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Protected routes */}
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Layout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Home />} />
              <Route path="quiz" element={<Quiz />} />
              <Route path="chatbot" element={<Chatbot />} />
              <Route path="colleges" element={<Colleges />} />
              <Route path="careers" element={<Careers />} />
              <Route path="alerts" element={<Alerts />} />
              <Route path="course/:id" element={<CourseDetails />} />
            </Route>

            {/* Catch-all redirect */}
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </div>
      </Router>
    </UserProvider>
  )
}

export default App
