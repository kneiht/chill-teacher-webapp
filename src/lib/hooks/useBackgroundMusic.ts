import { useRef, useCallback, useEffect } from 'react'
import { audioStore } from '@/lib/stores/audio.store'

interface UseBackgroundMusicOptions {
  volume?: number
  totalBackgrounds?: number
}

/**
 * Custom hook for managing background music in games
 * Randomly selects and plays background music in loop
 * @param options - Configuration options for background music
 * @returns Object with play, stop, and pause functions
 */
export const useBackgroundMusic = (options: UseBackgroundMusicOptions = {}) => {
  const { volume: defaultVolume = 0.3, totalBackgrounds = 5 } = options

  const audioRef = useRef<HTMLAudioElement | null>(null)
  const selectedTrackRef = useRef<number | null>(null)
  const enabledRef = useRef(audioStore.state.backgroundMusicEnabled)
  const volumeRef = useRef(
    audioStore.state.backgroundMusicVolume || defaultVolume,
  )

  /**
   * Select a random background track
   */
  const selectRandomTrack = useCallback((): number => {
    return Math.floor(Math.random() * totalBackgrounds) + 1
  }, [totalBackgrounds])

  /**
   * Play background music
   * If no track is specified, randomly selects one
   */
  const play = useCallback(
    (trackNumber?: number) => {
      if (!enabledRef.current) return

      try {
        // If already playing, don't restart
        if (audioRef.current && !audioRef.current.paused) {
          return
        }

        // Select track if not specified
        const track =
          trackNumber || selectedTrackRef.current || selectRandomTrack()
        selectedTrackRef.current = track

        // Create or update audio element
        if (!audioRef.current) {
          audioRef.current = new Audio(
            `/sounds/backgrounds/background-${track}.mp3`,
          )
          audioRef.current.loop = true
          audioRef.current.volume = volumeRef.current
        }

        audioRef.current.play().catch((error) => {
          console.warn('Could not play background music:', error)
        })
      } catch (error) {
        console.error('Error playing background music:', error)
      }
    },
    [selectRandomTrack],
  )

  /**
   * Stop background music and reset
   */
  const stop = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.currentTime = 0
      audioRef.current = null
      selectedTrackRef.current = null
    }
  }, [])

  /**
   * Pause background music without resetting
   */
  const pause = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause()
    }
  }, [])

  /**
   * Resume paused music
   */
  const resume = useCallback(() => {
    if (audioRef.current && audioRef.current.paused) {
      audioRef.current.play().catch((error) => {
        console.warn('Could not resume background music:', error)
      })
    }
  }, [])

  /**
   * Update volume
   */
  const setVolume = useCallback((newVolume: number) => {
    if (audioRef.current) {
      audioRef.current.volume = Math.max(0, Math.min(1, newVolume))
    }
  }, [])

  /**
   * Subscribe to store changes without causing re-renders
   */
  useEffect(() => {
    const unsubscribe = audioStore.subscribe(() => {
      const state = audioStore.state
      const newEnabled = state.backgroundMusicEnabled
      const newVolume = state.backgroundMusicVolume || defaultVolume

      // Update volume ref and audio element
      if (volumeRef.current !== newVolume) {
        volumeRef.current = newVolume
        if (audioRef.current) {
          audioRef.current.volume = newVolume
        }
      }

      // Update enabled ref and control playback
      if (enabledRef.current !== newEnabled) {
        enabledRef.current = newEnabled
        if (audioRef.current) {
          if (newEnabled && audioRef.current.paused) {
            audioRef.current.play().catch(() => {})
          } else if (!newEnabled && !audioRef.current.paused) {
            audioRef.current.pause()
          }
        }
      }
    })

    return unsubscribe
  }, [defaultVolume])

  /**
   * Cleanup on unmount
   */
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current = null
      }
    }
  }, [])

  return {
    play,
    stop,
    pause,
    resume,
    setVolume,
  }
}
