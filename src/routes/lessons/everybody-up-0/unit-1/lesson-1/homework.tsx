// Router
import { createFileRoute, useNavigate } from '@tanstack/react-router'

// Components
import PresentationShell from '@/lib/components/presentation/PresentationShell'
import Slide from '@/lib/components/presentation/Slide'

// Assets
import bg from './assets/bg.png'

const HomeworkSlide: React.FC<{ isActive: boolean }> = ({ isActive }) => (
  <Slide isActive={isActive} scrollable={true}>
    <div className="flex flex-col items-center justify-start h-full text-center p-6">
      <div className="bg-white bg-opacity-90 rounded-xl p-8 shadow-2xl w-full">
        <h2 className="text-4xl font-bold text-indigo-700 mb-6">
          Unit 1: Art Class
          <br />
          Lesson 1: School Supplies
        </h2>
        <p className="text-3xl text-gray-700 mb-4">
          Hãy hoàn thành các nhiệm vụ sau:
        </p>
        <ol className="text-3xl text-left text-gray-800 space-y-8  list-decimal list-inside">
          <li>Xem video bài học.</li>
          <li>Luyện tập phát âm từ vựng và câu theo video.</li>
          <li>Luyện tập từ vựng bằng các game tương tác.</li>
          <li>
            Viết các câu sau, mỗi câu tối thiểu 5 lần, chụp hình bài viết gửi
            giáo viên:
            <ul className="ml-8 mt-2 space-y-1 list-disc">
              <li>I have paper.</li>
              <li>I have glue.</li>
              <li>I have scissors.</li>
              <li>I have paint.</li>
            </ul>
          </li>
          <li>
            Ghi âm hoặc quay video phát âm các từ vựng và câu gửi cho giáo viên:
            <table className="ml-8 mt-2 border-collapse border border-gray-400">
              <thead>
                <tr>
                  <th className="border border-gray-400 px-4 py-2">
                    Word (từ)
                  </th>
                  <th className="border border-gray-400 px-4 py-2">
                    Sentence (câu)
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-gray-400 px-4 py-2">Paper</td>
                  <td className="border border-gray-400 px-4 py-2">
                    I have paper.
                  </td>
                </tr>
                <tr>
                  <td className="border border-gray-400 px-4 py-2">Scissors</td>
                  <td className="border border-gray-400 px-4 py-2">
                    I have scissors.
                  </td>
                </tr>
                <tr>
                  <td className="border border-gray-400 px-4 py-2">Glue</td>
                  <td className="border border-gray-400 px-4 py-2">
                    I have glue.
                  </td>
                </tr>
                <tr>
                  <td className="border border-gray-400 px-4 py-2">Paint</td>
                  <td className="border border-gray-400 px-4 py-2">
                    I have paint.
                  </td>
                </tr>
              </tbody>
            </table>
          </li>
          <li>
            Quay video phần practice (luyện tập) ở cuối video bài học gửi cho
            giáo viên.
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
  const goHome = () =>
    navigate({ to: '/lessons/everybody-up-0/unit-1/lesson-1' })

  const slides = [HomeworkSlide]
  return (
    <PresentationShell
      slides={slides}
      backgroundUrl={bg}
      onHomeClick={goHome}
      showNavButtons={false}
      showOutlineButton={false}
      showSlideCounter={false}
    />
  )
}

export const Route = createFileRoute(
  '/lessons/everybody-up-0/unit-1/lesson-1/homework',
)({
  component: HomeworkPage,
})
