import React from 'react'

interface SlideProps {
  isActive: boolean
}

const Slide2: React.FC<SlideProps> = ({ isActive }) => {
  return (
    <div
      className={`slide content-box px-5 py-2 rounded-2xl w-full h-full ${isActive ? 'active' : ''}`}
    >
      <h2 className="text-2xl md:text-3xl font-bold text-indigo-700 mb-5">
        1. Thì Present Continuous là gì?
      </h2>
      <div className="bg-white p-6 rounded-xl shadow-md">
        <p className="text-2xl mb-4">
          Thì Present Continuous (Hiện tại tiếp diễn) dùng để diễn tả những hành
          động
          <span className="font-bold text-green-500">đang xảy ra</span> tại thời
          điểm nói hoặc
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
            💡 Dấu hiệu nhận biết: now, at the moment, at present, currently,
            this week/month/year, today, right now
          </p>
        </div>
      </div>
    </div>
  )
}

export default Slide2
