import React, { useState, useEffect } from 'react'
import { Volume2, VolumeX } from 'lucide-react'
import { useStore } from '@tanstack/react-store'
import { flashcardStore, toggleSound } from '@/lib/stores/flashcard.store'
import { useVoice } from '@/lib/hooks/use-voice'

interface VocabItem {
  word: string
  phonics: string
  image: string
  vietnameseMeaning: string
  sampleSentence: string
  vietnameseTranslation: string
}

interface MultipleChoiceGameProps {
  correctVocab: VocabItem
  options: Array<VocabItem>
  isActive: boolean
  onComplete: () => void
  onNext?: () => void
  onPrev?: () => void
}

const MultipleChoiceGame: React.FC<MultipleChoiceGameProps> = ({
  correctVocab,
  options,
  isActive,
  onComplete,
}) => {
  const [shuffledOptions, setShuffledOptions] = useState<Array<VocabItem>>([])
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null)
  const settings = useStore(flashcardStore)
  const { speak } = useVoice()

  useEffect(() => {
    if (isActive) {
      // Shuffle options and reset state when the slide becomes active
      const shuffled = [...options].sort(() => Math.random() - 0.5)
      setShuffledOptions(shuffled)
      setSelectedAnswer(null)
      setIsCorrect(null)
    }
  }, [isActive, options])

  const handleAnswerClick = (word: string) => {
    if (selectedAnswer) return // Prevent changing answer

    const correct = word === correctVocab.word
    setSelectedAnswer(word)
    setIsCorrect(correct)

    if (correct) {
      // Wait a moment before moving to the next slide
      setTimeout(() => {
        onComplete()
      }, 1500)
    }
  }

  const getButtonClass = (optionWord: string) => {
    if (selectedAnswer === null) {
      return 'bg-white hover:bg-indigo-100'
    }
    if (optionWord === correctVocab.word) {
      return 'bg-green-500 text-white'
    }
    if (optionWord === selectedAnswer && !isCorrect) {
      return 'bg-red-500 text-white'
    }
    return 'bg-gray-200 text-gray-500 opacity-70'
  }

  if (!isActive) return null

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-start p-4 ">
      <div className="w-full max-w-4xl flex flex-col items-center">
        {/* Image */}
        <div className="mb-8 w-[60%] h-80 rounded-xl shadow-2xl overflow-hidden">
          <img
            src={correctVocab.image}
            alt="Vocabulary"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Options */}
        <div className="grid grid-cols-2 gap-3 w-full">
          {shuffledOptions.map((option) => (
            <button
              key={option.word}
              onClick={() => handleAnswerClick(option.word)}
              disabled={selectedAnswer !== null}
              className={`w-full py-4 px-4 rounded-lg shadow-lg text-3xl font-bold text-center transition-all duration-300 transform ${getButtonClass(
                option.word,
              )}`}
            >
              {option.word}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

export default MultipleChoiceGame
