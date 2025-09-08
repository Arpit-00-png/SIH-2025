import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { UserProvider } from './contexts/UserContext'
import Layout from './components/layout/Layout'
import Login from './pages/Login/Login'
import Quiz from './pages/Quiz/Quiz'
import Home from './pages/Home/Home'
import Chatbot from './pages/Chatbot/Chatbot'
import Colleges from './pages/Colleges/Colleges'
import Careers from './pages/Careers/Careers'
import Alerts from './pages/Alerts/Alerts'
import CourseDetails from './pages/CourseDetails/CourseDetails'
import './App.css'

const App = () => {
  return (
    <UserProvider>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/quiz" element={<Quiz />} />
            <Route path="/" element={<Layout />}>
              <Route index element={<Home />} />
              <Route path="chatbot" element={<Chatbot />} />
              <Route path="colleges" element={<Colleges />} />
              <Route path="careers" element={<Careers />} />
              <Route path="alerts" element={<Alerts />} />
              <Route path="course/:id" element={<CourseDetails />} />
            </Route>
          </Routes>
        </div>
      </Router>
    </UserProvider>
  )
}

export default App
