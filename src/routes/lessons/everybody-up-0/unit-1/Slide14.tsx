import React, { useState } from 'react'

interface SlideProps {
  isActive: boolean
}

const Slide14: React.FC<SlideProps> = ({ isActive }) => {
  const [selected, setSelected] = useState<{ [key: string]: string }>({})
  const [feedback, setFeedback] = useState<{ [key: string]: string }>({})

  const checkMCQ = (
    exerciseId: string,
    userAnswer: string,
    correctAnswer: string,
  ) => {
    if (userAnswer === correctAnswer) {
      setFeedback((prev) => ({ ...prev, [exerciseId]: 'correct' }))
    } else {
      setFeedback((prev) => ({ ...prev, [exerciseId]: 'incorrect' }))
    }
  }

  const resetMCQ = (exerciseId: string) => {
    setSelected((prev) => ({ ...prev, [exerciseId]: '' }))
    setFeedback((prev) => ({ ...prev, [exerciseId]: '' }))
  }

  return (
    <div
      className={`slide content-box px-5 py-2 rounded-2xl w-full h-full ${isActive ? 'active' : ''}`}
    >
      <h2 className="text-2xl md:text-3xl font-bold text-indigo-700 mb-5">
        Bài tập 5: Chọn thì đúng
      </h2>
      <p className="text-2xl mb-8">
        Chọn thì Present Simple hoặc Present Continuous phù hợp:
      </p>
      <div className="grid grid-cols-1 gap-4">
        <div className="exercise-item bg-white p-4 rounded-xl shadow-md">
          <p className="text-2xl mb-4">Look! The children ___ in the garden.</p>
          <div className="grid grid-cols-2 gap-2 text-2xl">
            <button
              onClick={() => {
                setSelected((prev) => ({ ...prev, garden: 'play' }))
                checkMCQ('garden', 'play', 'are playing')
              }}
              className={`px-4 py-2 rounded-lg font-bold ${selected['garden'] === 'play' ? (feedback['garden'] === 'correct' ? 'bg-green-500 text-white' : feedback['garden'] === 'incorrect' ? 'bg-red-500 text-white' : 'bg-gray-200') : 'bg-gray-200'}`}
              disabled={!!feedback['garden']}
            >
              play
            </button>
            <button
              onClick={() => {
                setSelected((prev) => ({ ...prev, garden: 'are playing' }))
                checkMCQ('garden', 'are playing', 'are playing')
              }}
              className={`px-4 py-2 rounded-lg font-bold ${selected['garden'] === 'are playing' ? (feedback['garden'] === 'correct' ? 'bg-green-500 text-white' : feedback['garden'] === 'incorrect' ? 'bg-red-500 text-white' : 'bg-gray-200') : 'bg-gray-200'}`}
              disabled={!!feedback['garden']}
            >
              are playing
            </button>
          </div>
          <div
            className={`text-2xl mt-2 ${feedback['garden'] === 'correct' ? 'correct' : feedback['garden'] === 'incorrect' ? 'incorrect' : 'hidden'}`}
          >
            {feedback['garden'] === 'correct'
              ? '✓ Chính xác!'
              : '✗ Sai rồi! Đáp án đúng là: are playing'}
          </div>
          {feedback['garden'] && (
            <button
              onClick={() => resetMCQ('garden')}
              className="btn-check px-4 py-2 rounded-lg font-bold mt-2"
            >
              Làm lại
            </button>
          )}
        </div>
        <div className="exercise-item bg-white p-4 rounded-xl shadow-md">
          <p className="text-2xl mb-4">She usually ___ to school by bus.</p>
          <div className="grid grid-cols-2 gap-2 text-2xl">
            <button
              onClick={() => {
                setSelected((prev) => ({ ...prev, bus: 'goes' }))
                checkMCQ('bus', 'goes', 'goes')
              }}
              className={`px-4 py-2 rounded-lg font-bold ${selected['bus'] === 'goes' ? (feedback['bus'] === 'correct' ? 'bg-green-500 text-white' : feedback['bus'] === 'incorrect' ? 'bg-red-500 text-white' : 'bg-gray-200') : 'bg-gray-200'}`}
              disabled={!!feedback['bus']}
            >
              goes
            </button>
            <button
              onClick={() => {
                setSelected((prev) => ({ ...prev, bus: 'is going' }))
                checkMCQ('bus', 'is going', 'goes')
              }}
              className={`px-4 py-2 rounded-lg font-bold ${selected['bus'] === 'is going' ? (feedback['bus'] === 'correct' ? 'bg-green-500 text-white' : feedback['bus'] === 'incorrect' ? 'bg-red-500 text-white' : 'bg-gray-200') : 'bg-gray-200'}`}
              disabled={!!feedback['bus']}
            >
              is going
            </button>
          </div>
          <div
            className={`text-2xl mt-2 ${feedback['bus'] === 'correct' ? 'correct' : feedback['bus'] === 'incorrect' ? 'incorrect' : 'hidden'}`}
          >
            {feedback['bus'] === 'correct'
              ? '✓ Chính xác!'
              : '✗ Sai rồi! Đáp án đúng là: goes'}
          </div>
          {feedback['bus'] && (
            <button
              onClick={() => resetMCQ('bus')}
              className="btn-check px-4 py-2 rounded-lg font-bold mt-2"
            >
              Làm lại
            </button>
          )}
        </div>
        <div className="exercise-item bg-white p-4 rounded-xl shadow-md">
          <p className="text-2xl mb-4">I ___ English every day.</p>
          <div className="grid grid-cols-2 gap-2 text-2xl">
            <button
              onClick={() => {
                setSelected((prev) => ({ ...prev, english: 'study' }))
                checkMCQ('english', 'study', 'study')
              }}
              className={`px-4 py-2 rounded-lg font-bold ${selected['english'] === 'study' ? (feedback['english'] === 'correct' ? 'bg-green-500 text-white' : feedback['english'] === 'incorrect' ? 'bg-red-500 text-white' : 'bg-gray-200') : 'bg-gray-200'}`}
              disabled={!!feedback['english']}
            >
              study
            </button>
            <button
              onClick={() => {
                setSelected((prev) => ({ ...prev, english: 'am studying' }))
                checkMCQ('english', 'am studying', 'study')
              }}
              className={`px-4 py-2 rounded-lg font-bold ${selected['english'] === 'am studying' ? (feedback['english'] === 'correct' ? 'bg-green-500 text-white' : feedback['english'] === 'incorrect' ? 'bg-red-500 text-white' : 'bg-gray-200') : 'bg-gray-200'}`}
              disabled={!!feedback['english']}
            >
              am studying
            </button>
          </div>
          <div
            className={`text-2xl mt-2 ${feedback['english'] === 'correct' ? 'correct' : feedback['english'] === 'incorrect' ? 'incorrect' : 'hidden'}`}
          >
            {feedback['english'] === 'correct'
              ? '✓ Chính xác!'
              : '✗ Sai rồi! Đáp án đúng là: study'}
          </div>
          {feedback['english'] && (
            <button
              onClick={() => resetMCQ('english')}
              className="btn-check px-4 py-2 rounded-lg font-bold mt-2"
            >
              Làm lại
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default Slide14
