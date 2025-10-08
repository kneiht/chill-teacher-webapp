import React, { useState, useEffect } from 'react'
import {
  answerCorrect,
  answerIncorrect,
  setTotalQuestions,
  resetGame,
} from '@/lib/stores/game.store'

// Components
import PresentationShell from '@/lib/components/presentation/PresentationShell'
import Slide from '@/lib/components/presentation/Slide'

interface VocabItem {
  word: string
  vietnameseMeaning: string
  exampleSentenceEn?: string
  exampleSentenceVi?: string
  // other fields
}

interface Question {
  vietnamese: string
  englishTokens: Array<string>
  scrambledTokens: Array<string>
}

interface UnjumbleGameProps {
  vocabData: Array<VocabItem>
  title: string
}

const UnjumbleGameCore: React.FC<UnjumbleGameProps> = ({
  vocabData,
  title,
}) => {
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
  const [bankTokens, setBankTokens] = useState<Array<string>>([])
  const [answerTokens, setAnswerTokens] = useState<Array<string>>([])
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

  const tokenize = (sentence: string): Array<string> => {
    return sentence.split(/\s+/).filter(Boolean)
  }

  const createQuestions = (words: Array<VocabItem>): Array<Question> => {
    const questionList = words
      .filter((word) => word.exampleSentenceEn)
      .map((word) => {
        const en = word.exampleSentenceEn!.trim()
        const tokens = tokenize(en)
        const scrambled = shuffleArray([...tokens])
        return {
          vietnamese: word.exampleSentenceVi || word.vietnameseMeaning,
          englishTokens: tokens,
          scrambledTokens: scrambled,
        }
      })
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
    setFeedback('')
    resetTimer()
    resetGame()
    setTotalQuestions(newQuestions.length)

    if (newQuestions.length > 0) {
      const firstQuestion = newQuestions[0]
      setBankTokens([...firstQuestion.scrambledTokens])
      setAnswerTokens([])
    }

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
    setBankTokens([])
    setAnswerTokens([])
    setFeedback('')
    resetGame()
  }

  const handleDragStart = (
    e: React.DragEvent,
    token: string,
    fromBank: boolean,
  ) => {
    if (isAnswering) return
    e.dataTransfer.setData('text/plain', token)
    e.dataTransfer.setData('fromBank', fromBank.toString())
  }

  const handleDragOver = (e: React.DragEvent) => {
    if (isAnswering) return
    e.preventDefault()
  }

  const handleDrop = (e: React.DragEvent, toBank: boolean) => {
    if (isAnswering) return
    e.preventDefault()

    const token = e.dataTransfer.getData('text/plain')
    const fromBank = e.dataTransfer.getData('fromBank') === 'true'

    if (!token) return

    if (fromBank && !toBank) {
      // Moving from bank to answer
      setBankTokens((prev) => prev.filter((t) => t !== token))
      setAnswerTokens((prev) => [...prev, token])
    } else if (!fromBank && toBank) {
      // Moving from answer to bank
      setAnswerTokens((prev) => prev.filter((t) => t !== token))
      setBankTokens((prev) => [...prev, token])
    }
  }

  const clearAnswer = () => {
    if (isAnswering) return
    const currentQuestion = questions[currentQuestionIndex]
    setBankTokens([...currentQuestion.scrambledTokens])
    setAnswerTokens([])
    setFeedback('')
  }

  const submitAnswer = () => {
    if (isAnswering) return

    const currentQuestion = questions[currentQuestionIndex]
    const userAnswer = answerTokens.join(' ')
    const correctAnswer = currentQuestion.englishTokens.join(' ')

    setIsAnswering(true)

    if (userAnswer.toLowerCase() === correctAnswer.toLowerCase()) {
      setScore((prev) => prev + 1)
      answerCorrect()
      setFeedback(`✅ Chính xác! "${correctAnswer}"`)
    } else {
      answerIncorrect()
      setFeedback(`❌ Sai. Đáp án đúng: "${correctAnswer}"`)
    }

    setTimeout(() => {
      const nextIndex = currentQuestionIndex + 1
      if (nextIndex < questions.length) {
        setCurrentQuestionIndex(nextIndex)
        setIsAnswering(false)
        const nextQ = questions[nextIndex]
        setBankTokens([...nextQ.scrambledTokens])
        setAnswerTokens([])
        setFeedback('')
      } else {
        setIsGameOver(true)
        stopTimer()
      }
    }, 2000)
  }

  const currentQuestion = questions[currentQuestionIndex]
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100

  return (
    <div className="h-full flex flex-col">
      <h2 className="text-md md:text-xl font-bold text-indigo-700 text-center">
        {title}
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
              🎯 {score}/{questions.length}
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
            <div className="text-6xl mb-4">🧩</div>
            <h3 className="text-2xl font-bold text-indigo-700 mb-4">
              Unjumble Game
            </h3>
            <p className="text-gray-600 mb-6">
              Bạn sẽ có {vocabWords.filter((w) => w.exampleSentenceEn).length}{' '}
              câu. Kéo thả từ để tạo câu đúng.
            </p>
            <div className="text-sm text-gray-500">
              Click "▶️ Start Game" để bắt đầu!
            </div>
          </div>
        ) : (
          <div className="max-w-4xl w-full bg-white rounded-xl shadow-lg p-3">
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

            <div className="flex flex-col gap-4 items-center">
              <div className="text-lg text-gray-700">
                <span className="inline-block bg-indigo-100 text-indigo-700 font-semibold px-3 py-1 rounded-full">
                  {currentQuestion.vietnamese}
                </span>
              </div>

              {/* Answer Area */}
              <div
                className="min-h-16 border-2 border-dashed border-indigo-300 bg-indigo-50 rounded-xl p-3 flex flex-wrap gap-2 items-center justify-center w-full max-w-2xl"
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, false)}
              >
                {answerTokens.map((token, index) => (
                  <span
                    key={`answer-${index}`}
                    draggable={!isAnswering}
                    onDragStart={(e) => handleDragStart(e, token, false)}
                    className="inline-flex items-center justify-center px-3 py-2 rounded-full border-2 border-gray-200 bg-white font-bold text-gray-800 cursor-grab active:cursor-grabbing"
                  >
                    {token}
                  </span>
                ))}
                {answerTokens.length === 0 && (
                  <span className="text-gray-400 text-sm">
                    Kéo từ vào đây để tạo câu
                  </span>
                )}
              </div>

              {/* Word Bank */}
              <div
                className="min-h-16 border-2 border-dashed border-gray-300 bg-gray-50 rounded-xl p-3 flex flex-wrap gap-2 items-center justify-center w-full max-w-2xl"
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, true)}
              >
                {bankTokens.map((token, index) => (
                  <span
                    key={`bank-${index}`}
                    draggable={!isAnswering}
                    onDragStart={(e) => handleDragStart(e, token, true)}
                    className="inline-flex items-center justify-center px-3 py-2 rounded-full border-2 border-gray-200 bg-white font-bold text-gray-800 cursor-grab active:cursor-grabbing"
                  >
                    {token}
                  </span>
                ))}
                {bankTokens.length === 0 && (
                  <span className="text-gray-400 text-sm">
                    Tất cả từ đã được sử dụng
                  </span>
                )}
              </div>

              <div className="flex gap-2">
                <button
                  onClick={clearAnswer}
                  disabled={isAnswering}
                  className="bg-gray-200 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed text-gray-800 font-semibold px-4 py-2 rounded-lg"
                >
                  Clear
                </button>
                <button
                  onClick={submitAnswer}
                  disabled={isAnswering || answerTokens.length === 0}
                  className="bg-green-500 hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold px-4 py-2 rounded-lg"
                >
                  Submit
                </button>
              </div>

              <div className="text-sm text-center">{feedback}</div>
            </div>
          </div>
        )}
      </div>

      {isGameOver && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-30">
          <div className="bg-white rounded-xl p-8 shadow-2xl text-center">
            <div className="text-6xl mb-4">🎉</div>
            <h3 className="text-2xl font-bold text-green-600 mb-2">
              {score >= questions.length * 0.9
                ? 'Excellent! 🌟'
                : score >= questions.length * 0.7
                  ? 'Great Job! 👏'
                  : score >= questions.length * 0.5
                    ? 'Good Try! 👍'
                    : 'Keep Practicing! 💪'}
            </h3>
            <p className="text-gray-600">
              You scored {score}/{questions.length} (
              {Math.round((score / questions.length) * 100)}%)
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

interface UnjumbleGameActivityProps {
  vocabData: VocabItem[]
  backgroundUrl: string
  title: string
}

const UnjumbleGame: React.FC<UnjumbleGameActivityProps> = ({
  vocabData,
  backgroundUrl,
  title,
}) => {
  const GameSlide: React.FC<{ isActive: boolean }> = ({ isActive }) => (
    <Slide isActive={isActive}>
      <UnjumbleGameCore vocabData={vocabData} title={title} />
    </Slide>
  )

  const slides = [GameSlide]

  return (
    <PresentationShell
      slides={slides}
      backgroundUrl={backgroundUrl}
      showHome={true}
    />
  )
}

export default UnjumbleGame
