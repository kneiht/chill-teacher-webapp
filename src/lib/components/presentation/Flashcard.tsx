import React, { useState, useEffect } from 'react'

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

  useEffect(() => {
    if (isActive) {
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
          e.preventDefault()
          setIsFlipped(!isFlipped)
        }
      }

      window.addEventListener('keydown', handleKeyDown)
      return () => window.removeEventListener('keydown', handleKeyDown)
    }
  }, [isActive, isFlipped])

  if (!isActive) return null

  return (
    <div className="w-full h-full flex items-center justify-center p-8">
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
            <img
              src={vocab.image}
              alt={vocab.word}
              className="w-32 h-32 object-contain mb-4"
            />
            <h2 className="text-4xl font-bold text-indigo-600 mb-2">
              {vocab.word}
            </h2>
            <p className="text-xl text-gray-600">{vocab.phonics}</p>
          </div>

          {/* Back */}
          <div
            className="absolute inset-0 w-full h-full backface-hidden bg-indigo-50 rounded-xl shadow-2xl flex flex-col items-center justify-center p-6 rotate-x-180"
            style={{
              backfaceVisibility: 'hidden',
              transform: 'rotateX(180deg)',
            }}
          >
            <h3 className="text-2xl font-bold text-indigo-700 mb-4">
              {vocab.vietnameseMeaning}
            </h3>
            <p className="text-lg text-gray-700 mb-4 text-center">
              "{vocab.sampleSentence}"
            </p>
            <p className="text-md text-gray-600 text-center italic">
              "{vocab.vietnameseTranslation}"
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Flashcard
