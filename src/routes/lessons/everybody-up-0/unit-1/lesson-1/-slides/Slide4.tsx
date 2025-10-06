import React from 'react'

interface SlideProps {
  isActive: boolean
}

const Slide4: React.FC<SlideProps> = ({ isActive }) => {
  return (
    <div
      className={`slide content-box px-5 py-2 rounded-2xl w-full h-full text-2xl ${isActive ? 'active' : ''}`}
    >
      <h2 className="text-2xl md:text-3xl font-bold text-indigo-700 mb-5">
        3. Cách thêm -ing vào động từ
      </h2>
      <div className="bg-white p-6 rounded-xl shadow-md">
        <p className="text-2xl mb-4">
          Để tạo thì Present Continuous, ta cần thêm
          <span className="font-bold text-red-500">-ing</span> vào động từ. Có
          một số quy tắc cần nhớ:
        </p>
        <div className="mt-6 space-y-4">
          <div className="bg-green-100 p-4 rounded-lg">
            <p className="font-bold text-green-800 text-2xl">
              1. Động từ thường: thêm -ing
            </p>
            <p className="text-2xl">
              play → playing, read → reading, work → working
            </p>
          </div>
          <div className="bg-blue-100 p-4 rounded-lg">
            <p className="font-bold text-blue-800 text-2xl">
              2. Động từ kết thúc bằng -e: bỏ -e, thêm -ing
            </p>
            <p className="text-2xl">
              write → writing, dance → dancing, make → making
            </p>
          </div>
          <div className="bg-yellow-100 p-4 rounded-lg">
            <p className="font-bold text-yellow-800 text-2xl">
              3. Động từ 1 âm tiết, kết thúc bằng phụ âm-nguyên âm-phụ âm: gấp
              đôi phụ âm cuối
            </p>
            <p className="text-2xl">
              run → running, sit → sitting, swim → swimming
            </p>
          </div>
          <div className="bg-red-100 p-4 rounded-lg">
            <p className="font-bold text-red-800 text-2xl">
              4. Động từ kết thúc bằng -ie: đổi thành -y
            </p>
            <p className="text-2xl">lie → lying, die → dying, tie → tying</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Slide4
