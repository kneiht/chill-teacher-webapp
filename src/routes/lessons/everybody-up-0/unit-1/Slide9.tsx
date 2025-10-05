import React from 'react'

interface SlideProps {
  isActive: boolean
}

const Slide9: React.FC<SlideProps> = ({ isActive }) => {
  return (
    <div
      className={`slide content-box px-5 py-2 rounded-2xl w-full h-full ${isActive ? 'active' : ''}`}
    >
      <h2 className="text-2xl md:text-3xl font-bold text-indigo-700 mb-5">
        6. Câu hỏi Yes/No Present Continuous
      </h2>
      <div className="bg-white p-6 rounded-xl shadow-md">
        <p className="text-2xl mb-4">
          Để đặt câu hỏi Yes/No, ta đảo động từ
          <span className="font-bold text-red-500">be</span> lên đầu câu.
        </p>
        <div className="mt-6 bg-gradient-to-r from-blue-100 to-purple-100 p-4 rounded-lg">
          <p className="font-bold text-blue-800 text-2xl">Công thức:</p>
          <p className="text-2xl font-bold text-center mt-3 text-purple-700">
            Am/Is/Are + S + V-ing + (O)?
          </p>
          <p className="text-2xl font-bold text-center mt-2">
            Cách trả lời ngắn:
          </p>
          <ul className="list-disc pl-8 text-2xl">
            <li>Yes, S + am/is/are.</li>
            <li>No, S + am not/isn't/aren't.</li>
          </ul>
        </div>
        <div className="mt-4 space-y-2">
          <p className="text-2xl">
            Ví dụ: <span className="highlight">Are</span> you
            <span className="highlight">studying</span> now? - Yes, I am. / No,
            I'm not.
          </p>
          <p className="text-2xl">
            Ví dụ: <span className="highlight">Is</span> she
            <span className="highlight">cooking</span> dinner? - Yes, she is. /
            No, she isn't.
          </p>
          <p className="text-2xl">
            Ví dụ: <span className="highlight">Are</span> they
            <span className="highlight">playing</span> games? - Yes, they are. /
            No, they aren't.
          </p>
        </div>
      </div>
    </div>
  )
}

export default Slide9
