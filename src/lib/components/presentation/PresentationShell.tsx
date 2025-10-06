import React, { useState, useEffect } from 'react'
import './PresentationShell.css'

interface PresentationShellProps {
  slides: Array<React.ComponentType<{ isActive: boolean }>>
  backgroundUrl?: string
}

const PresentationShell: React.FC<PresentationShellProps> = ({
  slides,
  backgroundUrl = 'None',
}) => {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [showOutline, setShowOutline] = useState(false)
  const totalSlides = slides.length

  // Font size adjustment
  const adjustFontSize = () => {
    const screenWidth = window.innerWidth
    const htmlElement = document.documentElement

    if (screenWidth <= 768) {
      htmlElement.style.fontSize = '20px'
    } else {
      const scaleFactor = screenWidth / 1680
      const fontSize = Math.max(20, Math.min(30, 30 * scaleFactor))
      htmlElement.style.fontSize = `${fontSize}px`
    }
  }

  // Initialize
  useEffect(() => {
    adjustFontSize()
    window.addEventListener('resize', adjustFontSize)
    return () => window.removeEventListener('resize', adjustFontSize)
  }, [])

  // Slide navigation
  const showSlide = (n: number) => {
    setCurrentSlide((n + totalSlides) % totalSlides)
  }

  // Outline functions
  const toggleOutline = () => {
    setShowOutline(!showOutline)
  }

  const goToSlide = (slideNumber: number) => {
    setCurrentSlide(slideNumber)
    setShowOutline(false)
  }

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        showSlide(currentSlide + 1)
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
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
    const threshold = 50
    const diff = touchStartX - touchEndX
    if (diff > threshold) {
      showSlide(currentSlide + 1)
    } else if (diff < -threshold) {
      showSlide(currentSlide - 1)
    }
  }

  return (
    <div
      className="bg-blue-50 min-h-screen flex items-center justify-center p-2"
      style={{
        backgroundImage:
          backgroundUrl && backgroundUrl !== 'None'
            ? `url(${backgroundUrl})`
            : undefined,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <div className="relative w-full max-w-6xl h-[95vh] mx-auto">
        {/* Slide counter */}
        <div className="absolute bottom-2 sm:bottom-full sm:top-7 right-4 z-50 flex items-center gap-2">
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

        {/* Slides container */}
        <div className="relative w-full h-full overflow-hidden rounded-2xl shadow-2xl">
          {/* Slides will be rendered here */}
          {slides.map((SlideComponent, index) => (
            <SlideComponent key={index} isActive={currentSlide === index} />
          ))}
        </div>
      </div>
    </div>
  )
}

export default PresentationShell
