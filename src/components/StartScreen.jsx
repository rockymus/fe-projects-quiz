export default function StartScreen({startGame}) {
    return (
        <div className="start-quiz-container">
          <h1>Quizzical</h1>
          <p>Can you answer all the questions?</p>
          <button onClick={() => startGame()}>Start quiz</button>
        </div>
    )
}