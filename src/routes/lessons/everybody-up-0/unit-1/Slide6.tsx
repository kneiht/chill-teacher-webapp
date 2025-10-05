import React from 'react'

interface SlideProps {
  isActive: boolean
}

const Slide6: React.FC<SlideProps> = ({ isActive }) => {
  return (
    <div
      className={`slide content-box px-5 py-2 rounded-2xl w-full h-full ${isActive ? 'active' : ''}`}
    >
      <h2 className="text-2xl md:text-3xl font-bold text-indigo-700 mb-5">
        4. Câu khẳng định Present Continuous
      </h2>
      <div className="bg-white p-6 rounded-xl shadow-md">
        <p className="text-2xl mb-4">
          Câu khẳng định dùng để diễn tả hành động đang xảy ra. Ta sử dụng
          <span className="font-bold text-red-500">am/is/are + V-ing</span>.
        </p>
        <table className="w-full mt-3 text-center bg-white rounded-lg overflow-hidden text-2xl">
          <thead className="bg-indigo-200">
            <tr>
              <th className="p-2">Chủ ngữ</th>
              <th className="p-2">Be + V-ing</th>
              <th className="p-2">Ví dụ</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b">
              <td className="p-2">I</td>
              <td className="p-2 font-bold text-red-500">am + V-ing</td>
              <td className="p-2">I am studying.</td>
            </tr>
            <tr className="border-b">
              <td className="p-2">He, She, It</td>
              <td className="p-2 font-bold text-red-500">is + V-ing</td>
              <td className="p-2">She is cooking.</td>
            </tr>
            <tr>
              <td className="p-2">You, We, They</td>
              <td className="p-2 font-bold text-red-500">are + V-ing</td>
              <td className="p-2">They are playing.</td>
            </tr>
          </tbody>
        </table>
        <div className="mt-4 space-y-2">
          <p className="text-2xl">
            Ví dụ: I <span className="highlight">am reading</span> a book now.
          </p>
          <p className="text-2xl">
            Ví dụ: He <span className="highlight">is working</span> at the
            moment.
          </p>
          <p className="text-2xl">
            Ví dụ: We <span className="highlight">are learning</span> English
            this week.
          </p>
        </div>
      </div>
    </div>
  )
}

export default Slide6
