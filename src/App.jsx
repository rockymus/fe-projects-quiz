import { useState } from "react"
import he from 'he';
import Question from "./components/Question"
import StartScreen from "./components/StartScreen"
import LoadingSpinner from "./components/LoadingSpinner"

export default function App() {
  const [quizState, setQuizState] = useState('start') // 'start', 'loading', 'playing', 'finished'
  const [questions, setQuestions] = useState([])
  const [error, setError] = useState(null)

  function selectAnswer(question) {
    setQuestions(prevQuestions => 
      prevQuestions.map(q => 
        q.questionNumber === question.questionNumber 
          ? { ...q, answer: question.answer } 
          : q
      )
    )
  }

  async function startQuiz() {
    setQuizState('loading')
    setError(null)
    
    try {
      const res = await fetch("https://opentdb.com/api.php?amount=10")
      
      if (!res.ok) {
        throw new Error('Failed to fetch questions')
      }
      
      const data = await res.json()
      
      setQuestions(data.results.map((question, index) => ({
        questionNumber: index + 1,
        question: he.decode(question.question),
        correctAnswer: he.decode(question.correct_answer),
        incorrectAnswers: question.incorrect_answers.map(ans => he.decode(ans)),
        answers: [
          he.decode(question.correct_answer), 
          ...question.incorrect_answers.map(ans => he.decode(ans))
        ].sort(() => Math.random() - 0.5),
        answer: undefined
      })))
      
      setQuizState('playing')
    } catch (err) {
      setError(err.message)
      setQuizState('start')
    }
  }

  function handleSubmit() {
    if (quizState === 'finished') {
      // Start a new game
      startQuiz()
    } else if (questions.every(question => question.answer)) {
      // Check answers
      setQuizState('finished')
    }
  }

  const calculateScore = () => {
    return questions.filter(q => q.answer === q.correctAnswer).length
  }

  const questionElements = questions.map((question) =>
    <Question 
      key={question.questionNumber} 
      question={question} 
      selectAnswer={selectAnswer} 
      gameOver={quizState === 'finished'} 
    />
  )

  return (
    <main>
      {quizState === 'loading' && <LoadingSpinner />}

      {quizState === 'start' && (
        <StartScreen onStart={startQuiz} error={error} />
      )}

      {(quizState === 'playing' || quizState === 'finished') && (
        <div className="questions-container">
          {questionElements}
          {questions.length > 0 && (
            <div style={{ textAlign: 'center' }}>
              <button onClick={handleSubmit} className="submit-button">
                {quizState === 'finished' ? 'Play again' : 'Check answers'}
              </button>
              {quizState === 'finished' && (
                <p className="score">
                  You scored {calculateScore()}/{questions.length} correct answers
                </p>
              )}
            </div>
          )}
        </div>
      )}
    </main>
  )
}