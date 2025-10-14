import React, { useState, useEffect } from 'react'
import {
  answerCorrect,
  answerIncorrect,
  setTotalQuestions,
  resetGame,
} from '@/lib/stores/game.store'

// Hooks
import { useSoundEffects } from '@/lib/hooks/useSoundEffects'

// Components
import PresentationShell from '@/lib/components/presentation/PresentationShell'
import Slide from '@/lib/components/presentation/Slide'

interface VocabItem {
  word: string
  vietnameseMeaning: string
  sampleSentence?: string
  vietnameseTranslation?: string
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
  numQuestions?: number
}

const UnjumbleGameCore: React.FC<UnjumbleGameProps> = ({
  vocabData,
  title,
  numQuestions = vocabData.length,
}) => {
  const { play: playSound } = useSoundEffects({ volume: 0.6 })

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

  const createQuestions = (
    words: Array<VocabItem>,
    num: number,
  ): Array<Question> => {
    const filtered = words.filter((word) => word.sampleSentence)
    const shuffled = shuffleArray(filtered).slice(0, num)
    const questionList = shuffled.map((word) => {
      const en = word.sampleSentence!.trim()
      const tokens = tokenize(en)
      const scrambled = shuffleArray([...tokens])
      return {
        vietnamese: word.vietnameseTranslation || word.vietnameseMeaning,
        englishTokens: tokens,
        scrambledTokens: scrambled,
      }
    })
    return shuffleArray(questionList)
  }

  const startGame = () => {
    playSound('start')
    const newQuestions = createQuestions(vocabWords, numQuestions)
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

    playSound('click')

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
      playSound('correct')
      setScore((prev) => prev + 1)
      answerCorrect()
      setFeedback(`✅ Chính xác! "${correctAnswer}"`)
    } else {
      playSound('incorrect')
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
        playSound('success')
        setIsGameOver(true)
        stopTimer()
      }
    }, 2000)
  }

  const currentQuestion = questions[currentQuestionIndex]
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100

  return (
    <div className="h-full flex flex-col overflow-hidden">
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
              🎯 {score}/{questions.length}
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
            <div className="text-6xl mb-4">🧩</div>
            <h3 className="text-4xl font-bold text-indigo-700 mb-4">
              Unjumble Game
            </h3>
            <p className="text-gray-600 mb-6 text-xl">
              Bạn sẽ có{' '}
              {Math.min(
                numQuestions,
                vocabWords.filter((w) => w.sampleSentence).length,
              )}{' '}
              câu. Kéo thả từ để tạo câu đúng.
            </p>
            <button
              onClick={startGame}
              className="bg-green-500 hover:bg-green-600 text-white font-semibold px-3 py-1 rounded-full shadow-lg transition-all duration-200 text-lg w-auto"
            >
              ▶️ Start Game
            </button>
          </div>
        ) : currentQuestion ? (
          <div className="w-full h-[98%] bg-glass rounded-xl shadow-lg p-2 mt-1 overflow-auto ">
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

            <div className="flex flex-col gap-6 items-center max-w-4xl mx-auto">
              <div className="text-3xl text-gray-700 text-center">
                <span className="inline-block bg-indigo-100 text-indigo-700 font-semibold px-5 py-3 rounded-full">
                  {currentQuestion.vietnamese}
                </span>
              </div>

              {/* Answer Area */}
              <div
                className="h-20 border-2 border-dashed border-indigo-300 bg-indigo-50 rounded-xl p-4 flex flex-wrap gap-3 items-center justify-center w-full"
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, false)}
              >
                {answerTokens.map((token, index) => (
                  <span
                    key={`answer-${index}`}
                    draggable={!isAnswering}
                    onDragStart={(e) => handleDragStart(e, token, false)}
                    className="inline-flex items-center justify-center px-4 py-2 rounded-lg border-2 border-gray-300 bg-white font-bold text-xl text-gray-800 cursor-grab active:cursor-grabbing shadow-sm"
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
                className="h-20 border-2 border-dashed border-gray-300 bg-gray-50 rounded-xl p-4 flex flex-wrap gap-3 items-center justify-center w-full"
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, true)}
              >
                {bankTokens.map((token, index) => (
                  <span
                    key={`bank-${index}`}
                    draggable={!isAnswering}
                    onDragStart={(e) => handleDragStart(e, token, true)}
                    className="inline-flex items-center justify-center px-4 py-2 rounded-lg border-2 border-gray-300 bg-white font-bold text-xl text-gray-800 cursor-grab active:cursor-grabbing shadow-sm"
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

              <div className="flex gap-4">
                <button
                  onClick={clearAnswer}
                  disabled={isAnswering}
                  className="bg-gray-200 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed text-gray-800 font-semibold px-6 py-3 rounded-lg text-lg"
                >
                  Clear
                </button>
                <button
                  onClick={submitAnswer}
                  disabled={isAnswering || answerTokens.length === 0}
                  className="bg-green-500 hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold px-6 py-3 rounded-lg text-lg"
                >
                  Submit
                </button>
              </div>

              <div className="text-lg font-semibold text-center h-6">
                {feedback.includes('✅') ? (
                  <span className="text-green-600">{feedback}</span>
                ) : (
                  <span className="text-red-600">{feedback}</span>
                )}
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
              {score >= questions.length * 0.9
                ? 'Excellent! 🌟'
                : score >= questions.length * 0.7
                  ? 'Great Job! 👏'
                  : score >= questions.length * 0.5
                    ? 'Good Try! 👍'
                    : 'Keep Practicing! 💪'}
            </h3>
            <p className="text-gray-600 text-xl">
              You scored {score}/{questions.length} (
              {Math.round((score / questions.length) * 100)}%)
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

interface UnjumbleGameActivityProps {
  vocabData: Array<VocabItem>
  backgroundUrl: string
  title: string
  onClose?: () => void
}

const UnjumbleGame: React.FC<UnjumbleGameActivityProps> = ({
  vocabData,
  backgroundUrl,
  title,
  onClose,
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
      onHomeClick={onClose}
      showNavButtons={false}
      showOutlineButton={false}
      showSlideCounter={false}
    />
  )
}

export default UnjumbleGame
