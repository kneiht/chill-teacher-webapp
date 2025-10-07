import { useState, useEffect } from 'react'
import { useTTS } from '@/lib/hooks/use-tts'

export const useVoice = () => {
  const [voices, setVoices] = useState<Array<SpeechSynthesisVoice>>([])
  const {
    settings: { voice, rate },
    setVoice,
    setRate,
  } = useTTS()

  useEffect(() => {
    const loadVoices = () => {
      setVoices(speechSynthesis.getVoices())
    }
    loadVoices()
    speechSynthesis.onvoiceschanged = loadVoices
  }, [])

  const speak = (text: string, lang: string = 'en-US') => {
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = lang
    utterance.rate = rate
    if (voice !== 'default') {
      const selectedVoice = voices.find((v) => v.name === voice)
      if (selectedVoice) {
        utterance.voice = selectedVoice
      } else {
        utterance.voice = voices[0]
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
  }
}
