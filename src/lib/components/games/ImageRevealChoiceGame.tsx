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
  image?: string
  // other fields
}

interface Question {
  image: string
  correct: string
  options: Array<string>
}

interface ImageRevealChoiceGameProps {
  vocabData: Array<VocabItem>
  title: string
}

const ImageRevealChoiceGameCore: React.FC<ImageRevealChoiceGameProps> = ({
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
  const [revealedTiles, setRevealedTiles] = useState<Set<string>>(new Set())
  const [selectedOption, setSelectedOption] = useState<string | null>(null)
  const [showFeedback, setShowFeedback] = useState(false)
  const [feedback, setFeedback] = useState('')

  const vocabWords: Array<VocabItem> = vocabData
  const gridSize = 4 // 4x4 grid

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
      words.map((word) => {
        const wrongs = shuffleArray(words.filter((w) => w.word !== word.word))
          .slice(0, 3)
          .map((w) => w.word)
        const options = shuffleArray([word.word, ...wrongs])
        return {
          image: word.image || '',
          correct: word.word,
          options,
        }
      }),
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
    setRevealedTiles(new Set())
    setSelectedOption(null)
    setShowFeedback(false)
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
    setRevealedTiles(new Set())
    setSelectedOption(null)
    setShowFeedback(false)
    setFeedback('')
    resetGame()
  }

  const handleTileClick = (tileId: string) => {
    if (isAnswering || revealedTiles.has(tileId)) return
    const newRevealed = new Set(revealedTiles)
    newRevealed.add(tileId)
    setRevealedTiles(newRevealed)
  }

  const handleOptionClick = (option: string) => {
    if (isAnswering) return
    setSelectedOption(option)
    setIsAnswering(true)
    setShowFeedback(true)

    const currentQuestion = questions[currentQuestionIndex]
    const isCorrect = option === currentQuestion.correct
    const penalty = revealedTiles.size // Each revealed tile costs 1 point

    if (isCorrect) {
      const pointsEarned = Math.max(1, 10 - penalty) // Max 10 points, minus penalty
      setScore((prev) => prev + pointsEarned)
      answerCorrect()
      setFeedback(`✅ Chính xác! +${pointsEarned} điểm (${penalty} ô mở)`)
    } else {
      answerIncorrect()
      setFeedback(`❌ Sai. Đáp án đúng: ${currentQuestion.correct}`)
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
      setRevealedTiles(new Set())
      setSelectedOption(null)
      setShowFeedback(false)
      setFeedback('')
    } else {
      setIsGameOver(true)
      stopTimer()
    }
  }

  const currentQuestion = questions[currentQuestionIndex]
  const progress = currentQuestion
    ? ((currentQuestionIndex + 1) / questions.length) * 100
    : 0

  const renderGrid = () => {
    const tiles = []
    for (let r = 0; r < gridSize; r++) {
      for (let c = 0; c < gridSize; c++) {
        const tileId = `${r}-${c}`
        const isRevealed = revealedTiles.has(tileId)
        tiles.push(
          <div
            key={tileId}
            onClick={() => handleTileClick(tileId)}
            className={`absolute border border-gray-300 bg-gray-400 bg-opacity-80 transition-opacity duration-200 cursor-pointer hover:bg-opacity-60 ${
              isRevealed ? 'opacity-0 pointer-events-none' : 'opacity-100'
            }`}
            style={{
              top: `${(r / gridSize) * 100}%`,
              left: `${(c / gridSize) * 100}%`,
              width: `${100 / gridSize}%`,
              height: `${100 / gridSize}%`,
            }}
          />,
        )
      }
    }
    return tiles
  }

  const getOptionClass = (option: string) => {
    let baseClass =
      'border-2 border-gray-200 bg-gray-50 rounded-lg p-3 cursor-pointer text-center transition-all duration-300 hover:translate-x-2 hover:shadow-lg'

    if (showFeedback) {
      baseClass += ' pointer-events-none'
    }

    if (!showFeedback && selectedOption === option) {
      baseClass += ' border-blue-500 bg-blue-50 translate-x-2'
    } else if (showFeedback && option === currentQuestion.correct) {
      baseClass += ' border-green-500 bg-green-100 animate-pulse'
    } else if (
      showFeedback &&
      selectedOption === option &&
      option !== currentQuestion.correct
    ) {
      baseClass += ' border-red-500 bg-red-100'
    }

    return baseClass
  }

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
              🎯 {score}
            </div>
          )}
          {isGameStarted && (
            <div className="bg-orange-100 text-orange-700 font-bold px-2 py-1 rounded-full shadow-lg text-center text-xs sm:text-sm w-full sm:w-28">
              👁️ {revealedTiles.size}
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
            <div className="text-6xl mb-4">🖼️</div>
            <h3 className="text-2xl font-bold text-indigo-700 mb-4">
              Image Reveal Choice
            </h3>
            <p className="text-gray-600 mb-6">
              Mỗi lần mở 1 ô sẽ trừ 1 điểm. Chọn từ đúng để ghi điểm tối đa.
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
              <div className="relative w-80 h-60 rounded-xl overflow-hidden border-2 border-blue-200">
                {currentQuestion.image && (
                  <img
                    src={currentQuestion.image}
                    alt="Question"
                    className="w-full h-full object-cover"
                  />
                )}
                <div className="absolute inset-0">{renderGrid()}</div>
              </div>

              <div className="grid grid-cols-2 gap-3 w-full max-w-md">
                {currentQuestion.options.map((option, index) => (
                  <div
                    key={index}
                    onClick={() => handleOptionClick(option)}
                    className={getOptionClass(option)}
                  >
                    <span className="font-semibold text-gray-800">
                      {option}
                    </span>
                  </div>
                ))}
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
              {score >= vocabWords.length * 5
                ? 'Excellent! 🌟'
                : score >= vocabWords.length * 3
                  ? 'Great Job! 👏'
                  : score >= vocabWords.length * 2
                    ? 'Good Try! 👍'
                    : 'Keep Practicing! 💪'}
            </h3>
            <p className="text-gray-600">You scored {score} points!</p>
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

interface ImageRevealChoiceGameActivityProps {
  vocabData: VocabItem[]
  backgroundUrl: string
  title: string
}

const ImageRevealChoiceGame: React.FC<ImageRevealChoiceGameActivityProps> = ({
  vocabData,
  backgroundUrl,
  title,
}) => {
  const GameSlide: React.FC<{ isActive: boolean }> = ({ isActive }) => (
    <Slide isActive={isActive}>
      <ImageRevealChoiceGameCore vocabData={vocabData} title={title} />
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

export default ImageRevealChoiceGame
