import React, { useState, useEffect, useMemo, useCallback } from 'react'
import { useVoice } from '@/lib/hooks/use-voice'
import { useSoundEffects } from '@/lib/hooks/useSoundEffects'
import { useBackgroundMusic } from '@/lib/hooks/useBackgroundMusic'
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
  options?: string[]
  wordToSpeak?: string
  image?: string
}

interface Candy {
  id: string
  row: number
  col: number
  color: string
  isMatched: boolean
}

interface CandyCrushEnglishGameProps {
  vocabData: Array<VocabItem>
  questionsData: Array<Question>
  title: string
}

const COLORS = ['🍎', '🍊', '🍋', '🍏', '🍇', '🍓']
const GRID_SIZE = 8
const INITIAL_MOVES = 3

const CandyCrushEnglishGameCore: React.FC<CandyCrushEnglishGameProps> = ({
  vocabData,
  questionsData,
  title,
}) => {
  const { play: playSound } = useSoundEffects({ volume: 0.6 })
  const { play: playMusic, stop: stopMusic } = useBackgroundMusic({
    volume: 0.3,
  })
  const { speak } = useVoice()

  // Game states
  const [isGameStarted, setIsGameStarted] = useState(false)
  const [isGameOver, setIsGameOver] = useState(false)
  const [score, setScore] = useState(0)
  const [moves, setMoves] = useState(INITIAL_MOVES)
  const [grid, setGrid] = useState<Candy[][]>([])
  const [selectedCandy, setSelectedCandy] = useState<{
    row: number
    col: number
  } | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)

  // Question states
  const [showQuestion, setShowQuestion] = useState(false)
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null)
  const [userAnswer, setUserAnswer] = useState('')
  const [selectedOption, setSelectedOption] = useState<string | null>(null)
  const [questionFeedback, setQuestionFeedback] = useState('')
  const [questionsAnswered, setQuestionsAnswered] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Animation effects states
  const [particles, setParticles] = useState<
    Array<{ id: string; x: number; y: number; emoji: string }>
  >([])
  const [showCorrectAnimation, setShowCorrectAnimation] = useState(false)
  const [showIncorrectAnimation, setShowIncorrectAnimation] = useState(false)
  const [comboCount, setComboCount] = useState(0)

  const vocabWords: Array<VocabItem> = vocabData

  useEffect(() => {
    return () => {
      resetGame()
      stopMusic()
    }
  }, [stopMusic])

  // Initialize grid
  const createCandy = (
    row: number,
    col: number,
    excludeColors: string[] = [],
  ): Candy => {
    let availableColors = COLORS.filter((c) => !excludeColors.includes(c))
    if (availableColors.length === 0) availableColors = COLORS

    return {
      id: `${row}-${col}-${Math.random()}`,
      row,
      col,
      color:
        availableColors[Math.floor(Math.random() * availableColors.length)],
      isMatched: false,
    }
  }

  const initializeGrid = useCallback(() => {
    const newGrid: Candy[][] = []
    for (let row = 0; row < GRID_SIZE; row++) {
      newGrid[row] = []
      for (let col = 0; col < GRID_SIZE; col++) {
        const excludeColors: string[] = []

        // Check horizontal match (2 candies to the left)
        if (
          col >= 2 &&
          newGrid[row][col - 1].color === newGrid[row][col - 2].color
        ) {
          excludeColors.push(newGrid[row][col - 1].color)
        }

        // Check vertical match (2 candies above)
        if (
          row >= 2 &&
          newGrid[row - 1][col].color === newGrid[row - 2][col].color
        ) {
          excludeColors.push(newGrid[row - 1][col].color)
        }

        newGrid[row][col] = createCandy(row, col, excludeColors)
      }
    }
    return newGrid
  }, [])

  // Check for matches
  const checkMatches = (currentGrid: Candy[][]): boolean => {
    let hasMatch = false
    const newGrid = currentGrid.map((row) => row.map((candy) => ({ ...candy })))

    // Check horizontal matches
    for (let row = 0; row < GRID_SIZE; row++) {
      for (let col = 0; col < GRID_SIZE - 2; col++) {
        const color = newGrid[row][col].color
        if (
          color === newGrid[row][col + 1].color &&
          color === newGrid[row][col + 2].color
        ) {
          newGrid[row][col].isMatched = true
          newGrid[row][col + 1].isMatched = true
          newGrid[row][col + 2].isMatched = true
          hasMatch = true
        }
      }
    }

    // Check vertical matches
    for (let col = 0; col < GRID_SIZE; col++) {
      for (let row = 0; row < GRID_SIZE - 2; row++) {
        const color = newGrid[row][col].color
        if (
          color === newGrid[row + 1][col].color &&
          color === newGrid[row + 2][col].color
        ) {
          newGrid[row][col].isMatched = true
          newGrid[row + 1][col].isMatched = true
          newGrid[row + 2][col].isMatched = true
          hasMatch = true
        }
      }
    }

    if (hasMatch) {
      setGrid(newGrid)
      // Count matches for score
      let matchCount = 0
      const matchedCandies: Array<{ row: number; col: number; color: string }> =
        []
      newGrid.forEach((row) =>
        row.forEach((candy) => {
          if (candy.isMatched) {
            matchCount++
            matchedCandies.push({
              row: candy.row,
              col: candy.col,
              color: candy.color,
            })
          }
        }),
      )
      setScore((prev) => prev + matchCount * 10)
      playSound('match')

      // Create particle effects for matched candies
      const newParticles = matchedCandies.map((candy, index) => ({
        id: `particle-${Date.now()}-${index}`,
        x: candy.col * 70 + 35,
        y: candy.row * 70 + 35,
        emoji: candy.color,
      }))
      setParticles((prev) => [...prev, ...newParticles])
      setTimeout(() => {
        setParticles((prev) =>
          prev.filter((p) => !newParticles.find((np) => np.id === p.id)),
        )
      }, 1000)

      // Combo counter
      setComboCount((prev) => prev + 1)
      setTimeout(() => setComboCount(0), 2000)
    }

    return hasMatch
  }

  // Remove matched candies and fill gaps
  const removeMatchedAndFill = useCallback(() => {
    setGrid((currentGrid) => {
      const newGrid = currentGrid.map((row) => [...row])

      // Remove matched candies and drop above candies
      for (let col = 0; col < GRID_SIZE; col++) {
        let emptyRow = GRID_SIZE - 1
        for (let row = GRID_SIZE - 1; row >= 0; row--) {
          if (!newGrid[row][col].isMatched) {
            if (row !== emptyRow) {
              newGrid[emptyRow][col] = {
                ...newGrid[row][col],
                row: emptyRow,
              }
            }
            emptyRow--
          }
        }

        // Fill empty spaces with new candies
        for (let row = emptyRow; row >= 0; row--) {
          newGrid[row][col] = createCandy(row, col)
        }
      }

      return newGrid
    })
  }, [])

  // Process matches cascade
  const processMatches = useCallback(
    async (currentGrid: Candy[][]) => {
      setIsProcessing(true)
      let gridToCheck = currentGrid
      let hasMatches = true

      while (hasMatches) {
        // Check for matches in current grid
        const matchedGrid = gridToCheck.map((row) =>
          row.map((candy) => ({ ...candy })),
        )
        let foundMatch = false

        // Check horizontal matches
        for (let row = 0; row < GRID_SIZE; row++) {
          for (let col = 0; col < GRID_SIZE - 2; col++) {
            const color = matchedGrid[row][col].color
            if (
              color === matchedGrid[row][col + 1].color &&
              color === matchedGrid[row][col + 2].color
            ) {
              matchedGrid[row][col].isMatched = true
              matchedGrid[row][col + 1].isMatched = true
              matchedGrid[row][col + 2].isMatched = true
              foundMatch = true
            }
          }
        }

        // Check vertical matches
        for (let col = 0; col < GRID_SIZE; col++) {
          for (let row = 0; row < GRID_SIZE - 2; row++) {
            const color = matchedGrid[row][col].color
            if (
              color === matchedGrid[row + 1][col].color &&
              color === matchedGrid[row + 2][col].color
            ) {
              matchedGrid[row][col].isMatched = true
              matchedGrid[row + 1][col].isMatched = true
              matchedGrid[row + 2][col].isMatched = true
              foundMatch = true
            }
          }
        }

        if (foundMatch) {
          // Count matches for score
          let matchCount = 0
          matchedGrid.forEach((row) =>
            row.forEach((candy) => {
              if (candy.isMatched) matchCount++
            }),
          )
          setScore((prev) => prev + matchCount * 10)
          playSound('match')
          setGrid(matchedGrid)

          await new Promise((resolve) => setTimeout(resolve, 500))

          // Remove matched and fill
          const newGrid = matchedGrid.map((row) => [...row])
          for (let col = 0; col < GRID_SIZE; col++) {
            let emptyRow = GRID_SIZE - 1
            for (let row = GRID_SIZE - 1; row >= 0; row--) {
              if (!newGrid[row][col].isMatched) {
                if (row !== emptyRow) {
                  newGrid[emptyRow][col] = {
                    ...newGrid[row][col],
                    row: emptyRow,
                  }
                }
                emptyRow--
              }
            }

            // Fill empty spaces with new candies
            for (let row = emptyRow; row >= 0; row--) {
              newGrid[row][col] = createCandy(row, col)
            }
          }

          setGrid(newGrid)
          gridToCheck = newGrid
          await new Promise((resolve) => setTimeout(resolve, 300))
        } else {
          hasMatches = false
        }
      }

      setIsProcessing(false)
    },
    [playSound],
  )

  // Handle candy click
  const handleCandyClick = (row: number, col: number) => {
    if (isProcessing) return

    if (!selectedCandy) {
      setSelectedCandy({ row, col })
      playSound('click')
    } else {
      // Check if adjacent
      const rowDiff = Math.abs(selectedCandy.row - row)
      const colDiff = Math.abs(selectedCandy.col - col)

      if (
        (rowDiff === 1 && colDiff === 0) ||
        (rowDiff === 0 && colDiff === 1)
      ) {
        // Only allow swap if have moves
        if (moves > 0) {
          swapCandies(selectedCandy.row, selectedCandy.col, row, col)
        }
      }
      setSelectedCandy(null)
    }
  }

  // Swap candies
  const swapCandies = (
    row1: number,
    col1: number,
    row2: number,
    col2: number,
  ) => {
    const newGrid = grid.map((row) => [...row])
    const temp = newGrid[row1][col1]
    newGrid[row1][col1] = { ...newGrid[row2][col2], row: row1, col: col1 }
    newGrid[row2][col2] = { ...temp, row: row2, col: col2 }

    setGrid(newGrid)
    setMoves((prev) => prev - 1)
    playSound('flip')

    // Check for matches after swap
    setTimeout(() => {
      const hasMatch = checkMatches(newGrid)
      if (hasMatch) {
        setTimeout(() => processMatches(newGrid), 500)
      } else {
        // Swap back if no match
        const revertGrid = newGrid.map((row) => [...row])
        const tempRevert = revertGrid[row1][col1]
        revertGrid[row1][col1] = {
          ...revertGrid[row2][col2],
          row: row1,
          col: col1,
        }
        revertGrid[row2][col2] = { ...tempRevert, row: row2, col: col2 }
        setGrid(revertGrid)
        setMoves((prev) => prev + 1) // Give back the move
      }
    }, 300)
  }

  // Get random question from questionsData
  const getRandomQuestion = useCallback((): Question => {
    const randomIndex = Math.floor(Math.random() * questionsData.length)
    const question = questionsData[randomIndex]

    // Auto-speak for listening questions
    if (question.type === 'listening' && question.wordToSpeak) {
      setTimeout(() => speak(question.wordToSpeak!, 'en-US'), 500)
    }

    return question
  }, [questionsData, speak])

  // Open question modal manually
  const openQuestionModal = () => {
    setShowQuestion(true)
    const question = getRandomQuestion()
    setCurrentQuestion(question)
    setUserAnswer('')
    setSelectedOption(null)
    setQuestionFeedback('')
    setIsSubmitting(false)
  }

  // Handle question answer
  const handleSubmitAnswer = () => {
    if (!currentQuestion || isSubmitting) return

    setIsSubmitting(true)

    let isCorrect = false
    if (currentQuestion.type === 'fillBlank') {
      isCorrect =
        userAnswer.trim().toLowerCase() ===
        currentQuestion.correctAnswer.toLowerCase()
    } else {
      isCorrect = selectedOption === currentQuestion.correctAnswer
    }

    if (isCorrect) {
      playSound('correct')
      setQuestionFeedback('✅ Chính xác! +2 lượt chơi')
      setMoves((prev) => prev + 2)
      answerCorrect()
      setShowCorrectAnimation(true)
      setTimeout(() => setShowCorrectAnimation(false), 1500)

      // Success confetti
      const confettiParticles = Array.from({ length: 20 }, (_, i) => ({
        id: `confetti-${Date.now()}-${i}`,
        x: Math.random() * window.innerWidth,
        y: -50,
        emoji: ['🎉', '⭐', '✨', '🌟', '💫'][Math.floor(Math.random() * 5)],
      }))
      setParticles((prev) => [...prev, ...confettiParticles])
      setTimeout(() => {
        setParticles((prev) =>
          prev.filter((p) => !confettiParticles.find((cp) => cp.id === p.id)),
        )
      }, 2000)
    } else {
      playSound('incorrect')
      setQuestionFeedback(
        `❌ Sai! Đáp án đúng: "${currentQuestion.correctAnswer}". -1 lượt`,
      )
      setMoves((prev) => Math.max(0, prev - 1))
      answerIncorrect()
      setShowIncorrectAnimation(true)
      setTimeout(() => setShowIncorrectAnimation(false), 600)
    }

    setQuestionsAnswered((prev) => prev + 1)

    setTimeout(() => {
      setQuestionFeedback('')
      // Generate new question immediately
      const newQuestion = getRandomQuestion()
      setCurrentQuestion(newQuestion)
      setUserAnswer('')
      setSelectedOption(null)
      setIsSubmitting(false)
    }, 1500)
  }

  const startGame = () => {
    playSound('start')
    playMusic()
    const newGrid = initializeGrid()
    setGrid(newGrid)
    setScore(0)
    setMoves(INITIAL_MOVES)
    setIsGameStarted(true)
    setIsGameOver(false)
    setShowQuestion(false)
    setQuestionsAnswered(0)
    resetGame()
    setIsProcessing(false)
  }

  const restartGame = () => {
    stopMusic()
    startGame()
  }

  // Replay audio for listening questions
  const replayAudio = () => {
    if (currentQuestion?.wordToSpeak) {
      speak(currentQuestion.wordToSpeak, 'en-US')
      playSound('click')
    }
  }

  return (
    <div className="h-full flex flex-col relative">
      {/* CSS Animations */}
      <style>{`
        @keyframes float-up {
          0% { transform: translateY(0) scale(1); opacity: 1; }
          100% { transform: translateY(-200px) scale(0.5); opacity: 0; }
        }
        @keyframes confetti-fall {
          0% { transform: translateY(0) rotate(0deg); opacity: 1; }
          100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
        }
        @keyframes pulse-success {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-10px); }
          75% { transform: translateX(10px); }
        }
        @keyframes bounce-in {
          0% { transform: scale(0.3); opacity: 0; }
          50% { transform: scale(1.05); }
          70% { transform: scale(0.9); }
          100% { transform: scale(1); opacity: 1; }
        }
        @keyframes glow {
          0%, 100% { box-shadow: 0 0 5px rgba(99, 102, 241, 0.5); }
          50% { box-shadow: 0 0 20px rgba(99, 102, 241, 0.8), 0 0 30px rgba(99, 102, 241, 0.6); }
        }
        @keyframes sparkle {
          0%, 100% { opacity: 0; transform: scale(0); }
          50% { opacity: 1; transform: scale(1); }
        }
        .particle {
          position: fixed;
          pointer-events: none;
          font-size: 2rem;
          z-index: 1000;
          animation: float-up 1s ease-out forwards;
        }
        .confetti {
          position: fixed;
          pointer-events: none;
          font-size: 2rem;
          z-index: 1000;
          animation: confetti-fall 2s ease-out forwards;
        }
        .success-animation {
          animation: pulse-success 0.5s ease-in-out;
        }
        .error-animation {
          animation: shake 0.3s ease-in-out;
        }
        .bounce-enter {
          animation: bounce-in 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55);
        }
        .candy-hover:hover {
          animation: bounce-in 0.3s ease-in-out;
        }
        .glow-effect {
          animation: glow 1.5s ease-in-out infinite;
        }
      `}</style>

      {/* Particle Effects */}
      {particles.map((particle) => (
        <div
          key={particle.id}
          className={particle.id.includes('confetti') ? 'confetti' : 'particle'}
          style={{
            left: particle.x,
            top: particle.y,
            animationDelay: particle.id.includes('confetti')
              ? `${Math.random() * 0.5}s`
              : '0s',
          }}
        >
          {particle.emoji}
        </div>
      ))}

      {/* Combo Counter */}
      {comboCount > 1 && (
        <div className="fixed top-1/4 left-1/2 transform -translate-x-1/2 z-50 bounce-enter">
          <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white font-bold text-4xl px-8 py-4 rounded-full shadow-2xl glow-effect">
            🔥 COMBO x{comboCount}! 🔥
          </div>
        </div>
      )}

      <h2 className="text-xl font-bold text-indigo-700 text-center">{title}</h2>

      {/* Game Controls */}
      <div className="w-full my-3 flex flex-row justify-center gap-4 items-stretch">
        {isGameStarted && (
          <>
            <div className="bg-gradient-to-r from-yellow-100 to-yellow-200 text-yellow-700 font-bold px-3 py-2 rounded-full shadow-lg text-center text-sm transform hover:scale-110 transition-transform bounce-enter">
              💎 Điểm: {score}
            </div>
            <div className="bg-gradient-to-r from-purple-100 to-purple-200 text-purple-700 font-bold px-3 py-2 rounded-full shadow-lg text-center text-sm transform hover:scale-110 transition-transform bounce-enter">
              🎯 Lượt: {moves}
            </div>
            <div className="bg-gradient-to-r from-green-100 to-green-200 text-green-700 font-bold px-3 py-2 rounded-full shadow-lg text-center text-sm transform hover:scale-110 transition-transform bounce-enter">
              📝 Câu hỏi: {questionsAnswered}
            </div>
            <button
              onClick={openQuestionModal}
              className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold px-4 py-2 rounded-full shadow-lg transition-all duration-200 text-sm transform hover:scale-110 glow-effect"
            >
              ❓ Trả lời câu hỏi
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

      {/* Game Area */}
      <div className="flex-1 flex items-start justify-center h-full overflow-auto">
        {!isGameStarted ? (
          <div className="text-center bg-gradient-to-br from-white to-indigo-100 rounded-2xl shadow-2xl p-8 py-12 mt-10 w-full max-w-2xl bounce-enter">
            <div className="text-7xl mb-4 animate-bounce">🍎</div>
            <h3 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 mb-4">
              Fruit Game
            </h3>
            <p className="text-gray-700 mb-6 text-xl leading-relaxed">
              ✨ Xếp 3 candy cùng loại để ghi điểm!
              <br />
              💡 Bấm "Trả lời câu hỏi" để nhận +2 lượt chơi.
              <br />
              🎯 Mục tiêu: Trả lời càng nhiều câu càng tốt!
            </p>
            <button
              onClick={startGame}
              className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold px-8 py-4 rounded-full shadow-lg transition-all duration-200 text-xl transform hover:scale-110 glow-effect"
            >
              ▶️ Bắt đầu
            </button>
          </div>
        ) : (
          <div className="w-full max-w-3xl bg-glass rounded-xl shadow-lg p-6 bounce-enter">
            {/* Candy Grid */}
            <div
              className="grid gap-2 mx-auto relative"
              style={{
                gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`,
                maxWidth: '600px',
              }}
            >
              {grid.map((row, rowIndex) =>
                row.map((candy, colIndex) => (
                  <button
                    key={candy.id}
                    onClick={() => handleCandyClick(rowIndex, colIndex)}
                    disabled={isProcessing}
                    style={{ willChange: 'transform' }}
                    className={`
                      aspect-square text-4xl rounded-xl transition-all duration-300 ease-out
                      ${candy.isMatched ? 'opacity-0 scale-0' : 'transform hover:scale-110'}
                      ${selectedCandy?.row === rowIndex && selectedCandy?.col === colIndex ? 'ring-4 ring-yellow-400 scale-110 shadow-2xl glow-effect' : ''}
                      ${isProcessing ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                      bg-gradient-to-br from-white to-gray-50 shadow-lg hover:shadow-xl
                    `}
                  >
                    {candy.color}
                  </button>
                )),
              )}
            </div>
          </div>
        )}
      </div>

      {/* Question Modal */}
      {showQuestion && currentQuestion && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50 backdrop-blur-sm w-full">
          <div
            className={`bg-gradient-to-br from-white to-indigo-50 rounded-2xl p-8 shadow-2xl w-full mx-4 bounce-enter ${showCorrectAnimation ? 'success-animation' : ''} ${showIncorrectAnimation ? 'error-animation' : ''}`}
          >
            <h3 className="text-2xl font-bold text-indigo-700 mb-6 text-center">
              {currentQuestion.question}
            </h3>

            {currentQuestion.type === 'listening' && (
              <button
                onClick={replayAudio}
                className="mb-4 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-semibold px-6 py-3 rounded-xl mx-auto block shadow-lg transform hover:scale-110 transition-all glow-effect text-xl"
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
                  placeholder="Nhập từ tiếng Anh..."
                  autoFocus
                />
              </div>
            ) : (currentQuestion.type === 'imageChoice' ||
                currentQuestion.type === 'imageToVietnamese') &&
              currentQuestion.image ? (
              // Image question layout: image on left, options in column on right
              <div className="flex gap-6 mb-6">
                {/* Image on the left */}
                <div className="flex-shrink-0">
                  <img
                    src={currentQuestion.image}
                    alt="Question"
                    className="w-full h-64 object-cover rounded-2xl shadow-2xl border-4 border-indigo-200 transform hover:scale-105 transition-all"
                  />
                </div>
                {/* Options in column on the right */}
                <div className="flex-1 flex flex-col gap-4">
                  {currentQuestion.options?.map((option, index) => (
                    <button
                      key={index}
                      onClick={() => !isSubmitting && setSelectedOption(option)}
                      disabled={isSubmitting}
                      className={`
                        border-3 rounded-xl p-4 text-xl font-semibold transition-all transform hover:scale-105 shadow-lg
                        ${selectedOption === option ? 'border-indigo-500 bg-gradient-to-br from-indigo-100 to-indigo-200 scale-105 glow-effect' : 'border-gray-300 hover:bg-gradient-to-br hover:from-gray-50 hover:to-gray-100'}
                        ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}
                      `}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              // Default 2x2 grid for other question types
              <div className="grid grid-cols-2 gap-4 mb-6">
                {currentQuestion.options?.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => !isSubmitting && setSelectedOption(option)}
                    disabled={isSubmitting}
                    className={`
                      border-3 rounded-xl p-4 text-xl font-semibold transition-all transform hover:scale-105 shadow-lg
                      ${selectedOption === option ? 'border-indigo-500 bg-gradient-to-br from-indigo-100 to-indigo-200 scale-105 glow-effect' : 'border-gray-300 hover:bg-gradient-to-br hover:from-gray-50 hover:to-gray-100'}
                      ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}
                    `}
                  >
                    {option}
                  </button>
                ))}
              </div>
            )}

            {questionFeedback ? (
              <div
                className={`text-center text-2xl font-bold p-4 rounded-xl ${questionFeedback.includes('✅') ? 'text-green-600 bg-green-100 bounce-enter' : 'text-red-600 bg-red-100 error-animation'}`}
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
                  className="flex-1 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold px-6 py-3 rounded-xl text-lg shadow-lg transform hover:scale-105 transition-all glow-effect"
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

interface CandyCrushEnglishGameActivityProps {
  vocabData: Array<VocabItem>
  questionsData: Array<Question>
  backgroundUrl: string
  title: string
  onClose?: () => void
}

const CandyCrushEnglishGame: React.FC<CandyCrushEnglishGameActivityProps> = ({
  vocabData,
  questionsData,
  backgroundUrl,
  title,
  onClose,
}) => {
  const slides = useMemo(() => {
    const GameSlide = React.memo<{ isActive: boolean }>(({ isActive }) => (
      <Slide isActive={isActive}>
        <CandyCrushEnglishGameCore
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

export default CandyCrushEnglishGame
