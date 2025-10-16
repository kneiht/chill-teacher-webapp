import React, { useState, useEffect, useMemo, useCallback } from 'react'
import { useVoice } from '@/lib/hooks/use-voice'
import { useSoundEffects } from '@/lib/hooks/useSoundEffects'
import { useBackgroundMusic } from '@/lib/hooks/useBackgroundMusic'
import {
  answerCorrect,
  answerIncorrect,
  resetGame,
} from '@/lib/stores/game.store'

// Components
import PresentationShell from '@/lib/components/presentation/PresentationShell'
import Slide from '@/lib/components/presentation/Slide'
import './game-styles.css'

interface VocabItem {
  word: string
  vietnameseMeaning: string
  sampleSentence?: string
  image?: string
  phonics?: string
}

type QuestionType =
  | 'multipleChoice'
  | 'listening'
  | 'fillBlank'
  | 'imageChoice'
  | 'imageToVietnamese'

interface Question {
  type: QuestionType
  question: string
  correctAnswer: string
  options?: Array<string>
  wordToSpeak?: string
  image?: string
}

interface Bubble {
  id: string
  row: number
  col: number
  color: string
}

interface BubbleShooterEnglishGameProps {
  vocabData: Array<VocabItem>
  questionsData: Array<Question>
  title: string
}

type Board = Array<Array<Bubble | null>>

const BUBBLE_COLORS = ['🔵', '🟢', '🔴', '🟣', '🟡', '🟠']
const GRID_ROWS = 10
const GRID_COLS = 8
const INITIAL_SHOTS = 8
const INITIAL_FILLED_ROWS = 4

const getRandomColor = () =>
  BUBBLE_COLORS[Math.floor(Math.random() * BUBBLE_COLORS.length)]

const BubbleShooterEnglishGameCore: React.FC<BubbleShooterEnglishGameProps> = ({
  questionsData,
  title,
}) => {
  const { play: playSound } = useSoundEffects({ volume: 0.6 })
  const { play: playMusic, stop: stopMusic } = useBackgroundMusic({
    volume: 0.3,
  })
  const { speak } = useVoice()

  // Game state
  const [isGameStarted, setIsGameStarted] = useState(false)
  const [isGameOver, setIsGameOver] = useState(false)
  const [board, setBoard] = useState<Board>([])
  const [activeBubble, setActiveBubble] = useState<string | null>(null)
  const [nextBubble, setNextBubble] = useState<string | null>(null)
  const [shotsLeft, setShotsLeft] = useState(INITIAL_SHOTS)
  const [score, setScore] = useState(0)
  const [isProcessing, setIsProcessing] = useState(false)
  const [comboCount, setComboCount] = useState(0)

  // Question state
  const [showQuestion, setShowQuestion] = useState(false)
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null)
  const [userAnswer, setUserAnswer] = useState('')
  const [selectedOption, setSelectedOption] = useState<string | null>(null)
  const [questionFeedback, setQuestionFeedback] = useState('')
  const [questionsAnswered, setQuestionsAnswered] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Visual effects
  const [particles, setParticles] = useState<
    Array<{ id: string; x: number; y: number; emoji: string }>
  >([])

  useEffect(() => {
    return () => {
      resetGame()
      stopMusic()
    }
  }, [stopMusic])

  const createBubble = (
    row: number,
    col: number,
    color = getRandomColor(),
  ): Bubble => ({
    id: `${row}-${col}-${Math.random().toString(36).slice(2, 8)}`,
    row,
    col,
    color,
  })

  const initialiseBoard = useCallback((): Board => {
    const newBoard: Board = Array.from({ length: GRID_ROWS }, (_, row) =>
      Array.from({ length: GRID_COLS }, (_, col) =>
        row < INITIAL_FILLED_ROWS ? createBubble(row, col) : null,
      ),
    )
    return newBoard
  }, [])

  const applyGravity = (currentBoard: Board): Board => {
    const newBoard: Board = Array.from({ length: GRID_ROWS }, () =>
      Array.from({ length: GRID_COLS }, () => null),
    )

    for (let col = 0; col < GRID_COLS; col++) {
      let writeRow = GRID_ROWS - 1
      for (let row = GRID_ROWS - 1; row >= 0; row--) {
        const bubble = currentBoard[row][col]
        if (bubble) {
          newBoard[writeRow][col] = {
            ...bubble,
            row: writeRow,
            col,
          }
          writeRow--
        }
      }
    }

    return newBoard
  }

  const findAndClearMatches = (currentBoard: Board) => {
    const visited = new Set<string>()
    const positionsToClear: Array<{ row: number; col: number; color: string }> =
      []

    const directions = [
      [1, 0],
      [-1, 0],
      [0, 1],
      [0, -1],
    ]

    for (let row = 0; row < GRID_ROWS; row++) {
      for (let col = 0; col < GRID_COLS; col++) {
        const bubble = currentBoard[row][col]
        if (!bubble) continue

        const key = `${row}-${col}`
        if (visited.has(key)) continue

        const stack: Array<{ row: number; col: number }> = [{ row, col }]
        const cluster: Array<{ row: number; col: number; color: string }> = []
        visited.add(key)

        while (stack.length > 0) {
          const cell = stack.pop()!
          const current = currentBoard[cell.row][cell.col]
          if (!current) continue

          cluster.push({ row: cell.row, col: cell.col, color: current.color })

          for (const [dRow, dCol] of directions) {
            const nextRow = cell.row + dRow
            const nextCol = cell.col + dCol
            if (
              nextRow < 0 ||
              nextRow >= GRID_ROWS ||
              nextCol < 0 ||
              nextCol >= GRID_COLS
            ) {
              continue
            }

            const neighbour = currentBoard[nextRow][nextCol]
            if (!neighbour || neighbour.color !== current.color) continue

            const neighbourKey = `${nextRow}-${nextCol}`
            if (visited.has(neighbourKey)) continue

            visited.add(neighbourKey)
            stack.push({ row: nextRow, col: nextCol })
          }
        }

        if (cluster.length >= 3) {
          positionsToClear.push(...cluster)
        }
      }
    }

    if (positionsToClear.length === 0) {
      return { cleared: 0, board: currentBoard }
    }

    const boardAfterClear: Board = currentBoard.map((row) =>
      row.map((cell) => cell),
    )

    positionsToClear.forEach(({ row, col }) => {
      boardAfterClear[row][col] = null
    })

    const withGravity = applyGravity(boardAfterClear)

    const particleBurst = positionsToClear.map(
      ({ row, col, color }, index) => ({
        id: `bubble-pop-${Date.now()}-${row}-${col}-${index}`,
        x: col * 70 + 30,
        y: row * 70 + 30,
        emoji: color,
      }),
    )

    setParticles((prev) => [...prev, ...particleBurst])
    setTimeout(() => {
      setParticles((prev) =>
        prev.filter((particle) => !particle.id.startsWith('bubble-pop-')),
      )
    }, 900)

    return { cleared: positionsToClear.length, board: withGravity }
  }

  const resolveBoard = useCallback(
    async (initialBoard: Board) => {
      let boardToProcess = initialBoard
      let totalCleared = 0
      let chainCount = 0

      while (true) {
        const { cleared, board: nextBoard } =
          findAndClearMatches(boardToProcess)
        if (cleared === 0) break

        totalCleared += cleared
        chainCount += 1
        boardToProcess = nextBoard
        setBoard(nextBoard)
        playSound('match')
        setScore((prev) => prev + cleared * 15 + chainCount * 5)
        await new Promise((resolve) => setTimeout(resolve, 260))
      }

      if (chainCount > 0) {
        setComboCount(chainCount)
        setTimeout(() => setComboCount(0), 1800)
      }

      return { totalCleared, finalBoard: boardToProcess }
    },
    [playSound],
  )

  const prepareNextBubble = useCallback(() => {
    setActiveBubble((previous) => (previous ? previous : getRandomColor()))
    setNextBubble(getRandomColor())
  }, [])

  const getRandomQuestion = useCallback((): Question => {
    const randomIndex = Math.floor(Math.random() * questionsData.length)
    const question = questionsData[randomIndex]

    if (question.type === 'listening' && question.wordToSpeak) {
      setTimeout(() => speak(question.wordToSpeak!, 'en-US'), 500)
    }

    return question
  }, [questionsData, speak])

  const openQuestionModal = useCallback(() => {
    setShowQuestion(true)
    const question = getRandomQuestion()
    setCurrentQuestion(question)
    setUserAnswer('')
    setSelectedOption(null)
    setQuestionFeedback('')
    setIsSubmitting(false)
  }, [getRandomQuestion])

  useEffect(() => {
    if (
      isGameStarted &&
      !isGameOver &&
      shotsLeft === 0 &&
      !showQuestion &&
      questionsData.length > 0
    ) {
      openQuestionModal()
    }
  }, [
    isGameStarted,
    isGameOver,
    shotsLeft,
    showQuestion,
    openQuestionModal,
    questionsData.length,
  ])

  const handleShoot = async (col: number) => {
    if (!isGameStarted || isGameOver || isProcessing) return
    if (shotsLeft <= 0) {
      playSound('incorrect')
      return
    }
    if (!activeBubble) {
      prepareNextBubble()
      return
    }

    const targetRow = (() => {
      for (let row = GRID_ROWS - 1; row >= 0; row--) {
        if (!board[row] || !board[row][col]) {
          return row
        }
      }
      return -1
    })()

    if (targetRow === -1) {
      playSound('incorrect')
      return
    }

    setIsProcessing(true)
    playSound('flip')

    const newBoard: Board = board.map((row, rowIndex) =>
      row.map((cell, cellCol) => {
        if (rowIndex === targetRow && cellCol === col) {
          return createBubble(rowIndex, cellCol, activeBubble)
        }
        return cell
      }),
    )

    setBoard(newBoard)
    setShotsLeft((prev) => Math.max(0, prev - 1))

    const { totalCleared, finalBoard } = await resolveBoard(newBoard)

    if (totalCleared === 0) {
      setComboCount(0)
    }

    setBoard(finalBoard)
    setActiveBubble(nextBubble)
    setNextBubble(getRandomColor())
    setIsProcessing(false)

    const overflow = finalBoard[0].some((cell) => cell !== null)
    if (overflow) {
      setIsGameOver(true)
      playSound('incorrect')
      stopMusic()
      return
    }

    if (shotsLeft - 1 <= 0 && questionsData.length === 0) {
      setIsGameOver(true)
      stopMusic()
    }
  }

  const handleSubmitAnswer = () => {
    if (!currentQuestion || isSubmitting) return

    setIsSubmitting(true)

    let isCorrect = false
    if (currentQuestion.type === 'fillBlank') {
      isCorrect =
        userAnswer.trim().toLowerCase() ===
        currentQuestion.correctAnswer.trim().toLowerCase()
    } else {
      isCorrect = selectedOption === currentQuestion.correctAnswer
    }

    if (isCorrect) {
      playSound('correct')
      setQuestionFeedback('✅ Chính xác! +3 đạn')
      setShotsLeft((prev) => prev + 3)
      answerCorrect()
      setComboCount((prev) => Math.max(prev, 1))
    } else {
      playSound('incorrect')
      setQuestionFeedback(
        `❌ Sai rồi! Đáp án đúng: "${currentQuestion.correctAnswer}". -1 đạn`,
      )
      setShotsLeft((prev) => Math.max(0, prev - 1))
      answerIncorrect()
    }

    setQuestionsAnswered((prev) => prev + 1)

    setTimeout(() => {
      setQuestionFeedback('')
      setShowQuestion(false)
      setCurrentQuestion(null)
      setIsSubmitting(false)
      if (shotsLeft <= 0) {
        openQuestionModal()
      }
    }, 1500)
  }

  const startGame = () => {
    playSound('start')
    playMusic()
    const newBoard = initialiseBoard()
    setBoard(newBoard)
    setActiveBubble(getRandomColor())
    setNextBubble(getRandomColor())
    setShotsLeft(INITIAL_SHOTS)
    setScore(0)
    setQuestionsAnswered(0)
    setIsGameStarted(true)
    setIsGameOver(false)
    setShowQuestion(false)
    resetGame()
    setComboCount(0)
  }

  const restartGame = () => {
    stopMusic()
    startGame()
  }

  const replayAudio = () => {
    if (currentQuestion?.wordToSpeak) {
      speak(currentQuestion.wordToSpeak, 'en-US')
      playSound('click')
    }
  }

  return (
    <div className="h-full flex flex-col relative">
      <style>{`
        @keyframes bubble-rise {
          0% { transform: translateY(0) scale(1); opacity: 1; }
          100% { transform: translateY(-160px) scale(0.5); opacity: 0; }
        }
        @keyframes bubble-pop {
          0% { transform: scale(0.5); opacity: 0; }
          50% { transform: scale(1.2); opacity: 1; }
          100% { transform: scale(0.7); opacity: 0; }
        }
        @keyframes combo-glow {
          0%, 100% { transform: scale(1); box-shadow: 0 0 12px rgba(129, 140, 248, 0.4); }
          50% { transform: scale(1.05); box-shadow: 0 0 22px rgba(129, 140, 248, 0.8); }
        }
        .bubble-particle {
          position: fixed;
          pointer-events: none;
          font-size: 2.2rem;
          z-index: 80;
          animation: bubble-rise 1s ease-out forwards;
        }
        .combo-banner {
          animation: combo-glow 1s ease-in-out infinite;
        }
        .bubble-cell {
          transition: transform 0.2s ease-in-out, opacity 0.2s ease-in-out;
        }
        .bubble-cell:hover {
          transform: scale(1.08);
        }
      `}</style>

      {particles.map((particle) => (
        <div
          key={particle.id}
          className="bubble-particle"
          style={{ left: particle.x, top: particle.y }}
        >
          {particle.emoji}
        </div>
      ))}

      {comboCount > 1 && (
        <div className="fixed top-1/4 left-1/2 transform -translate-x-1/2 z-40">
          <div className="bg-gradient-to-r from-sky-400 to-indigo-500 text-white font-bold text-3xl md:text-4xl px-6 py-3 rounded-full shadow-2xl combo-banner">
            🫧 Combo x{comboCount}!
          </div>
        </div>
      )}

      <h2 className="text-xl font-bold text-indigo-700 text-center">{title}</h2>

      <div className="w-full my-3 flex flex-row justify-center gap-4 items-stretch flex-wrap">
        {isGameStarted && (
          <>
            <div className="bg-gradient-to-r from-blue-100 to-blue-200 text-blue-700 font-bold px-3 py-2 rounded-full shadow-lg text-center text-sm transform hover:scale-110 transition-transform">
              💎 Điểm: {score}
            </div>
            <div className="bg-gradient-to-r from-purple-100 to-purple-200 text-purple-700 font-bold px-3 py-2 rounded-full shadow-lg text-center text-sm transform hover:scale-110 transition-transform">
              🎯 Đạn: {shotsLeft}
            </div>
            <div className="bg-gradient-to-r from-green-100 to-green-200 text-green-700 font-bold px-3 py-2 rounded-full shadow-lg text-center text-sm transform hover:scale-110 transition-transform">
              🧠 Câu hỏi: {questionsAnswered}
            </div>
            <button
              onClick={openQuestionModal}
              className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold px-4 py-2 rounded-full shadow-lg transition-all duration-200 text-sm transform hover:scale-110"
            >
              ❓ Nạp đạn bằng câu hỏi
            </button>
            <button
              onClick={restartGame}
              className="bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white font-semibold px-4 py-2 rounded-full shadow-lg transition-all duration-200 text-sm transform hover:scale-110"
            >
              🔄 Restart
            </button>
          </>
        )}
      </div>

      <div className="flex-1 flex items-start justify-center h-full overflow-auto">
        {!isGameStarted ? (
          <div className="text-center bg-gradient-to-br from-white to-sky-100 rounded-2xl shadow-2xl p-8 py-12 mt-10 w-full max-w-2xl">
            <div className="text-7xl mb-4 animate-bounce">🫧</div>
            <h3 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-sky-600 to-indigo-600 mb-4">
              Bubble Shooter
            </h3>
            <p className="text-gray-700 mb-6 text-xl leading-relaxed">
              🎯 Bắn bong bóng cùng màu để làm chúng biến mất!
              <br />
              💡 Trả lời câu hỏi để nạp thêm đạn.
              <br />
              🧠 Mục tiêu: giữ bảng không chạm đỉnh.
            </p>
            <button
              onClick={startGame}
              className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold px-8 py-4 rounded-full shadow-lg transition-all duration-200 text-xl transform hover:scale-110"
            >
              ▶️ Bắt đầu
            </button>
          </div>
        ) : (
          <div className="w-full max-w-3xl bg-glass rounded-xl shadow-lg p-6">
            <div
              className="grid gap-2 mb-4"
              style={{
                gridTemplateColumns: `repeat(${GRID_COLS}, minmax(0, 1fr))`,
              }}
            >
              {Array.from({ length: GRID_COLS }, (_, colIndex) => (
                <button
                  key={`launcher-${colIndex}`}
                  onClick={() => handleShoot(colIndex)}
                  disabled={isProcessing || isGameOver}
                  className={`flex flex-col items-center justify-center gap-1 px-2 py-2 rounded-lg border-2 border-indigo-200 text-indigo-600 font-semibold transition-all hover:scale-105 hover:border-indigo-400 ${
                    isProcessing || isGameOver
                      ? 'opacity-50 cursor-not-allowed'
                      : 'bg-white shadow-md'
                  }`}
                >
                  <span className="text-2xl">⬆️</span>
                  <span className="text-xs">Cột {colIndex + 1}</span>
                </button>
              ))}
            </div>

            <div
              className="grid gap-2"
              style={{
                gridTemplateColumns: `repeat(${GRID_COLS}, minmax(0, 1fr))`,
              }}
            >
              {board.map((row, rowIndex) =>
                row.map((bubble, colIndex) => (
                  <div
                    key={`${rowIndex}-${colIndex}`}
                    className={`aspect-square rounded-2xl flex items-center justify-center bg-gradient-to-br from-white to-sky-50 shadow-inner bubble-cell ${
                      bubble ? 'text-3xl' : 'text-transparent'
                    } ${isGameOver ? 'opacity-80' : ''}`}
                  >
                    {bubble ? bubble.color : '•'}
                  </div>
                )),
              )}
            </div>

            <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 gap-4">
              <div className="bg-white rounded-xl shadow-md p-4 text-center">
                <p className="text-sm text-gray-500">Đạn hiện tại</p>
                <p className="text-2xl font-bold">{activeBubble ?? '…'}</p>
              </div>
              <div className="bg-white rounded-xl shadow-md p-4 text-center">
                <p className="text-sm text-gray-500">Đạn kế tiếp</p>
                <p className="text-2xl font-bold">{nextBubble ?? '…'}</p>
              </div>
              <div className="bg-white rounded-xl shadow-md p-4 text-center">
                <p className="text-sm text-gray-500">Chuỗi combo</p>
                <p className="text-2xl font-bold">x{comboCount}</p>
              </div>
            </div>

            {isGameOver && (
              <div className="mt-6 bg-red-100 text-red-700 rounded-xl p-4 text-center text-lg font-semibold">
                💥 Trò chơi kết thúc! Bảng đã chạm đỉnh.
              </div>
            )}
          </div>
        )}
      </div>

      {showQuestion && currentQuestion && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50 backdrop-blur-sm w-full">
          <div
            className={`bg-gradient-to-br from-white to-sky-50 rounded-2xl p-8 shadow-2xl w-full max-w-2xl mx-4 ${
              questionFeedback.includes('✅')
                ? 'animate-pulse'
                : questionFeedback.includes('❌')
                  ? 'animate-shake'
                  : ''
            }`}
          >
            <h3 className="text-2xl font-bold text-indigo-700 mb-6 text-center">
              {currentQuestion.question}
            </h3>

            {currentQuestion.type === 'listening' && (
              <button
                onClick={replayAudio}
                className="mb-4 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-semibold px-6 py-3 rounded-xl mx-auto block shadow-lg transform hover:scale-110 transition-all text-xl"
              >
                🔊 Nghe lại
              </button>
            )}

            {currentQuestion.type === 'fillBlank' ? (
              <div className="mb-6">
                <input
                  type="text"
                  value={userAnswer}
                  onChange={(e) => setUserAnswer(e.target.value)}
                  onKeyDown={(e) =>
                    e.key === 'Enter' && !isSubmitting && handleSubmitAnswer()
                  }
                  disabled={isSubmitting}
                  className="w-full text-center text-2xl border-2 border-indigo-300 rounded-xl p-4 focus:outline-none focus:ring-4 focus:ring-indigo-400 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg bg-white transition-all"
                  placeholder="Nhập đáp án tiếng Anh..."
                  autoFocus
                />
              </div>
            ) : currentQuestion.type === 'imageChoice' &&
              currentQuestion.image ? (
              <div className="grid md:grid-cols-[1fr_1fr] gap-6">
                <img
                  src={currentQuestion.image}
                  alt="Question"
                  className="rounded-xl shadow-lg object-cover w-full h-full max-h-64"
                />
                <div className="grid gap-3">
                  {currentQuestion.options?.map((option) => (
                    <button
                      key={option}
                      onClick={() => !isSubmitting && setSelectedOption(option)}
                      disabled={isSubmitting}
                      className={`border-2 rounded-xl p-4 text-lg font-semibold transition-all transform hover:scale-105 shadow-lg ${
                        selectedOption === option
                          ? 'border-indigo-500 bg-gradient-to-br from-indigo-100 to-indigo-200'
                          : 'border-gray-300 hover:bg-gradient-to-br hover:from-gray-50 hover:to-gray-100'
                      } ${isSubmitting ? 'cursor-not-allowed' : ''}`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4 mb-6">
                {currentQuestion.options?.map((option) => (
                  <button
                    key={option}
                    onClick={() => !isSubmitting && setSelectedOption(option)}
                    disabled={isSubmitting}
                    className={`border-2 rounded-xl p-4 text-lg font-semibold transition-all transform hover:scale-105 shadow-lg ${
                      selectedOption === option
                        ? 'border-indigo-500 bg-gradient-to-br from-indigo-100 to-indigo-200'
                        : 'border-gray-300 hover:bg-gradient-to-br hover:from-gray-50 hover:to-gray-100'
                    } ${isSubmitting ? 'cursor-not-allowed' : ''}`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            )}

            {questionFeedback ? (
              <div
                className={`text-center text-2xl font-bold p-4 rounded-xl ${
                  questionFeedback.includes('✅')
                    ? 'text-green-600 bg-green-100'
                    : 'text-red-600 bg-red-100'
                }`}
              >
                {questionFeedback}
              </div>
            ) : (
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowQuestion(false)
                    setCurrentQuestion(null)
                  }}
                  className="flex-1 bg-gradient-to-r from-gray-400 to-gray-500 hover:from-gray-500 hover:to-gray-600 text-white font-semibold px-6 py-3 rounded-xl text-lg shadow-lg transform hover:scale-105 transition-all"
                >
                  ← Quay lại chơi
                </button>
                <button
                  onClick={handleSubmitAnswer}
                  disabled={
                    (!userAnswer.trim() && !selectedOption) || isSubmitting
                  }
                  className="flex-1 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold px-6 py-3 rounded-xl text-lg shadow-lg transform hover:scale-105 transition-all"
                >
                  ✓ Xác nhận
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

interface BubbleShooterEnglishGameActivityProps {
  vocabData: Array<VocabItem>
  questionsData: Array<Question>
  backgroundUrl: string
  title: string
  onClose?: () => void
}

const BubbleShooterEnglishGame: React.FC<
  BubbleShooterEnglishGameActivityProps
> = ({ vocabData, questionsData, backgroundUrl, title, onClose }) => {
  const slides = useMemo(() => {
    const GameSlide = React.memo<{ isActive: boolean }>(({ isActive }) => (
      <Slide isActive={isActive}>
        <BubbleShooterEnglishGameCore
          vocabData={vocabData}
          questionsData={questionsData}
          title={title}
        />
      </Slide>
    ))

    return [GameSlide]
  }, [vocabData, questionsData, title])

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

export default BubbleShooterEnglishGame
