import React, { useState, useEffect, useRef } from 'react'
import { useVoice } from '@/lib/hooks/use-voice'
import { useSoundEffects } from '@/lib/hooks/useSoundEffects'
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
  sampleSentence?: string
  // other fields
}

interface Question {
  sentence: string
}

interface ListeningSentenceTypingGameProps {
  vocabData: Array<VocabItem>
  title: string
  numQuestions?: number
}

const ListeningSentenceTypingGameCore: React.FC<
  ListeningSentenceTypingGameProps
> = ({ vocabData, title, numQuestions = vocabData.length }) => {
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
  const [userAnswer, setUserAnswer] = useState('')
  const [feedback, setFeedback] = useState('')
  const [isPlayingAudio, setIsPlayingAudio] = useState(false)

  const inputRef = useRef<HTMLInputElement>(null)
  const nextButtonRef = useRef<HTMLButtonElement>(null)
  const { speak } = useVoice()

  const vocabWords: Array<VocabItem> = vocabData

  useEffect(() => {
    setTotalQuestions(vocabWords.length)
    resetGame()
  }, [])

  // Auto-focus input when moving to next question
  useEffect(() => {
    if (isGameStarted && !isAnswering && inputRef.current) {
      inputRef.current.focus()
    }
  }, [currentQuestionIndex, isAnswering, isGameStarted])

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

  const createQuestions = (
    words: Array<VocabItem>,
    num: number,
  ): Array<Question> => {
    const shuffled = shuffleArray(words)
    return shuffled
      .slice(0, num)
      .map((word) => ({
        sentence: word.sampleSentence || '',
      }))
      .filter((q) => q.sentence) // Only include items with sentences
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
    setUserAnswer('')
    setFeedback('')
    setIsPlayingAudio(false)
    resetTimer()
    resetGame()
    setTotalQuestions(newQuestions.length)
    startTimer()
  }

  const restartGame = () => {
    const newQuestions = createQuestions(vocabWords, numQuestions)
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
    setTotalQuestions(newQuestions.length)
    startTimer()
  }

  const playCurrentSentence = () => {
    if (isPlayingAudio || !currentQuestion) return

    playSound('click')
    setIsPlayingAudio(true)
    const text = currentQuestion.sentence

    speak(text, 'en-US')

    // Reset playing state after a delay
    setTimeout(() => {
      setIsPlayingAudio(false)
    }, 3000)
  }

  const submitAnswer = () => {
    if (isAnswering || !currentQuestion) return

    setIsAnswering(true)
    const normalizedUserAnswer = userAnswer
      .trim()
      .toLowerCase()
      .replace(/[^a-z\s]/g, '')
    const normalizedCorrectAnswer = currentQuestion.sentence
      .toLowerCase()
      .replace(/[^a-z\s]/g, '')

    if (normalizedUserAnswer === normalizedCorrectAnswer) {
      setScore((prev) => prev + 1)
      answerCorrect()
      playSound('correct')
      setFeedback(`✅ Chính xác! "${currentQuestion.sentence}"`)
    } else {
      answerIncorrect()
      playSound('incorrect')
      setFeedback(`❌ Sai. Đáp án đúng: "${currentQuestion.sentence}"`)
    }

    // Focus next button after showing feedback
    setTimeout(() => {
      nextButtonRef.current?.focus()
    }, 100)
  }

  const nextQuestion = () => {
    if (!isAnswering) return

    const nextIndex = currentQuestionIndex + 1
    if (nextIndex < questions.length) {
      setCurrentQuestionIndex(nextIndex)
      setIsAnswering(false)
      setUserAnswer('')
      setFeedback('')
      setIsPlayingAudio(false)
    } else {
      playSound('success')
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

  // Auto-focus input and auto-speak when moving to next question
  useEffect(() => {
    if (isGameStarted && !isAnswering && currentQuestion) {
      // Auto-speak the sentence
      speak(currentQuestion.sentence, 'en-US')

      // Focus input after a short delay
      setTimeout(() => {
        inputRef.current?.focus()
      }, 500)
    }
  }, [currentQuestionIndex, isAnswering, isGameStarted, currentQuestion])

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
            <div className="text-6xl mb-4">🔊</div>
            <h3 className="text-4xl font-bold text-indigo-700 mb-4">
              Listening & Typing Sentences
            </h3>
            <p className="text-gray-600 mb-6 text-xl">
              Nghe phát âm câu ví dụ và gõ lại câu. Có{' '}
              {vocabWords.filter((w) => w.sampleSentence).length} câu.
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

            <div className="flex flex-col items-center gap-6 max-w-2xl mx-auto">
              <div className="flex flex-col items-center gap-4">
                <button
                  onClick={playCurrentSentence}
                  disabled={isPlayingAudio}
                  className="bg-indigo-500 hover:bg-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-4 px-6 rounded-full shadow-lg text-2xl"
                >
                  <span className={isPlayingAudio ? 'animate-pulse' : ''}>
                    🔊 Nghe câu
                  </span>
                </button>
                <p className="text-gray-600 text-sm">Bấm để nghe câu ví dụ</p>
              </div>

              <div className="flex flex-col gap-3 w-full max-w-lg">
                <input
                  ref={inputRef}
                  type="text"
                  value={userAnswer}
                  onChange={(e) => setUserAnswer(e.target.value)}
                  onKeyDown={handleKeyPress}
                  disabled={isAnswering}
                  className={`answer-input w-full text-center text-2xl border-2 border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition-all ${
                    feedback.includes('✅')
                      ? 'border-green-500 bg-green-100'
                      : feedback.includes('❌')
                        ? 'border-red-500 bg-red-100'
                        : ''
                  }`}
                  placeholder="Gõ câu tiếng Anh..."
                  autoComplete="off"
                />
                {!isAnswering ? (
                  <button
                    onClick={submitAnswer}
                    disabled={!userAnswer.trim()}
                    className="bg-green-500 hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-lg text-lg"
                  >
                    Submit
                  </button>
                ) : (
                  <button
                    ref={nextButtonRef}
                    onClick={nextQuestion}
                    className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 rounded-lg text-lg"
                  >
                    Next
                  </button>
                )}
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

interface ListeningSentenceTypingGameActivityProps {
  vocabData: Array<VocabItem>
  backgroundUrl: string
  title: string
  onClose?: () => void
  numQuestions?: number
}

const ListeningSentenceTypingGame: React.FC<
  ListeningSentenceTypingGameActivityProps
> = ({ vocabData, backgroundUrl, title, onClose, numQuestions }) => {
  const GameSlide: React.FC<{ isActive: boolean }> = ({ isActive }) => (
    <Slide isActive={isActive}>
      <ListeningSentenceTypingGameCore
        vocabData={vocabData}
        title={title}
        numQuestions={numQuestions}
      />
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

export default ListeningSentenceTypingGame
