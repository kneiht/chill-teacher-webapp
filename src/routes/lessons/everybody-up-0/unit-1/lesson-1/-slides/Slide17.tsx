import React from 'react'

interface SlideProps {
  isActive: boolean
}

const Slide17: React.FC<SlideProps> = ({ isActive }) => {
  return (
    <div
      className={`slide content-box px-5 py-2 rounded-2xl w-full h-full ${isActive ? 'active' : ''}`}
    >
      <div className="w-full h-full flex items-center justify-center">
        <iframe
          src="https://docs.google.com/presentation/d/e/2PACX-1vSorZ_C8rPid4KgGQ3gao73kQxkPKBXyKlQU3_IG9KHKeznJRtrYcDro5N7xeItwQ/pubembed?start=true&loop=true&delayms=3000"
          style={{ border: 0 }}
          width="100%"
          height="100%"
          allowFullScreen
          className="rounded-xl"
        ></iframe>
      </div>
    </div>
  )
}

export default Slide17
