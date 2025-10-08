import React, { useState, useEffect, useRef } from 'react'
import {
  Maximize,
  Minimize,
  Home,
  ChevronLeft,
  ChevronRight,
  Menu,
  Settings,
} from 'lucide-react'
import './PresentationShell.css'
import { useVoice } from '@/lib/hooks/use-voice'

interface PresentationShellProps {
  slides: Array<React.ComponentType<{ isActive: boolean }>>
  backgroundUrl?: string
  onHomeClick?: () => void
  showFullscreenButton?: boolean
  showNavButtons?: boolean
  showOutlineButton?: boolean
  showSettingsButton?: boolean
  showSlideCounter?: boolean
}

const PresentationShell: React.FC<PresentationShellProps> = ({
  slides,
  backgroundUrl = 'None',
  onHomeClick,
  showFullscreenButton = true,
  showNavButtons = false,
  showOutlineButton = false,
  showSettingsButton = false,
  showSlideCounter = false,
}) => {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [showOutline, setShowOutline] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [showTTSSettings, setShowTTSSettings] = useState(false)
  const { voices, voice, rate, setVoice, setRate } = useVoice()
  const totalSlides = slides.length
  const slideContainerRef = useRef<HTMLDivElement>(null)

  // Font size adjustment
  const adjustFontSize = () => {
    if (!slideContainerRef.current) return

    // Get slide width
    const slideWidth = slideContainerRef.current.offsetWidth
    const htmlElement = document.documentElement

    // Scale font size based on slide width. 1920 is a common 16:9 reference width.
    const scaleFactor = slideWidth / 1920
    // Adjust min/max font sizes as needed
    const fontSize = 30 * scaleFactor
    htmlElement.style.fontSize = `${fontSize}px`
  }

  // Initialize and handle resize
  useEffect(() => {
    adjustFontSize()
    window.addEventListener('resize', adjustFontSize)
    return () => window.removeEventListener('resize', adjustFontSize)
  }, [])

  // Handle fullscreen change
  const handleFullscreenChange = () => {
    setIsFullscreen(!!document.fullscreenElement)
  }

  // Add event listener for fullscreen change
  useEffect(() => {
    document.addEventListener('fullscreenchange', handleFullscreenChange)
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange)
    }
  }, [])

  // Slide navigation
  const showSlide = (n: number) => {
    setCurrentSlide((n + totalSlides) % totalSlides)
  }

  // Outline functions
  const toggleOutline = () => {
    setShowOutline(!showOutline)
  }

  // Go to slide
  const goToSlide = (slideNumber: number) => {
    setCurrentSlide(slideNumber)
    setShowOutline(false)
  }

  // Toggle fullscreen
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().then(() => {
        ;(screen as any).orientation?.lock('landscape').catch(() => {})
      })
    } else {
      document.exitFullscreen().then(() => {
        ;(screen as any).orientation?.unlock().catch(() => {})
      })
    }
  }

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') {
        showSlide(currentSlide + 1)
      } else if (e.key === 'ArrowLeft') {
        showSlide(currentSlide - 1)
      } else if (e.key === 'Escape' && showOutline) {
        setShowOutline(false)
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [currentSlide, showOutline])

  // Touch swipe
  const [touchStartX, setTouchStartX] = useState(0)
  const [touchEndX, setTouchEndX] = useState(0)

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.changedTouches[0].screenX)
  }

  const handleTouchEnd = (e: React.TouchEvent) => {
    setTouchEndX(e.changedTouches[0].screenX)
    const threshold = 100
    const diff = touchStartX - touchEndX
    if (diff > threshold) {
      showSlide(currentSlide + 1)
    } else if (diff < -threshold) {
      showSlide(currentSlide - 1)
    }
  }

  return (
    <div className="bg-black h-screen w-screen flex items-center justify-center">
      <div
        ref={slideContainerRef}
        className="relative aspect-[16/9] w-full max-h-full max-w-[calc(100vh*16/9)]"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {/* Slides container */}
        <div
          className="w-full h-full overflow-hidden rounded-xl shadow-2xl"
          style={{
            backgroundImage:
              backgroundUrl && backgroundUrl !== 'None'
                ? `url(${backgroundUrl})`
                : undefined,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          {/* Slides will be rendered here */}
          {slides.map((SlideComponent, index) => (
            <SlideComponent key={index} isActive={currentSlide === index} />
          ))}
        </div>

        {/* Top Controls Bar */}
        <div className="absolute top-4 right-4 z-50 flex items-center gap-2">
          {onHomeClick && (
            <button
              onClick={onHomeClick}
              title="Go Back"
              className="presentation-fullscreen"
            >
              <Home size={18} />
            </button>
          )}

          {showNavButtons && (
            <button
              onClick={() => showSlide(currentSlide - 1)}
              className="presentation-button"
              title="Previous Slide"
            >
              <ChevronLeft size={18} />
            </button>
          )}

          {showSlideCounter && (
            <div className="presentation-counter">
              {currentSlide + 1}/{totalSlides}
            </div>
          )}

          {showNavButtons && (
            <button
              onClick={() => showSlide(currentSlide + 1)}
              className="presentation-button"
              title="Next Slide"
            >
              <ChevronRight size={18} />
            </button>
          )}

          {showOutlineButton && (
            <button
              onClick={toggleOutline}
              className="presentation-button"
              title="Outline"
            >
              <Menu size={18} />
            </button>
          )}

          {showSettingsButton && (
            <button
              onClick={() => setShowTTSSettings(true)}
              className="presentation-button"
              title="TTS Settings"
            >
              <Settings size={18} />
            </button>
          )}

          {showFullscreenButton && (
            <button
              onClick={toggleFullscreen}
              title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
              className="presentation-fullscreen"
            >
              {isFullscreen ? <Minimize size={18} /> : <Maximize size={18} />}
            </button>
          )}
        </div>

        {/* Outline Modal */}
        {showOutline && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center"
            onClick={(e) =>
              e.target === e.currentTarget && setShowOutline(false)
            }
          >
            <div className="outline-content">
              {/* Outline content will be generated here */}
              {Array.from({ length: totalSlides }, (_, i) => (
                <div
                  key={i}
                  className={`outline-item rounded-lg cursor-pointer relative ${
                    i === currentSlide
                      ? 'ring-2 ring-indigo-500 bg-indigo-50'
                      : 'bg-white shadow-md'
                  }`}
                  onClick={() => goToSlide(i)}
                >
                  <div className="slide-number text-xs bg-indigo-100 text-indigo-600 px-2 py-1 rounded-full font-medium mb-2 inline-block absolute bottom-1 right-5 z-10">
                    Slide {i + 1}
                  </div>
                  <div className="slide-preview">
                    <div className="slide-wrapper">
                      {/* Placeholder for slide preview */}
                      <div className="slide">Slide {i + 1} Preview</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TTS Settings Modal */}
        {showTTSSettings && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center"
            onClick={(e) =>
              e.target === e.currentTarget && setShowTTSSettings(false)
            }
          >
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
              <h3 className="text-lg font-semibold mb-4">TTS Settings</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Voice
                  </label>
                  <select
                    value={voice}
                    onChange={(e) => setVoice(e.target.value)}
                    className="w-full p-2 border rounded"
                  >
                    {voices.map((v) => (
                      <option key={v.name} value={v.name}>
                        {v.name} ({v.lang})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Speed: {rate.toFixed(1)}
                  </label>
                  <input
                    type="range"
                    min="0.5"
                    max="2.0"
                    step="0.1"
                    value={rate}
                    onChange={(e) => setRate(parseFloat(e.target.value))}
                    className="w-full"
                  />
                </div>
              </div>
              <button
                onClick={() => setShowTTSSettings(false)}
                className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default PresentationShell
