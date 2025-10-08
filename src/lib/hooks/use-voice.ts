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

  return {
    voices,
    voice,
    rate,
    setVoice,
    setRate,
    speak,
    isSupported,
  }
}
