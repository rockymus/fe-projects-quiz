import { useState, useEffect, useRef, use } from "react"
import he from 'he';
import Question from "./components/Question"
import StartScreen from "./components/StartScreen";
import LoadingSpinner from "./components/LoadingSpinner";

export default function App() {
  const [gameState, setGameState] = useState("start") // start, loading, playing, over, error
  const [questions, setQuestions] = useState([])
  const [correctAnswers, setCorrectAnswers] = useState(0)
  const [error, setError] = useState(null)


  function selectAnswer(question) {
    setQuestions(prevQuestions =>
      prevQuestions.map(q =>
        q.questionNumber === question.questionNumber ? { ...q, answer: question.answer } : q))
  }


  async function startGame() {
    setGameState("loading")
    setError(null)
    try {
      const res = await fetch("https://opentdb.com/api.php?amount=10")
      
      if (!res.ok) {
        throw new Error(`Failed to fetch questions: ${res.status} ${res.statusText}`)
      }
      
      const data = await res.json()
      
      if (data.response_code !== 0) {
        throw new Error("No questions available. Please try again.")
      }
      
      setQuestions(data.results.map((question, index) => ({
        questionNumber: index + 1,
        question: he.decode(question.question),
        correctAnswer: he.decode(question.correct_answer),
        incorrectAnswers: question.incorrect_answers.map(ans => he.decode(ans)),
        answers: [he.decode(question.correct_answer), ...question.incorrect_answers.map(ans => he.decode(ans))].sort(() => Math.random() - 0.5),
        answer: undefined
      })))
      setGameState("playing")
    } catch (err) {
      console.error("Error fetching questions:", err)
      setError(err.message || "Failed to load questions. Please check your internet connection and try again.")
      setGameState("error")
    }
  }

  function checkAnswers() {
    if (gameState === "over") {
      startGame()
    } else if (questions.every((question) => question.answer)) {
      setGameState("over")
      setCorrectAnswers(questions.filter((el) => el.answer === el.correctAnswer).length)
    } else {
      alert("Please answer all questions before checking answers.")
    }
  }

  const questionElements = questions.map((question) =>
    <Question key={question.questionNumber} question={question} selectAnswer={selectAnswer} gameOver={gameState === "over"} />
  )

  return (
    <main>
      {gameState === "loading" && <LoadingSpinner />}
      {gameState === "start" && <StartScreen startGame={startGame} />}
      {gameState === "error" && (
        <div className="error-container">
          <h2>Oops! Something went wrong</h2>
          <p>{error}</p>
          <button onClick={startGame} className="submit-button">Try Again</button>
        </div>
      )}
      {(gameState === "playing" || gameState === "over") && <div className="questions-container">
        {questionElements}
        {gameState === "over" && <p>You scored {`${correctAnswers}/${questions.length}`} correct answers</p>}
        <button onClick={() => checkAnswers()} className="submit-button">{gameState === "playing" ? "Check answers" : "Play again"}</button>
      </div>}
    </main>
  )
}