import React, { useMemo, useRef, useState } from 'react'
import { Volume2, Play, Pause } from 'lucide-react'

// Components
import PresentationShell from '@/lib/components/presentation/PresentationShell'
import Slide from '@/lib/components/presentation/Slide'

interface ReadingSlideItem {
  audio: string
  image: string
  text: string
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

  const handleToggleAudio = () => {
    if (!audioRef.current) return

    if (isPlaying) {
      audioRef.current.pause()
      setIsPlaying(false)
    } else {
      audioRef.current.play()
      setIsPlaying(true)
    }
  }

  React.useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const handleEnded = () => setIsPlaying(false)
    const handlePause = () => setIsPlaying(false)
    const handlePlay = () => setIsPlaying(true)

    audio.addEventListener('ended', handleEnded)
    audio.addEventListener('pause', handlePause)
    audio.addEventListener('play', handlePlay)

    return () => {
      audio.removeEventListener('ended', handleEnded)
      audio.removeEventListener('pause', handlePause)
      audio.removeEventListener('play', handlePlay)
    }
  }, [])

  // Stop audio when slide becomes inactive
  React.useEffect(() => {
    if (!isActive && audioRef.current) {
      audioRef.current.pause()
      audioRef.current.currentTime = 0
      setIsPlaying(false)
    }
  }, [isActive])

  if (!isActive) return null

  // Check if text contains newlines to determine if it's a title
  const isTitle = !slide.text.includes('\n')
  const textLines = slide.text.split('\n')

  return (
    <div
      className="flex flex-col items-center justify-center h-full w-full rounded-xl p-8 bg-[#ffffffae] gap-6"
      style={{ fontFamily: "'Roboto', sans-serif" }}
    >
      {/* Audio element - hidden */}
      <audio ref={audioRef} src={slide.audio} preload="auto" />

      {/* Image */}
      <div className="w-full max-w-4xl h-[400px] rounded-lg overflow-hidden shadow-lg mb-4">
        <img
          src={slide.image}
          alt="Reading slide"
          className="w-full h-full object-cover"
          onError={(e) => {
            const target = e.target as HTMLImageElement
            target.style.display = 'none'
            target.parentElement!.innerHTML =
              '<div class="flex items-center justify-center h-full text-gray-400 text-2xl">Image not found</div>'
          }}
        />
      </div>

      {/* Title or Text */}
      {isTitle ? (
        <h1 className="text-6xl font-bold text-indigo-600 text-center">
          {slide.text}
        </h1>
      ) : (
        <div className="flex flex-col items-center gap-4 w-full max-w-5xl">
          <h2 className="text-5xl font-bold text-indigo-600 text-center mb-2">
            {textLines[0]}
          </h2>
          <p className="text-3xl text-gray-700 text-center leading-relaxed whitespace-pre-line">
            {textLines.slice(1).join('\n')}
          </p>
        </div>
      )}

      {/* Audio Play Button */}
      <button
        onClick={handleToggleAudio}
        className="flex items-center gap-3 px-6 py-3 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition-colors text-2xl font-semibold shadow-lg"
        title={isPlaying ? 'Pause audio' : 'Play audio'}
      >
        {isPlaying ? (
          <>
            <Pause className="w-6 h-6" />
            Pause Audio
          </>
        ) : (
          <>
            <Play className="w-6 h-6" />
            Play Audio
          </>
        )}
      </button>
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
    const slides = []

    // Add title slide as the first slide
    if (lessonTitle || lessonDescription) {
      slides.push(({ isActive }: { isActive: boolean }) => (
        <Slide isActive={isActive}>
          <div className="flex flex-col items-center justify-center h-full gap-5">
            {lessonTitle && (
              <h1 className="text-center text-6xl font-bold text-indigo-600 bg-[#ffffffae] px-6 py-3 rounded-lg">
                {lessonTitle}
              </h1>
            )}
            {lessonDescription && (
              <h2 className="text-center text-5xl font-bold text-indigo-600 bg-[#ffffffae] px-6 py-3 rounded-lg">
                {lessonDescription}
              </h2>
            )}
            {activityTitle && (
              <h3 className="text-center text-4xl font-semibold text-gray-700 bg-[#ffffffae] px-6 py-3 rounded-lg">
                {activityTitle}
              </h3>
            )}
            {activityDescription && (
              <p className="text-center text-3xl text-gray-600 bg-[#ffffffae] px-6 py-3 rounded-lg">
                {activityDescription}
              </p>
            )}
          </div>
        </Slide>
      ))
    }

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
