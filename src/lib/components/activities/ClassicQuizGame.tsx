import React, { useState, useEffect, useMemo, useCallback } from 'react'
import { useVoice } from '@/lib/hooks/use-voice'
import { useSoundEffects } from '@/lib/hooks/useSoundEffects'
import {
  answerCorrect,
  answerIncorrect,
  resetGame,
} from '@/lib/stores/game.store'

// Components
import PresentationShell from '@/lib/components/presentation/PresentationShell'
import Slide from '@/lib/components/presentation/Slide'

interface VocabItem {
  word: string
  vietnameseMeaning: string
  sampleSentence?: string
  image?: string
  phonics?: string
}

type QuestionType =
  | 'multipleChoice'
  | 'listening'
  | 'fillBlank'
  | 'imageChoice'
  | 'imageToVietnamese'

interface Question {
  type: QuestionType
  question: string
  correctAnswer: string
  options?: Array<string>
  wordToSpeak?: string
  image?: string
}

interface ClassicQuizGameProps {
  vocabData: Array<VocabItem>
  questionsData: Array<Question>
  title: string
}

const ClassicQuizGameCore: React.FC<ClassicQuizGameProps> = ({
  questionsData,
  title,
}) => {
  const { play: playSound } = useSoundEffects({ volume: 0.6 })
  const { speak } = useVoice()

  // Game states
  const [isGameStarted, setIsGameStarted] = useState(false)
  const [correctCount, setCorrectCount] = useState(0)
  const [incorrectCount, setIncorrectCount] = useState(0)

  // Question states
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null)
  const [userAnswer, setUserAnswer] = useState('')
  const [selectedOption, setSelectedOption] = useState<string | null>(null)
  const [questionFeedback, setQuestionFeedback] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Animation effects states
  const [showCorrectAnimation, setShowCorrectAnimation] = useState(false)
  const [showIncorrectAnimation, setShowIncorrectAnimation] = useState(false)

  useEffect(() => {
    return () => {
      resetGame()
    }
  }, [])

  // Get random question from questionsData
  const getRandomQuestion = useCallback((): Question => {
    const randomIndex = Math.floor(Math.random() * questionsData.length)
    const question = questionsData[randomIndex]

    // Auto-speak for listening questions
    if (question.type === 'listening' && question.wordToSpeak) {
      setTimeout(() => speak(question.wordToSpeak!, 'en-US'), 500)
    }

    return question
  }, [questionsData, speak])

  // Start game
  const startGame = () => {
    playSound('start')
    setCorrectCount(0)
    setIncorrectCount(0)
    setIsGameStarted(true)
    resetGame()

    // Load first question
    const question = getRandomQuestion()
    setCurrentQuestion(question)
    setUserAnswer('')
    setSelectedOption(null)
    setQuestionFeedback('')
    setIsSubmitting(false)
  }

  // Handle question answer
  const handleSubmitAnswer = () => {
    if (!currentQuestion || isSubmitting) return

    setIsSubmitting(true)

    let isCorrect = false
    if (currentQuestion.type === 'fillBlank') {
      isCorrect =
        userAnswer.trim().toLowerCase() ===
        currentQuestion.correctAnswer.toLowerCase()
    } else {
      isCorrect = selectedOption === currentQuestion.correctAnswer
    }

    if (isCorrect) {
      playSound('correct')
      setQuestionFeedback('✅ Chính xác!')
      setCorrectCount((prev) => prev + 1)
      answerCorrect()
      setShowCorrectAnimation(true)
      setTimeout(() => setShowCorrectAnimation(false), 1500)
    } else {
      playSound('incorrect')
      setQuestionFeedback(
        `❌ Sai! Đáp án đúng: "${currentQuestion.correctAnswer}"`,
      )
      setIncorrectCount((prev) => prev + 1)
      answerIncorrect()
      setShowIncorrectAnimation(true)
      setTimeout(() => setShowIncorrectAnimation(false), 600)
    }

    setTimeout(() => {
      setQuestionFeedback('')
      // Generate new question immediately
      const newQuestion = getRandomQuestion()
      setCurrentQuestion(newQuestion)
      setUserAnswer('')
      setSelectedOption(null)
      setIsSubmitting(false)
    }, 2000)
  }

  // Replay audio for listening questions
  const replayAudio = () => {
    if (currentQuestion?.wordToSpeak) {
      speak(currentQuestion.wordToSpeak, 'en-US')
      playSound('click')
    }
  }

  return (
    <div className="h-full flex flex-col relative bg-gradient-to-br from-indigo-50 to-purple-50 p-6 rounded-3xl">
      {/* CSS Animations */}
      <style>{`
        @keyframes pulse-success {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-10px); }
          75% { transform: translateX(10px); }
        }
        @keyframes bounce-in {
          0% { transform: scale(0.3); opacity: 0; }
          50% { transform: scale(1.05); }
          70% { transform: scale(0.9); }
          100% { transform: scale(1); opacity: 1; }
        }
        .success-animation {
          animation: pulse-success 0.5s ease-in-out;
        }
        .error-animation {
          animation: shake 0.3s ease-in-out;
        }
        .bounce-enter {
          animation: bounce-in 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55);
        }
        .glow-effect {
          box-shadow: 0 0 15px rgba(99, 102, 241, 0.5);
        }
      `}</style>

      <h2 className="text-3xl font-bold text-indigo-700 text-center mb-6">
        {title}
      </h2>

      {/* Game Controls / Stats */}
      <div className="w-full mb-8 flex flex-row justify-center gap-6 items-stretch">
        {isGameStarted && (
          <>
            <div className="bg-white border-2 border-green-200 text-green-700 font-bold px-6 py-3 rounded-2xl shadow-sm text-center text-lg transform transition-transform bounce-enter flex items-center gap-2">
              <span>✅</span>
              <span>Đúng: {correctCount}</span>
            </div>
            <div className="bg-white border-2 border-red-200 text-red-700 font-bold px-6 py-3 rounded-2xl shadow-sm text-center text-lg transform transition-transform bounce-enter flex items-center gap-2">
              <span>❌</span>
              <span>Sai: {incorrectCount}</span>
            </div>
          </>
        )}
      </div>

      {/* Game Area */}
      <div className="flex-1 flex items-center justify-center w-full max-w-4xl mx-auto">
        {!isGameStarted ? (
          <div className="text-center bg-white rounded-3xl shadow-xl p-12 w-full max-w-2xl bounce-enter border border-indigo-100">
            <div className="text-8xl mb-6 animate-bounce">🎓</div>
            <h3 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 mb-6">
              Quiz Time!
            </h3>
            <p className="text-gray-600 mb-8 text-xl leading-relaxed">
              Sẵn sàng thử thách kiến thức của bạn?
              <br />
              Hãy trả lời thật nhanh và chính xác nhé!
            </p>
            <button
              onClick={startGame}
              className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold px-10 py-4 rounded-full shadow-lg transition-all duration-200 text-xl transform hover:scale-105 hover:shadow-xl"
            >
              ▶️ Bắt đầu ngay
            </button>
          </div>
        ) : (
          currentQuestion && (
            <div
              className={`bg-white rounded-3xl p-10 shadow-xl w-full border border-indigo-100 bounce-enter ${showCorrectAnimation ? 'success-animation ring-4 ring-green-200' : ''} ${showIncorrectAnimation ? 'error-animation ring-4 ring-red-200' : ''}`}
            >
              <h3 className="text-3xl font-bold text-gray-800 mb-8 text-center leading-relaxed">
                {currentQuestion.question}
              </h3>

              {currentQuestion.type === 'listening' && (
                <button
                  onClick={replayAudio}
                  className="mb-8 bg-indigo-100 hover:bg-indigo-200 text-indigo-700 font-semibold px-8 py-4 rounded-2xl mx-auto flex items-center gap-3 shadow-sm transform hover:scale-105 transition-all text-xl"
                >
                  <span>🔊</span> Nghe lại
                </button>
              )}

              {currentQuestion.type === 'fillBlank' ? (
                <div className="mb-8 max-w-xl mx-auto">
                  <input
                    type="text"
                    value={userAnswer}
                    onChange={(e) => setUserAnswer(e.target.value)}
                    onKeyDown={(e) =>
                      e.key === 'Enter' && !isSubmitting && handleSubmitAnswer()
                    }
                    disabled={isSubmitting}
                    className="w-full text-center text-3xl border-2 border-indigo-200 rounded-2xl p-6 focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 disabled:opacity-50 disabled:cursor-not-allowed shadow-inner bg-gray-50 transition-all font-medium text-indigo-900"
                    placeholder="Nhập câu trả lời..."
                    autoFocus
                  />
                </div>
              ) : (currentQuestion.type === 'imageChoice' ||
                  currentQuestion.type === 'imageToVietnamese') &&
                currentQuestion.image ? (
                <div className="flex flex-col md:flex-row gap-8 mb-8">
                  <div className="flex-1">
                    <img
                      src={currentQuestion.image}
                      alt="Question"
                      className="w-full h-80 object-cover rounded-2xl shadow-md border-2 border-indigo-100"
                    />
                  </div>
                  <div className="flex-1 flex flex-col gap-4 justify-center">
                    {currentQuestion.options?.map((option, index) => (
                      <button
                        key={index}
                        onClick={() =>
                          !isSubmitting && setSelectedOption(option)
                        }
                        disabled={isSubmitting}
                        className={`
                          border-2 rounded-xl p-5 text-xl font-semibold transition-all transform hover:scale-102 shadow-sm text-left
                          ${selectedOption === option ? 'border-indigo-600 bg-indigo-50 text-indigo-700 ring-2 ring-indigo-200' : 'border-gray-200 hover:border-indigo-300 hover:bg-gray-50 text-gray-700'}
                          ${isSubmitting ? 'cursor-not-allowed opacity-70' : ''}
                        `}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  {currentQuestion.options?.map((option, index) => (
                    <button
                      key={index}
                      onClick={() => !isSubmitting && setSelectedOption(option)}
                      disabled={isSubmitting}
                      className={`
                        border-2 rounded-xl p-6 text-xl font-semibold transition-all transform hover:scale-102 shadow-sm
                        ${selectedOption === option ? 'border-indigo-600 bg-indigo-50 text-indigo-700 ring-2 ring-indigo-200' : 'border-gray-200 hover:border-indigo-300 hover:bg-gray-50 text-gray-700'}
                        ${isSubmitting ? 'cursor-not-allowed opacity-70' : ''}
                      `}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              )}

              {questionFeedback ? (
                <div
                  className={`text-center text-2xl font-bold p-6 rounded-2xl animate-bounce ${questionFeedback.includes('✅') ? 'text-green-700 bg-green-100 border border-green-200' : 'text-red-700 bg-red-100 border border-red-200'}`}
                >
                  {questionFeedback}
                </div>
              ) : (
                <div className="flex justify-center mt-8">
                  <button
                    onClick={handleSubmitAnswer}
                    disabled={
                      (!userAnswer.trim() && !selectedOption) || isSubmitting
                    }
                    className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold px-12 py-4 rounded-full text-xl shadow-lg transform hover:scale-105 transition-all hover:shadow-xl w-full md:w-auto min-w-[200px]"
                  >
                    ✓ Xác nhận
                  </button>
                </div>
              )}
            </div>
          )
        )}
      </div>
    </div>
  )
}

interface ClassicQuizGameActivityProps {
  vocabData: Array<VocabItem>
  questionsData: Array<Question>
  backgroundUrl: string
  title: string
  onClose?: () => void
}

const ClassicQuizGame: React.FC<ClassicQuizGameActivityProps> = ({
  vocabData,
  questionsData,
  backgroundUrl,
  title,
  onClose,
}) => {
  const slides = useMemo(() => {
    const GameSlide = React.memo<{ isActive: boolean }>(({ isActive }) => (
      <Slide isActive={isActive}>
        <ClassicQuizGameCore
          vocabData={vocabData}
          questionsData={questionsData}
          title={title}
        />
      </Slide>
    ))

    return [GameSlide]
  }, [vocabData, questionsData, title])

  return (
    <PresentationShell
      slides={slides}
      backgroundUrl={backgroundUrl}
      onHomeClick={onClose}
      showNavButtons={false}
      showOutlineButton={false}
      showSlideCounter={false}
    />
  )
}

export default ClassicQuizGame
