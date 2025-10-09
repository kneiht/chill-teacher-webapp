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
import './game-styles.css'

// This game doesn't use vocabData directly for questions, but it's part of the standard interface.
interface VocabItem {
  word: string
  // other fields
}

interface ClozeData {
  paragraph?: string
  words?: string[]
  sentences?: Array<{ sentence: string; word: string }>
}

interface ClozeGameProps {
  clozeData?: ClozeData
  title: string
}

const ClozeGameCore: React.FC<ClozeGameProps> = ({ clozeData, title }) => {
  const [isGameStarted, setIsGameStarted] = useState(false)
  const [isGameOver, setIsGameOver] = useState(false)
  const [timer, setTimer] = useState(0)
  const [timerInterval, setTimerInterval] = useState<NodeJS.Timeout | null>(
    null,
  )
  const [score, setScore] = useState(0) // Score can be 1 for completing, 0 for not.
  const [isAnswering, setIsAnswering] = useState(false) // To show feedback
  const [feedback, setFeedback] = useState('')
  const [answers, setAnswers] = useState<string[]>([])
  const [shuffledWords, setShuffledWords] = useState<string[]>([])
  const [correctAnswers, setCorrectAnswers] = useState<boolean[]>([])

  const parts =
    clozeData && clozeData.paragraph ? clozeData.paragraph.split('_____') : []

  useEffect(() => {
    setTotalQuestions(1) // This game has one big question
    return () => resetGame()
  }, [])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs
      .toString()
      .padStart(2, '0')}`
  }

  const normalizeText = (text: string) => {
    return text
      .trim()
      .toLowerCase()
      .replace(/\s+/g, ' ') // Loại bỏ khoảng trắng thừa
      .replace(/[^\w\s]/g, '') // Loại bỏ dấu câu
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

  const startGame = () => {
    if (!clozeData) return
    if (clozeData.words) {
      setShuffledWords([...clozeData.words].sort(() => Math.random() - 0.5))
      setAnswers(new Array(clozeData.words.length).fill(''))
      setCorrectAnswers(new Array(clozeData.words.length).fill(false))
    } else if (clozeData.sentences) {
      setShuffledWords(
        clozeData.sentences.map((s) => s.word).sort(() => Math.random() - 0.5),
      )
      setAnswers(new Array(clozeData.sentences.length).fill(''))
      setCorrectAnswers(new Array(clozeData.sentences.length).fill(false))
    }
    setIsGameStarted(true)
    setIsGameOver(false)
    setIsAnswering(false)
    setFeedback('')
    setScore(0)
    resetTimer()
    resetGame()
    setTotalQuestions(1)
    startTimer()
  }

  const restartGame = () => {
    setCorrectAnswers([])
    startGame()
  }

  const checkAnswers = () => {
    if (isAnswering || !clozeData) return
    setIsAnswering(true)

    let newCorrectAnswers: boolean[]
    let correctCount: number
    let totalBlanks: number

    if (clozeData.words) {
      newCorrectAnswers = answers.map(
        (answer, index) =>
          normalizeText(answer) === normalizeText(clozeData.words![index]),
      )
      correctCount = newCorrectAnswers.filter(Boolean).length
      totalBlanks = clozeData.words!.length
    } else if (clozeData.sentences) {
      newCorrectAnswers = answers.map(
        (answer, index) =>
          normalizeText(answer) ===
          normalizeText(clozeData.sentences![index].word),
      )
      correctCount = newCorrectAnswers.filter(Boolean).length
      totalBlanks = clozeData.sentences!.length
    } else {
      return
    }

    setCorrectAnswers(newCorrectAnswers)
    setScore(correctCount / totalBlanks)

    if (correctCount === totalBlanks) {
      answerCorrect()
      setFeedback('✅ Chúc mừng! Bạn đã hoàn thành!')
      stopTimer()
      setTimeout(() => {
        setIsGameOver(true)
      }, 1500)
    } else {
      answerIncorrect()
      setFeedback('❌ Chưa đúng, thử lại nhé!')
      // Reset answering state after a delay to allow another try
      setTimeout(() => {
        setIsAnswering(false)
      }, 1500)
    }
  }

  if (!clozeData) {
    return (
      <div className="text-center p-8">
        <p className="text-red-500">
          Lỗi: Không có dữ liệu cho bài tập điền từ.
        </p>
      </div>
    )
  }

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
              🎯{' '}
              {Math.floor(
                score *
                  (clozeData.words
                    ? clozeData.words.length
                    : clozeData.sentences
                      ? clozeData.sentences.length
                      : 0),
              )}
              /
              {clozeData.words
                ? clozeData.words.length
                : clozeData.sentences
                  ? clozeData.sentences.length
                  : 0}
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
            <div className="text-6xl mb-4">📝</div>
            <h3 className="text-4xl font-bold text-indigo-700 mb-4">
              Cloze Game
            </h3>
            <p className="text-gray-600 mb-6 text-xl">
              Điền từ còn thiếu vào câu hoặc đoạn văn.
            </p>
            <button
              onClick={startGame}
              className="bg-green-500 hover:bg-green-600 text-white font-semibold px-3 py-1 rounded-full shadow-lg transition-all duration-200 text-lg w-auto"
            >
              ▶️ Start Game
            </button>
          </div>
        ) : (
          <div className="w-full h-[95%] bg-glass rounded-xl shadow-lg p-5 mt-3 overflow-auto">
            <div className="flex flex-col items-center gap-4">
              <div className="mb-4 w-full max-w-3xl">
                <h3 className="text-xl font-bold text-indigo-600 mb-3 text-center">
                  Word Bank
                </h3>
                <div className="flex flex-wrap justify-center gap-3">
                  {shuffledWords.map((word, index) => (
                    <div
                      key={index}
                      className="bg-indigo-100 rounded-lg px-3 py-1 text-center text-lg font-semibold text-indigo-800 shadow-sm"
                    >
                      {word}
                    </div>
                  ))}
                </div>
              </div>

              {clozeData.sentences ? (
                <div className="space-y-4">
                  {clozeData.sentences.map((item, index) => {
                    const sentenceParts = item.sentence.split('_____')
                    return (
                      <div
                        key={index}
                        className="text-xl leading-relaxed bg-white/70 p-4 rounded-lg shadow select-none"
                        onCopy={(e) => e.preventDefault()}
                        onContextMenu={(e) => e.preventDefault()}
                      >
                        {sentenceParts.map((part, partIndex) => (
                          <span key={partIndex}>
                            {part}
                            {partIndex < sentenceParts.length - 1 && (
                              <input
                                type="text"
                                value={answers[index]}
                                onChange={(e) =>
                                  setAnswers((prev) => {
                                    const newA = [...prev]
                                    newA[index] = e.target.value
                                    return newA
                                  })
                                }
                                disabled={
                                  isAnswering && feedback.includes('✅')
                                }
                                className={`border-b-2 w-32 text-center mx-2 py-1 text-xl font-semibold bg-transparent focus:outline-none transition-colors ${
                                  correctAnswers[index]
                                    ? 'border-green-500 text-green-700'
                                    : isAnswering && !correctAnswers[index]
                                      ? 'border-red-500 text-red-700'
                                      : 'border-indigo-400 focus:border-indigo-600'
                                }`}
                              />
                            )}
                          </span>
                        ))}
                      </div>
                    )
                  })}
                </div>
              ) : (
                <div
                  className="text-2xl mb-4 leading-relaxed bg-white/70 p-6 rounded-lg shadow select-none"
                  onCopy={(e) => e.preventDefault()}
                  onContextMenu={(e) => e.preventDefault()}
                >
                  {parts.map((part, index) => (
                    <span key={index}>
                      {part}
                      {index < parts.length - 1 && (
                        <input
                          type="text"
                          value={answers[index]}
                          onChange={(e) =>
                            setAnswers((prev) => {
                              const newA = [...prev]
                              newA[index] = e.target.value
                              return newA
                            })
                          }
                          disabled={isAnswering && feedback.includes('✅')}
                          className={`border-b-2 w-32 text-center mx-2 py-1 text-2xl font-semibold bg-transparent focus:outline-none transition-colors ${
                            correctAnswers[index]
                              ? 'border-green-500 text-green-700'
                              : isAnswering && !correctAnswers[index]
                                ? 'border-red-500 text-red-700'
                                : 'border-indigo-400 focus:border-indigo-600'
                          }`}
                        />
                      )}
                    </span>
                  ))}
                </div>
              )}

              <div className="flex gap-4">
                <button
                  onClick={checkAnswers}
                  disabled={isAnswering}
                  className="bg-green-500 hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold px-6 py-3 rounded-lg text-lg"
                >
                  Check Answers
                </button>
              </div>

              <div className="text-lg font-semibold text-center h-6 mt-2">
                {feedback.includes('✅') ? (
                  <span className="text-green-600">{feedback}</span>
                ) : (
                  <span className="text-red-600">{feedback}</span>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {isGameOver && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white rounded-xl p-8 shadow-2xl text-center">
            <div className="text-6xl mb-4">🎉</div>
            <h3 className="text-2xl font-bold text-green-600 mb-2">
              Excellent Work!
            </h3>
            <p className="text-gray-600 text-xl">You completed the exercise!</p>
            <p className="text-indigo-700 font-bold mt-2 text-xl">
              ⏱️ Time: {formatTime(timer)}
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

interface ClozeGameActivityProps {
  vocabData: Array<VocabItem> // Keep for consistency, though unused
  backgroundUrl: string
  title: string
  onClose?: () => void
  clozeData?: ClozeData
}

const ClozeGame: React.FC<ClozeGameActivityProps> = ({
  backgroundUrl,
  title,
  onClose,
  clozeData,
}) => {
  const ClozeGameSlide: React.FC<{ isActive: boolean }> = ({ isActive }) => (
    <Slide isActive={isActive} className="overflow-hidden">
      <ClozeGameCore clozeData={clozeData} title={title} />
    </Slide>
  )

  const slides = [ClozeGameSlide]

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

export default ClozeGame
