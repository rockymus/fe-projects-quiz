export default function StartScreen({ onStart, error }) {
  return (
    <div className="start-quiz-container">
      <h1>Quizzical</h1>
      <p>Can you answer all the questions?</p>
      {error && <p style={{ color: 'red' }}>Error: {error}</p>}
      <button onClick={onStart}>Start quiz</button>
    </div>
  )
}
