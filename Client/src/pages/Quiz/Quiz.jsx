import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { analyzeQuizResults } from '../../services/geminiService'
import { useUser } from '../../contexts/UserContext'
import './Quiz.css'

const Quiz = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const navigate = useNavigate()
  const { user, updateUser } = useUser()

  // Stream options map to normalized keys used on Home
  const streamOptionToKey = {
    'Science (PCM – Physics, Chemistry, Maths)': 'Science (PCM)',
    'Science (PCB – Physics, Chemistry, Biology)': 'Science (PCB)',
    'Commerce': 'Commerce',
    'Arts / Humanities': 'Arts / Humanities'
  }

  const questions = [
    {
      id: 0,
      question: 'Which stream are you studying right now?',
      options: [
        'Science (PCM – Physics, Chemistry, Maths)',
        'Science (PCB – Physics, Chemistry, Biology)',
        'Commerce',
        'Arts / Humanities'
      ]
    },
    {
      id: 1,
      question: "What subjects do you enjoy the most?",
      options: [
        "Mathematics and Science",
        "Literature and Arts",
        "Social Sciences",
        "Technology and Programming"
      ]
    },
    {
      id: 2,
      question: "How do you prefer to work?",
      options: [
        "Independently",
        "In small teams",
        "Leading others",
        "Collaborating with many people"
      ]
    },
    {
      id: 3,
      question: "What motivates you most?",
      options: [
        "Solving complex problems",
        "Helping others",
        "Creating something new",
        "Making money"
      ]
    },
    {
      id: 4,
      question: "What's your ideal work environment?",
      options: [
        "Office setting",
        "Remote work",
        "Outdoor/Field work",
        "Laboratory/Research facility"
      ]
    },
    {
      id: 5,
      question: "How do you handle challenges?",
      options: [
        "Analyze and plan carefully",
        "Ask for help immediately",
        "Try different approaches",
        "Persist until solved"
      ]
    }
  ]

  const handleAnswer = (questionId, answer) => {
    setAnswers({
      ...answers,
      [questionId]: answer
    })
  }

  const submitQuiz = async () => {
    setIsSubmitting(true)
    try {
      // Persist normalized stream to profile
      const streamAnswer = answers[0]
      const streamKey = streamOptionToKey[streamAnswer] || null

      if (streamKey) {
        updateUser({ stream: streamKey })
      }

      // Optionally run AI analysis with all answers
      const result = await analyzeQuizResults(answers, user)
      updateUser({ quizResults: { answers, analysis: result } })

      // Go to Home so cards update based on stream
      navigate('/')
    } catch (e) {
      console.error('Quiz analysis failed', e)
      navigate('/')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    } else {
      submitQuiz()
    }
  }

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1)
    }
  }

  const currentQ = questions[currentQuestion]
  const progress = ((currentQuestion + 1) / questions.length) * 100

  return (
    <div className="quiz-container">
      <div className="quiz-card">
        <div className="quiz-header">
          <h1>Career Assessment Quiz</h1>
          <p>Start by selecting your stream. This helps us personalize courses and careers.</p>
          <div className="progress-bar">
            <div className="progress" style={{ width: `${progress}%` }}></div>
          </div>
          <span className="progress-text">
            Question {currentQuestion + 1} of {questions.length}
          </span>
        </div>

        <div className="question-section">
          <h2 className="question">{currentQ.question}</h2>
          <div className="options">
            {currentQ.options.map((option, index) => (
              <button
                key={index}
                className={`option ${answers[currentQ.id] === option ? 'selected' : ''}`}
                onClick={() => handleAnswer(currentQ.id, option)}
                disabled={isSubmitting}
              >
                {option}
              </button>
            ))}
          </div>
        </div>

        <div className="quiz-navigation">
          <button
            onClick={handlePrevious}
            disabled={currentQuestion === 0 || isSubmitting}
            className="btn btn-secondary"
          >
            <ChevronLeft size={20} />
            Previous
          </button>
          <button
            onClick={handleNext}
            disabled={!answers[currentQ.id] || isSubmitting}
            className="btn btn-primary"
          >
            {currentQuestion === questions.length - 1 ? (isSubmitting ? 'Analyzing...' : 'Finish') : 'Next'}
            <ChevronRight size={20} />
          </button>
        </div>
      </div>
    </div>
  )
}

export default Quiz 