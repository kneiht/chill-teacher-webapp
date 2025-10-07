import { SwapOutlined } from '@ant-design/icons'
import React, { useState, useEffect } from 'react'
import { useStore } from '@tanstack/react-store'
import { flashcardStore, toggleInitialSide } from '@/lib/stores/flashcard.store'

interface VocabItem {
  word: string
  phonics: string
  image: string
  vietnameseMeaning: string
  sampleSentence: string
  vietnameseTranslation: string
}

interface FlashcardProps {
  vocab: VocabItem
  isActive: boolean
}

const Flashcard: React.FC<FlashcardProps> = ({ vocab, isActive }) => {
  const [isFlipped, setIsFlipped] = useState(false)
  const { initialSide } = useStore(flashcardStore)

  useEffect(() => {
    // Reset flip state when card becomes active or inactive
    setIsFlipped(initialSide === 'back')
  }, [isActive, initialSide])

  useEffect(() => {
    if (isActive) {
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
          e.preventDefault()
          setIsFlipped((prev) => !prev)
        }
      }

      window.addEventListener('keydown', handleKeyDown)
      return () => window.removeEventListener('keydown', handleKeyDown)
    }
  }, [isActive])

  if (!isActive) return null

  return (
    <div className="relative w-full h-full flex items-center justify-center p-8">
      <div
        className="relative w-[70%] h-[80%] cursor-pointer"
        onClick={() => setIsFlipped(!isFlipped)}
        style={{ perspective: '3000px' }}
      >
        <div
          className={`relative w-full h-full transition-transform duration-700 transform-style-preserve-3d ${
            isFlipped ? 'rotate-x-180' : ''
          }`}
          style={{ transformStyle: 'preserve-3d' }}
        >
          {/* Front */}
          <div
            className="absolute inset-0 w-full h-full backface-hidden bg-white rounded-xl shadow-2xl flex flex-col items-center justify-center p-6"
            style={{ backfaceVisibility: 'hidden' }}
          >
            <h2 className="text-8xl font-bold text-indigo-600 mb-4">
              {vocab.word}
            </h2>
            <p className="text-5xl text-gray-600 mb-4">{vocab.phonics}</p>
            <p className="text-5xl text-gray-700 text-center">
              "{vocab.sampleSentence}"
            </p>
          </div>

          {/* Back */}
          <div
            className="absolute inset-0 w-full h-full backface-hidden rounded-xl shadow-2xl rotate-x-180 overflow-hidden"
            style={{
              backfaceVisibility: 'hidden',
              transform: 'rotateX(180deg)',
            }}
          >
            <img
              src={vocab.image}
              alt={vocab.word}
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute top-3 inset-x-0 flex items-center justify-center">
              <h3 className="text-3xl font-bold text-indigo-600 px-6 py-3 rounded-lg bg-[#ffffff9b]">
                {vocab.vietnameseMeaning}
              </h3>
            </div>
          </div>
        </div>
      </div>

      {/* Settings */}
      <div className="absolute bottom-4 inset-x-0 flex items-center gap-2">
        <SwapOutlined
          onClick={toggleInitialSide}
          className="text-2xl cursor-pointer"
        />
      </div>
    </div>
  )
}

export default Flashcard
