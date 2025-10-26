import React from 'react'
import { Volume2 } from 'lucide-react'
import { useVoice } from '@/lib/hooks/use-voice'

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

interface VocabularyProps {
  vocab: VocabItem
  isActive: boolean
}

const Vocabulary: React.FC<VocabularyProps> = ({ vocab, isActive }) => {
  const { speakWord, speakSentence } = useVoice()

  if (!isActive) return null

  return (
    <div
      className="flex flex-col items-center justify-center h-[97%] rounded-xl p-8 m-2 bg-[#ffffffae]"
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
      {vocab.image ? (
        <img
          src={vocab.image}
          alt={vocab.word}
          className="w-64 h-64 object-cover rounded-lg mb-4"
        />
      ) : null}
      <h1 className="text-5xl text-indigo-600 mb-4">
        ({vocab.partOfSpeech}) {vocab.vietnameseMeaning}
      </h1>
      <p className="text-4xl text-gray-700 text-center mb-4">
        "{vocab.sampleSentence}"
      </p>
      <p className="text-4xl text-gray-700 text-center">
        {vocab.vietnameseTranslation}
      </p>
    </div>
  )
}

export default Vocabulary
