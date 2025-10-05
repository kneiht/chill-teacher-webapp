import React, { useState, useEffect } from 'react'
import Slide1 from './Slide1'
import Slide2 from './Slide2'
import Slide3 from './Slide3'
import Slide4 from './Slide4'
import Slide5 from './Slide5'
import Slide6 from './Slide6'
import Slide7 from './Slide7'
import Slide8 from './Slide8'
import Slide9 from './Slide9'
import Slide10 from './Slide10'
import Slide11 from './Slide11'
import Slide12 from './Slide12'
import Slide13 from './Slide13'
import Slide14 from './Slide14'
import Slide15 from './Slide15'
import Slide16 from './Slide16'

const PresentContinuousLesson: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [showOutline, setShowOutline] = useState(false)
  const [showZoomInstructions, setShowZoomInstructions] = useState(false)
  const totalSlides = 16

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

  // Show zoom instructions
  useEffect(() => {
    if (window.innerWidth <= 768) return
    if (localStorage.getItem('hideZoomInstructions')) return
    setShowZoomInstructions(true)
  }, [])

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

  // Zoom instructions dismiss
  const dismissZoomInstructions = () => {
    setShowZoomInstructions(false)
    localStorage.setItem('hideZoomInstructions', 'true')
  }

  return (
    <>
      <style>
        {`
          body {
            font-family: 'Baloo 2', cursive;
            transition: background-color 0.5s ease;
          }

          .slide {
            display: none;
            animation: fadeIn 0.5s ease-in-out;
          }

          .slide.active {
            display: block;
          }

          @keyframes fadeIn {
            from {
              opacity: 0;
            }
            to {
              opacity: 1;
            }
          }

          @keyframes float {
            0% {
              transform: translateY(0px);
            }
            50% {
              transform: translateY(-10px);
            }
            100% {
              transform: translateY(0px);
            }
          }

          .floating {
            animation: float 3s ease-in-out infinite;
          }

          .content-box {
            background-color: rgba(255, 255, 255, 0.45);
            overflow-y: auto;
            padding: 1rem 1rem 2rem 1rem;
          }

          .exercise-input {
            border-bottom: 2px dashed #4f46e5;
            min-width: 100px;
            display: inline-block;
            text-align: center;
          }

          .exercise-input:focus {
            outline: none;
            border-bottom: 2px solid #4f46e5;
          }

          .btn-check {
            background-color: #4f46e5;
            color: white;
          }

          .btn-check:hover {
            background-color: #4338ca;
          }

          .correct {
            color: #10b981;
            font-weight: bold;
          }

          .incorrect {
            color: #ef4444;
            font-weight: bold;
          }

          .highlight {
            background-color: #fef08a;
            padding: 0px 4px;
            border-radius: 8px;
          }

          .thought-bubble {
            position: absolute;
            background: white;
            border-radius: 10px;
            padding: 15px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
          }

          .thought-bubble:after {
            content: '';
            position: absolute;
            border-style: solid;
            border-width: 15px 0 15px 25px;
            border-color: transparent white;
            display: block;
            width: 0;
            z-index: 1;
          }

          .boy {
            animation: bounce 2s ease infinite;
          }

          @keyframes bounce {
            0%,
            100% {
              transform: translateY(0);
            }
            50% {
              transform: translateY(-10px);
            }
          }

          .verb-card {
            transition: all 0.3s ease;
            cursor: pointer;
          }

          .verb-card:hover {
            transform: scale(1.05);
            box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
          }

          .verb-example {
            border-left: 4px solid #4f46e5;
            padding-left: 12px;
          }

          .outline-content {
            background: white;
            border-radius: 16px;
            padding: 20px;
            max-width: 90vw;
            max-height: 90vh;
            overflow-y: auto;
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(340px, 1fr));
            gap: 20px;
          }

          .outline-item {
            transition: all 0.3s ease;
            border: 1px solid #e5e7eb;
            padding: 10px;
          }

          .outline-item:hover {
            transform: translateY(-2px);
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
          }

          .outline-slide {
            display: block;
            transform: scale(0.3);
            transform-origin: top left;
            width: 333.33%; /* 100% / 0.3 */
            height: 333.33%; /* 100% / 0.3 */
            pointer-events: none;
            background-color: white;
          }

          .slide-preview {
            width: 300px;
            height: 250px;
            overflow: hidden;
            border-radius: 8px;
            border: 1px solid #e5e7eb;
            margin: 0 auto;
          }

          .slide-wrapper {
            width: 1200px;
            height: 1000px;
            transform: scale(0.25);
            transform-origin: top left;
          }

          .slide-wrapper > .slide {
            display: block !important;
            pointer-events: none;
          }

          .modal-verb {
            background: white;
            border-radius: 12px;
            padding: 20px;
            max-width: 500px;
            animation: popIn 0.3s ease-out;
          }

          @keyframes popIn {
            0% {
              transform: scale(0.5);
              opacity: 0;
            }
            100% {
              transform: scale(1);
              opacity: 1;
            }
          }
        `}
      </style>
      <div
        className="bg-blue-50 bg-[url('https://cdn.photoroom.com/v2/image-cache?path=gs://background-7ef44.appspot.com/backgrounds_v3/nice/31_nice.jpg')] bg-cover bg-center min-h-screen flex items-center justify-center p-2"
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
            <Slide1 isActive={currentSlide === 0} />
            <Slide2 isActive={currentSlide === 1} />
            <Slide3 isActive={currentSlide === 2} />
            <Slide4 isActive={currentSlide === 3} />
            <Slide5 isActive={currentSlide === 4} />
            <Slide6 isActive={currentSlide === 5} />
            <Slide7 isActive={currentSlide === 6} />
            <Slide8 isActive={currentSlide === 7} />
            <Slide9 isActive={currentSlide === 8} />
            <Slide10 isActive={currentSlide === 9} />
            <Slide11 isActive={currentSlide === 10} />
            <Slide12 isActive={currentSlide === 11} />
            <Slide13 isActive={currentSlide === 12} />
            <Slide14 isActive={currentSlide === 13} />
            <Slide15 isActive={currentSlide === 14} />
            <Slide16 isActive={currentSlide === 15} />
          </div>
        </div>
      </div>

      {/* Zoom Instructions Popup */}
      {showZoomInstructions && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div
            className="bg-white p-6 rounded-xl shadow-lg max-w-md w-full mx-4"
            style={{
              animation: 'popIn 0.3s ease-out',
            }}
          >
            <div className="text-center mb-4">
              <svg
                width="40"
                height="40"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="mx-auto mb-3"
              >
                <path
                  d="M15 3H21V9"
                  stroke="#4f46e5"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M9 21H3V15"
                  stroke="#4f46e5"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M21 3L14 10"
                  stroke="#4f46e5"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M3 21L10 14"
                  stroke="#4f46e5"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <h3 className="text-xl font-bold text-gray-800 mb-3">
                Hướng dẫn phóng to/thu nhỏ
              </h3>
            </div>
            <div className="bg-gray-100 p-4 rounded-lg mb-4">
              <p className="text-sm mb-3">
                Bạn có thể sử dụng tổ hợp phím sau để phóng to/thu nhỏ nội dung
                cho phù hợp với màn hình của bạn:
              </p>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="bg-gray-200 px-2 py-1 rounded text-sm">
                    Windows
                  </span>
                  <span>Ctrl + (+/-)</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="bg-gray-200 px-2 py-1 rounded text-sm">
                    Mac
                  </span>
                  <span>Command + (+/-)</span>
                </div>
              </div>
            </div>
            <button
              onClick={dismissZoomInstructions}
              className="w-full bg-indigo-600 text-white py-2 rounded-lg font-bold hover:bg-indigo-700"
            >
              Không hiển thị lại
            </button>
          </div>
        </div>
      )}
    </>
  )
}

export default PresentContinuousLesson
