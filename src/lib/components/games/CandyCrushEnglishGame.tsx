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

type QuestionType = 'multipleChoice' | 'listening' | 'fillBlank'

interface Question {
  type: QuestionType
  question: string
  correctAnswer: string
  options?: string[]
  wordToSpeak?: string
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
  title: string
}

const COLORS = ['🍎', '🍊', '🍋', '🍏', '🍇', '🍓']
const GRID_SIZE = 8
const INITIAL_MOVES = 3

const CandyCrushEnglishGameCore: React.FC<CandyCrushEnglishGameProps> = ({
  vocabData,
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
      newGrid.forEach((row) =>
        row.forEach((candy) => {
          if (candy.isMatched) matchCount++
        }),
      )
      setScore((prev) => prev + matchCount * 10)
      playSound('match')
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

  // Generate question
  const generateQuestion = useCallback((): Question => {
    const vocab = vocabWords[Math.floor(Math.random() * vocabWords.length)]
    const questionTypes: QuestionType[] = [
      'multipleChoice',
      'listening',
      'fillBlank',
    ]
    const type = questionTypes[Math.floor(Math.random() * questionTypes.length)]

    if (type === 'multipleChoice') {
      const wrongOptions = vocabWords
        .filter((v) => v.vietnameseMeaning !== vocab.vietnameseMeaning)
        .sort(() => Math.random() - 0.5)
        .slice(0, 3)
        .map((v) => v.vietnameseMeaning)

      const options = [vocab.vietnameseMeaning, ...wrongOptions].sort(
        () => Math.random() - 0.5,
      )

      return {
        type: 'multipleChoice',
        question: `"${vocab.word}" nghĩa là gì?`,
        correctAnswer: vocab.vietnameseMeaning,
        options,
      }
    } else if (type === 'listening') {
      const wrongOptions = vocabWords
        .filter((v) => v.word !== vocab.word)
        .sort(() => Math.random() - 0.5)
        .slice(0, 3)
        .map((v) => v.word)

      const options = [vocab.word, ...wrongOptions].sort(
        () => Math.random() - 0.5,
      )

      // Auto-speak the word
      setTimeout(() => speak(vocab.word, 'en-US'), 500)

      return {
        type: 'listening',
        question: '🔊 Nghe và chọn từ đúng:',
        correctAnswer: vocab.word,
        options,
        wordToSpeak: vocab.word,
      }
    } else {
      // Fill blank
      return {
        type: 'fillBlank',
        question: `Điền từ tiếng Anh cho: "${vocab.vietnameseMeaning}"`,
        correctAnswer: vocab.word.toLowerCase(),
      }
    }
  }, [vocabWords, speak])

  // Open question modal manually
  const openQuestionModal = () => {
    setShowQuestion(true)
    const question = generateQuestion()
    setCurrentQuestion(question)
    setUserAnswer('')
    setSelectedOption(null)
    setQuestionFeedback('')
  }

  // Handle question answer
  const handleSubmitAnswer = () => {
    if (!currentQuestion) return

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
      answerCorrect()
    } else {
      playSound('incorrect')
      setQuestionFeedback(
        `❌ Sai! Đáp án đúng: "${currentQuestion.correctAnswer}". +2 lượt`,
      )
      answerIncorrect()
    }

    setMoves((prev) => prev + 2)
    setQuestionsAnswered((prev) => prev + 1)

    setTimeout(() => {
      setQuestionFeedback('')
      // Generate new question immediately
      const newQuestion = generateQuestion()
      setCurrentQuestion(newQuestion)
      setUserAnswer('')
      setSelectedOption(null)
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
    <div className="h-full flex flex-col">
      <h2 className="text-xl font-bold text-indigo-700 text-center">{title}</h2>

      {/* Game Controls */}
      <div className="w-full my-3 flex flex-row justify-center gap-4 items-stretch">
        {isGameStarted && (
          <>
            <div className="bg-yellow-100 text-yellow-700 font-bold px-3 py-2 rounded-full shadow-lg text-center text-sm">
              💎 Điểm: {score}
            </div>
            <div className="bg-purple-100 text-purple-700 font-bold px-3 py-2 rounded-full shadow-lg text-center text-sm">
              🎯 Lượt: {moves}
            </div>
            <div className="bg-green-100 text-green-700 font-bold px-3 py-2 rounded-full shadow-lg text-center text-sm">
              📝 Câu hỏi: {questionsAnswered}
            </div>
            <button
              onClick={openQuestionModal}
              className="bg-green-500 hover:bg-green-600 text-white font-semibold px-4 py-2 rounded-full shadow-lg transition-all duration-200 text-sm"
            >
              ❓ Trả lời câu hỏi
            </button>
            <button
              onClick={restartGame}
              className="bg-indigo-500 hover:bg-indigo-600 text-white font-semibold px-4 py-2 rounded-full shadow-lg transition-all duration-200 text-sm"
            >
              🔄 Restart
            </button>
          </>
        )}
      </div>

      {/* Game Area */}
      <div className="flex-1 flex items-start justify-center h-full overflow-auto">
        {!isGameStarted ? (
          <div className="text-center bg-glass rounded-xl shadow-lg p-8 py-12 mt-10 w-full max-w-2xl">
            <div className="text-6xl mb-4">🍬</div>
            <h3 className="text-4xl font-bold text-indigo-700 mb-4">
              Candy Crush Tiếng Anh
            </h3>
            <p className="text-gray-600 mb-6 text-xl">
              Xếp 3 candy cùng loại để ghi điểm!
              <br />
              Bấm "Trả lời câu hỏi" để nhận +2 lượt chơi.
              <br />
              🎯 Mục tiêu: Trả lời càng nhiều câu càng tốt!
            </p>
            <button
              onClick={startGame}
              className="bg-green-500 hover:bg-green-600 text-white font-semibold px-6 py-3 rounded-full shadow-lg transition-all duration-200 text-lg"
            >
              ▶️ Bắt đầu
            </button>
          </div>
        ) : (
          <div className="w-full max-w-3xl bg-glass rounded-xl shadow-lg p-6">
            {/* Candy Grid */}
            <div
              className="grid gap-1 mx-auto"
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
                    className={`
                      aspect-square text-4xl rounded-lg transition-all duration-200
                      ${candy.isMatched ? 'opacity-30 scale-75' : 'hover:scale-110'}
                      ${selectedCandy?.row === rowIndex && selectedCandy?.col === colIndex ? 'ring-4 ring-yellow-400 scale-110' : ''}
                      ${isProcessing ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                      bg-white shadow-md
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
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white rounded-xl p-8 shadow-2xl max-w-2xl w-full mx-4">
            <div className="text-5xl mb-4 text-center">
              {currentQuestion.type === 'listening'
                ? '🎧'
                : currentQuestion.type === 'fillBlank'
                  ? '✏️'
                  : '❓'}
            </div>
            <h3 className="text-2xl font-bold text-indigo-700 mb-6 text-center">
              {currentQuestion.question}
            </h3>

            {currentQuestion.type === 'listening' && (
              <button
                onClick={replayAudio}
                className="mb-4 bg-indigo-500 hover:bg-indigo-600 text-white font-semibold px-4 py-2 rounded-lg mx-auto block"
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
                  onKeyDown={(e) => e.key === 'Enter' && handleSubmitAnswer()}
                  className="w-full text-center text-2xl border-2 border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                  placeholder="Nhập từ tiếng Anh..."
                  autoFocus
                />
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4 mb-6">
                {currentQuestion.options?.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedOption(option)}
                    className={`
                      border-2 rounded-lg p-4 text-xl font-semibold transition-all
                      ${selectedOption === option ? 'border-indigo-500 bg-indigo-100 scale-105' : 'border-gray-300 hover:bg-gray-50'}
                    `}
                  >
                    {option}
                  </button>
                ))}
              </div>
            )}

            {questionFeedback ? (
              <div
                className={`text-center text-xl font-bold ${questionFeedback.includes('✅') ? 'text-green-600' : 'text-red-600'}`}
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
                  className="flex-1 bg-gray-400 hover:bg-gray-500 text-white font-semibold px-6 py-3 rounded-lg text-lg"
                >
                  ← Quay lại chơi
                </button>
                <button
                  onClick={handleSubmitAnswer}
                  disabled={!userAnswer.trim() && !selectedOption}
                  className="flex-1 bg-green-500 hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold px-6 py-3 rounded-lg text-lg"
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
  backgroundUrl: string
  title: string
  onClose?: () => void
}

const CandyCrushEnglishGame: React.FC<CandyCrushEnglishGameActivityProps> = ({
  vocabData,
  backgroundUrl,
  title,
  onClose,
}) => {
  const slides = useMemo(() => {
    const GameSlide = React.memo<{ isActive: boolean }>(({ isActive }) => (
      <Slide isActive={isActive}>
        <CandyCrushEnglishGameCore vocabData={vocabData} title={title} />
      </Slide>
    ))

    return [GameSlide]
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

export default CandyCrushEnglishGame
