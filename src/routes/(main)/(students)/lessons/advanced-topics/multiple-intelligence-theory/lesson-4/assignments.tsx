// Router
import { createFileRoute, useNavigate } from '@tanstack/react-router'

// Components
import PresentationShell from '@/lib/components/presentation/PresentationShell'
import Slide from '@/lib/components/presentation/Slide'

// Assets
import urls from './assets/urls.json'

const HomeworkSlide: React.FC<{ isActive: boolean }> = ({ isActive }) => (
  <Slide isActive={isActive} scrollable={true}>
    <div className="flex flex-col items-center justify-start h-full text-center p-6">
      <div className="bg-white bg-opacity-90 rounded-xl p-10 shadow-2xl w-full">
        <h2 className="text-4xl font-bold text-indigo-700 mb-6">
          Multiple Intelligence Theory
          <br />
          Lesson 4: Reading
        </h2>
        <p className="text-3xl text-gray-700 mb-4">
          Hãy hoàn thành các nhiệm vụ sau:
        </p>
        <ol className="text-3xl text-left text-gray-800 space-y-8  list-decimal list-inside">
          <li>Xem video bài học.</li>
          <li>Xem lại flashcards để nhớ từ vựng.</li>
          <li>Làm các bài tập đọc hiểu. Chụp điểm số gửi giáo viên.</li>
          <li>
            Luyện đọc thành tiếng và ghi âm lại gửi giáo viên. Chú ý phát âm và
            ngữ điệu khi đọc.
          </li>
        </ol>
        <p className="text-xl text-gray-600 mt-6 italic">
          Chúc các em học tốt!
        </p>
      </div>
    </div>
  </Slide>
)

const HomeworkPage: React.FC = () => {
  const navigate = useNavigate()
  const goHome = () => navigate({ to: '..' })

  const slides = [HomeworkSlide]
  return (
    <PresentationShell
      slides={slides}
      backgroundUrl={urls.background}
      onHomeClick={goHome}
      showNavButtons={false}
      showOutlineButton={false}
      showSlideCounter={false}
    />
  )
}

export const Route = createFileRoute(
  '/(main)/(students)/lessons/advanced-topics/multiple-intelligence-theory/lesson-4/assignments',
)({
  component: HomeworkPage,
})
