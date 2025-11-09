import { useState, useEffect, useRef, use } from "react"
import he from 'he';
import Question from "./components/Question"
import StartScreen from "./components/StartScreen";
import LoadingSpinner from "./components/LoadingSpinner";

export default function App() {
  const [gameState, setGameState] = useState("start") // start, loading, playing, over
  const [questions, setQuestions] = useState([])
  const [correctAnswers, setCorrectAnswers] = useState(0)


  function selectAnswer(question) {
    setQuestions(prevQuestions =>
      prevQuestions.map(q =>
        q.questionNumber === question.questionNumber ? { ...q, answer: question.answer } : q))
  }


  async function startGame() {
    setGameState("loading")
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
    setGameState("playing")
  }

  function checkAnswers() {
    if (gameState === "over") {
      startGame()
    } else if (questions.every((question) => question.answer)) {
      setGameState("over")
      setCorrectAnswers(questions.filter((el) => el.answer === el.correctAnswer).length)
    }
  }

  const questionElements = questions.map((question) =>
    <Question key={question.questionNumber} question={question} selectAnswer={selectAnswer} gameOver={gameState === "over"} />
  )
  console.log("meow");
  return (
    <main>
      {gameState === "loading" && <LoadingSpinner />}
      {gameState === "start" && <StartScreen startGame={startGame} />}
      {(gameState === "playing" || gameState === "over") && <div className="questions-container">
        {questionElements}
        {gameState === "over" && <p>You scored {`${correctAnswers}/${questions.length}`} correct answers</p>}
        <button onClick={() => checkAnswers()} className="submit-button">{gameState === "playing" ? "Check answers" : "Play again"}</button>
      </div>}
    </main>
  )
}