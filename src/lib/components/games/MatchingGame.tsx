import React, { useState, useEffect } from 'react'
import {
  answerCorrect,
  answerIncorrect,
  setTotalQuestions,
  resetGame,
} from '@/lib/stores/game.store'
import vocabData from '../../../routes/lessons/everybody-up-0/unit-1/lesson-1/assets/vocab.json'

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

const MatchingGame: React.FC = () => {
  const [gameData, setGameData] = useState<Array<Card>>([])
  const [selectedCards, setSelectedCards] = useState<Array<number>>([])
  const [matchedPairs, setMatchedPairs] = useState<Array<number>>([])
  const [isGameStarted, setIsGameStarted] = useState(false)
  const [isGameOver, setIsGameOver] = useState(false)

  const vocabWords: Array<VocabItem> = vocabData.slice(0, 4) // Use first 4 words

  useEffect(() => {
    setTotalQuestions(vocabWords.length)
    resetGame()
  }, [])

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
    resetGame()
    setTotalQuestions(vocabWords.length)
  }

  const restartGame = () => {
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
      <h2 className="text-xl font-bold text-indigo-700 text-center mb-4">
        Matching Game
      </h2>
      {!isGameStarted ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center bg-white rounded-xl shadow-lg p-8">
            <div className="text-6xl mb-4">🃏</div>
            <h3 className="text-2xl font-bold text-indigo-700 mb-4">
              Matching Game
            </h3>
            <p className="text-gray-600 mb-6">
              Match English words with their Vietnamese meanings.
            </p>
            <button
              onClick={startGame}
              className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700"
            >
              Start Game
            </button>
          </div>
        </div>
      ) : (
        <>
          <div className="flex justify-between mb-4">
            <button
              onClick={restartGame}
              className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
            >
              Restart
            </button>
            <div>
              Matched: {matchedPairs.length}/{vocabWords.length}
            </div>
          </div>
          <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-4">
            {gameData.map((card, index) => (
              <div
                key={index}
                onClick={() => handleCardClick(index)}
                className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                  card.matched
                    ? 'bg-green-200 border-green-500'
                    : selectedCards.includes(index)
                      ? 'bg-blue-200 border-blue-500'
                      : 'bg-white border-gray-300 hover:bg-gray-50'
                }`}
              >
                <div className="text-center font-semibold">{card.text}</div>
              </div>
            ))}
          </div>
          {isGameOver && (
            <div className="text-center mt-4">
              <h3 className="text-2xl font-bold text-green-600">
                Congratulations!
              </h3>
              <p>You matched all pairs!</p>
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default MatchingGame
