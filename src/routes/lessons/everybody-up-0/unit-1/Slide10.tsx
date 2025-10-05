import React, { useState } from 'react'

interface SlideProps {
  isActive: boolean
}

const Slide10: React.FC<SlideProps> = ({ isActive }) => {
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
        Bài tập 3: Đặt câu hỏi Yes/No
      </h2>
      <p className="text-2xl mb-8">Đặt câu hỏi Yes/No cho các câu sau:</p>
      <div className="grid grid-cols-1 gap-4">
        <div className="exercise-item bg-white p-4 rounded-xl shadow-md">
          <p className="text-2xl mb-4">
            They are playing soccer. →
            <input
              type="text"
              className="exercise-input"
              value={answers['soccer'] || ''}
              onChange={(e) =>
                setAnswers((prev) => ({ ...prev, soccer: e.target.value }))
              }
            />
            ?
          </p>
          <div className="flex items-center space-x-4">
            <button
              onClick={() =>
                feedback['soccer']
                  ? resetExercise('soccer')
                  : checkInput('soccer', 'Are they playing soccer')
              }
              className="btn-check px-4 py-2 rounded-lg font-bold"
            >
              {feedback['soccer'] ? 'Làm lại' : 'Kiểm tra'}
            </button>
            <div
              className={`text-2xl ${feedback['soccer'] === 'correct' ? 'correct' : feedback['soccer'] === 'incorrect' ? 'incorrect' : 'hidden'}`}
            >
              {feedback['soccer'] === 'correct'
                ? '✓ Đúng: Are they playing soccer'
                : '✗ Sai: Đáp án đúng là "Are they playing soccer"'}
            </div>
          </div>
        </div>
        <div className="exercise-item bg-white p-4 rounded-xl shadow-md">
          <p className="text-2xl mb-4">
            He is working in a hospital. →
            <input
              type="text"
              className="exercise-input"
              value={answers['hospital'] || ''}
              onChange={(e) =>
                setAnswers((prev) => ({ ...prev, hospital: e.target.value }))
              }
            />
            ?
          </p>
          <div className="flex items-center space-x-4">
            <button
              onClick={() =>
                feedback['hospital']
                  ? resetExercise('hospital')
                  : checkInput('hospital', 'Is he working in a hospital')
              }
              className="btn-check px-4 py-2 rounded-lg font-bold"
            >
              {feedback['hospital'] ? 'Làm lại' : 'Kiểm tra'}
            </button>
            <div
              className={`text-2xl ${feedback['hospital'] === 'correct' ? 'correct' : feedback['hospital'] === 'incorrect' ? 'incorrect' : 'hidden'}`}
            >
              {feedback['hospital'] === 'correct'
                ? '✓ Đúng: Is he working in a hospital'
                : '✗ Sai: Đáp án đúng là "Is he working in a hospital"'}
            </div>
          </div>
        </div>
        <div className="exercise-item bg-white p-4 rounded-xl shadow-md">
          <p className="text-2xl mb-4">
            I am reading a book. →
            <input
              type="text"
              className="exercise-input"
              value={answers['book'] || ''}
              onChange={(e) =>
                setAnswers((prev) => ({ ...prev, book: e.target.value }))
              }
            />
            ?
          </p>
          <div className="flex items-center space-x-4">
            <button
              onClick={() =>
                feedback['book']
                  ? resetExercise('book')
                  : checkInput('book', 'Are you reading a book')
              }
              className="btn-check px-4 py-2 rounded-lg font-bold"
            >
              {feedback['book'] ? 'Làm lại' : 'Kiểm tra'}
            </button>
            <div
              className={`text-2xl ${feedback['book'] === 'correct' ? 'correct' : feedback['book'] === 'incorrect' ? 'incorrect' : 'hidden'}`}
            >
              {feedback['book'] === 'correct'
                ? '✓ Đúng: Are you reading a book'
                : '✗ Sai: Đáp án đúng là "Are you reading a book"'}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Slide10
