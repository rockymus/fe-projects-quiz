
import { clsx } from 'clsx';
import { useMemo } from 'react';


export default function Question({ question, selectAnswer, gameOver }) {    

    const answerElements = question.answers.map(ans => <button disabled={gameOver} onClick={() => selectAnswer({...question, answer: ans})} className={clsx({
        "answer-correct": question.correctAnswer === ans && gameOver,
        "answer-wrong": question.answer === ans && question.incorrectAnswers.includes(question.answer) && gameOver,
        "answer-selected": question.answer === ans && !gameOver,
    })} key={`${question.questionNumber}-${ans}`}>{ans}</button>)
    return (
        <section className="question">
            <h3>{question.question}</h3>
            <div className="answers">
                {answerElements}
            </div>
            <hr />
        </section>
    )
}