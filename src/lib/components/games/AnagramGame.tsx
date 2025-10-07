import React, { useState, useEffect } from 'react'
import {
  answerCorrect,
  answerIncorrect,
  setTotalQuestions,
  resetGame,
} from '@/lib/stores/game.store'

interface VocabItem {
  word: string
  vietnameseMeaning: string
  // other fields
}

interface Question {
  vietnamese: string
  correct: string
  scrambled: string
}

interface AnagramGameProps {
  vocabData: Array<VocabItem>
}

const AnagramGame: React.FC<AnagramGameProps> = ({ vocabData }) => {
  const [questions, setQuestions] = useState<Array<Question>>([])
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [isGameStarted, setIsGameStarted] = useState(false)
  const [isGameOver, setIsGameOver] = useState(false)
  const [timer, setTimer] = useState(0)
  const [timerInterval, setTimerInterval] = useState<NodeJS.Timeout | null>(
    null,
  )
  const [score, setScore] = useState(0)
  const [isAnswering, setIsAnswering] = useState(false)
  const [answerSlots, setAnswerSlots] = useState<Array<string>>([])
  const [usedLetters, setUsedLetters] = useState<Set<number>>(new Set())
  const [feedback, setFeedback] = useState('')

  const vocabWords: Array<VocabItem> = vocabData

  useEffect(() => {
    setTotalQuestions(vocabWords.length)
    resetGame()
  }, [])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const startTimer = () => {
    const interval = setInterval(() => {
      setTimer((prev) => prev + 1)
    }, 1000)
    setTimerInterval(interval)
  }

  const stopTimer = () => {
    if (timerInterval) {
      clearInterval(timerInterval)
      setTimerInterval(null)
    }
  }

  const resetTimer = () => {
    setTimer(0)
    stopTimer()
  }

  const shuffleArray = (array: Array<any>) => {
    const shuffled = [...array]
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
    }
    return shuffled
  }

  const scrambleWord = (word: string): string => {
    const letters = word.split('')
    for (let i = letters.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[letters[i], letters[j]] = [letters[j], letters[i]]
    }
    let scrambled = letters.join('')
    if (scrambled.toLowerCase() === word.toLowerCase() && letters.length > 1) {
      ;[letters[0], letters[1]] = [letters[1], letters[0]]
      scrambled = letters.join('')
    }
    return scrambled
  }

  const createQuestions = (words: Array<VocabItem>): Array<Question> => {
    const questionList = words.map((word) => ({
      vietnamese: word.vietnameseMeaning,
      correct: word.word,
      scrambled: scrambleWord(word.word),
    }))
    return shuffleArray(questionList)
  }

  const startGame = () => {
    const newQuestions = createQuestions(vocabWords)
    setQuestions(newQuestions)
    setCurrentQuestionIndex(0)
    setScore(0)
    setIsGameStarted(true)
    setIsGameOver(false)
    setIsAnswering(false)
    setAnswerSlots([])
    setUsedLetters(new Set())
    setFeedback('')
    resetTimer()
    resetGame()
    setTotalQuestions(vocabWords.length)
    startTimer()
  }

  const restartGame = () => {
    stopTimer()
    setIsGameStarted(false)
    setIsGameOver(false)
    setQuestions([])
    setCurrentQuestionIndex(0)
    setScore(0)
    setIsAnswering(false)
    setAnswerSlots([])
    setUsedLetters(new Set())
    setFeedback('')
    resetGame()
  }

  const handleLetterClick = (letterIndex: number, letter: string) => {
    if (isAnswering) return
    if (usedLetters.has(letterIndex)) return

    const emptySlotIndex = answerSlots.findIndex((slot) => slot === '')
    if (emptySlotIndex === -1) return

    const newSlots = [...answerSlots]
    newSlots[emptySlotIndex] = letter.toUpperCase()
    setAnswerSlots(newSlots)

    const newUsed = new Set(usedLetters)
    newUsed.add(letterIndex)
    setUsedLetters(newUsed)
  }

  const handleSlotClick = (slotIndex: number) => {
    if (isAnswering) return
    if (answerSlots[slotIndex] === '') return

    const newSlots = [...answerSlots]
    newSlots[slotIndex] = ''
    setAnswerSlots(newSlots)

    // Find which letter was in this slot and remove it from used
    const currentQuestion = questions[currentQuestionIndex]
    const letter = currentQuestion.scrambled[slotIndex]
    const letterIndex = currentQuestion.scrambled.indexOf(letter)
    const newUsed = new Set(usedLetters)
    newUsed.delete(letterIndex)
    setUsedLetters(newUsed)
  }

  const clearAnswer = () => {
    if (isAnswering) return
    setAnswerSlots(
      new Array(questions[currentQuestionIndex].correct.length).fill(''),
    )
    setUsedLetters(new Set())
    setFeedback('')
  }

  const submitAnswer = () => {
    if (isAnswering) return
    setIsAnswering(true)

    const currentQuestion = questions[currentQuestionIndex]
    const userAnswer = answerSlots.join('').toLowerCase()
    const correctAnswer = currentQuestion.correct.toLowerCase()
    const isCorrect = userAnswer === correctAnswer

    if (isCorrect) {
      setScore((prev) => prev + 1)
      answerCorrect()
      setFeedback('✅ Chính xác!')
    } else {
      answerIncorrect()
      setFeedback(`❌ Sai. Đáp án đúng: ${currentQuestion.correct}`)
    }

    setTimeout(() => {
      nextQuestion()
    }, 1500)
  }

  const nextQuestion = () => {
    const nextIndex = currentQuestionIndex + 1
    if (nextIndex < questions.length) {
      setCurrentQuestionIndex(nextIndex)
      setIsAnswering(false)
      setAnswerSlots(new Array(questions[nextIndex].correct.length).fill(''))
      setUsedLetters(new Set())
      setFeedback('')
    } else {
      setIsGameOver(true)
      stopTimer()
    }
  }

  const currentQuestion = questions[currentQuestionIndex]
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100

  return (
    <div className="h-full flex flex-col">
      <h2 className="text-md md:text-xl font-bold text-indigo-700 text-center">
        Anagram Game - School Supplies
      </h2>

      {/* Game Controls */}
      <div className="w-full my-2 flex flex-col sm:flex-row sm:justify-center gap-2 sm:gap-4 items-stretch transition-transform duration-200">
        <div className="w-full sm:w-auto flex flex-row gap-1 sm:gap-4 justify-stretch sm:justify-start">
          {isGameStarted && (
            <div className="bg-yellow-100 text-yellow-700 font-bold px-2 py-1 rounded-full shadow-lg text-center text-xs sm:text-sm w-full sm:w-28">
              ⏱️ {formatTime(timer)}
            </div>
          )}
          {isGameStarted && (
            <div className="bg-purple-100 text-purple-700 font-bold px-2 py-1 rounded-full shadow-lg text-center text-xs sm:text-sm w-full sm:w-28">
              🎯 {score}/{vocabWords.length}
            </div>
          )}
        </div>
        <div className="w-full sm:w-auto flex flex-row gap-1 sm:gap-4 justify-stretch sm:justify-end">
          {!isGameStarted && (
            <button
              onClick={startGame}
              className="bg-green-500 hover:bg-green-600 text-white font-semibold px-3 py-1 rounded-full shadow-lg transition-all duration-200 text-xs sm:text-sm w-full sm:w-auto"
            >
              ▶️ Start Game
            </button>
          )}
          {isGameStarted && (
            <button
              onClick={restartGame}
              className="bg-indigo-500 hover:bg-indigo-600 text-white font-semibold px-3 py-1 rounded-full shadow-lg transition-all duration-200 text-xs sm:text-sm w-full sm:w-auto"
            >
              🔄 Restart
            </button>
          )}
        </div>
      </div>

      {/* Game Area */}
      <div className="flex-1 flex items-center justify-center">
        {!isGameStarted ? (
          <div className="text-center bg-white rounded-xl shadow-lg p-8">
            <div className="text-6xl mb-4">🔤</div>
            <h3 className="text-2xl font-bold text-indigo-700 mb-4">
              Anagram Game
            </h3>
            <p className="text-gray-600 mb-6">
              Bạn sẽ có {vocabWords.length} câu hỏi.
              <br />
              Xem gợi ý tiếng Việt và sắp xếp chữ cái để gõ từ tiếng Anh đúng.
            </p>
            <div className="text-sm text-gray-500">
              Click "▶️ Start Game" để bắt đầu!
            </div>
          </div>
        ) : (
          <div className="max-w-3xl w-full bg-white rounded-xl shadow-lg p-3">
            <div className="mb-6">
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span className="bg-green-500 text-white font-semibold px-3 py-1 rounded-lg">
                  Question {currentQuestionIndex + 1} of {questions.length}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            </div>

            <div className="flex flex-col items-center gap-4 mb-3">
              <div className="text-lg text-gray-700">
                <span className="inline-block bg-indigo-100 text-indigo-700 font-semibold px-3 py-1 rounded-full">
                  {currentQuestion.vietnamese}
                </span>
              </div>

              <div className="answer-area flex flex-wrap gap-2 justify-center">
                {answerSlots.map((letter, index) => (
                  <div
                    key={index}
                    onClick={() => handleSlotClick(index)}
                    className={`w-10 h-10 rounded-lg border-2 flex items-center justify-center font-bold text-gray-800 cursor-pointer transition-all ${
                      letter
                        ? 'border-solid bg-blue-50 border-blue-300'
                        : 'border-dashed border-gray-300 bg-gray-50'
                    }`}
                  >
                    {letter}
                  </div>
                ))}
              </div>

              <div className="flex flex-wrap gap-2 justify-center">
                {currentQuestion.scrambled.split('').map((letter, index) => (
                  <span
                    key={index}
                    onClick={() => handleLetterClick(index, letter)}
                    className={`inline-flex items-center justify-center w-10 h-10 rounded-lg border-2 bg-gray-50 font-bold text-gray-800 cursor-pointer transition-all hover:bg-blue-50 ${
                      usedLetters.has(index)
                        ? 'opacity-40 pointer-events-none'
                        : ''
                    }`}
                  >
                    {letter.toUpperCase()}
                  </span>
                ))}
              </div>

              <div className="flex gap-2 w-full max-w-md justify-center">
                <button
                  onClick={clearAnswer}
                  disabled={isAnswering}
                  className="bg-gray-200 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed text-gray-800 font-semibold px-4 py-2 rounded-lg"
                >
                  Clear
                </button>
                <button
                  onClick={submitAnswer}
                  disabled={
                    isAnswering || answerSlots.some((slot) => slot === '')
                  }
                  className="bg-green-500 hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold px-4 py-2 rounded-lg"
                >
                  Submit
                </button>
              </div>

              <div className="text-sm">{feedback}</div>
            </div>
          </div>
        )}
      </div>

      {isGameOver && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-30">
          <div className="bg-white rounded-xl p-8 shadow-2xl text-center">
            <div className="text-6xl mb-4">🎉</div>
            <h3 className="text-2xl font-bold text-green-600 mb-2">
              {score >= vocabWords.length * 0.9
                ? 'Excellent! 🌟'
                : score >= vocabWords.length * 0.7
                  ? 'Great Job! 👏'
                  : score >= vocabWords.length * 0.5
                    ? 'Good Try! 👍'
                    : 'Keep Practicing! 💪'}
            </h3>
            <p className="text-gray-600">
              You scored {score}/{vocabWords.length} (
              {Math.round((score / vocabWords.length) * 100)}%)
            </p>
            <p className="text-indigo-700 font-bold mt-2">
              ⏱️ Time: {formatTime(timer)} seconds
            </p>
            <button
              onClick={() => setIsGameOver(false)}
              className="mt-6 bg-indigo-500 hover:bg-indigo-600 text-white font-semibold px-6 py-2 rounded-lg transition-all duration-200"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default AnagramGame
