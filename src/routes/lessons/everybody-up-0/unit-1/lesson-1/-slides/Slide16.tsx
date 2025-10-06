import React from 'react'

interface SlideProps {
  isActive: boolean
}

const Slide16: React.FC<SlideProps> = ({ isActive }) => {
  return (
    <div
      className={`slide content-box px-5 py-2 rounded-2xl w-full h-full ${isActive ? 'active' : ''}`}
    >
      <div className="flex flex-col items-center justify-start h-full text-center">
        <h1 className="text-2xl font-bold text-indigo-700 mb-3">Chúc mừng!</h1>
        <div className="text-2xl md:text-3xl text-gray-700 mb-3">
          <p className="mb-4">Bạn đã hoàn thành bài học về</p>
          <div className="bg-gradient-to-r from-yellow-400 to-red-500 text-white text-4xl font-bold px-6 py-2 rounded-full inline-block">
            PRESENT CONTINUOUS TENSE
          </div>
        </div>
        <div className="flex justify-center mb-3">
          <img
            src="https://t3.ftcdn.net/jpg/04/09/09/92/360_F_409099227_cinbeFsXrOrLKZkFzAUYnXRppExHtbXL.jpg"
            className="h-32 rounded-xl object-cover"
            alt="Celebration Image"
          />
        </div>
        <div className="bg-gradient-to-r from-green-400 to-blue-500 text-white p-6 rounded-xl max-w-xl">
          <p className="text-2xl md:text-2xl font-bold mb-2">
            Bây giờ bạn đã biết cách sử dụng thì Present Continuous!
          </p>
          <p className="text-xl">Hẹn gặp lại trong bài học tiếp theo!</p>
        </div>
      </div>
    </div>
  )
}

export default Slide16
