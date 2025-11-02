import React, { useMemo, useRef, useState } from 'react'
import { Volume2, Play, Pause } from 'lucide-react'

// Components
import PresentationShell from '@/lib/components/presentation/PresentationShell'
import Slide from '@/lib/components/presentation/Slide'

interface ReadingSlideItem {
  audio: string
  image?: string
  text: string
  title?: string // Big header, separate from text
  textTitle?: string // Optional title for text content
}

interface ReadingSlideCoreProps {
  slide: ReadingSlideItem
  isActive: boolean
}

const ReadingSlideCore: React.FC<ReadingSlideCoreProps> = ({
  slide,
  isActive,
}) => {
  const audioRef = useRef<HTMLAudioElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)

  // Format time helper function
  const formatTime = (seconds: number): string => {
    if (isNaN(seconds) || !isFinite(seconds)) return '0:00'
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const handleToggleAudio = async () => {
    if (!audioRef.current) return

    try {
      if (isPlaying) {
        audioRef.current.pause()
        setIsPlaying(false)
      } else {
        await audioRef.current.play()
        setIsPlaying(true)
      }
    } catch (error) {
      console.error('Error playing audio:', error)
      setIsPlaying(false)
    }
  }

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!audioRef.current) return

    const progressBar = e.currentTarget
    const rect = progressBar.getBoundingClientRect()
    const clickX = e.clientX - rect.left
    const percentage = clickX / rect.width
    const newTime = percentage * duration

    audioRef.current.currentTime = newTime
    setCurrentTime(newTime)
  }

  React.useEffect(() => {
    const audio = audioRef.current
    if (!audio || !isActive) return

    const handleTimeUpdate = () => {
      if (audio) {
        setCurrentTime(audio.currentTime)
      }
    }

    const handleLoadedMetadata = () => {
      if (audio && audio.duration && isFinite(audio.duration)) {
        setDuration(audio.duration)
      }
    }

    const handleLoadedData = () => {
      if (audio && audio.duration && isFinite(audio.duration)) {
        setDuration(audio.duration)
      }
    }

    const handleEnded = () => {
      setIsPlaying(false)
      setCurrentTime(0)
    }

    const handlePause = () => setIsPlaying(false)
    const handlePlay = () => setIsPlaying(true)

    audio.addEventListener('timeupdate', handleTimeUpdate)
    audio.addEventListener('loadedmetadata', handleLoadedMetadata)
    audio.addEventListener('loadeddata', handleLoadedData)
    audio.addEventListener('ended', handleEnded)
    audio.addEventListener('pause', handlePause)
    audio.addEventListener('play', handlePlay)

    // Load metadata if already available
    if (audio.readyState >= 1 && audio.duration && isFinite(audio.duration)) {
      setDuration(audio.duration)
    }

    // Force load metadata
    audio.load()

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate)
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata)
      audio.removeEventListener('loadeddata', handleLoadedData)
      audio.removeEventListener('ended', handleEnded)
      audio.removeEventListener('pause', handlePause)
      audio.removeEventListener('play', handlePlay)
    }
  }, [slide.audio, isActive])

  // Stop audio when slide becomes inactive
  React.useEffect(() => {
    if (!isActive && audioRef.current) {
      audioRef.current.pause()
      audioRef.current.currentTime = 0
      setIsPlaying(false)
      setCurrentTime(0)
    }
  }, [isActive])

  if (!isActive) return null

  const hasImage = slide.image && slide.image.trim() !== ''
  const hasText = slide.text && slide.text.trim() !== ''
  const isTitleSlide = slide.title && !hasText

  return (
    <div className="flex flex-col h-full w-full rounded-xl p-8 bg-[#ffffffa1]">
      {/* Audio element - hidden (only for non-title slides) */}
      {!isTitleSlide && (
        <audio ref={audioRef} src={slide.audio} preload="auto" />
      )}

      {/* Title Slide Layout: Title only (centered) or Title + Image (vertical) */}
      {isTitleSlide && (
        <div className="flex flex-col items-center justify-center h-full gap-8">
          {/* Main Title */}
          <h1 className="text-6xl font-bold text-indigo-600 text-center">
            {slide.title}
          </h1>

          {/* Image below title (horizontal layout) */}
          {hasImage && (
            <div className="w-full max-w-3xl h-[60%] flex items-center justify-center">
              <div className="w-full h-full rounded-lg overflow-hidden shadow-lg">
                <img
                  src={slide.image}
                  alt="Reading slide"
                  className="w-full h-full rounded-lg object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement
                    target.style.display = 'none'
                    target.parentElement!.innerHTML =
                      '<div class="flex items-center justify-center h-full text-gray-400 text-2xl">Image not found</div>'
                  }}
                />
              </div>
            </div>
          )}
        </div>
      )}

      {/* Regular Slide Layout: Title + Image + Text */}
      {!isTitleSlide && (
        <>
          {/* Main Title (Big Header) */}
          {slide.title && (
            <h1 className="text-6xl font-bold text-indigo-600 text-center mb-6">
              {slide.title}
            </h1>
          )}

          {/* Content Layout: Image + Text or Text Only */}
          <div
            className={`flex gap-6 flex-1 min-h-0 ${
              hasImage ? 'flex-row' : 'flex-col items-center justify-center'
            }`}
          >
            {/* Image Section (Left) */}
            {hasImage && (
              <div className="w-2/5 flex-shrink-0 flex flex-col">
                <div className="w-full h-full rounded-lg overflow-hidden shadow-lg">
                  <img
                    src={slide.image}
                    alt="Reading slide"
                    className="w-full h-full rounded-lg object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement
                      target.style.display = 'none'
                      target.parentElement!.innerHTML =
                        '<div class="flex items-center justify-center h-full text-gray-400 text-2xl">Image not found</div>'
                    }}
                  />
                </div>
              </div>
            )}

            {/* Text Section (Right if image exists, full width if no image) */}
            <div
              className={`flex flex-col min-h-0 ${hasImage ? 'w-3/5' : 'w-full max-w-5xl'}`}
            >
              {/* Text Title (Optional) */}
              {slide.textTitle && (
                <h2 className="text-3xl font-bold text-indigo-600 mb-4">
                  {slide.textTitle}
                </h2>
              )}

              {/* Scrollable Text Content */}
              <div
                className={`flex-1 overflow-y-auto ${
                  hasImage ? '' : 'flex items-center justify-center'
                }`}
              >
                <p
                  className={`text-3xl text-gray-900 leading-relaxed whitespace-pre-line ${
                    hasImage ? 'text-left' : 'text-center'
                  }`}
                >
                  {slide.text}
                </p>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Audio Player (only for non-title slides) */}
      {!isTitleSlide && (
        <div className="flex flex-col items-center gap-4 mt-6 w-full max-w-3xl mx-auto">
          {/* Main Controls Row */}
          <div className="flex items-center justify-center gap-6 w-full">
            {/* Play/Pause Button - Large and Prominent */}
            <button
              onClick={handleToggleAudio}
              className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-indigo-600 to-indigo-700 text-white rounded-full hover:from-indigo-700 hover:to-indigo-800 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 active:scale-95"
              title={isPlaying ? 'Pause audio' : 'Play audio'}
            >
              {isPlaying ? (
                <Pause className="w-6 h-6 fill-current" />
              ) : (
                <Play className="w-6 h-6 fill-current" />
              )}
            </button>

            {/* Time Display */}
            <div className="flex items-center gap-2 text-lg font-medium text-gray-900 min-w-[140px] justify-center">
              <span className="text-indigo-600">{formatTime(currentTime)}</span>
              <span className="text-gray-400">/</span>
              <span className="text-gray-600">{formatTime(duration)}</span>
            </div>
          </div>

          {/* Progress Bar - Enhanced */}
          <div className="w-full">
            <div
              className="w-full h-3 bg-gray-200 rounded-full cursor-pointer relative group overflow-hidden shadow-inner"
              onClick={handleProgressClick}
            >
              {/* Background gradient */}
              <div className="absolute inset-0 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full" />

              {/* Progress fill with gradient */}
              <div
                className="h-full bg-gradient-to-r from-indigo-500 via-indigo-600 to-indigo-700 rounded-full transition-all duration-100 shadow-md relative overflow-hidden"
                style={{
                  width: `${duration ? (currentTime / duration) * 100 : 0}%`,
                }}
              >
                {/* Subtle shine effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent" />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// Activity Interface
interface ReadingSlideProps {
  readingData: ReadingSlideItem[]
  backgroundUrl: string
  activityTitle?: string
  lessonTitle?: string
  activityDescription?: string
  lessonDescription?: string
  onClose?: () => void
}

const ReadingSlide: React.FC<ReadingSlideProps> = ({
  readingData,
  backgroundUrl,
  activityTitle,
  lessonTitle,
  activityDescription,
  lessonDescription,
  onClose,
}) => {
  const readingSlides = useMemo(() => {
    const slides: React.FC<{ isActive: boolean }>[] = []

    // Add reading slides
    readingData.forEach((slide) => {
      slides.push(({ isActive }: { isActive: boolean }) => (
        <Slide isActive={isActive}>
          <ReadingSlideCore slide={slide} isActive={isActive} />
        </Slide>
      ))
    })

    return slides
  }, [
    readingData,
    activityTitle,
    lessonTitle,
    activityDescription,
    lessonDescription,
  ])

  return (
    <PresentationShell
      slides={readingSlides}
      backgroundUrl={backgroundUrl}
      onHomeClick={onClose}
      showNavButtons={true}
      showSlideCounter={true}
    />
  )
}

export default ReadingSlide
