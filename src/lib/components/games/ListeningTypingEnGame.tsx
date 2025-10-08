import React, { useState, useEffect, useRef } from 'react'
import { useVoice } from '@/lib/hooks/use-voice'
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
  pronunciation?: string
  exampleSentenceEn?: string
  // other fields
}

interface Question {
  english: string
  pronunciation: string
  exampleSentence: string
}

interface ListeningTypingEnGameProps {
  vocabData: Array<VocabItem>
  title: string
}

const ListeningTypingEnGameCore: React.FC<ListeningTypingEnGameProps> = ({
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
  const [userAnswer, setUserAnswer] = useState('')
  const [feedback, setFeedback] = useState('')
  const [isPlayingAudio, setIsPlayingAudio] = useState(false)

  const inputRef = useRef<HTMLInputElement>(null)
  const { speak } = useVoice()

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

  const createQuestions = (words: Array<VocabItem>): Array<Question> => {
    return shuffleArray(
      words.map((word) => ({
        english: word.word,
        pronunciation: word.pronunciation || '',
        exampleSentence: word.exampleSentenceEn || '',
      })),
    )
  }

  const startGame = () => {
    const newQuestions = createQuestions(vocabWords)
    setQuestions(newQuestions)
    setCurrentQuestionIndex(0)
    setScore(0)
    setIsGameStarted(true)
    setIsGameOver(false)
    setIsAnswering(false)
    setUserAnswer('')
    setFeedback('')
    setIsPlayingAudio(false)
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
    setUserAnswer('')
    setFeedback('')
    setIsPlayingAudio(false)
    resetGame()
  }

  const playCurrentWord = () => {
    if (isPlayingAudio || !currentQuestion) return

    setIsPlayingAudio(true)
    const text = currentQuestion.exampleSentence
      ? `${currentQuestion.english}. ${currentQuestion.exampleSentence}`
      : currentQuestion.english

    speak(text, 'en-US')

    // Reset playing state after a delay
    setTimeout(() => {
      setIsPlayingAudio(false)
    }, 2000)
  }

  const submitAnswer = () => {
    if (isAnswering || !currentQuestion) return

    setIsAnswering(true)
    const normalizedUserAnswer = userAnswer.trim().toLowerCase()
    const normalizedCorrectAnswer = currentQuestion.english.toLowerCase()

    if (normalizedUserAnswer === normalizedCorrectAnswer) {
      setScore((prev) => prev + 1)
      answerCorrect()
      setFeedback(`✅ Chính xác! "${currentQuestion.english}"`)
    } else {
      answerIncorrect()
      setFeedback(`❌ Sai. Đáp án đúng: "${currentQuestion.english}"`)
    }

    setTimeout(() => {
      nextQuestion()
    }, 2000)
  }

  const nextQuestion = () => {
    const nextIndex = currentQuestionIndex + 1
    if (nextIndex < questions.length) {
      setCurrentQuestionIndex(nextIndex)
      setIsAnswering(false)
      setUserAnswer('')
      setFeedback('')
      setIsPlayingAudio(false)
    } else {
      setIsGameOver(true)
      stopTimer()
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      if (!isAnswering) {
        submitAnswer()
      } else {
        nextQuestion()
      }
    }
  }

  const currentQuestion = questions[currentQuestionIndex]
  const progress = currentQuestion
    ? ((currentQuestionIndex + 1) / questions.length) * 100
    : 0

  return (
    <div className="h-full flex flex-col">
      <h2 className="text-xl font-bold text-indigo-700 text-center">{title}</h2>

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
            <div className="text-6xl mb-4">🔊</div>
            <h3 className="text-2xl font-bold text-indigo-700 mb-4">
              Listening & Typing
            </h3>
            <p className="text-gray-600 mb-6">
              Nghe phát âm từ và câu ví dụ, sau đó gõ lại từ tiếng Anh. Có{' '}
              {vocabWords.length} câu.
            </p>
            <div className="text-sm text-gray-500">
              Click "▶️ Start Game" để bắt đầu!
            </div>
          </div>
        ) : currentQuestion ? (
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

            <div className="flex flex-col items-center gap-4">
              <div className="flex gap-2">
                <button
                  onClick={playCurrentWord}
                  disabled={isPlayingAudio}
                  className="bg-indigo-500 hover:bg-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold px-4 py-2 rounded-lg"
                >
                  ▶️ Nghe
                </button>
              </div>

              <div className="flex flex-col gap-2 w-full max-w-md">
                <input
                  ref={inputRef}
                  type="text"
                  value={userAnswer}
                  onChange={(e) => setUserAnswer(e.target.value)}
                  onKeyDown={handleKeyPress}
                  disabled={isAnswering}
                  className={`answer-input flex-1 border-2 border-gray-200 rounded-lg p-2 md:p-3 text-base md:text-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 ${
                    feedback.includes('✅')
                      ? 'border-green-500 bg-green-50'
                      : feedback.includes('❌')
                        ? 'border-red-500 bg-red-50'
                        : ''
                  }`}
                  placeholder="Gõ từ tiếng Anh..."
                  autoComplete="off"
                />
                <button
                  onClick={submitAnswer}
                  disabled={isAnswering || !userAnswer.trim()}
                  className="bg-green-500 hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold px-3 py-1.5 md:px-4 md:py-2 rounded-lg text-base md:text-lg"
                >
                  Submit
                </button>
              </div>

              <div className="text-sm text-center">{feedback}</div>
            </div>
          </div>
        ) : null}
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

interface ListeningTypingEnGameActivityProps {
  vocabData: VocabItem[]
  backgroundUrl: string
  title: string
  onClose?: () => void
}

const ListeningTypingEnGame: React.FC<ListeningTypingEnGameActivityProps> = ({
  vocabData,
  backgroundUrl,
  title,
  onClose,
}) => {
  const GameSlide: React.FC<{ isActive: boolean }> = ({ isActive }) => (
    <Slide isActive={isActive}>
      <ListeningTypingEnGameCore vocabData={vocabData} title={title} />
    </Slide>
  )

  const slides = [GameSlide]

  return (
    <PresentationShell
      slides={slides}
      backgroundUrl={backgroundUrl}
      onHomeClick={onClose}
      showNavButtons={false}
      showOutlineButton={false}
      showSlideCounter={false}
    />
  )
}

export default ListeningTypingEnGame
