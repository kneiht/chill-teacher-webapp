import { useState } from 'react'
import vocabData from './assets/vocab.json'

// Router
import { createFileRoute, Link } from '@tanstack/react-router'

// Components
import AnagramGame from '@/lib/components/games/AnagramGame'
import PresentationShell from '@/lib/components/presentation/PresentationShell'
import Slide from '@/lib/components/presentation/Slide'

// Assets
import bg from './assets/bg.png'

const LessonHomepageSlide: React.FC<{ isActive: boolean }> = ({ isActive }) => {
  const [showAnagramGame, setShowAnagramGame] = useState(false)

  return (
    <Slide isActive={isActive}>
      <div className="flex flex-col items-center justify-start h-full text-center">
        <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 mb-12 mt-12 text-center leading-tight">
          Unit 1: Art Class
          <br />
          Lesson 1: School Supplies
        </h1>
        <div className="grid grid-cols-3 gap-8">
          <Link
            to="/lessons/everybody-up-0/unit-1/lesson-1/presentation-lesson"
            className="font-bold py-6 px-10 rounded-xl text-3xl transition-transform transform hover:scale-105"
          >
            Bài giảng
          </Link>
          <Link
            to="/lessons/everybody-up-0/unit-1/lesson-1/youtube-lesson"
            className="font-bold py-6 px-10 rounded-xl text-3xl transition-transform transform hover:scale-105"
          >
            Video bài giảng
          </Link>
          <Link
            to="/lessons/everybody-up-0/unit-1/lesson-1/flashcards"
            className="font-bold py-6 px-10 rounded-xl text-3xl transition-transform transform hover:scale-105"
          >
            Flashcards
          </Link>

          <Link
            to="/lessons/everybody-up-0/unit-1/lesson-1/matching-game"
            className="font-bold py-6 px-10 rounded-xl text-3xl transition-transform transform hover:scale-105"
          >
            Matching Game
          </Link>
          <Link
            to="/lessons/everybody-up-0/unit-1/lesson-1/multiple-choice-en-vi-game"
            className="font-bold py-6 px-10 rounded-xl text-3xl transition-transform transform hover:scale-105"
          >
            Multiple Choice En→Vi
          </Link>
          <Link
            to="/lessons/everybody-up-0/unit-1/lesson-1/multiple-choice-vi-en-game"
            className="font-bold py-6 px-10 rounded-xl text-3xl transition-transform transform hover:scale-105"
          >
            Multiple Choice Vi→En
          </Link>
          <Link
            to="/lessons/everybody-up-0/unit-1/lesson-1/memory-game"
            className="font-bold py-6 px-10 rounded-xl text-3xl transition-transform transform hover:scale-105"
          >
            Memory Game
          </Link>
          <Link
            to="/lessons/everybody-up-0/unit-1/lesson-1/image-reveal-choice-game"
            className="font-bold py-6 px-10 rounded-xl text-3xl transition-transform transform hover:scale-105"
          >
            Image Reveal
          </Link>
          <Link
            to="/lessons/everybody-up-0/unit-1/lesson-1/listening-typing-en-game"
            className="font-bold py-6 px-10 rounded-xl text-3xl transition-transform transform hover:scale-105"
          >
            Listening & Typing
          </Link>
          <Link
            to="/lessons/everybody-up-0/unit-1/lesson-1/picture-choice-en-game"
            className="font-bold py-6 px-10 rounded-xl text-3xl transition-transform transform hover:scale-105"
          >
            Picture Choice
          </Link>
          <Link
            to="/lessons/everybody-up-0/unit-1/lesson-1/picture-typing-en-game"
            className="font-bold py-6 px-10 rounded-xl text-3xl transition-transform transform hover:scale-105"
          >
            Picture Typing
          </Link>
          <Link
            to="/lessons/everybody-up-0/unit-1/lesson-1/unjumble-game"
            className="font-bold py-6 px-10 rounded-xl text-3xl transition-transform transform hover:scale-105"
          >
            Unjumble Game
          </Link>
          {/* Nút để test game */}
          <button
            onClick={() => setShowAnagramGame(true)}
            className="font-bold py-6 px-10 rounded-xl text-3xl transition-transform transform hover:scale-105 bg-yellow-400 text-yellow-900"
          >
            Test Anagram Game
          </button>
        </div>
      </div>

      {/* Modal/Overlay để hiển thị game khi test */}
      {showAnagramGame && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex flex-col items-center justify-center">
          <div className="relative w-full h-full">
            <AnagramGame
              vocabData={vocabData}
              backgroundUrl={bg}
              title="Anagram Game (Test Mode)"
            />
            {/* Nút đóng game test */}
            <button
              onClick={() => setShowAnagramGame(false)}
              className="absolute top-2 right-20 z-[60] bg-red-500 text-white font-bold py-2 px-4 rounded-full hover:bg-red-600 transition-colors"
            >
              Đóng
            </button>
          </div>
        </div>
      )}
    </Slide>
  )
}

const LessonHomePage: React.FC = () => {
  const slides = [LessonHomepageSlide]
  return (
    <PresentationShell
      slides={slides}
      backgroundUrl={bg}
      showControls={false}
      showHome={false}
    />
  )
}

export const Route = createFileRoute(
  '/lessons/everybody-up-0/unit-1/lesson-1/',
)({
  component: LessonHomePage,
})
