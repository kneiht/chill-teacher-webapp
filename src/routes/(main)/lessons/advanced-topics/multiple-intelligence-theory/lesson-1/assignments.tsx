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
          Lesson 1: School Supplies
        </h2>
        <p className="text-3xl text-gray-700 mb-4">
          Hãy hoàn thành các nhiệm vụ sau:
        </p>
        <ol className="text-3xl text-left text-gray-800 space-y-8  list-decimal list-inside">
          <li>Xem video bài học.</li>
          <li>Luyện tập phát âm từ vựng và câu theo video.</li>
          <li>
            Luyện tập từ vựng bằng các game tương tác, chụp kết quả gửi kết quả
            cho giáo viên.
          </li>
          <li>Viết lại từ vựng và câu vào vở, chụp hình gửi giáo viên.</li>
          <li>
            Ghi âm hoặc quay video phát âm các từ vựng và câu gửi cho giáo viên.
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
  '/(main)/lessons/advanced-topics/multiple-intelligence-theory/lesson-1/assignments',
)({
  component: HomeworkPage,
})
