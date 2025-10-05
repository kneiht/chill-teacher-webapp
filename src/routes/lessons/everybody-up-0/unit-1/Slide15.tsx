import React from 'react'

interface SlideProps {
  isActive: boolean
}

const Slide15: React.FC<SlideProps> = ({ isActive }) => {
  return (
    <div
      className={`slide content-box px-5 py-2 rounded-2xl w-full h-full ${isActive ? 'active' : ''}`}
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
                <span className="highlight">Khẳng định:</span> S + am/is/are +
                V-ing + (O)
              </li>
              <li>
                <span className="highlight">Phủ định:</span> S + am/is/are + not
                + V-ing + (O)
              </li>
              <li>
                <span className="highlight">Yes/No Question:</span> Am/Is/Are +
                S + V-ing + (O)?
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
              <li>Hành động đang diễn ra trong khoảng thời gian hiện tại</li>
            </ul>
          </div>
          <div className="bg-yellow-50 p-4 rounded-lg">
            <p className="text-2xl font-bold text-yellow-800">
              3. Dấu hiệu nhận biết
            </p>
            <p className="text-2xl">
              now, at the moment, at present, currently, this week/month/year,
              today, right now, look!, listen!
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Slide15
