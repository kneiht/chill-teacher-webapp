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

interface Card {
  id: number
  type: 'english' | 'vietnamese'
  text: string
  matched: boolean
  image?: string
}

interface MemoryGameProps {
  vocabData: Array<VocabItem>
  title: string
}

const MemoryGameCore: React.FC<MemoryGameProps> = ({ vocabData, title }) => {
  const [gameData, setGameData] = useState<Array<Card>>([])
  const [selectedCards, setSelectedCards] = useState<Array<number>>([])
  const [matchedPairs, setMatchedPairs] = useState<Array<number>>([])
  const [isGameStarted, setIsGameStarted] = useState(false)
  const [isGameOver, setIsGameOver] = useState(false)
  const [timer, setTimer] = useState(0)
  const [timerInterval, setTimerInterval] = useState<NodeJS.Timeout | null>(
    null,
  )
  const [moves, setMoves] = useState(0)
  const [flippedCards, setFlippedCards] = useState<Set<number>>(new Set())

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

  const createGameData = (words: Array<VocabItem>): Array<Card> => {
    const cards: Array<Card> = []
    words.forEach((word, index) => {
      cards.push({
        id: index,
        type: 'english',
        text: word.word,
        matched: false,
      })
      cards.push({
        id: index,
        type: 'vietnamese',
        text: word.vietnameseMeaning,
        matched: false,
        image: word.image,
      })
    })
    return shuffleArray(cards)
  }

  const startGame = () => {
    const data = createGameData(vocabWords)
    setGameData(data)
    setSelectedCards([])
    setMatchedPairs([])
    setFlippedCards(new Set())
    setIsGameStarted(true)
    setIsGameOver(false)
    setMoves(0)
    resetTimer()
    resetGame()
    setTotalQuestions(vocabWords.length)
    startTimer()
  }

  const restartGame = () => {
    stopTimer()
    setIsGameStarted(false)
    setIsGameOver(false)
    setGameData([])
    setSelectedCards([])
    setMatchedPairs([])
    setFlippedCards(new Set())
    setMoves(0)
    resetGame()
  }

  const handleCardClick = (index: number) => {
    if (!isGameStarted || isGameOver) return
    if (gameData[index].matched || flippedCards.has(index)) return
    if (selectedCards.length >= 2) return

    const newFlipped = new Set(flippedCards)
    newFlipped.add(index)
    setFlippedCards(newFlipped)

    const newSelected = [...selectedCards, index]
    setSelectedCards(newSelected)

    if (newSelected.length === 2) {
      setMoves((prev) => prev + 1)
      setTimeout(() => checkMatch(newSelected), 700)
    }
  }

  const checkMatch = (selected: Array<number>) => {
    const [card1Index, card2Index] = selected
    const card1 = gameData[card1Index]
    const card2 = gameData[card2Index]

    if (card1.id === card2.id && card1.type !== card2.type) {
      // Match
      const newGameData = [...gameData]
      newGameData[card1Index].matched = true
      newGameData[card2Index].matched = true
      setGameData(newGameData)
      setMatchedPairs([...matchedPairs, card1.id])
      answerCorrect()

      if (matchedPairs.length + 1 === vocabWords.length) {
        setIsGameOver(true)
        stopTimer()
      }
    } else {
      // No match
      answerIncorrect()
      const newFlipped = new Set(flippedCards)
      newFlipped.delete(card1Index)
      newFlipped.delete(card2Index)
      setFlippedCards(newFlipped)
    }
    setSelectedCards([])
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
              🎯 {matchedPairs.length}/{vocabWords.length}
            </div>
          )}
          {isGameStarted && (
            <div className="bg-orange-100 text-orange-700 font-bold px-2 py-1 rounded-full shadow-lg text-center text-xs sm:text-sm w-full sm:w-28">
              🎲 {moves}
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
            <div className="text-6xl mb-4">🧠</div>
            <h3 className="text-2xl font-bold text-indigo-700 mb-4">
              Memory Game
            </h3>
            <p className="text-gray-600 mb-6">
              Lật thẻ và tìm {vocabWords.length} cặp trùng nhau. Bấm Start để
              bắt đầu.
            </p>
            <div className="text-sm text-gray-500">
              Click "▶️ Start Game" để bắt đầu!
            </div>
          </div>
        ) : (
          <div className="max-w-4xl w-full">
            <div className="grid grid-cols-3 md:grid-cols-4 gap-2 md:gap-4 w-full">
              {gameData.map((card, index) => (
                <div
                  key={index}
                  onClick={() => handleCardClick(index)}
                  className={`memory-card relative bg-transparent rounded-lg shadow-md border-2 border-gray-200 min-h-[100px] h-24 sm:h-28 cursor-pointer transition-all duration-300 hover:scale-105 ${
                    card.matched
                      ? 'opacity-95 pointer-events-none border-green-500 shadow-green-200'
                      : ''
                  }`}
                  style={{ perspective: '1000px' }}
                >
                  {/* Card Back */}
                  <div
                    className={`absolute inset-0 bg-gradient-to-br from-indigo-400 to-indigo-600 rounded-lg flex items-center justify-center transition-all duration-500 ${
                      flippedCards.has(index) || card.matched
                        ? 'transform rotate-y-180 opacity-0'
                        : 'transform rotate-y-0 opacity-100'
                    }`}
                    style={{
                      backfaceVisibility: 'hidden',
                      WebkitBackfaceVisibility: 'hidden',
                    }}
                  >
                    <span className="text-white text-4xl">🎴</span>
                  </div>

                  {/* Card Front */}
                  <div
                    className={`absolute inset-0 rounded-lg border-2 border-gray-200 flex items-center justify-center p-3 transition-all duration-500 ${
                      card.type === 'vietnamese' && card.image
                        ? 'bg-cover bg-center bg-no-repeat'
                        : 'bg-white'
                    } ${
                      flippedCards.has(index) || card.matched
                        ? 'transform rotate-y-0 opacity-100'
                        : 'transform rotate-y-180 opacity-0'
                    }`}
                    style={{
                      backfaceVisibility: 'hidden',
                      WebkitBackfaceVisibility: 'hidden',
                      backgroundImage:
                        card.type === 'vietnamese' && card.image
                          ? `url('${card.image}')`
                          : undefined,
                    }}
                  >
                    <span
                      className={`text-xs md:text-sm font-semibold text-center ${
                        card.type === 'english'
                          ? 'text-blue-600'
                          : 'text-green-700'
                      } ${
                        card.type === 'vietnamese' && card.image
                          ? 'bg-white bg-opacity-90 px-1 py-1 rounded shadow-sm'
                          : ''
                      }`}
                    >
                      {card.text}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {isGameOver && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-30">
          <div className="bg-white rounded-xl p-8 shadow-2xl text-center">
            <div className="text-6xl mb-4">🎉</div>
            <h3 className="text-2xl font-bold text-green-600 mb-2">
              Excellent Work!
            </h3>
            <p className="text-gray-600">
              You matched all {vocabWords.length} pairs in {moves} moves!
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

interface MemoryGameActivityProps {
  vocabData: VocabItem[]
  backgroundUrl: string
  title: string
  onClose?: () => void
}

const MemoryGame: React.FC<MemoryGameActivityProps> = ({
  vocabData,
  backgroundUrl,
  title,
  onClose,
}) => {
  const MemoryGameSlide: React.FC<{ isActive: boolean }> = ({ isActive }) => (
    <Slide isActive={isActive}>
      <MemoryGameCore vocabData={vocabData} title={title} />
    </Slide>
  )

  const slides = [MemoryGameSlide]

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

export default MemoryGame
