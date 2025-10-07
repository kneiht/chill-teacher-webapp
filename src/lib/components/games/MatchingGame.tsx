import React, { useState, useEffect } from 'react'
import {
  answerCorrect,
  answerIncorrect,
  setTotalQuestions,
  resetGame,
} from '@/lib/stores/game.store'

interface VocabItem {
  word: string
  vietnameseMeaning: string
  // other fields
}

interface Card {
  id: number
  type: 'english' | 'vietnamese'
  text: string
  matched: boolean
}

interface MatchingGameProps {
  vocabData: Array<VocabItem>
}

const MatchingGame: React.FC<MatchingGameProps> = ({ vocabData }) => {
  const [gameData, setGameData] = useState<Array<Card>>([])
  const [selectedCards, setSelectedCards] = useState<Array<number>>([])
  const [matchedPairs, setMatchedPairs] = useState<Array<number>>([])
  const [isGameStarted, setIsGameStarted] = useState(false)
  const [isGameOver, setIsGameOver] = useState(false)
  const [timer, setTimer] = useState(0)
  const [timerInterval, setTimerInterval] = useState<NodeJS.Timeout | null>(
    null,
  )

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
      })
    })
    return shuffleArray(cards)
  }

  const startGame = () => {
    const data = createGameData(vocabWords)
    setGameData(data)
    setSelectedCards([])
    setMatchedPairs([])
    setIsGameStarted(true)
    setIsGameOver(false)
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
    resetGame()
  }

  const handleCardClick = (index: number) => {
    if (!isGameStarted || isGameOver) return
    if (gameData[index].matched || selectedCards.includes(index)) return
    if (selectedCards.length >= 2) return

    const newSelected = [...selectedCards, index]
    setSelectedCards(newSelected)

    if (newSelected.length === 2) {
      setTimeout(() => checkMatch(newSelected), 500)
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
        // Win logic
      }
    } else {
      // No match
      answerIncorrect()
    }
    setSelectedCards([])
  }

  return (
    <div className="h-full flex flex-col">
      <h2 className="text-md md:text-xl font-bold text-indigo-700 text-center">
        Matching Game - School Supplies
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
            <div className="text-6xl mb-4">🃏</div>
            <h3 className="text-2xl font-bold text-indigo-700 mb-4">
              Matching Game
            </h3>
            <p className="text-gray-600 mb-6">
              Bạn sẽ ghép {vocabWords.length} cặp. Bấm Start để bắt đầu.
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
                  className={`game-card bg-white rounded-lg shadow-md p-4 cursor-pointer transition-all duration-300 hover:scale-105 border-2 min-h-[100px] flex items-center justify-center text-center ${
                    card.matched
                      ? 'bg-green-200 border-green-500'
                      : selectedCards.includes(index)
                        ? 'bg-blue-200 border-blue-500'
                        : 'border-gray-200 hover:bg-blue-50'
                  }`}
                >
                  <span className="card-text text-xs md:text-lg font-semibold text-gray-800">
                    {card.text}
                  </span>
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
              You matched all {vocabWords.length} pairs!
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

export default MatchingGame
