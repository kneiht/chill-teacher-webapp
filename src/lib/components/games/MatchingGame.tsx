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

interface MatchingGameProps {
  vocabData: Array<VocabItem>
  title: string
  numQuestions?: number
}

const MatchingGameCore: React.FC<MatchingGameProps> = ({
  vocabData,
  title,
  numQuestions = vocabData.length > 8 ? 8 : vocabData.length,
}) => {
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
    return () => resetGame()
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

  const createGameData = (
    words: Array<VocabItem>,
    num: number,
  ): Array<Card> => {
    const shuffled = shuffleArray(words)
    const cards: Array<Card> = []
    shuffled.slice(0, num).forEach((word, index) => {
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
    const data = createGameData(vocabWords, numQuestions)
    setGameData(data)
    setSelectedCards([])
    setMatchedPairs([])
    setIsGameStarted(true)
    setIsGameOver(false)
    setTimer(0)
    resetTimer()
    resetGame()
    setTotalQuestions(numQuestions)
    startTimer()
  }

  const restartGame = () => {
    const data = createGameData(vocabWords, numQuestions)
    setGameData(data)
    setSelectedCards([])
    setMatchedPairs([])
    setIsGameStarted(true)
    setIsGameOver(false)
    setTimer(0)
    resetTimer()
    resetGame()
    setTotalQuestions(numQuestions)
    startTimer()
  }

  const handleCardClick = (index: number) => {
    if (!isGameStarted || isGameOver) return
    if (gameData[index].matched || selectedCards.includes(index)) return
    if (selectedCards.length >= 2) return

    const newSelected = [...selectedCards, index]
    setSelectedCards(newSelected)

    if (newSelected.length === 2) {
      setTimeout(() => checkMatch(newSelected), 200)
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
    }
    setSelectedCards([])
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
              🎯 {matchedPairs.length}/{vocabWords.length}
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
            <div className="text-6xl mb-4">🃏</div>
            <h3 className="text-4xl font-bold text-indigo-700 mb-4">
              Matching Game
            </h3>
            <p className="text-gray-600 mb-6 text-xl">
              Bạn sẽ ghép {vocabWords.length} cặp từ tiếng Anh và tiếng Việt.
            </p>
            <button
              onClick={startGame}
              className="bg-green-500 hover:bg-green-600 text-white font-semibold px-3 py-1 rounded-full shadow-lg transition-all duration-200 text-lg w-auto"
            >
              ▶️ Start Game
            </button>
          </div>
        ) : (
          <div className="w-full h-[98%] bg-glass rounded-xl shadow-lg p-2 mt-1 overflow-auto flex justify-center items-center">
            <div className="grid grid-cols-4 gap-4 w-full h-fit">
              {gameData.map((card, index) => (
                <div
                  key={index}
                  onClick={() => handleCardClick(index)}
                  className={`game-card rounded-lg shadow-md cursor-pointer transition-all duration-300 hover:scale-105 border-2 flex items-center justify-center text-center overflow-hidden relative bg-cover bg-center h-24 ${
                    card.matched
                      ? 'bg-green-200 border-green-600 opacity-60 border-5'
                      : selectedCards.includes(index)
                        ? 'bg-blue-200 border-blue-600 scale-105 shadow-lg border-5'
                        : 'bg-white border-gray-200 hover:bg-indigo-50'
                  }`}
                  style={{
                    backgroundImage:
                      card.type === 'vietnamese' && card.image
                        ? `url('${card.image}')`
                        : 'none',
                  }}
                >
                  {card.type === 'vietnamese' && card.image ? (
                    <span className="text-lg font-semibold text-white bg-[#0000005c] bg-opacity-50 px-2 py-1 rounded-lg">
                      {card.text}
                    </span>
                  ) : (
                    <span className="text-2xl font-semibold text-gray-800">
                      {card.text}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {isGameOver && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-opacity-30">
          <div className="bg-white rounded-xl p-8 shadow-2xl text-center">
            <div className="text-6xl mb-4">🎉</div>
            <h3 className="text-2xl font-bold text-green-600 mb-2">
              Excellent Work!
            </h3>
            <p className="text-gray-600 text-xl">
              You matched all {vocabWords.length} pairs!
            </p>
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

interface MatchingGameActivityProps {
  vocabData: Array<VocabItem>
  backgroundUrl: string
  title: string
  onClose?: () => void
}

const MatchingGame: React.FC<MatchingGameActivityProps> = ({
  vocabData,
  backgroundUrl,
  title,
  onClose,
}) => {
  const MatchingGameSlide: React.FC<{ isActive: boolean }> = ({ isActive }) => (
    <Slide isActive={isActive}>
      <MatchingGameCore vocabData={vocabData} title={title} />
    </Slide>
  )

  const slides = [MatchingGameSlide]

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

export default MatchingGame
