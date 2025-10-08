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

interface PictureChoiceEnGameProps {
  vocabData: Array<VocabItem>
  title: string
  numQuestions?: number
}

const PictureChoiceEnGameCore: React.FC<PictureChoiceEnGameProps> = ({
  vocabData,
  title,
  numQuestions = vocabData.length,
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
  const [selectedOption, setSelectedOption] = useState<string | null>(null)
  const [showFeedback, setShowFeedback] = useState(false)

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

  const getRandomWrongAnswers = (
    correctWord: string,
    allWords: Array<VocabItem>,
    count: number,
  ) => {
    const wrongOptions = allWords
      .filter((w) => w.word !== correctWord)
      .map((w) => w.word)

    // Shuffle and take first 'count' items
    const shuffled = shuffleArray(wrongOptions)
    return shuffled.slice(0, count)
  }

  const createQuestions = (
    words: Array<VocabItem>,
    num: number,
  ): Array<Question> => {
    const shuffledWords = shuffleArray(words).slice(0, num)
    const questionList = shuffledWords.map((word) => {
      const wrongAnswers = getRandomWrongAnswers(word.word, words, 3)
      const allOptions = [word.word, ...wrongAnswers]
      const shuffledOptions = shuffleArray(allOptions)

      return {
        image: word.image || '',
        correct: word.word,
        options: shuffledOptions,
      }
    })
    return shuffleArray(questionList)
  }

  const startGame = () => {
    const newQuestions = createQuestions(vocabWords, numQuestions)
    setQuestions(newQuestions)
    setCurrentQuestionIndex(0)
    setScore(0)
    setIsGameStarted(true)
    setIsGameOver(false)
    setSelectedOption(null)
    setIsAnswering(false)
    setShowFeedback(false)
    resetTimer()
    resetGame()
    setTotalQuestions(newQuestions.length)
    startTimer()
  }

  const restartGame = () => {
    stopTimer()
    setIsGameStarted(false)
    setIsGameOver(false)
    setQuestions([])
    setCurrentQuestionIndex(0)
    setScore(0)
    setSelectedOption(null)
    setIsAnswering(false)
    setShowFeedback(false)
    resetGame()
  }

  const handleOptionClick = (option: string) => {
    if (isAnswering) return
    setSelectedOption(option)
    setIsAnswering(true)
    setShowFeedback(true)

    const currentQuestion = questions[currentQuestionIndex]
    const isCorrect = option === currentQuestion.correct

    if (isCorrect) {
      setScore((prev) => prev + 1)
      answerCorrect()
    } else {
      answerIncorrect()
    }

    setTimeout(() => {
      nextQuestion()
    }, 1500)
  }

  const nextQuestion = () => {
    const nextIndex = currentQuestionIndex + 1
    if (nextIndex < questions.length) {
      setCurrentQuestionIndex(nextIndex)
      setSelectedOption(null)
      setIsAnswering(false)
      setShowFeedback(false)
    } else {
      setIsGameOver(true)
      stopTimer()
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
      <div className="w-full my-3 flex flex-row justify-center gap-2 items-stretch transition-transform duration-200">
        <div className="w-auto flex flex-row gap-4 justify-stretch">
          {isGameStarted && (
            <div className="bg-yellow-100 text-yellow-700 font-bold px-2 py-1 rounded-full shadow-lg text-center text-sm w-28">
              ⏱️ {formatTime(timer)}
            </div>
          )}
          {isGameStarted && (
            <div className="bg-purple-100 text-purple-700 font-bold px-2 py-1 rounded-full shadow-lg text-center text-sm w-28">
              🎯 {score}/{vocabWords.length}
            </div>
          )}
        </div>
        <div className="w-auto flex flex-row gap-4 justify-end">
          {isGameStarted && (
            <button
              onClick={restartGame}
              className="bg-indigo-500 hover:bg-indigo-600 text-white font-semibold px-3 py-1 rounded-full shadow-lg transition-all duration-200 w-auto text-sm"
            >
              🔄 Restart
            </button>
          )}
        </div>
      </div>

      {/* Game Area */}
      <div className="flex-1 flex items-start justify-center h-full">
        {!isGameStarted ? (
          <div className="text-center bg-glass rounded-xl shadow-lg p-8 py-12 mt-10 w-full max-w-2xl">
            <div className="text-6xl mb-4">🖼️→🇬🇧</div>
            <h3 className="text-4xl font-bold text-indigo-700 mb-4">
              Picture Choice Game
            </h3>
            <p className="text-gray-600 mb-6 text-xl">
              Bạn sẽ có {Math.min(numQuestions, vocabData.length)} câu hỏi.
              <br />
              Nhìn hình và chọn từ tiếng Anh đúng.
            </p>
            <button
              onClick={startGame}
              className="bg-green-500 hover:bg-green-600 text-white font-semibold px-3 py-1 rounded-full shadow-lg transition-all duration-200 text-lg w-auto"
            >
              ▶️ Start Game
            </button>
          </div>
        ) : currentQuestion ? (
          <div className="w-full h-[95%] bg-glass rounded-xl shadow-lg p-5 mt-3 overflow-auto">
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

            <div className="flex flex-row items-center justify-center gap-8 w-full mx-auto">
              {/* Image on the left */}
              <div
                className="rounded-xl border-2 border-indigo-200 shadow-lg overflow-hidden w-[60%] h-70 bg-gray-100 bg-cover bg-center"
                style={{
                  backgroundImage: currentQuestion.image
                    ? `url('${currentQuestion.image}')`
                    : undefined,
                }}
              />

              {/* Options on the right */}
              <div className="flex flex-col gap-4 w-full max-w-md">
                {currentQuestion.options.map((option, index) => (
                  <div
                    key={index}
                    onClick={() => handleOptionClick(option)}
                    className={`border-2 border-gray-200 rounded-lg p-3 md:p-4 text-center transition-all duration-300 text-xl font-semibold text-gray-800 ${
                      showFeedback
                        ? 'pointer-events-none opacity-70'
                        : 'cursor-pointer bg-white hover:bg-indigo-50 hover:scale-105 hover:shadow-md'
                    } ${
                      !showFeedback && selectedOption === option
                        ? 'border-blue-500 bg-blue-100 scale-105 shadow-lg'
                        : ''
                    } ${
                      showFeedback && option === currentQuestion.correct
                        ? 'border-green-500 bg-green-100'
                        : ''
                    } ${
                      showFeedback &&
                      selectedOption === option &&
                      option !== currentQuestion.correct
                        ? 'border-red-500 bg-red-100'
                        : ''
                    }`}
                  >
                    <span className="font-semibold text-gray-800 text-2xl">
                      {option}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : null}
      </div>

      {isGameOver && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-opacity-30">
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
            <p className="text-gray-600 text-xl">
              You scored {score}/{vocabWords.length} (
              {Math.round((score / vocabWords.length) * 100)}%)
            </p>
            <p className="text-indigo-700 font-bold mt-2 text-xl">
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

interface PictureChoiceEnGameActivityProps {
  vocabData: Array<VocabItem>
  backgroundUrl: string
  title: string
  onClose?: () => void
}

const PictureChoiceEnGame: React.FC<PictureChoiceEnGameActivityProps> = ({
  vocabData,
  backgroundUrl,
  title,
  onClose,
}) => {
  const GameSlide: React.FC<{ isActive: boolean }> = ({ isActive }) => (
    <Slide isActive={isActive}>
      <PictureChoiceEnGameCore vocabData={vocabData} title={title} />
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

export default PictureChoiceEnGame
