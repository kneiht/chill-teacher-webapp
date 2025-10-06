import React, { useState } from 'react'

interface SlideProps {
  isActive: boolean
}

const Slide8: React.FC<SlideProps> = ({ isActive }) => {
  const [answers, setAnswers] = useState<{ [key: string]: string }>({})
  const [feedback, setFeedback] = useState<{ [key: string]: string }>({})

  const checkInput = (exerciseId: string, correctAnswer: string) => {
    const userAnswer = (answers[exerciseId] || '')
      .trim()
      .toLowerCase()
      .replace(/[.?]/g, '')
    const correct = correctAnswer.toLowerCase().replace(/[.?]/g, '')
    if (userAnswer === correct) {
      setFeedback((prev) => ({ ...prev, [exerciseId]: 'correct' }))
    } else {
      setFeedback((prev) => ({ ...prev, [exerciseId]: 'incorrect' }))
    }
  }

  const resetExercise = (exerciseId: string) => {
    setAnswers((prev) => ({ ...prev, [exerciseId]: '' }))
    setFeedback((prev) => ({ ...prev, [exerciseId]: '' }))
  }

  return (
    <div
      className={`slide content-box px-5 py-2 rounded-2xl w-full h-full ${isActive ? 'active' : ''}`}
    >
      <h2 className="text-2xl md:text-3xl font-bold text-indigo-700 mb-5">
        Bài tập 2: Chuyển sang câu phủ định
      </h2>
      <p className="text-2xl mb-8">Chuyển các câu sau sang dạng phủ định:</p>
      <div className="grid grid-cols-1 gap-4">
        <div className="exercise-item bg-white p-4 rounded-xl shadow-md">
          <p className="text-2xl mb-4">
            I am studying English. → I
            <input
              type="text"
              className="exercise-input"
              value={answers['study'] || ''}
              onChange={(e) =>
                setAnswers((prev) => ({ ...prev, study: e.target.value }))
              }
            />
            .
          </p>
          <div className="flex items-center space-x-4">
            <button
              onClick={() =>
                feedback['study']
                  ? resetExercise('study')
                  : checkInput('study', 'am not studying English')
              }
              className="btn-check px-4 py-2 rounded-lg font-bold"
            >
              {feedback['study'] ? 'Làm lại' : 'Kiểm tra'}
            </button>
            <div
              className={`text-2xl ${feedback['study'] === 'correct' ? 'correct' : feedback['study'] === 'incorrect' ? 'incorrect' : 'hidden'}`}
            >
              {feedback['study'] === 'correct'
                ? '✓ Đúng: am not studying English'
                : '✗ Sai: Đáp án đúng là "am not studying English"'}
            </div>
          </div>
        </div>
        <div className="exercise-item bg-white p-4 rounded-xl shadow-md">
          <p className="text-2xl mb-4">
            She is cooking dinner. → She
            <input
              type="text"
              className="exercise-input"
              value={answers['cook'] || ''}
              onChange={(e) =>
                setAnswers((prev) => ({ ...prev, cook: e.target.value }))
              }
            />
            .
          </p>
          <div className="flex items-center space-x-4">
            <button
              onClick={() =>
                feedback['cook']
                  ? resetExercise('cook')
                  : checkInput('cook', "isn't cooking dinner")
              }
              className="btn-check px-4 py-2 rounded-lg font-bold"
            >
              {feedback['cook'] ? 'Làm lại' : 'Kiểm tra'}
            </button>
            <div
              className={`text-2xl ${feedback['cook'] === 'correct' ? 'correct' : feedback['cook'] === 'incorrect' ? 'incorrect' : 'hidden'}`}
            >
              {feedback['cook'] === 'correct'
                ? "✓ Đúng: isn't cooking dinner"
                : '✗ Sai: Đáp án đúng là "isn\'t cooking dinner"'}
            </div>
          </div>
        </div>
        <div className="exercise-item bg-white p-4 rounded-xl shadow-md">
          <p className="text-2xl mb-4">
            They are playing football. → They
            <input
              type="text"
              className="exercise-input"
              value={answers['play'] || ''}
              onChange={(e) =>
                setAnswers((prev) => ({ ...prev, play: e.target.value }))
              }
            />
            .
          </p>
          <div className="flex items-center space-x-4">
            <button
              onClick={() =>
                feedback['play']
                  ? resetExercise('play')
                  : checkInput('play', "aren't playing football")
              }
              className="btn-check px-4 py-2 rounded-lg font-bold"
            >
              {feedback['play'] ? 'Làm lại' : 'Kiểm tra'}
            </button>
            <div
              className={`text-2xl ${feedback['play'] === 'correct' ? 'correct' : feedback['play'] === 'incorrect' ? 'incorrect' : 'hidden'}`}
            >
              {feedback['play'] === 'correct'
                ? "✓ Đúng: aren't playing football"
                : '✗ Sai: Đáp án đúng là "aren\'t playing football"'}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Slide8
