import { useRef, useCallback, useEffect } from 'react'
import { audioStore } from '@/lib/stores/audio.store'

export type SoundType =
  | 'correct'
  | 'incorrect'
  | 'click'
  | 'success'
  | 'start'
  | 'flip'
  | 'match'

interface UseSoundEffectsOptions {
  volume?: number
}

/**
 * Custom hook for managing game sound effects
 * @param options - Configuration options for sound effects
 * @returns Object with play function and utility methods
 */
export const useSoundEffects = (options: UseSoundEffectsOptions = {}) => {
  const { volume: defaultVolume = 0.5 } = options

  // Store audio instances to prevent recreation
  const audioRefs = useRef<Map<SoundType, HTMLAudioElement>>(new Map())
  const enabledRef = useRef(audioStore.state.soundEffectsEnabled)
  const volumeRef = useRef(audioStore.state.soundEffectsVolume || defaultVolume)

  /**
   * Get or create an audio instance for a sound type
   */
  const getAudio = useCallback((sound: SoundType): HTMLAudioElement => {
    if (!audioRefs.current.has(sound)) {
      const audio = new Audio(`/sounds/${sound}.mp3`)
      audio.volume = volumeRef.current
      audioRefs.current.set(sound, audio)
    }
    return audioRefs.current.get(sound)!
  }, [])

  /**
   * Play a sound effect
   */
  const play = useCallback(
    (sound: SoundType) => {
      if (!enabledRef.current) return

      try {
        const audio = getAudio(sound)
        // Reset to start if already playing
        audio.currentTime = 0
        audio.play().catch((error) => {
          // Silently fail if autoplay is blocked
          console.warn(`Could not play sound: ${sound}`, error)
        })
      } catch (error) {
        console.error(`Error playing sound: ${sound}`, error)
      }
    },
    [getAudio],
  )

  /**
   * Stop a specific sound
   */
  const stop = useCallback((sound: SoundType) => {
    const audio = audioRefs.current.get(sound)
    if (audio) {
      audio.pause()
      audio.currentTime = 0
    }
  }, [])

  /**
   * Stop all sounds
   */
  const stopAll = useCallback(() => {
    audioRefs.current.forEach((audio) => {
      audio.pause()
      audio.currentTime = 0
    })
  }, [])

  /**
   * Update volume for all sounds
   */
  const setVolume = useCallback((newVolume: number) => {
    audioRefs.current.forEach((audio) => {
      audio.volume = Math.max(0, Math.min(1, newVolume))
    })
  }, [])

  /**
   * Subscribe to store changes without causing re-renders
   */
  useEffect(() => {
    const unsubscribe = audioStore.subscribe(() => {
      const state = audioStore.state
      const newEnabled = state.soundEffectsEnabled
      const newVolume = state.soundEffectsVolume || defaultVolume

      // Update volume ref and all audio elements
      if (volumeRef.current !== newVolume) {
        volumeRef.current = newVolume
        audioRefs.current.forEach((audio) => {
          audio.volume = newVolume
        })
      }

      // Update enabled ref
      if (enabledRef.current !== newEnabled) {
        enabledRef.current = newEnabled
      }
    })

    return unsubscribe
  }, [defaultVolume])

  return {
    play,
    stop,
    stopAll,
    setVolume,
  }
}
