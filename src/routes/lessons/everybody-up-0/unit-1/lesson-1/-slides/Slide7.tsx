import React from 'react'

interface SlideProps {
  isActive: boolean
}

const Slide7: React.FC<SlideProps> = ({ isActive }) => {
  return (
    <div
      className={`slide content-box px-5 py-2 rounded-2xl w-full h-full ${isActive ? 'active' : ''}`}
    >
      <h2 className="text-2xl md:text-3xl font-bold text-indigo-700 mb-5">
        5. Câu phủ định Present Continuous
      </h2>
      <div className="bg-white p-6 rounded-xl shadow-md">
        <p className="text-2xl mb-4">
          Để tạo câu phủ định, ta thêm
          <span className="font-bold text-red-500">"not"</span> sau động từ
          <span className="font-bold text-red-500">be</span>.
        </p>
        <div className="mt-6 bg-gradient-to-r from-red-100 to-orange-100 p-4 rounded-lg">
          <p className="font-bold text-red-800 text-2xl">Công thức:</p>
          <p className="text-2xl font-bold text-center mt-3 text-purple-700">
            S + am/is/are + not + V-ing + (O)
          </p>
          <p className="text-2xl font-bold text-center mt-2">
            Viết tắt: am not, isn't (is not), aren't (are not)
          </p>
        </div>
        <div className="mt-4 space-y-2">
          <p className="text-2xl">
            Ví dụ: I <span className="highlight">am not watching</span> TV now.
            (I'm not watching TV now.)
          </p>
          <p className="text-2xl">
            Ví dụ: He <span className="highlight">is not sleeping</span>. (He
            <span className="highlight">isn't sleeping</span>.)
          </p>
          <p className="text-2xl">
            Ví dụ: They
            <span className="highlight">are not playing</span> games. (They
            <span className="highlight">aren't playing</span> games.)
          </p>
        </div>
      </div>
    </div>
  )
}

export default Slide7
