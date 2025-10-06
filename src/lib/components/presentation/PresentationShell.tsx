import React, { useState, useEffect, useRef } from 'react'
import { Link, useRouterState } from '@tanstack/react-router'
import {
  FullscreenOutlined,
  FullscreenExitOutlined,
  HomeOutlined,
} from '@ant-design/icons'
import './PresentationShell.css'

interface PresentationShellProps {
  slides: Array<React.ComponentType<{ isActive: boolean }>>
  backgroundUrl?: string
  showControls?: boolean
  showHome?: boolean
}

const PresentationShell: React.FC<PresentationShellProps> = ({
  slides,
  backgroundUrl = 'None',
  showControls = true,
  showHome = true,
}) => {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [showOutline, setShowOutline] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const totalSlides = slides.length
  const slideContainerRef = useRef<HTMLDivElement>(null)

  // Home button component
  const HomeButton = () => {
    // Get the current path
    const routerState = useRouterState()
    const pathname = routerState.location.pathname

    // Remove the last segment of the path to get the parent path
    const parentPath = pathname.substring(0, pathname.lastIndexOf('/'))

    return (
      <Link
        to={parentPath || '/'}
        title="Go to Lesson Home" // Tooltip
        className="bg-white hover:bg-indigo-100 text-indigo-600 w-8 h-8 flex items-center justify-center rounded-full shadow-lg font-bold transition-all duration-300 ease-in-out transform hover:scale-110"
      >
        <HomeOutlined style={{ fontSize: '16px' }} />
      </Link>
    )
  }

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
      document.documentElement.requestFullscreen()
    } else {
      document.exitFullscreen()
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

        {/* Activity controls */}
        {showHome && (
          <div className="absolute top-4 right-4 flex flex-row gap-2 z-50">
            <HomeButton />
          </div>
        )}

        {/* Controls */}
        <div className="absolute bottom-3 right-4 z-50 flex items-center gap-2">
          {showControls && (
            <>
              <button
                onClick={() => showSlide(currentSlide - 1)}
                className="bg-white rounded-full w-8 h-8 flex items-center justify-center shadow-lg font-bold text-indigo-600 hover:bg-indigo-50"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>
              <button
                onClick={() => showSlide(currentSlide + 1)}
                className="bg-white rounded-full w-8 h-8 flex items-center justify-center shadow-lg font-bold text-indigo-600 hover:bg-indigo-50"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
              <button
                onClick={toggleOutline}
                className="bg-white rounded-full w-8 h-8 flex items-center justify-center shadow-lg font-bold text-indigo-600 hover:bg-indigo-50"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </button>
              <div className="bg-white rounded-full w-8 h-8 flex items-center justify-center shadow-lg font-bold text-indigo-600 text-xs">
                {currentSlide + 1}/{totalSlides}
              </div>
            </>
          )}
          <button
            onClick={toggleFullscreen}
            title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
            className="bg-white hover:bg-indigo-100 text-indigo-600 w-8 h-8 flex items-center justify-center rounded-full shadow-lg font-bold transition-all duration-300 ease-in-out transform hover:scale-110"
          >
            {isFullscreen ? (
              <FullscreenExitOutlined style={{ fontSize: '16px' }} />
            ) : (
              <FullscreenOutlined style={{ fontSize: '16px' }} />
            )}
          </button>
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
      </div>
    </div>
  )
}

export default PresentationShell
