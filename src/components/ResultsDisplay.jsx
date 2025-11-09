export default function ResultsDisplay({ score, total, onPlayAgain }) {
  return (
    <div className="results">
      <p className="score">You scored {score}/{total} correct answers</p>
      <button onClick={onPlayAgain} className="submit-button">Play again</button>
    </div>
  )
}
