import React from 'react'

interface SlideProps {
  isActive: boolean
}

const Slide13: React.FC<SlideProps> = ({ isActive }) => {
  return (
    <div
      className={`slide content-box px-5 py-2 rounded-2xl w-full h-full ${isActive ? 'active' : ''}`}
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
  )
}

export default Slide13
