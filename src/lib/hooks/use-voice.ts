import { useState, useEffect } from 'react'
import { useStore } from '@tanstack/react-store'
import { ttsStore, setVoice, setRate } from '@/lib/stores/tts.store'

export const useVoice = () => {
  const [voices, setVoices] = useState<Array<SpeechSynthesisVoice>>([])
  const [isSupported, setIsSupported] = useState(false)
  const { voice, rate } = useStore(ttsStore)

  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      setIsSupported(true)
      const loadVoices = () => {
        setVoices(speechSynthesis.getVoices())
      }
      loadVoices()
      speechSynthesis.onvoiceschanged = loadVoices
    }
  }, [])

  const speak = (text: string, lang: string = 'en-US') => {
    if (!isSupported || speechSynthesis.speaking) {
      return
    }
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = lang
    utterance.rate = rate
    if (voice !== 'default') {
      const allVoices = speechSynthesis.getVoices()
      const selectedVoice = allVoices.find((v) => v.name === voice)
      if (selectedVoice) {
        utterance.voice = selectedVoice
      } else {
        utterance.voice = allVoices[0]
      }
    }
    speechSynthesis.speak(utterance)
  }

  const playOnlineAudio = (
    url: string,
    fallbackText: string,
    lang: string = 'en-US',
  ) => {
    const audio = new Audio(url)
    audio.play().catch(() => {
      speak(fallbackText, lang)
    })
  }

  const speakWord = (word: string, pronunciation?: string) => {
    if (pronunciation) {
      playOnlineAudio(
        `https://storage.chillteacher.com/audio-words/${pronunciation.replace('.mp3', '.wav')}`,
        word,
      )
    } else {
      speak(word)
    }
  }

  const speakSentence = (sentence: string, pronunciation?: string) => {
    if (pronunciation) {
      playOnlineAudio(
        `https://storage.chillteacher.com/audio-sentences/${pronunciation.replace('.mp3', '.wav')}`,
        sentence,
      )
    } else {
      speak(sentence)
    }
  }

  return {
    voices,
    voice,
    rate,
    setVoice,
    setRate,
    speak,
    speakWord,
    speakSentence,
    isSupported,
  }
}
