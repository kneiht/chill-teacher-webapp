import React, { useState } from 'react'

interface SlideProps {
  isActive: boolean
}

const Slide5: React.FC<SlideProps> = ({ isActive }) => {
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
        Bài tập 1: Thêm -ing vào động từ
      </h2>
      <p className="text-2xl mb-8">Chuyển các động từ sau sang dạng -ing:</p>
      <div className="grid grid-cols-1 gap-4">
        <div className="exercise-item bg-white p-4 rounded-xl shadow-md">
          <p className="text-2xl mb-4">
            write →
            <input
              type="text"
              className="exercise-input"
              value={answers['write'] || ''}
              onChange={(e) =>
                setAnswers((prev) => ({ ...prev, write: e.target.value }))
              }
            />
            (viết)
          </p>
          <div className="flex items-center space-x-4">
            <button
              onClick={() =>
                feedback['write']
                  ? resetExercise('write')
                  : checkInput('write', 'writing')
              }
              className="btn-check px-4 py-2 rounded-lg font-bold"
            >
              {feedback['write'] ? 'Làm lại' : 'Kiểm tra'}
            </button>
            <div
              className={`text-2xl ${feedback['write'] === 'correct' ? 'correct' : feedback['write'] === 'incorrect' ? 'incorrect' : 'hidden'}`}
            >
              {feedback['write'] === 'correct'
                ? '✓ Đúng: writing'
                : '✗ Sai: Đáp án đúng là "writing"'}
            </div>
          </div>
        </div>
        <div className="exercise-item bg-white p-4 rounded-xl shadow-md">
          <p className="text-2xl mb-4">
            run →
            <input
              type="text"
              className="exercise-input"
              value={answers['run'] || ''}
              onChange={(e) =>
                setAnswers((prev) => ({ ...prev, run: e.target.value }))
              }
            />
            (chạy)
          </p>
          <div className="flex items-center space-x-4">
            <button
              onClick={() =>
                feedback['run']
                  ? resetExercise('run')
                  : checkInput('run', 'running')
              }
              className="btn-check px-4 py-2 rounded-lg font-bold"
            >
              {feedback['run'] ? 'Làm lại' : 'Kiểm tra'}
            </button>
            <div
              className={`text-2xl ${feedback['run'] === 'correct' ? 'correct' : feedback['run'] === 'incorrect' ? 'incorrect' : 'hidden'}`}
            >
              {feedback['run'] === 'correct'
                ? '✓ Đúng: running'
                : '✗ Sai: Đáp án đúng là "running"'}
            </div>
          </div>
        </div>
        <div className="exercise-item bg-white p-4 rounded-xl shadow-md">
          <p className="text-2xl mb-4">
            lie →
            <input
              type="text"
              className="exercise-input"
              value={answers['lie'] || ''}
              onChange={(e) =>
                setAnswers((prev) => ({ ...prev, lie: e.target.value }))
              }
            />
            (nằm)
          </p>
          <div className="flex items-center space-x-4">
            <button
              onClick={() =>
                feedback['lie']
                  ? resetExercise('lie')
                  : checkInput('lie', 'lying')
              }
              className="btn-check px-4 py-2 rounded-lg font-bold"
            >
              {feedback['lie'] ? 'Làm lại' : 'Kiểm tra'}
            </button>
            <div
              className={`text-2xl ${feedback['lie'] === 'correct' ? 'correct' : feedback['lie'] === 'incorrect' ? 'incorrect' : 'hidden'}`}
            >
              {feedback['lie'] === 'correct'
                ? '✓ Đúng: lying'
                : '✗ Sai: Đáp án đúng là "lying"'}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Slide5
