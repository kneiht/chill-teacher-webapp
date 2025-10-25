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
          Unit 1: Art Class
          <br />
          Lesson 3: Reading
        </h2>
        <p className="text-3xl text-gray-700 mb-4">
          Hãy hoàn thành các nhiệm vụ sau:
        </p>
        <ol className="text-3xl text-left text-gray-800 space-y-8  list-decimal list-inside">
          <li>Xem lại Flashcards để nhớ từ vựng.</li>
          <li>Xem video bài học, trong quá trình xem, luyện đọc cùng thầy.</li>
          <li>Làm bài tập đọc hiểu, gửi chụp hình gửi thầy kết quả.</li>
          <li>
            Tập đọc câu chuyện, bấm vào cái loa để nghe và tập nói lại, nói
            nhiều lần đến khi nhớ cách phát âm đúng.
          </li>
          <li>
            Quay video đọc bài gửi giáo viên. Yêu cầu các câu liên quan tới từ
            vựng đã học phải đọc lưu loát, các câu có các từ khó có thể bỏ qua.
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
  '/(main)/(students)/lessons/everybody-up-0/unit-1/lesson-3/assignments',
)({
  component: HomeworkPage,
})
