// React hooks
import React, { useState } from 'react'

// React Router
import { createFileRoute } from '@tanstack/react-router'

// Components
import PresentationShell from '@/lib/components/presentation/PresentationShell'
import Slide from '@/lib/components/presentation/Slide'
import HomeButton from '@/lib/components/ui/HomeButton'

// Assets
import bg from './assets/bg.png'

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
    <Slide isActive={isActive}>
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
    </Slide>
  )
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
    <Slide isActive={isActive}>
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
    </Slide>
  )
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
    <Slide isActive={isActive}>
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
    </Slide>
  )
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
    <Slide isActive={isActive}>
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
    </Slide>
  )
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
    <Slide isActive={isActive}>
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
    </Slide>
  )
}

const ExercisesActivity = () => {
  const exerciseSlides = [Slide5, Slide8, Slide10, Slide12, Slide14]

  return (
    <div className="w-screen h-screen bg-black relative">
      <PresentationShell slides={exerciseSlides} backgroundUrl={bg} />
      <HomeButton />
    </div>
  )
}

export const Route = createFileRoute(
  '/lessons/everybody-up-0/unit-1/lesson-1/exercises',
)({
  component: ExercisesActivity,
})
