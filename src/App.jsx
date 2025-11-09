import { useState, useEffect, useRef } from "react"
import he from 'he';
import Question from "./components/Question"

export default function App() {
  const [questions, setQuestions] = useState([])
  const startContainer = useRef(null)
  const submitBtn = useRef(null)
  const loader = useRef(null)
  const mainContainer = useRef(null)

  const [gameOver, setGameOver] = useState(false)

  function selectAnswer(question) {
    const currentQuestionState = questions.find(q => q.questionNumber === question.questionNumber)
    setQuestions(prevQuestions => prevQuestions.map(q => q.questionNumber === question.questionNumber ? { ...currentQuestionState, answer: question.answer } : q))
  }


  async function updateQuestions() {
    loader.current.style.display = "block"
    mainContainer.current.style.display = "none"
    const myHeaders = new Headers();
    myHeaders.append('Content-Type', 'text/plain; charset=UTF-8')
    const res = await fetch("https://opentdb.com/api.php?amount=10")
    const data = await res.json()
    setQuestions(data.results.map((question, index) => ({
      questionNumber: index + 1,
      question: he.decode(question.question),
      correctAnswer: he.decode(question.correct_answer),
      incorrectAnswers: question.incorrect_answers.map(ans => he.decode(ans)),
      answers: [he.decode(question.correct_answer), ...question.incorrect_answers.map(ans => he.decode(ans))].sort(() => Math.random() - 0.5),
      answer: undefined
    })))
    startContainer.current.style.display = "none"
    loader.current.style.display = "none"
    mainContainer.current.style.display = "block"
  }

  function checkAnswers() {
    if (gameOver) {
      setGameOver(false)
      updateQuestions()
      submitBtn.current.textContent = "Check answers"

    }
    else if (questions.every((question) => question.answer)) {
      submitBtn.current.textContent = "New game"

      console.log(submitBtn.current.textContent)
      setGameOver(true)
    }
  }

  const questionElements = questions.map((question) =>
    <Question key={question.questionNumber} question={question} selectAnswer={selectAnswer} gameOver={gameOver} />
  )

  return (
    <main>
      <div ref={loader} class="loader"></div>
      <div ref={mainContainer}>
        <div className="start-quiz-container" ref={startContainer}>
          <h1>Quizzical</h1>
          <p>Can you answer all the questions?</p>
          <button onClick={updateQuestions}>Start quiz</button>
        </div>
        <div className="questions-container">
          {questionElements}
          {questions.length != 0 && <button ref={submitBtn} onClick={checkAnswers} className="submit-button">Check answers</button>}
        </div>
      </div>

    </main>
  )
}