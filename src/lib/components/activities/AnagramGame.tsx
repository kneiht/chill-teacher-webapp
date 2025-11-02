import React, { useState, useEffect, useMemo } from 'react'
import {
  answerCorrect,
  answerIncorrect,
  setTotalQuestions,
  resetGame,
} from '@/lib/stores/game.store'

// Hooks
import { useSoundEffects } from '@/lib/hooks/useSoundEffects'
import { useBackgroundMusic } from '@/lib/hooks/useBackgroundMusic'

// Components
import PresentationShell from '@/lib/components/presentation/PresentationShell'
import Slide from '@/lib/components/presentation/Slide'

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
  title: string
  numQuestions?: number
}

interface AnswerSlot {
  letter: string
  sourceIndex: number | null
}

const AnagramGameCore: React.FC<AnagramGameProps> = ({
  vocabData,
  title,
  numQuestions = vocabData.length,
}) => {
  const { play: playSound } = useSoundEffects({ volume: 0.6 })
  const { play: playMusic, stop: stopMusic } = useBackgroundMusic({
    volume: 0.3,
  })

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
  const [answerSlots, setAnswerSlots] = useState<Array<AnswerSlot>>([])
  const [usedLetters, setUsedLetters] = useState<Set<number>>(new Set())
  const [feedback, setFeedback] = useState('')

  const vocabWords: Array<VocabItem> = vocabData

  useEffect(() => {
    setTotalQuestions(vocabWords.length)
    return () => {
      resetGame()
      stopMusic()
    }
  }, [stopMusic])

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

  const createQuestions = (
    words: Array<VocabItem>,
    num: number,
  ): Array<Question> => {
    const shuffled = shuffleArray(words)
    const questionList = shuffled.slice(0, num).map((word) => ({
      vietnamese: word.vietnameseMeaning,
      correct: word.word,
      scrambled: scrambleWord(word.word),
    }))
    return shuffleArray(questionList)
  }

  const startGame = () => {
    playSound('start')
    playMusic() // Start background music with random track
    const newQuestions = createQuestions(vocabWords, numQuestions)
    setQuestions(newQuestions)
    setCurrentQuestionIndex(0)
    setScore(0)
    setIsGameStarted(true)
    setIsGameOver(false)
    setIsAnswering(false)
    setUsedLetters(new Set())
    setFeedback('')
    resetTimer()
    resetGame()
    setTotalQuestions(newQuestions.length)
    startTimer()
  }

  useEffect(() => {
    if (isGameStarted && questions.length > 0) {
      setAnswerSlots(
        new Array(questions[currentQuestionIndex].correct.length).fill({
          letter: '',
          sourceIndex: null,
        }),
      )
    }
  }, [isGameStarted, currentQuestionIndex, questions])

  const restartGame = () => {
    stopMusic() // Stop current music
    playMusic() // Start new random background music
    const newQuestions = createQuestions(vocabWords, numQuestions)
    setQuestions(newQuestions)
    setCurrentQuestionIndex(0)
    setScore(0)
    setIsGameStarted(true)
    setIsGameOver(false)
    setIsAnswering(false)
    setAnswerSlots([]) // Clear slots
    setUsedLetters(new Set())
    setFeedback('')
    resetTimer()
    resetGame()
    setTotalQuestions(newQuestions.length)
    startTimer()
  }

  const handleLetterClick = (letterIndex: number, letter: string) => {
    if (isAnswering) return
    if (usedLetters.has(letterIndex)) return

    const emptySlotIndex = answerSlots.findIndex((slot) => slot.letter === '')
    if (emptySlotIndex === -1) return

    playSound('click')

    const newSlots = [...answerSlots]
    newSlots[emptySlotIndex] = {
      letter: letter.toUpperCase(),
      sourceIndex: letterIndex,
    }
    setAnswerSlots(newSlots)

    const newUsed = new Set(usedLetters)
    newUsed.add(letterIndex)
    setUsedLetters(newUsed)
  }

  const handleSlotClick = (slotIndex: number) => {
    if (isAnswering) return
    const slot = answerSlots[slotIndex]
    if (slot.letter === '') return

    const newSlots = [...answerSlots]
    newSlots[slotIndex] = { letter: '', sourceIndex: null }
    setAnswerSlots(newSlots)

    if (slot.sourceIndex !== null) {
      const newUsed = new Set(usedLetters)
      newUsed.delete(slot.sourceIndex)
      setUsedLetters(newUsed)
    }
  }

  const clearAnswer = () => {
    if (isAnswering) return
    setAnswerSlots(
      new Array(questions[currentQuestionIndex].correct.length).fill({
        letter: '',
        sourceIndex: null,
      }),
    )
    setUsedLetters(new Set())
    setFeedback('')
  }

  const submitAnswer = () => {
    if (isAnswering) return
    setIsAnswering(true)

    const currentQuestion = questions[currentQuestionIndex]
    const userAnswer = answerSlots
      .map((s) => s.letter)
      .join('')
      .toLowerCase()
    const correctAnswer = currentQuestion.correct.toLowerCase()
    const isCorrect = userAnswer === correctAnswer

    if (isCorrect) {
      playSound('correct')
      setScore((prev) => prev + 1)
      answerCorrect()
      setFeedback('✅ Chính xác!')
    } else {
      playSound('incorrect')
      answerIncorrect()
      setFeedback(`❌ Sai. Đáp án đúng: ${currentQuestion.correct}`)
    }

    // Now we wait for the user to click "Next"
  }

  const goToNextQuestion = () => {
    const nextIndex = currentQuestionIndex + 1
    if (nextIndex < questions.length) {
      setCurrentQuestionIndex(nextIndex)
      setIsAnswering(false)
      setUsedLetters(new Set())
      setFeedback('')
    } else {
      playSound('success')
      stopMusic() // Stop background music when game ends
      setIsGameOver(true)
      stopTimer()
    }
  }

  const currentQuestion = questions[currentQuestionIndex]
  const progress =
    isGameStarted && questions.length > 0
      ? ((currentQuestionIndex + 1) / questions.length) * 100
      : 0

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
          <div className="text-center bg-glass rounded-xl shadow-lg p-8 py-12 mt-10">
            <div className="text-6xl mb-4">🔤</div>
            <h3 className="text-4xl font-bold text-indigo-700 mb-4">
              Anagram Game
            </h3>
            <p className="text-gray-600 mb-6 text-xl">
              Bạn sẽ có {vocabWords.length} câu hỏi.
              <br />
              Xem gợi ý tiếng Việt và sắp xếp chữ cái để gõ từ tiếng Anh đúng.
            </p>
            {!isGameStarted && (
              <button
                onClick={startGame}
                className="bg-green-500 hover:bg-green-600 text-white font-semibold px-3 py-1 rounded-full shadow-lg transition-all duration-200 text-lg w-auto "
              >
                ▶️ Start Game
              </button>
            )}
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

            <div className="flex flex-col items-center gap-4 mb-3">
              <div className="text-4xl text-gray-700">
                <span className="inline-block bg-indigo-100 text-indigo-700 font-semibold px-5 py-3 rounded-full">
                  {currentQuestion.vietnamese}
                </span>
              </div>

              <div className="answer-area flex flex-wrap gap-2 justify-center">
                {answerSlots.map((slot, index) => (
                  <div
                    key={index}
                    onClick={() => handleSlotClick(index)}
                    className={`w-14 h-14 rounded-lg border-2 flex items-center justify-center font-bold text-3xl text-gray-800 cursor-pointer transition-all duration-200 ${
                      slot.letter
                        ? 'border-solid bg-indigo-100 border-indigo-300 shadow-sm'
                        : 'border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100'
                    } ${
                      isAnswering && feedback.includes('✅')
                        ? 'border-green-500 bg-green-100 animate-pulse'
                        : ''
                    } ${
                      isAnswering && feedback.includes('❌')
                        ? 'border-red-500 bg-red-100'
                        : ''
                    }`}
                  >
                    {slot.letter}
                  </div>
                ))}
              </div>

              <div className="flex flex-wrap gap-2 justify-center">
                {currentQuestion.scrambled.split('').map((letter, index) => (
                  <span
                    key={index}
                    onClick={() => handleLetterClick(index, letter)}
                    className={`inline-flex items-center justify-center w-14 h-14 rounded-lg border-2 border-gray-200 bg-white font-bold text-3xl text-gray-800 cursor-pointer transition-all duration-200 hover:bg-indigo-50 hover:scale-105 hover:shadow-md active:scale-95 ${
                      usedLetters.has(index)
                        ? 'opacity-30 pointer-events-none'
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
                  className="bg-gray-200 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed text-gray-800 font-semibold px-6 py-3 rounded-lg text-lg"
                >
                  Clear
                </button>
                {isAnswering ? (
                  <button
                    onClick={goToNextQuestion}
                    className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-6 py-3 rounded-lg text-lg"
                  >
                    Next →
                  </button>
                ) : (
                  <button
                    onClick={submitAnswer}
                    disabled={
                      isAnswering ||
                      answerSlots.some((slot) => slot.letter === '')
                    }
                    className="bg-green-500 hover:bg-green-600 disabled:opacity-80 disabled:cursor-not-allowed text-white font-semibold px-6 py-3 rounded-lg text-lg"
                  >
                    Submit
                  </button>
                )}
              </div>

              <div className="text-sm h-5 mt-2 font-semibold">
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

      {isGameOver && ( // Game Over Modal
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

interface AnagramGameActivityProps {
  vocabData: Array<VocabItem>
  backgroundUrl: string
  title: string
  onClose?: () => void
}

const AnagramGame: React.FC<AnagramGameActivityProps> = ({
  vocabData,
  backgroundUrl,
  title,
  onClose,
}) => {
  const slides = useMemo(() => {
    const AnagramGameSlide = React.memo<{ isActive: boolean }>(
      ({ isActive }) => (
        <Slide isActive={isActive} className="overflow-hidden">
          <AnagramGameCore vocabData={vocabData} title={title} />
        </Slide>
      ),
    )

    return [AnagramGameSlide]
  }, [vocabData, title])

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

export default AnagramGame
