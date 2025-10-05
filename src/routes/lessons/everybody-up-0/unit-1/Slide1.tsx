import React from 'react'

interface SlideProps {
  isActive: boolean
}

const Slide1: React.FC<SlideProps> = ({ isActive }) => {
  return (
    <div
      className={`slide content-box px-5 py-2 rounded-2xl w-full h-full ${isActive ? 'active' : ''}`}
    >
      <div className="flex flex-col items-center justify-start h-full text-center">
        <h1 className="text-2xl font-bold text-indigo-700 mb-8">
          GRAMMAR FOR PRE-GRADE 7
        </h1>
        <div className="bg-yellow-400 text-2xl md:text-4xl font-bold px-6 py-3 rounded-full mb-5 shadow-lg floating">
          Present Continuous Tense
        </div>
        <div className="flex flex-col md:flex-row items-center justify-center gap-8">
          <div className="mt-6 flex justify-center">
            <img
              src="https://img.freepik.com/free-photo/notebook-with-grammar-word-school-suplies_23-2149436698.jpg"
              alt="Grammar Learning"
              className="object-cover h-52 rounded-xl floating"
            />
          </div>
          <div className="bg-gradient-to-r from-indigo-100 to-green-200 border-l-4 border-indigo-500 py-5 px-10 text-left rounded-2xl text-2xl">
            <p className="font-bold text-indigo-800">Mục tiêu bài học:</p>
            <ul className="list-disc pl-5 text-gray-700 text-2xl">
              <li>Hiểu và vận dụng thì Present Continuous</li>
              <li>Nắm vững cấu trúc khẳng định, phủ định, nghi vấn</li>
              <li>Biết cách sử dụng đúng thời điểm</li>
              <li>Phân biệt Present Continuous và Present Simple</li>
            </ul>
          </div>
        </div>
        <div className="my-3 opacity-0">---</div>
      </div>
    </div>
  )
}

export default Slide1
