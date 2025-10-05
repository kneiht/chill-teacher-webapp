import React from 'react'

interface SlideProps {
  isActive: boolean
}

const Slide11: React.FC<SlideProps> = ({ isActive }) => {
  return (
    <div
      className={`slide content-box px-5 py-2 rounded-2xl w-full h-full ${isActive ? 'active' : ''}`}
    >
      <h2 className="text-2xl md:text-3xl font-bold text-indigo-700 mb-5">
        7. Câu hỏi WH- Present Continuous
      </h2>
      <div className="bg-white p-6 rounded-xl shadow-md">
        <p className="text-2xl mb-4">
          Câu hỏi WH- dùng để hỏi thông tin cụ thể. Ta thêm từ để hỏi (WH-word)
          vào đầu câu hỏi Yes/No.
        </p>
        <div className="mt-6 bg-gradient-to-r from-orange-100 to-red-100 p-4 rounded-lg">
          <p className="font-bold text-orange-800 text-2xl">Công thức:</p>
          <p className="text-2xl font-bold text-center mt-3 text-purple-700">
            WH-word + am/is/are + S + V-ing?
          </p>
        </div>
        <div className="mt-4 space-y-2">
          <p className="text-2xl">
            Ví dụ: <span className="highlight">What</span> are you doing now?
          </p>
          <p className="text-2xl">
            Ví dụ: <span className="highlight">Where</span> is she going?
          </p>
          <p className="text-2xl">
            Ví dụ: <span className="highlight">Why</span> are they crying?
          </p>
          <p className="text-2xl">
            Ví dụ: <span className="highlight">How</span> is he feeling today?
          </p>
        </div>
        <div className="mt-4 bg-blue-100 p-4 rounded-lg">
          <p className="font-bold text-blue-800 text-2xl">
            💡 Các từ để hỏi thường dùng: What, Where, When, Why, How, Who,
            Which
          </p>
        </div>
      </div>
    </div>
  )
}

export default Slide11
