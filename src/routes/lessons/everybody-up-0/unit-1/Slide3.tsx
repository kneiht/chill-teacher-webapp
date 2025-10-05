import React from 'react'

interface SlideProps {
  isActive: boolean
}

const Slide3: React.FC<SlideProps> = ({ isActive }) => {
  return (
    <div
      className={`slide content-box px-5 py-2 rounded-2xl w-full h-full text-2xl ${isActive ? 'active' : ''}`}
    >
      <h2 className="text-2xl md:text-3xl font-bold text-indigo-700 mb-5">
        2. Cấu trúc Present Continuous
      </h2>
      <div className="bg-white p-6 rounded-xl shadow-md">
        <p className="text-2xl mb-4">
          Cấu trúc cơ bản của thì Present Continuous:
          <span className="font-bold text-red-500">S + be + V-ing</span>
        </p>
        <div className="mt-6 bg-gradient-to-r from-blue-100 to-purple-100 p-4 rounded-lg">
          <p className="font-bold text-blue-800 text-2xl">Công thức:</p>
          <p className="text-2xl font-bold text-center mt-3 text-purple-700">
            S + am/is/are + V-ing + (O)
          </p>
        </div>
        <div className="mt-4 space-y-4">
          <div className="verb-example">
            <p className="text-2xl">
              <span className="font-bold text-blue-500">I</span>
              <span className="font-bold text-green-500">am reading</span> a
              book.
            </p>
            <p className="text-gray-600">(Tôi đang đọc sách.)</p>
          </div>
          <div className="verb-example">
            <p className="text-2xl">
              <span className="font-bold text-blue-500">She</span>
              <span className="font-bold text-green-500">is cooking</span>
              dinner.
            </p>
            <p className="text-gray-600">(Cô ấy đang nấu bữa tối.)</p>
          </div>
          <div className="verb-example">
            <p className="text-2xl">
              <span className="font-bold text-blue-500">They</span>
              <span className="font-bold text-green-500">are playing</span>
              football.
            </p>
            <p className="text-gray-600">(Họ đang chơi bóng đá.)</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Slide3
