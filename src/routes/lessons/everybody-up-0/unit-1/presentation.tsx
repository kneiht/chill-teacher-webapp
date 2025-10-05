import React, { useState, useEffect } from 'react'
import './presentation.css'

// Add Google Fonts link
const fontLink = document.createElement('link')
fontLink.href =
  'https://fonts.googleapis.com/css2?family=Baloo+2:wght@400;600;700&display=swap'
fontLink.rel = 'stylesheet'
document.head.appendChild(fontLink)

const Presentation: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [outlineModalOpen, setOutlineModalOpen] = useState(false)
  const [exerciseStates, setExerciseStates] = useState<{
    [key: string]: {
      inputValue: string
      checked: boolean
      correct: boolean
    }
  }>({
    write: { inputValue: '', checked: false, correct: false },
    run: { inputValue: '', checked: false, correct: false },
    lie: { inputValue: '', checked: false, correct: false },
    neg1: { inputValue: '', checked: false, correct: false },
    neg2: { inputValue: '', checked: false, correct: false },
    neg3: { inputValue: '', checked: false, correct: false },
    yn1: { inputValue: '', checked: false, correct: false },
    yn2: { inputValue: '', checked: false, correct: false },
    yn3: { inputValue: '', checked: false, correct: false },
    wh1: { inputValue: '', checked: false, correct: false },
    wh2: { inputValue: '', checked: false, correct: false },
    wh3: { inputValue: '', checked: false, correct: false },
    mcq1: { inputValue: '', checked: false, correct: false },
    mcq2: { inputValue: '', checked: false, correct: false },
    mcq3: { inputValue: '', checked: false, correct: false },
  })

  const totalSlides = 16 // Based on the HTML, there are 16 slides

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
  const showZoomInstructions = () => {
    if (window.innerWidth <= 768) return
    if (localStorage.getItem('hideZoomInstructions')) return

    const popup = document.createElement('div')
    popup.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%) scale(0.95);
      background: white;
      padding: 25px;
      border-radius: 16px;
      box-shadow: 0 10px 25px rgba(0,0,0,0.1);
      z-index: 1000;
      max-width: 90%;
      width: 400px;
      opacity: 0;
      transition: all 0.3s ease;
    `

    popup.innerHTML = `
      <div style="text-align: center; margin-bottom: 20px;">
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style="margin-bottom: 15px;">
          <path d="M15 3H21V9" stroke="#4f46e5" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M9 21H3V15" stroke="#4f46e5" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M21 3L14 10" stroke="#4f46e5" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M3 21L10 14" stroke="#4f46e5" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        <h3 style="margin: 0 0 15px 0; color: #1f2937; font-size: 25px; font-weight: 600;">Hướng dẫn phóng to/thu nhỏ</h3>
      </div>
      <div style="background: #f3f4f6; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
        <p style="margin: 0; color: #4b5563; font-size: 20px; line-height: 1.6;">
          Bạn có thể sử dụng tổ hợp phím sau để phóng to/thu nhỏ nội dung cho phù hợp với màn hình của bạn:
        </p>
        <div style="margin-top: 12px; display: flex; flex-direction: column; gap: 8px;">
          <div style="display: flex; align-items: center; gap: 8px;">
            <span style="background: #e5e7eb; padding: 4px 8px; border-radius: 4px; font-size: 20px; color: #374151;">Windows</span>
            <span style="color: #4b5563;">Ctrl + (+/-)</span>
          </div>
          <div style="display: flex; align-items: center; gap: 8px;">
            <span style="background: #e5e7eb; padding: 4px 8px; border-radius: 4px; font-size: 20px; color: #374151;">Mac</span>
            <span style="color: #4b5563;">Command + (+/-)</span>
          </div>
        </div>
      </div>
      <button id="dismissPopup" style="background: #4f46e5; color: white; padding: 10px 20px; border-radius: 8px; border: none; cursor: pointer; width: 100%; font-size: 15px; font-weight: 500; transition: background-color 0.2s ease;">Không hiển thị lại</button>
    `

    document.body.appendChild(popup)

    requestAnimationFrame(() => {
      popup.style.transform = 'translate(-50%, -50%) scale(1)'
      popup.style.opacity = '1'
    })

    const button = document.getElementById('dismissPopup')
    if (button) {
      button.addEventListener('mouseover', () => {
        button.style.backgroundColor = '#4338ca'
      })
      button.addEventListener('mouseout', () => {
        button.style.backgroundColor = '#4f46e5'
      })

      button.addEventListener('click', () => {
        popup.style.transform = 'translate(-50%, -50%) scale(0.95)'
        popup.style.opacity = '0'
        setTimeout(() => {
          localStorage.setItem('hideZoomInstructions', 'true')
          popup.remove()
        }, 300)
      })
    }
  }

  // Get initial slide from URL
  const getInitialSlide = () => {
    const url = new URL(window.location.href)
    const slideParam = url.searchParams.get('slide')
    if (slideParam) {
      const slideNumber = parseInt(slideParam) - 1
      if (slideNumber >= 0 && slideNumber < totalSlides) {
        return slideNumber
      }
    }
    return 0
  }

  // Update URL with current slide
  const updateURL = (slideNumber: number) => {
    const url = new URL(window.location.href)
    url.searchParams.set('slide', (slideNumber + 1).toString())
    window.history.pushState({}, '', url)
  }

  // Show slide
  const showSlide = (n: number) => {
    const newSlide = (n + totalSlides) % totalSlides
    setCurrentSlide(newSlide)
    updateURL(newSlide)
  }

  // Toggle outline modal
  const toggleOutline = () => {
    setOutlineModalOpen(!outlineModalOpen)
  }

  // Go to slide from outline
  const goToSlide = (slideNumber: number) => {
    showSlide(slideNumber)
    setOutlineModalOpen(false)
  }

  // Handle exercise input change
  const handleExerciseInputChange = (exerciseId: string, value: string) => {
    setExerciseStates((prev) => ({
      ...prev,
      [exerciseId]: {
        ...prev[exerciseId],
        inputValue: value,
        checked: false,
        correct: false,
      },
    }))
  }

  // Check exercise input
  const checkInput = (exerciseId: string, correctAnswer: string) => {
    const state = exerciseStates[exerciseId]
    if (!state) return

    const userAnswer = state.inputValue
      .trim()
      .toLowerCase()
      .replace(/[.?]/g, '')
    const expectedAnswer = correctAnswer.toLowerCase().replace(/[.?]/g, '')
    const isCorrect = userAnswer === expectedAnswer

    setExerciseStates((prev) => ({
      ...prev,
      [exerciseId]: {
        ...prev[exerciseId],
        checked: true,
        correct: isCorrect,
      },
    }))
  }

  // Handle MCQ
  const checkMCQ = (
    exerciseId: string,
    correctAnswer: string,
    selectedAnswer: string,
  ) => {
    const isCorrect =
      selectedAnswer.toLowerCase() === correctAnswer.toLowerCase()
    setExerciseStates((prev) => ({
      ...prev,
      [exerciseId]: {
        checked: true,
        correct: isCorrect,
        inputValue: selectedAnswer,
      },
    }))
  }

  useEffect(() => {
    adjustFontSize()
    showZoomInstructions()
    setCurrentSlide(getInitialSlide())

    window.addEventListener('resize', adjustFontSize)

    // Keyboard navigation
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        showSlide(currentSlide + 1)
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        showSlide(currentSlide - 1)
      } else if (e.key === 'Escape' && outlineModalOpen) {
        setOutlineModalOpen(false)
      }
    }

    document.addEventListener('keydown', handleKeyDown)

    return () => {
      window.removeEventListener('resize', adjustFontSize)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [])

  // Touch swipe
  useEffect(() => {
    let touchStartX = 0
    let touchEndX = 0

    const handleTouchStart = (e: TouchEvent) => {
      touchStartX = e.changedTouches[0].screenX
    }

    const handleTouchEnd = (e: TouchEvent) => {
      touchEndX = e.changedTouches[0].screenX
      const threshold = 50
      const diff = touchStartX - touchEndX
      if (diff > threshold) {
        showSlide(currentSlide + 1)
      } else if (diff < -threshold) {
        showSlide(currentSlide - 1)
      }
    }

    document.addEventListener('touchstart', handleTouchStart, { passive: true })
    document.addEventListener('touchend', handleTouchEnd, { passive: true })

    return () => {
      document.removeEventListener('touchstart', handleTouchStart)
      document.removeEventListener('touchend', handleTouchEnd)
    }
  }, [currentSlide])

  // Generate outline content
  const generateOutline = () => {
    const slides = []
    for (let i = 0; i < totalSlides; i++) {
      slides.push(
        <div
          key={i}
          className={`outline-item rounded-lg cursor-pointer relative ${i === currentSlide ? 'ring-2 ring-indigo-500 bg-indigo-50' : 'bg-white shadow-md'}`}
          onClick={() => goToSlide(i)}
        >
          <div className="slide-number text-xs bg-indigo-100 text-indigo-600 px-2 py-1 rounded-full font-medium mb-2 inline-block absolute bottom-1 right-5 z-10">
            Slide {i + 1}
          </div>
          <div className="slide-preview">
            <div className="slide-wrapper">
              {/* Render slide preview here - simplified for now */}
              <div className="slide">Slide {i + 1} Preview</div>
            </div>
          </div>
        </div>,
      )
    }
    return slides
  }

  return (
    <div className="bg-blue-50 bg-[url('https://cdn.photoroom.com/v2/image-cache?path=gs://background-7ef44.appspot.com/backgrounds_v3/nice/31_nice.jpg')] bg-cover bg-center min-h-screen flex items-center justify-center p-2">
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
            <span id="slide-counter">
              {currentSlide + 1}/{totalSlides}
            </span>
          </div>
        </div>

        {/* Outline Modal */}
        {outlineModalOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center"
            onClick={() => setOutlineModalOpen(false)}
          >
            <div
              className="outline-content"
              onClick={(e) => e.stopPropagation()}
            >
              {generateOutline()}
            </div>
          </div>
        )}

        {/* Slides container */}
        <div className="relative w-full h-full overflow-hidden rounded-2xl shadow-2xl">
          {/* Slide 1: Title */}
          <div
            className={`slide content-box px-5 py-2 rounded-2xl w-full h-full ${currentSlide === 0 ? 'active' : ''}`}
          >
            <div className="flex flex-col items-center justify-start h-full text-center">
              <h1 className="text-2xl font-bold text-indigo-700 mb-8">
                GRAMMAR FOR PRE-GRADE 7
              </h1>
              <div className="bg-yellow-400 text-2xl md:text-4xl font-bold px-6 py-3 rounded-full mb-5 shadow-lg floating">
                Present Continuous Tense
              </div>
              <div className="flex flex-col md:flex-row items-center justify-center gap-8">
                <div className="mt-6 flex justify-center">
                  <img
                    src="https://img.freepik.com/free-photo/notebook-with-grammar-word-school-suplies_23-2149436698.jpg"
                    alt="Grammar Learning"
                    className="object-cover h-52 rounded-xl floating"
                  />
                </div>
                <div className="bg-gradient-to-r from-indigo-100 to-green-200 border-l-4 border-indigo-500 py-5 px-10 text-left rounded-2xl text-2xl">
                  <p className="font-bold text-indigo-800">Mục tiêu bài học:</p>
                  <ul className="list-disc pl-5 text-gray-700 text-2xl">
                    <li>Hiểu và vận dụng thì Present Continuous</li>
                    <li>Nắm vững cấu trúc khẳng định, phủ định, nghi vấn</li>
                    <li>Biết cách sử dụng đúng thời điểm</li>
                    <li>Phân biệt Present Continuous và Present Simple</li>
                  </ul>
                </div>
              </div>
              <div className="my-3 opacity-0">---</div>
            </div>
          </div>

          {/* Add other slides here - for brevity, I'll add a few more */}
          {/* Slide 2 */}
          <div
            className={`slide content-box px-5 py-2 rounded-2xl w-full h-full ${currentSlide === 1 ? 'active' : ''}`}
          >
            <h2 className="text-2xl md:text-3xl font-bold text-indigo-700 mb-5">
              1. Thì Present Continuous là gì?
            </h2>
            <div className="bg-white p-6 rounded-xl shadow-md">
              <p className="text-2xl mb-4">
                Thì Present Continuous (Hiện tại tiếp diễn) dùng để diễn tả
                những hành động
                <span className="font-bold text-green-500">
                  đang xảy ra
                </span>{' '}
                tại thời điểm nói hoặc
                <span className="font-bold text-green-500">
                  xung quanh thời điểm nói
                </span>
                .
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                <div className="bg-blue-100 p-4 rounded-lg text-center">
                  <p className="text-2xl font-bold text-blue-800">
                    Đang xảy ra ngay lúc nói
                  </p>
                  <p className="text-2xl">"I am reading now."</p>
                </div>
                <div className="bg-red-100 p-4 rounded-lg text-center">
                  <p className="text-2xl font-bold text-red-800">
                    Xung quanh thời điểm nói
                  </p>
                  <p className="text-2xl">"I am studying English this week."</p>
                </div>
              </div>
              <div className="mt-6 bg-yellow-100 p-4 rounded-lg">
                <p className="font-bold text-yellow-800 text-2xl">
                  💡 Dấu hiệu nhận biết: now, at the moment, at present,
                  currently, this week/month/year, today, right now
                </p>
              </div>
            </div>
          </div>

          {/* Slide 3: Cấu trúc Present Continuous */}
          <div
            className={`slide content-box px-5 py-2 rounded-2xl w-full h-full text-2xl ${currentSlide === 2 ? 'active' : ''}`}
          >
            <h2 className="text-2xl md:text-3xl font-bold text-indigo-700 mb-5">
              2. Cấu trúc Present Continuous
            </h2>
            <div className="bg-white p-6 rounded-xl shadow-md">
              <p className="text-2xl mb-4">
                Cấu trúc cơ bản của thì Present Continuous:
                <span className="font-bold text-red-500">S + be + V-ing</span>
              </p>
              <div className="mt-6 bg-gradient-to-r from-blue-100 to-purple-100 p-4 rounded-lg">
                <p className="font-bold text-blue-800 text-2xl">Công thức:</p>
                <p className="text-2xl font-bold text-center mt-3 text-purple-700">
                  S + am/is/are + V-ing + (O)
                </p>
              </div>
              <div className="mt-4 space-y-4">
                <div className="verb-example">
                  <p className="text-2xl">
                    <span className="font-bold text-blue-500">I</span>
                    <span className="font-bold text-green-500">
                      am reading
                    </span>{' '}
                    a book.
                  </p>
                  <p className="text-gray-600">(Tôi đang đọc sách.)</p>
                </div>
                <div className="verb-example">
                  <p className="text-2xl">
                    <span className="font-bold text-blue-500">She</span>
                    <span className="font-bold text-green-500">
                      is cooking
                    </span>{' '}
                    dinner.
                  </p>
                  <p className="text-gray-600">(Cô ấy đang nấu bữa tối.)</p>
                </div>
                <div className="verb-example">
                  <p className="text-2xl">
                    <span className="font-bold text-blue-500">They</span>
                    <span className="font-bold text-green-500">
                      are playing
                    </span>{' '}
                    football.
                  </p>
                  <p className="text-gray-600">(Họ đang chơi bóng đá.)</p>
                </div>
              </div>
            </div>
          </div>

          {/* Slide 4: Cách thêm -ing */}
          <div
            className={`slide content-box px-5 py-2 rounded-2xl w-full h-full text-2xl ${currentSlide === 3 ? 'active' : ''}`}
          >
            <h2 className="text-2xl md:text-3xl font-bold text-indigo-700 mb-5">
              3. Cách thêm -ing vào động từ
            </h2>
            <div className="bg-white p-6 rounded-xl shadow-md">
              <p className="text-2xl mb-4">
                Để tạo thì Present Continuous, ta cần thêm
                <span className="font-bold text-red-500">-ing</span> vào động
                từ. Có một số quy tắc cần nhớ:
              </p>
              <div className="mt-6 space-y-4">
                <div className="bg-green-100 p-4 rounded-lg">
                  <p className="font-bold text-green-800 text-2xl">
                    1. Động từ thường: thêm -ing
                  </p>
                  <p className="text-2xl">
                    play → playing, read → reading, work → working
                  </p>
                </div>
                <div className="bg-blue-100 p-4 rounded-lg">
                  <p className="font-bold text-blue-800 text-2xl">
                    2. Động từ kết thúc bằng -e: bỏ -e, thêm -ing
                  </p>
                  <p className="text-2xl">
                    write → writing, dance → dancing, make → making
                  </p>
                </div>
                <div className="bg-yellow-100 p-4 rounded-lg">
                  <p className="font-bold text-yellow-800 text-2xl">
                    3. Động từ 1 âm tiết, kết thúc bằng phụ âm-nguyên âm-phụ âm:
                    gấp đôi phụ âm cuối
                  </p>
                  <p className="text-2xl">
                    run → running, sit → sitting, swim → swimming
                  </p>
                </div>
                <div className="bg-red-100 p-4 rounded-lg">
                  <p className="font-bold text-red-800 text-2xl">
                    4. Động từ kết thúc bằng -ie: đổi thành -y
                  </p>
                  <p className="text-2xl">
                    lie → lying, die → dying, tie → tying
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Slide 5: Bài tập thêm -ing */}
          <div
            className={`slide content-box px-5 py-2 rounded-2xl w-full h-full ${currentSlide === 4 ? 'active' : ''}`}
          >
            <h2 className="text-2xl md:text-3xl font-bold text-indigo-700 mb-5">
              Bài tập 1: Thêm -ing vào động từ
            </h2>
            <p className="text-2xl mb-8">
              Chuyển các động từ sau sang dạng -ing:
            </p>
            <div className="grid grid-cols-1 gap-4">
              <div className="exercise-item bg-white p-4 rounded-xl shadow-md">
                <p className="text-2xl mb-4">
                  write →
                  <input
                    type="text"
                    className="exercise-input"
                    value={exerciseStates['write']?.inputValue || ''}
                    onChange={(e) =>
                      handleExerciseInputChange('write', e.target.value)
                    }
                  />
                  (viết)
                </p>
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => checkInput('write', 'writing')}
                    className="btn-check px-4 py-2 rounded-lg font-bold"
                  >
                    Kiểm tra
                  </button>
                  <div
                    className={`answer ${exerciseStates['write']?.checked ? '' : 'hidden'} text-2xl`}
                  >
                    {exerciseStates['write']?.correct ? (
                      <p className="correct">✓ Đúng: writing</p>
                    ) : (
                      <p className="incorrect">
                        ✗ Sai: Đáp án đúng là "writing" (Bạn điền: "
                        {exerciseStates['write']?.inputValue?.trim() || 'trống'}
                        ")
                      </p>
                    )}
                  </div>
                </div>
              </div>
              <div className="exercise-item bg-white p-4 rounded-xl shadow-md">
                <p className="text-2xl mb-4">
                  run →
                  <input
                    type="text"
                    className="exercise-input"
                    value={exerciseStates['run']?.inputValue || ''}
                    onChange={(e) =>
                      handleExerciseInputChange('run', e.target.value)
                    }
                  />
                  (chạy)
                </p>
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => checkInput('run', 'running')}
                    className="btn-check px-4 py-2 rounded-lg font-bold"
                  >
                    Kiểm tra
                  </button>
                  <div
                    className={`answer ${exerciseStates['run']?.checked ? '' : 'hidden'} text-2xl`}
                  >
                    {exerciseStates['run']?.correct ? (
                      <p className="correct">✓ Đúng: running</p>
                    ) : (
                      <p className="incorrect">
                        ✗ Sai: Đáp án đúng là "running" (Bạn điền: "
                        {exerciseStates['run']?.inputValue?.trim() || 'trống'}")
                      </p>
                    )}
                  </div>
                </div>
              </div>
              <div className="exercise-item bg-white p-4 rounded-xl shadow-md">
                <p className="text-2xl mb-4">
                  lie →
                  <input
                    type="text"
                    className="exercise-input"
                    value={exerciseStates['lie']?.inputValue || ''}
                    onChange={(e) =>
                      handleExerciseInputChange('lie', e.target.value)
                    }
                  />
                  (nằm)
                </p>
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => checkInput('lie', 'lying')}
                    className="btn-check px-4 py-2 rounded-lg font-bold"
                  >
                    Kiểm tra
                  </button>
                  <div
                    className={`answer ${exerciseStates['lie']?.checked ? '' : 'hidden'} text-2xl`}
                  >
                    {exerciseStates['lie']?.correct ? (
                      <p className="correct">✓ Đúng: lying</p>
                    ) : (
                      <p className="incorrect">
                        ✗ Sai: Đáp án đúng là "lying" (Bạn điền: "
                        {exerciseStates['lie']?.inputValue?.trim() || 'trống'}")
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Slide 6: Câu khẳng định Present Continuous */}
          <div
            className={`slide content-box px-5 py-2 rounded-2xl w-full h-full ${currentSlide === 5 ? 'active' : ''}`}
          >
            <h2 className="text-2xl md:text-3xl font-bold text-indigo-700 mb-5">
              4. Câu khẳng định Present Continuous
            </h2>
            <div className="bg-white p-6 rounded-xl shadow-md">
              <p className="text-2xl mb-4">
                Câu khẳng định dùng để diễn tả hành động đang xảy ra. Ta sử dụng
                <span className="font-bold text-red-500">
                  am/is/are + V-ing
                </span>
                .
              </p>
              <table className="w-full mt-3 text-center bg-white rounded-lg overflow-hidden text-2xl">
                <thead className="bg-indigo-200">
                  <tr>
                    <th className="p-2">Chủ ngữ</th>
                    <th className="p-2">Be + V-ing</th>
                    <th className="p-2">Ví dụ</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b">
                    <td className="p-2">I</td>
                    <td className="p-2 font-bold text-red-500">am + V-ing</td>
                    <td className="p-2">I am studying.</td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-2">He, She, It</td>
                    <td className="p-2 font-bold text-red-500">is + V-ing</td>
                    <td className="p-2">She is cooking.</td>
                  </tr>
                  <tr>
                    <td className="p-2">You, We, They</td>
                    <td className="p-2 font-bold text-red-500">are + V-ing</td>
                    <td className="p-2">They are playing.</td>
                  </tr>
                </tbody>
              </table>
              <div className="mt-4 space-y-2">
                <p className="text-2xl">
                  Ví dụ: I <span className="highlight">am reading</span> a book
                  now.
                </p>
                <p className="text-2xl">
                  Ví dụ: He <span className="highlight">is working</span> at the
                  moment.
                </p>
                <p className="text-2xl">
                  Ví dụ: We <span className="highlight">are learning</span>{' '}
                  English this week.
                </p>
              </div>
            </div>
          </div>

          {/* Slide 7: Câu phủ định Present Continuous */}
          <div
            className={`slide content-box px-5 py-2 rounded-2xl w-full h-full ${currentSlide === 6 ? 'active' : ''}`}
          >
            <h2 className="text-2xl md:text-3xl font-bold text-indigo-700 mb-5">
              5. Câu phủ định Present Continuous
            </h2>
            <div className="bg-white p-6 rounded-xl shadow-md">
              <p className="text-2xl mb-4">
                Để tạo câu phủ định, ta thêm
                <span className="font-bold text-red-500">"not"</span> sau động
                từ
                <span className="font-bold text-red-500">be</span>.
              </p>
              <div className="mt-6 bg-gradient-to-r from-red-100 to-orange-100 p-4 rounded-lg">
                <p className="font-bold text-red-800 text-2xl">Công thức:</p>
                <p className="text-2xl font-bold text-center mt-3 text-purple-700">
                  S + am/is/are + not + V-ing + (O)
                </p>
                <p className="text-2xl font-bold text-center mt-2">
                  Viết tắt: am not, isn't (is not), aren't (are not)
                </p>
              </div>
              <div className="mt-4 space-y-2">
                <p className="text-2xl">
                  Ví dụ: I <span className="highlight">am not watching</span> TV
                  now. (I'm not watching TV now.)
                </p>
                <p className="text-2xl">
                  Ví dụ: He <span className="highlight">is not sleeping</span>.
                  (He <span className="highlight">isn't sleeping</span>.)
                </p>
                <p className="text-2xl">
                  Ví dụ: They <span className="highlight">are not playing</span>{' '}
                  games. (They <span className="highlight">aren't playing</span>{' '}
                  games.)
                </p>
              </div>
            </div>
          </div>

          {/* Slide 8: Bài tập câu phủ định Present Continuous */}
          <div
            className={`slide content-box px-5 py-2 rounded-2xl w-full h-full ${currentSlide === 7 ? 'active' : ''}`}
          >
            <h2 className="text-2xl md:text-3xl font-bold text-indigo-700 mb-5">
              Bài tập 2: Chuyển sang câu phủ định
            </h2>
            <p className="text-2xl mb-8">
              Chuyển các câu sau sang dạng phủ định:
            </p>
            <div className="grid grid-cols-1 gap-4">
              <div className="exercise-item bg-white p-4 rounded-xl shadow-md">
                <p className="text-2xl mb-4">
                  I am studying English. → I
                  <input
                    type="text"
                    className="exercise-input"
                    value={exerciseStates['neg1']?.inputValue || ''}
                    onChange={(e) =>
                      handleExerciseInputChange('neg1', e.target.value)
                    }
                  />
                  .
                </p>
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() =>
                      checkInput('neg1', 'am not studying English')
                    }
                    className="btn-check px-4 py-2 rounded-lg font-bold"
                  >
                    Kiểm tra
                  </button>
                  <div
                    className={`answer ${exerciseStates['neg1']?.checked ? '' : 'hidden'} text-2xl`}
                  >
                    {exerciseStates['neg1']?.correct ? (
                      <p className="correct">✓ Đúng: am not studying English</p>
                    ) : (
                      <p className="incorrect">
                        ✗ Sai: Đáp án đúng là "am not studying English" (Bạn
                        điền: "
                        {exerciseStates['neg1']?.inputValue?.trim() || 'trống'}
                        ")
                      </p>
                    )}
                  </div>
                </div>
              </div>
              <div className="exercise-item bg-white p-4 rounded-xl shadow-md">
                <p className="text-2xl mb-4">
                  She is cooking dinner. → She
                  <input
                    type="text"
                    className="exercise-input"
                    value={exerciseStates['neg2']?.inputValue || ''}
                    onChange={(e) =>
                      handleExerciseInputChange('neg2', e.target.value)
                    }
                  />
                  .
                </p>
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => checkInput('neg2', "isn't cooking dinner")}
                    className="btn-check px-4 py-2 rounded-lg font-bold"
                  >
                    Kiểm tra
                  </button>
                  <div
                    className={`answer ${exerciseStates['neg2']?.checked ? '' : 'hidden'} text-2xl`}
                  >
                    {exerciseStates['neg2']?.correct ? (
                      <p className="correct">✓ Đúng: isn't cooking dinner</p>
                    ) : (
                      <p className="incorrect">
                        ✗ Sai: Đáp án đúng là "isn't cooking dinner" (Bạn điền:
                        "{exerciseStates['neg2']?.inputValue?.trim() || 'trống'}
                        ")
                      </p>
                    )}
                  </div>
                </div>
              </div>
              <div className="exercise-item bg-white p-4 rounded-xl shadow-md">
                <p className="text-2xl mb-4">
                  They are playing football. → They
                  <input
                    type="text"
                    className="exercise-input"
                    value={exerciseStates['neg3']?.inputValue || ''}
                    onChange={(e) =>
                      handleExerciseInputChange('neg3', e.target.value)
                    }
                  />
                  .
                </p>
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() =>
                      checkInput('neg3', "aren't playing football")
                    }
                    className="btn-check px-4 py-2 rounded-lg font-bold"
                  >
                    Kiểm tra
                  </button>
                  <div
                    className={`answer ${exerciseStates['neg3']?.checked ? '' : 'hidden'} text-2xl`}
                  >
                    {exerciseStates['neg3']?.correct ? (
                      <p className="correct">✓ Đúng: aren't playing football</p>
                    ) : (
                      <p className="incorrect">
                        ✗ Sai: Đáp án đúng là "aren't playing football" (Bạn
                        điền: "
                        {exerciseStates['neg3']?.inputValue?.trim() || 'trống'}
                        ")
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Slide 9: Câu hỏi Yes/No Present Continuous */}
          <div
            className={`slide content-box px-5 py-2 rounded-2xl w-full h-full ${currentSlide === 8 ? 'active' : ''}`}
          >
            <h2 className="text-2xl md:text-3xl font-bold text-indigo-700 mb-5">
              6. Câu hỏi Yes/No Present Continuous
            </h2>
            <div className="bg-white p-6 rounded-xl shadow-md">
              <p className="text-2xl mb-4">
                Để đặt câu hỏi Yes/No, ta đảo động từ
                <span className="font-bold text-red-500">be</span> lên đầu câu.
              </p>
              <div className="mt-6 bg-gradient-to-r from-blue-100 to-purple-100 p-4 rounded-lg">
                <p className="font-bold text-blue-800 text-2xl">Công thức:</p>
                <p className="text-2xl font-bold text-center mt-3 text-purple-700">
                  Am/Is/Are + S + V-ing + (O)?
                </p>
                <p className="text-2xl font-bold text-center mt-2">
                  Cách trả lời ngắn:
                </p>
                <ul className="list-disc pl-8 text-2xl">
                  <li>Yes, S + am/is/are.</li>
                  <li>No, S + am not/isn't/aren't.</li>
                </ul>
              </div>
              <div className="mt-4 space-y-2">
                <p className="text-2xl">
                  Ví dụ: <span className="highlight">Are</span> you
                  <span className="highlight">studying</span> now? - Yes, I am.
                  / No, I'm not.
                </p>
                <p className="text-2xl">
                  Ví dụ: <span className="highlight">Is</span> she
                  <span className="highlight">cooking</span> dinner? - Yes, she
                  is. / No, she isn't.
                </p>
                <p className="text-2xl">
                  Ví dụ: <span className="highlight">Are</span> they
                  <span className="highlight">playing</span> games? - Yes, they
                  are. / No, they aren't.
                </p>
              </div>
            </div>
          </div>

          {/* Slide 10: Bài tập câu hỏi Yes/No Present Continuous */}
          <div
            className={`slide content-box px-5 py-2 rounded-2xl w-full h-full ${currentSlide === 9 ? 'active' : ''}`}
          >
            <h2 className="text-2xl md:text-3xl font-bold text-indigo-700 mb-5">
              Bài tập 3: Đặt câu hỏi Yes/No
            </h2>
            <p className="text-2xl mb-8">Đặt câu hỏi Yes/No cho các câu sau:</p>
            <div className="grid grid-cols-1 gap-4">
              <div className="exercise-item bg-white p-4 rounded-xl shadow-md">
                <p className="text-2xl mb-4">
                  They are playing soccer. →
                  <input
                    type="text"
                    className="exercise-input"
                    value={exerciseStates['yn1']?.inputValue || ''}
                    onChange={(e) =>
                      handleExerciseInputChange('yn1', e.target.value)
                    }
                  />
                  ?
                </p>
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => checkInput('yn1', 'Are they playing soccer')}
                    className="btn-check px-4 py-2 rounded-lg font-bold"
                  >
                    Kiểm tra
                  </button>
                  <div
                    className={`answer ${exerciseStates['yn1']?.checked ? '' : 'hidden'} text-2xl`}
                  >
                    {exerciseStates['yn1']?.correct ? (
                      <p className="correct">✓ Đúng: Are they playing soccer</p>
                    ) : (
                      <p className="incorrect">
                        ✗ Sai: Đáp án đúng là "Are they playing soccer" (Bạn
                        điền: "
                        {exerciseStates['yn1']?.inputValue?.trim() || 'trống'}")
                      </p>
                    )}
                  </div>
                </div>
              </div>
              <div className="exercise-item bg-white p-4 rounded-xl shadow-md">
                <p className="text-2xl mb-4">
                  He is working in a hospital. →
                  <input
                    type="text"
                    className="exercise-input"
                    value={exerciseStates['yn2']?.inputValue || ''}
                    onChange={(e) =>
                      handleExerciseInputChange('yn2', e.target.value)
                    }
                  />
                  ?
                </p>
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() =>
                      checkInput('yn2', 'Is he working in a hospital')
                    }
                    className="btn-check px-4 py-2 rounded-lg font-bold"
                  >
                    Kiểm tra
                  </button>
                  <div
                    className={`answer ${exerciseStates['yn2']?.checked ? '' : 'hidden'} text-2xl`}
                  >
                    {exerciseStates['yn2']?.correct ? (
                      <p className="correct">
                        ✓ Đúng: Is he working in a hospital
                      </p>
                    ) : (
                      <p className="incorrect">
                        ✗ Sai: Đáp án đúng là "Is he working in a hospital" (Bạn
                        điền: "
                        {exerciseStates['yn2']?.inputValue?.trim() || 'trống'}")
                      </p>
                    )}
                  </div>
                </div>
              </div>
              <div className="exercise-item bg-white p-4 rounded-xl shadow-md">
                <p className="text-2xl mb-4">
                  I am reading a book. →
                  <input
                    type="text"
                    className="exercise-input"
                    value={exerciseStates['yn3']?.inputValue || ''}
                    onChange={(e) =>
                      handleExerciseInputChange('yn3', e.target.value)
                    }
                  />
                  ?
                </p>
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => checkInput('yn3', 'Are you reading a book')}
                    className="btn-check px-4 py-2 rounded-lg font-bold"
                  >
                    Kiểm tra
                  </button>
                  <div
                    className={`answer ${exerciseStates['yn3']?.checked ? '' : 'hidden'} text-2xl`}
                  >
                    {exerciseStates['yn3']?.correct ? (
                      <p className="correct">✓ Đúng: Are you reading a book</p>
                    ) : (
                      <p className="incorrect">
                        ✗ Sai: Đáp án đúng là "Are you reading a book" (Bạn
                        điền: "
                        {exerciseStates['yn3']?.inputValue?.trim() || 'trống'}")
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Slide 11: Câu hỏi WH- Present Continuous */}
          <div
            className={`slide content-box px-5 py-2 rounded-2xl w-full h-full ${currentSlide === 10 ? 'active' : ''}`}
          >
            <h2 className="text-2xl md:text-3xl font-bold text-indigo-700 mb-5">
              7. Câu hỏi WH- Present Continuous
            </h2>
            <div className="bg-white p-6 rounded-xl shadow-md">
              <p className="text-2xl mb-4">
                Câu hỏi WH- dùng để hỏi thông tin cụ thể. Ta thêm từ để hỏi
                (WH-word) vào đầu câu hỏi Yes/No.
              </p>
              <div className="mt-6 bg-gradient-to-r from-orange-100 to-red-100 p-4 rounded-lg">
                <p className="font-bold text-orange-800 text-2xl">Công thức:</p>
                <p className="text-2xl font-bold text-center mt-3 text-purple-700">
                  WH-word + am/is/are + S + V-ing?
                </p>
              </div>
              <div className="mt-4 space-y-2">
                <p className="text-2xl">
                  Ví dụ: <span className="highlight">What</span> are you doing
                  now?
                </p>
                <p className="text-2xl">
                  Ví dụ: <span className="highlight">Where</span> is she going?
                </p>
                <p className="text-2xl">
                  Ví dụ: <span className="highlight">Why</span> are they crying?
                </p>
                <p className="text-2xl">
                  Ví dụ: <span className="highlight">How</span> is he feeling
                  today?
                </p>
              </div>
              <div className="mt-4 bg-blue-100 p-4 rounded-lg">
                <p className="font-bold text-blue-800 text-2xl">
                  💡 Các từ để hỏi thường dùng: What, Where, When, Why, How,
                  Who, Which
                </p>
              </div>
            </div>
          </div>

          {/* Slide 12: Bài tập câu hỏi WH- Present Continuous */}
          <div
            className={`slide content-box px-5 py-2 rounded-2xl w-full h-full ${currentSlide === 11 ? 'active' : ''}`}
          >
            <h2 className="text-2xl md:text-3xl font-bold text-indigo-700 mb-5">
              Bài tập 4: Đặt câu hỏi WH-
            </h2>
            <p className="text-2xl mb-8">Đặt câu hỏi cho phần gạch chân:</p>
            <div className="grid grid-cols-1 gap-4">
              <div className="exercise-item bg-white p-4 rounded-xl shadow-md">
                <p className="text-2xl mb-2">
                  They are playing <span className="highlight">football</span>.
                </p>
                <input
                  type="text"
                  className="exercise-input w-full"
                  value={exerciseStates['wh1']?.inputValue || ''}
                  onChange={(e) =>
                    handleExerciseInputChange('wh1', e.target.value)
                  }
                  placeholder="Đặt câu hỏi"
                />
                <div className="flex items-center space-x-4 mt-4">
                  <button
                    onClick={() => checkInput('wh1', 'What are they playing')}
                    className="btn-check px-4 py-2 rounded-lg font-bold"
                  >
                    Kiểm tra
                  </button>
                  <div
                    className={`answer ${exerciseStates['wh1']?.checked ? '' : 'hidden'} text-2xl`}
                  >
                    {exerciseStates['wh1']?.correct ? (
                      <p className="correct">✓ Đúng: What are they playing</p>
                    ) : (
                      <p className="incorrect">
                        ✗ Sai: Đáp án đúng là "What are they playing" (Bạn điền:
                        "{exerciseStates['wh1']?.inputValue?.trim() || 'trống'}
                        ")
                      </p>
                    )}
                  </div>
                </div>
              </div>
              <div className="exercise-item bg-white p-4 rounded-xl shadow-md">
                <p className="text-2xl mb-2">
                  She is going <span className="highlight">to school</span>.
                </p>
                <input
                  type="text"
                  className="exercise-input w-full"
                  value={exerciseStates['wh2']?.inputValue || ''}
                  onChange={(e) =>
                    handleExerciseInputChange('wh2', e.target.value)
                  }
                  placeholder="Đặt câu hỏi"
                />
                <div className="flex items-center space-x-4 mt-4">
                  <button
                    onClick={() => checkInput('wh2', 'Where is she going')}
                    className="btn-check px-4 py-2 rounded-lg font-bold"
                  >
                    Kiểm tra
                  </button>
                  <div
                    className={`answer ${exerciseStates['wh2']?.checked ? '' : 'hidden'} text-2xl`}
                  >
                    {exerciseStates['wh2']?.correct ? (
                      <p className="correct">✓ Đúng: Where is she going</p>
                    ) : (
                      <p className="incorrect">
                        ✗ Sai: Đáp án đúng là "Where is she going" (Bạn điền: "
                        {exerciseStates['wh2']?.inputValue?.trim() || 'trống'}")
                      </p>
                    )}
                  </div>
                </div>
              </div>
              <div className="exercise-item bg-white p-4 rounded-xl shadow-md">
                <p className="text-2xl mb-2">
                  He is crying{' '}
                  <span className="highlight">because he is sad</span>.
                </p>
                <input
                  type="text"
                  className="exercise-input w-full"
                  value={exerciseStates['wh3']?.inputValue || ''}
                  onChange={(e) =>
                    handleExerciseInputChange('wh3', e.target.value)
                  }
                  placeholder="Đặt câu hỏi"
                />
                <div className="flex items-center space-x-4 mt-4">
                  <button
                    onClick={() => checkInput('wh3', 'Why is he crying')}
                    className="btn-check px-4 py-2 rounded-lg font-bold"
                  >
                    Kiểm tra
                  </button>
                  <div
                    className={`answer ${exerciseStates['wh3']?.checked ? '' : 'hidden'} text-2xl`}
                  >
                    {exerciseStates['wh3']?.correct ? (
                      <p className="correct">✓ Đúng: Why is he crying</p>
                    ) : (
                      <p className="incorrect">
                        ✗ Sai: Đáp án đúng là "Why is he crying" (Bạn điền: "
                        {exerciseStates['wh3']?.inputValue?.trim() || 'trống'}")
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Slide 13: So sánh Present Continuous và Present Simple */}
          <div
            className={`slide content-box px-5 py-2 rounded-2xl w-full h-full ${currentSlide === 12 ? 'active' : ''}`}
          >
            <h2 className="text-2xl md:text-3xl font-bold text-indigo-700 mb-5">
              8. So sánh Present Continuous và Present Simple
            </h2>
            <div className="bg-white p-6 rounded-xl shadow-md">
              <p className="text-2xl mb-4">
                Hai thì này có cách sử dụng khác nhau. Hãy so sánh:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                <div className="bg-blue-100 p-4 rounded-lg">
                  <h3 className="font-bold text-blue-800 text-2xl mb-3">
                    Present Simple
                  </h3>
                  <ul className="list-disc pl-5 space-y-2 text-2xl">
                    <li>Hành động thường xuyên, lặp lại</li>
                    <li>Thói quen, sở thích</li>
                    <li>Sự thật hiển nhiên</li>
                    <li>Lịch trình, thời gian biểu</li>
                  </ul>
                  <div className="mt-3 p-3 bg-white rounded">
                    <p className="text-2xl font-bold">Ví dụ:</p>
                    <p className="text-2xl">I play football every Sunday.</p>
                    <p className="text-2xl">She likes coffee.</p>
                    <p className="text-2xl">The sun rises in the east.</p>
                  </div>
                </div>
                <div className="bg-green-100 p-4 rounded-lg">
                  <h3 className="font-bold text-green-800 text-2xl mb-3">
                    Present Continuous
                  </h3>
                  <ul className="list-disc pl-5 space-y-2 text-2xl">
                    <li>Hành động đang xảy ra ngay lúc nói</li>
                    <li>Hành động tạm thời</li>
                    <li>Kế hoạch đã sắp xếp</li>
                    <li>Hành động đang diễn ra xung quanh thời điểm nói</li>
                  </ul>
                  <div className="mt-3 p-3 bg-white rounded">
                    <p className="text-2xl font-bold">Ví dụ:</p>
                    <p className="text-2xl">I am playing football now.</p>
                    <p className="text-2xl">She is drinking coffee.</p>
                    <p className="text-2xl">We are having a party tonight.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Slide 14: Bài tập so sánh hai thì */}
          <div
            className={`slide content-box px-5 py-2 rounded-2xl w-full h-full ${currentSlide === 13 ? 'active' : ''}`}
          >
            <h2 className="text-2xl md:text-3xl font-bold text-indigo-700 mb-5">
              Bài tập 5: Chọn thì đúng
            </h2>
            <p className="text-2xl mb-8">
              Chọn thì Present Simple hoặc Present Continuous phù hợp:
            </p>
            <div className="grid grid-cols-1 gap-4">
              <div className="exercise-item bg-white p-4 rounded-xl shadow-md">
                <p className="text-2xl mb-4">
                  Look! The children ___ in the garden.
                </p>
                <div className="grid grid-cols-2 gap-2 text-2xl">
                  <button
                    onClick={() => checkMCQ('mcq1', 'are playing', 'play')}
                    className="bg-gray-200 px-4 py-2 rounded-lg font-bold"
                  >
                    play
                  </button>
                  <button
                    onClick={() =>
                      checkMCQ('mcq1', 'are playing', 'are playing')
                    }
                    className="bg-gray-200 px-4 py-2 rounded-lg font-bold"
                  >
                    are playing
                  </button>
                </div>
                <div
                  className={`answer ${exerciseStates['mcq1']?.checked ? '' : 'hidden'} text-2xl mt-2`}
                >
                  {exerciseStates['mcq1']?.correct ? (
                    <p className="correct">✓ Chính xác!</p>
                  ) : (
                    <p className="incorrect">
                      ✗ Sai rồi! Đáp án đúng là:{' '}
                      <span className="font-bold">are playing</span>
                    </p>
                  )}
                </div>
              </div>
              <div className="exercise-item bg-white p-4 rounded-xl shadow-md">
                <p className="text-2xl mb-4">
                  She usually ___ to school by bus.
                </p>
                <div className="grid grid-cols-2 gap-2 text-2xl">
                  <button
                    onClick={() => checkMCQ('mcq2', 'goes', 'goes')}
                    className="bg-gray-200 px-4 py-2 rounded-lg font-bold"
                  >
                    goes
                  </button>
                  <button
                    onClick={() => checkMCQ('mcq2', 'goes', 'is going')}
                    className="bg-gray-200 px-4 py-2 rounded-lg font-bold"
                  >
                    is going
                  </button>
                </div>
                <div
                  className={`answer ${exerciseStates['mcq2']?.checked ? '' : 'hidden'} text-2xl mt-2`}
                >
                  {exerciseStates['mcq2']?.correct ? (
                    <p className="correct">✓ Chính xác!</p>
                  ) : (
                    <p className="incorrect">
                      ✗ Sai rồi! Đáp án đúng là:{' '}
                      <span className="font-bold">goes</span>
                    </p>
                  )}
                </div>
              </div>
              <div className="exercise-item bg-white p-4 rounded-xl shadow-md">
                <p className="text-2xl mb-4">I ___ English every day.</p>
                <div className="grid grid-cols-2 gap-2 text-2xl">
                  <button
                    onClick={() => checkMCQ('mcq3', 'study', 'study')}
                    className="bg-gray-200 px-4 py-2 rounded-lg font-bold"
                  >
                    study
                  </button>
                  <button
                    onClick={() => checkMCQ('mcq3', 'study', 'am studying')}
                    className="bg-gray-200 px-4 py-2 rounded-lg font-bold"
                  >
                    am studying
                  </button>
                </div>
                <div
                  className={`answer ${exerciseStates['mcq3']?.checked ? '' : 'hidden'} text-2xl mt-2`}
                >
                  {exerciseStates['mcq3']?.correct ? (
                    <p className="correct">✓ Chính xác!</p>
                  ) : (
                    <p className="incorrect">
                      ✗ Sai rồi! Đáp án đúng là:{' '}
                      <span className="font-bold">study</span>
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Slide 15: Tổng kết */}
          <div
            className={`slide content-box px-5 py-2 rounded-2xl w-full h-full ${currentSlide === 14 ? 'active' : ''}`}
          >
            <div className="flex flex-col items-center justify-start h-full">
              <h2 className="text-2xl md:text-3xl font-bold text-indigo-700 mb-5">
                Tổng kết bài học
              </h2>
              <div className="w-full bg-white p-6 rounded-xl shadow-md">
                <div className="bg-blue-50 p-4 rounded-lg mb-6">
                  <p className="text-2xl font-bold text-blue-800 text-center">
                    Kiến thức trọng tâm
                  </p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg mb-4">
                  <p className="text-2xl font-bold text-green-800">
                    1. Cấu trúc Present Continuous
                  </p>
                  <ul className="list-disc pl-6 mt-2 space-y-2">
                    <li>
                      <span className="highlight">Khẳng định:</span> S +
                      am/is/are + V-ing + (O)
                    </li>
                    <li>
                      <span className="highlight">Phủ định:</span> S + am/is/are
                      + not + V-ing + (O)
                    </li>
                    <li>
                      <span className="highlight">Yes/No Question:</span>{' '}
                      Am/Is/Are + S + V-ing + (O)?
                    </li>
                    <li>
                      <span className="highlight">WH- Question:</span> WH-word +
                      am/is/are + S + V-ing?
                    </li>
                  </ul>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg mb-4">
                  <p className="text-2xl font-bold text-purple-800">
                    2. Cách sử dụng
                  </p>
                  <ul className="list-disc pl-6 mt-2 space-y-2">
                    <li>Hành động đang xảy ra ngay lúc nói</li>
                    <li>Hành động tạm thời xung quanh thời điểm nói</li>
                    <li>Kế hoạch đã sắp xếp trong tương lai gần</li>
                    <li>
                      Hành động đang diễn ra trong khoảng thời gian hiện tại
                    </li>
                  </ul>
                </div>
                <div className="bg-yellow-50 p-4 rounded-lg">
                  <p className="text-2xl font-bold text-yellow-800">
                    3. Dấu hiệu nhận biết
                  </p>
                  <p className="text-2xl">
                    now, at the moment, at present, currently, this
                    week/month/year, today, right now, look!, listen!
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Slide 16: Kết thúc */}
          <div
            className={`slide content-box px-5 py-2 rounded-2xl w-full h-full ${currentSlide === 15 ? 'active' : ''}`}
          >
            <div className="flex flex-col items-center justify-start h-full text-center">
              <h1 className="text-2xl font-bold text-indigo-700 mb-3">
                Chúc mừng!
              </h1>
              <div className="text-2xl md:text-3xl text-gray-700 mb-3">
                <p className="mb-4">Bạn đã hoàn thành bài học về</p>
                <div className="bg-gradient-to-r from-yellow-400 to-red-500 text-white text-4xl font-bold px-6 py-2 rounded-full inline-block">
                  PRESENT CONTINUOUS TENSE
                </div>
              </div>
              <div className="flex justify-center mb-3">
                <img
                  src="https://t3.ftcdn.net/jpg/04/09/09/92/360_F_409099227_cinbeFsXrOrLKZkFzAUYnXRppExHtbXL.jpg"
                  className="h-32 rounded-xl object-cover"
                  alt="Celebration Image"
                />
              </div>
              <div className="bg-gradient-to-r from-green-400 to-blue-500 text-white p-6 rounded-xl max-w-xl">
                <p className="text-2xl md:text-2xl font-bold mb-2">
                  Bây giờ bạn đã biết cách sử dụng thì Present Continuous!
                </p>
                <p className="text-xl">Hẹn gặp lại trong bài học tiếp theo!</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Presentation
