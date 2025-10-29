import React, { useMemo } from 'react'
import { Volume2 } from 'lucide-react'
import { useVoice } from '@/lib/hooks/use-voice'

// Components
import PresentationShell from '@/lib/components/presentation/PresentationShell'
import Slide from '@/lib/components/presentation/Slide'

interface VocabItem {
  word: string
  phonics: string
  partOfSpeech: string
  image: string
  vietnameseMeaning: string
  sampleSentence: string
  vietnameseTranslation: string
  wordPronunciation?: string
  sentencePronunciation?: string
}

interface VocabularyCoreProps {
  vocab: VocabItem
  isActive: boolean
  title?: string
}

const VocabularyCore: React.FC<VocabularyCoreProps> = ({
  vocab,
  isActive,
  title,
}) => {
  const { speakWord, speakSentence } = useVoice()

  if (!isActive) return null

  // Render the old layout if there is no image
  if (!vocab.image) {
    return (
      <div className="relative w-full h-full flex flex-col items-center justify-center p-8">
        {/* Title */}
        {title && (
          <h2 className="text-xl font-bold text-indigo-700 text-center mb-4">
            {title}
          </h2>
        )}
        <div
          className="flex flex-col items-center justify-center flex-1 rounded-xl p-8 bg-[#ffffffae] w-full"
          style={{ fontFamily: "'Roboto', sans-serif" }}
        >
          <div className="flex items-center mb-4">
            <h1 className="text-6xl font-bold text-indigo-600">{vocab.word}</h1>
            <button
              onClick={() => speakWord(vocab.word, vocab.wordPronunciation)}
              className="ml-4 p-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition-colors"
              title="Play word audio"
            >
              <Volume2 className="text-2xl" />
            </button>
            <button
              onClick={() =>
                speakSentence(vocab.sampleSentence, vocab.sentencePronunciation)
              }
              className="ml-2 p-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition-colors"
              title="Play sentence audio"
            >
              <Volume2 className="text-2xl" />
            </button>
          </div>
          <p className="text-4xl text-gray-600 mb-4">{vocab.phonics}</p>
          <h1 className="text-5xl text-green-700 mb-4 text-center font-bold">
            [{vocab.partOfSpeech}] {vocab.vietnameseMeaning}
          </h1>
          <p className="text-4xl text-gray-700 text-center mb-4">
            "{vocab.sampleSentence}"
          </p>
          <p className="text-4xl text-gray-500 text-center">
            {vocab.vietnameseTranslation}
          </p>
        </div>
      </div>
    )
  }

  // Render the new two-column layout if an image exists
  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center">
      <div
        className="flex flex-row items-start justify-center flex-1 rounded-xl p-8 bg-[#ffffffae] gap-12 w-full"
        style={{ fontFamily: "'Roboto', sans-serif" }}
      >
        {/* Left Column */}
        <div className="flex flex-col items-center w-2/5">
          <img
            src={vocab.image}
            alt={vocab.word}
            className="w-full h-auto object-cover rounded-lg mb-6 shadow-lg"
          />
          <div className="flex items-center mb-4">
            <h1 className="text-6xl font-bold text-indigo-600">{vocab.word}</h1>
            <button
              onClick={() => speakWord(vocab.word, vocab.wordPronunciation)}
              className="ml-4 p-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition-colors"
              title="Play word audio"
            >
              <Volume2 className="text-2xl" />
            </button>
          </div>
          <p className="text-4xl text-gray-600 mb-4">{vocab.phonics}</p>
        </div>

        {/* Right Column */}
        <div className="flex flex-col justify-center w-3/5 pt-8">
          <h2 className="text-5xl text-green-700 text-center my-5 font-bold">
            [{vocab.partOfSpeech}] {vocab.vietnameseMeaning}
          </h2>
          <div className="flex items-start mb-6">
            <p className="text-4xl text-gray-700 text-left">
              "{vocab.sampleSentence}"
            </p>
            <button
              onClick={() =>
                speakSentence(vocab.sampleSentence, vocab.sentencePronunciation)
              }
              className="ml-4 p-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition-colors flex-shrink-0"
              title="Play sentence audio"
            >
              <Volume2 className="text-2xl" />
            </button>
          </div>
          <p className="text-4xl text-gray-500 text-left">
            {vocab.vietnameseTranslation}
          </p>
        </div>
      </div>
    </div>
  )
}

// Activity Interface
interface VocabularyProps {
  vocabData: VocabItem[]
  backgroundUrl: string
  activityTitle?: string
  lessonTitle?: string
  activityDescription?: string
  lessonDescription?: string
  onClose?: () => void
}

const Vocabulary: React.FC<VocabularyProps> = ({
  vocabData,
  backgroundUrl,
  activityTitle,
  lessonTitle,
  activityDescription,
  lessonDescription,
  onClose,
}) => {
  const vocabularySlides = useMemo(() => {
    const slides = []

    // Add title slide as the first slide
    if (lessonTitle) {
      slides.push(({ isActive }: { isActive: boolean }) => (
        <Slide isActive={isActive}>
          <div className="flex flex-col items-center justify-center h-full gap-5">
            {lessonTitle && (
              <>
                <h1 className="text-center text-6xl font-bold text-indigo-600 bg-[#ffffffae] px-6 py-3 rounded-lg">
                  {lessonTitle}
                </h1>
              </>
            )}
            {lessonDescription && (
              <h1 className="text-center text-6xl font-bold text-indigo-600 bg-[#ffffffae] px-6 py-3 rounded-lg">
                {lessonDescription}
              </h1>
            )}
          </div>
        </Slide>
      ))
    }

    // Add vocabulary slides
    vocabData.forEach((vocab) => {
      slides.push(({ isActive }: { isActive: boolean }) => (
        <Slide isActive={isActive}>
          <VocabularyCore vocab={vocab} isActive={isActive} />
        </Slide>
      ))
    })

    return slides
  }, [vocabData, activityTitle, lessonTitle, lessonDescription])

  return (
    <PresentationShell
      slides={vocabularySlides}
      backgroundUrl={backgroundUrl}
      onHomeClick={onClose}
      showNavButtons={true}
      showSlideCounter={true}
    />
  )
}

export default Vocabulary
