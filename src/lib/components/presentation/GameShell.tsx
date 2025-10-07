import React, { useEffect } from 'react'
import { useStore } from '@tanstack/react-store'
import PresentationShell from './PresentationShell'
import {
  gameStore,
  resetGame,
  setTotalQuestions,
} from '@/lib/stores/game.store'

interface GameShellProps {
  slides: Array<React.ComponentType<{ isActive: boolean }>>
  backgroundUrl?: string
  showHome?: boolean
  showScore?: boolean
}

const GameShell: React.FC<GameShellProps> = ({
  slides,
  backgroundUrl,
  showHome = true,
}) => {
  const { score, totalQuestions, correctAnswers, incorrectAnswers } =
    useStore(gameStore)

  useEffect(() => {
    resetGame()
    setTotalQuestions(slides.length)
  }, [slides.length])

  return (
    <div className="relative h-screen w-screen">
      <PresentationShell
        slides={slides}
        backgroundUrl={backgroundUrl}
        showControls={true}
        showHome={showHome}
      />

      <div className="absolute top-4 left-4 bg-gray-800 bg-opacity-75 text-white p-2 rounded-lg z-50">
        <div className="text-lg font-bold">Score: {score}</div>
        <div className="text-sm">
          Correct: {correctAnswers} | Incorrect: {incorrectAnswers} | Total:{' '}
          {totalQuestions}
        </div>
      </div>
    </div>
  )
}

export default GameShell
