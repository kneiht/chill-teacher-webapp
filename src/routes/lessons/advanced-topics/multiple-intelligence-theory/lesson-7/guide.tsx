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
      <div className="bg-white bg-opacity-90 rounded-xl p-10 shadow-2xl w-full max-w-6xl mx-auto">
        <h2 className="text-4xl font-bold text-indigo-700 mb-6">
          Multiple Intelligence Theory
          <br />
          Lesson 7: Writing Guide
        </h2>
        
        <div className="text-left text-gray-800 space-y-6">
          <h3 className="text-2xl font-bold text-blue-600">✍️ HƯỚNG DẪN VIẾT VỀ “MULTIPLE INTELLIGENCES CHART”</h3>
          
          <div>
            <h4 className="text-xl font-semibold text-orange-500">🧩 1. Hiểu mục tiêu bài viết</h4>
            <p className="ml-4">Bài viết này giúp bạn:</p>
            <ul className="list-disc list-inside ml-8 space-y-2">
              <li>Mô tả điểm số từng loại trí thông minh (Multiple Intelligences).</li>
              <li>Phân tích điểm mạnh, điểm yếu của bản thân.</li>
              <li>Viết kết luận về kiểu người học (learning style) của bạn.</li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-xl font-semibold text-yellow-500">🪶 2. Cấu trúc bài viết (Structure)</h4>
            
            <div className="ml-4">
              <h5 className="font-semibold text-blue-500">🟦 Introduction (Mở bài)</h5>
              <p className="ml-4">→ Giới thiệu ngắn gọn về bài kiểm tra Multiple Intelligences và mục đích của nó.</p>
              <p className="ml-8">Gợi ý câu mở đầu:</p>
              <ul className="list-disc list-inside ml-12 space-y-1">
                <li>"According to my Multiple Intelligence test, everyone has different types of intelligence."</li>
                <li>"This chart shows my results from a Multiple Intelligence test."</li>
                <li>"The chart illustrates how I learn best based on my intelligence types."</li>
              </ul>
              <p className="ml-4 mt-2 italic">👉 Mẹo: Dùng thì hiện tại đơn và giới thiệu nhẹ nhàng, không cần nêu chi tiết điểm số ở phần này.</p>
            </div>
            
            <div className="ml-4 mt-4">
              <h5 className="font-semibold text-yellow-500">🟨 Body (Thân bài)</h5>
              <p className="ml-4">Chia thân bài thành 3 phần nhỏ:</p>
              
              <div className="ml-4 mt-2">
                <p className="font-semibold">a. Describe your strongest intelligences</p>
                <p className="ml-4">→ Nêu rõ 2–3 loại trí thông minh cao nhất, viết riêng từng đoạn nhỏ cho từng loại.</p>
                <p className="ml-8">Gợi ý cấu trúc đoạn:</p>
                <ul className="list-disc list-inside ml-12 space-y-1">
                  <li>My strongest intelligence is [type] with a score of [number].</li>
                  <li>This means I am good at [skills/abilities].</li>
                  <li>I learn best through [methods].</li>
                  <li>For example, I enjoy [specific activity].</li>
                </ul>
                <p className="ml-8 mt-2">Ví dụ:</p>
                <p className="ml-12 italic">"My strongest intelligence is Interpersonal, with a score of 77. This means I am good at communicating and understanding others. I learn best through group work and discussions. For example, I enjoy sharing ideas with classmates."</p>
              </div>
              
              <div className="ml-4 mt-2">
                <p className="font-semibold">b. Describe your moderate intelligences</p>
                <p className="ml-4">→ Nêu những loại có điểm trung bình (khoảng 50–60).</p>
                <p className="ml-8">Cấu trúc:</p>
                <ul className="list-disc list-inside ml-12 space-y-1">
                  <li>I have moderate [type] intelligence with a score of [number].</li>
                  <li>I can [ability], but I still need to improve.</li>
                </ul>
              </div>
              
              <div className="ml-4 mt-2">
                <p className="font-semibold">c. Describe your weaker intelligences</p>
                <p className="ml-4">→ Nêu những loại thấp nhất (dưới 50).</p>
                <p className="ml-8">Cấu trúc:</p>
                <ul className="list-disc list-inside ml-12 space-y-1">
                  <li>My weakest intelligence is [type], with a score of [number].</li>
                  <li>It means I don't often [related skill].</li>
                  <li>However, I can develop it by [learning method].</li>
                </ul>
              </div>
            </div>
            
            <div className="ml-4 mt-4">
              <h5 className="font-semibold text-green-500">🟩 Conclusion (Kết bài)</h5>
              <p className="ml-4">→ Tổng kết lại phong cách học tập (learning style).</p>
              <p className="ml-8">Gợi ý câu kết:</p>
              <ul className="list-disc list-inside ml-12 space-y-1">
                <li>"In conclusion, I am mainly a [type]-smart and [type]-smart learner."</li>
                <li>"Overall, I learn best through [learning method]."</li>
                <li>"This test helps me understand myself and find better ways to study."</li>
              </ul>
            </div>
          </div>
          
          <div>
            <h4 className="text-xl font-semibold text-purple-500">🧠 3. Từ vựng gợi ý (Useful Vocabulary)</h4>
            <div className="overflow-x-auto">
              <table className="min-w-full border-collapse table-auto">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border px-4 py-2">Loại trí thông minh</th>
                    <th className="border px-4 py-2">Từ/cụm từ mô tả đi kèm</th>
                    <th className="border px-4 py-2">Nghĩa</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border px-4 py-2">Interpersonal</td>
                    <td className="border px-4 py-2">communicate with others, teamwork, understand people</td>
                    <td className="border px-4 py-2">giao tiếp, làm việc nhóm</td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="border px-4 py-2">Intrapersonal</td>
                    <td className="border px-4 py-2">understand myself, reflect, manage emotions</td>
                    <td className="border px-4 py-2">hiểu bản thân, tự nhận thức</td>
                  </tr>
                  <tr>
                    <td className="border px-4 py-2">Logical</td>
                    <td className="border px-4 py-2">problem solving, reasoning, thinking logically</td>
                    <td className="border px-4 py-2">tư duy logic, giải quyết vấn đề</td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="border px-4 py-2">Linguistic</td>
                    <td className="border px-4 py-2">reading, writing, speaking</td>
                    <td className="border px-4 py-2">ngôn ngữ, đọc viết</td>
                  </tr>
                  <tr>
                    <td className="border px-4 py-2">Kinesthetic</td>
                    <td className="border px-4 py-2">moving, touching, hands-on learning</td>
                    <td className="border px-4 py-2">vận động, thực hành</td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="border px-4 py-2">Musical</td>
                    <td className="border px-4 py-2">rhythm, singing, playing instruments</td>
                    <td className="border px-4 py-2">âm nhạc, giai điệu</td>
                  </tr>
                  <tr>
                    <td className="border px-4 py-2">Naturalist</td>
                    <td className="border px-4 py-2">nature, animals, environment</td>
                    <td className="border px-4 py-2">thiên nhiên, sinh học</td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="border px-4 py-2">Visual/Spatial</td>
                    <td className="border px-4 py-2">drawing, imagining, visual memory</td>
                    <td className="border px-4 py-2">hình ảnh, tưởng tượng</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          
          <div>
            <h4 className="text-xl font-semibold text-pink-500">🪄 4. Mẫu câu hữu ích (Sentence Patterns)</h4>
            <div className="overflow-x-auto">
              <table className="min-w-full border-collapse table-auto">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border px-4 py-2">Mục đích</th>
                    <th className="border px-4 py-2">Cấu trúc gợi ý</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border px-4 py-2">Nêu điểm mạnh</td>
                    <td className="border px-4 py-2">My strongest intelligence is … with a score of …</td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="border px-4 py-2">Giải thích ý nghĩa</td>
                    <td className="border px-4 py-2">This means I am good at … / It shows that I can …</td>
                  </tr>
                  <tr>
                    <td className="border px-4 py-2">Cách học tốt nhất</td>
                    <td className="border px-4 py-2">I learn best through … / I enjoy learning by …</td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="border px-4 py-2">Đưa ví dụ</td>
                    <td className="border px-4 py-2">For example, I enjoy … / One example is …</td>
                  </tr>
                  <tr>
                    <td className="border px-4 py-2">Nói về điểm yếu</td>
                    <td className="border px-4 py-2">My weakest intelligence is … / I am not very strong in …</td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="border px-4 py-2">Kết luận</td>
                    <td className="border px-4 py-2">In conclusion, I am a … learner. / Overall, this test helps me …</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          
          <div>
            <h4 className="text-xl font-semibold text-red-500">✨ 5. Mẹo khi viết</h4>
            <ul className="list-disc list-inside ml-4 space-y-2">
              <li>Chia nhỏ đoạn: Mỗi trí thông minh mạnh → 1 đoạn riêng.</li>
              <li>Dùng từ nối: Also, besides, however, on the other hand, in conclusion…</li>
              <li>Dùng thì hiện tại đơn: vì bạn đang mô tả thói quen & đặc điểm của bản thân.</li>
              <li>Không chỉ liệt kê điểm số: Hãy giải thích và đưa ví dụ thực tế.</li>
            </ul>
          </div>
        </div>
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
  '/lessons/advanced-topics/multiple-intelligence-theory/lesson-7/guide',
)({
  component: HomeworkPage,
})
