import { ArrowRightLeft, Volume2, VolumeX } from 'lucide-react'
import React, { useState, useEffect, useMemo } from 'react'
import { useStore } from '@tanstack/react-store'
import {
  flashcardStore,
  toggleInitialSide,
  toggleSound,
} from '@/lib/stores/flashcard.store'
import { useVoice } from '@/lib/hooks/use-voice'

// Components
import PresentationShell from '@/lib/components/presentation/PresentationShell'
import Slide from '@/lib/components/presentation/Slide'

interface VocabItem {
  word: string
  phonics: string
  image: string
  vietnameseMeaning: string
  sampleSentence: string
  vietnameseTranslation: string
  wordPronunciation?: string
  sentencePronunciation?: string
}

interface FlashcardCoreProps {
  vocab: VocabItem
  isActive: boolean
  title?: string
}

const FlashcardCore: React.FC<FlashcardCoreProps> = ({
  vocab,
  isActive,
  title,
}) => {
  const [isFlipped, setIsFlipped] = useState(false)
  const settings = useStore(flashcardStore)
  const { speakWord, speakSentence, stopAll } = useVoice()

  useEffect(() => {
    // Reset flip state when card becomes active or inactive
    setIsFlipped(settings.initialSide === 'back')
  }, [isActive, settings.initialSide])

  useEffect(() => {
    if (isActive && settings.soundEnabled) {
      const wordTimeout = setTimeout(() => {
        speakWord(vocab.word, vocab.wordPronunciation)
      }, 500)
      const sentenceTimeout = setTimeout(() => {
        speakSentence(vocab.sampleSentence, vocab.sentencePronunciation, false)
      }, 1500)

      return () => {
        clearTimeout(wordTimeout)
        clearTimeout(sentenceTimeout)
        stopAll()
      }
    }
  }, [isActive])

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
    <div className="relative w-full h-full flex flex-col items-center justify-center p-8">
      {/* Title */}
      {title && (
        <h2 className="text-xl font-bold text-indigo-700 text-center mb-4">
          {title}
        </h2>
      )}
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
            <h2 className="text-6xl font-bold text-indigo-600 mb-4  text-center">
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
            {vocab.image ? (
              <>
                <img
                  src={vocab.image}
                  alt={vocab.word}
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute bottom-5 inset-x-0 flex items-center justify-center">
                  <h3 className="text-3xl font-bold text-indigo-600 px-6 py-3 rounded-lg bg-[#ffffff9b]">
                    {vocab.vietnameseMeaning}
                  </h3>
                </div>
              </>
            ) : (
              <div className="absolute inset-0 w-full h-full backface-hidden bg-white rounded-xl shadow-2xl flex flex-col items-center justify-center p-6">
                <h2 className="text-6xl font-bold text-indigo-600 mb-4 text-center">
                  {vocab.vietnameseMeaning}
                </h2>
                <p className="text-5xl text-gray-700 text-center">
                  "{vocab.vietnameseTranslation}"
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Settings */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-4">
        <button
          onClick={toggleInitialSide}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition-colors shadow-lg"
          title="Toggle initial side"
        >
          <ArrowRightLeft className="text-lg" />
        </button>
        <button
          onClick={toggleSound}
          className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-full hover:bg-green-700 transition-colors shadow-lg"
          title="Toggle sound"
        >
          {settings.soundEnabled ? (
            <Volume2 className="text-lg" />
          ) : (
            <VolumeX className="text-lg" />
          )}
        </button>
        <button
          onClick={() => speakWord(vocab.word, vocab.wordPronunciation)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors shadow-lg"
          title="Play word audio"
        >
          <Volume2 className="text-lg" />
        </button>
        <button
          onClick={() =>
            speakSentence(vocab.sampleSentence, vocab.sentencePronunciation)
          }
          className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-full hover:bg-purple-700 transition-colors shadow-lg"
          title="Play sentence audio"
        >
          <Volume2 className="text-lg" />
        </button>
      </div>
    </div>
  )
}

// Activity Interface
interface FlashcardProps {
  vocabData: VocabItem[]
  backgroundUrl: string
  title?: string
  onClose?: () => void
}

const Flashcard: React.FC<FlashcardProps> = ({
  vocabData,
  backgroundUrl,
  title,
  onClose,
}) => {
  const flashcardSlides = useMemo(
    () =>
      vocabData.map((vocab) => ({ isActive }: { isActive: boolean }) => (
        <Slide isActive={isActive}>
          <FlashcardCore vocab={vocab} isActive={isActive} title={title} />
        </Slide>
      )),
    [vocabData, title],
  )

  return (
    <PresentationShell
      slides={flashcardSlides}
      backgroundUrl={backgroundUrl}
      onHomeClick={onClose}
      showNavButtons={true}
      showSlideCounter={true}
    />
  )
}

export default Flashcard
