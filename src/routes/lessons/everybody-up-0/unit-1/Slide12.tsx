import React, { useState } from 'react'

interface SlideProps {
  isActive: boolean
}

const Slide12: React.FC<SlideProps> = ({ isActive }) => {
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
        Bài tập 4: Đặt câu hỏi WH-
      </h2>
      <p className="text-2xl mb-8">Đặt câu hỏi cho phần gạch chân:</p>
      <div className="grid grid-cols-1 gap-4">
        <div className="exercise-item bg-white p-4 rounded-xl shadow-md">
          <p className="text-2xl mb-2">
            They are playing <span className="highlight">football</span>.
          </p>
          <input
            type="text"
            className="exercise-input w-full"
            value={answers['football'] || ''}
            onChange={(e) =>
              setAnswers((prev) => ({ ...prev, football: e.target.value }))
            }
            placeholder="Đặt câu hỏi"
          />
          <div className="flex items-center space-x-4 mt-4">
            <button
              onClick={() =>
                feedback['football']
                  ? resetExercise('football')
                  : checkInput('football', 'What are they playing')
              }
              className="btn-check px-4 py-2 rounded-lg font-bold"
            >
              {feedback['football'] ? 'Làm lại' : 'Kiểm tra'}
            </button>
            <div
              className={`text-2xl ${feedback['football'] === 'correct' ? 'correct' : feedback['football'] === 'incorrect' ? 'incorrect' : 'hidden'}`}
            >
              {feedback['football'] === 'correct'
                ? '✓ Đúng: What are they playing'
                : '✗ Sai: Đáp án đúng là "What are they playing"'}
            </div>
          </div>
        </div>
        <div className="exercise-item bg-white p-4 rounded-xl shadow-md">
          <p className="text-2xl mb-2">
            She is going <span className="highlight">to school</span>.
          </p>
          <input
            type="text"
            className="exercise-input w-full"
            value={answers['school'] || ''}
            onChange={(e) =>
              setAnswers((prev) => ({ ...prev, school: e.target.value }))
            }
            placeholder="Đặt câu hỏi"
          />
          <div className="flex items-center space-x-4 mt-4">
            <button
              onClick={() =>
                feedback['school']
                  ? resetExercise('school')
                  : checkInput('school', 'Where is she going')
              }
              className="btn-check px-4 py-2 rounded-lg font-bold"
            >
              {feedback['school'] ? 'Làm lại' : 'Kiểm tra'}
            </button>
            <div
              className={`text-2xl ${feedback['school'] === 'correct' ? 'correct' : feedback['school'] === 'incorrect' ? 'incorrect' : 'hidden'}`}
            >
              {feedback['school'] === 'correct'
                ? '✓ Đúng: Where is she going'
                : '✗ Sai: Đáp án đúng là "Where is she going"'}
            </div>
          </div>
        </div>
        <div className="exercise-item bg-white p-4 rounded-xl shadow-md">
          <p className="text-2xl mb-2">
            He is crying <span className="highlight">because he is sad</span>.
          </p>
          <input
            type="text"
            className="exercise-input w-full"
            value={answers['sad'] || ''}
            onChange={(e) =>
              setAnswers((prev) => ({ ...prev, sad: e.target.value }))
            }
            placeholder="Đặt câu hỏi"
          />
          <div className="flex items-center space-x-4 mt-4">
            <button
              onClick={() =>
                feedback['sad']
                  ? resetExercise('sad')
                  : checkInput('sad', 'Why is he crying')
              }
              className="btn-check px-4 py-2 rounded-lg font-bold"
            >
              {feedback['sad'] ? 'Làm lại' : 'Kiểm tra'}
            </button>
            <div
              className={`text-2xl ${feedback['sad'] === 'correct' ? 'correct' : feedback['sad'] === 'incorrect' ? 'incorrect' : 'hidden'}`}
            >
              {feedback['sad'] === 'correct'
                ? '✓ Đúng: Why is he crying'
                : '✗ Sai: Đáp án đúng là "Why is he crying"'}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Slide12
