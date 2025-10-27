import React from 'react'

interface GoogleSlideProps {
  isActive: boolean
  src: string
  style?: React.CSSProperties
}

const GoogleSlide: React.FC<GoogleSlideProps> = ({ isActive, src, style }) => {
  return (
    <div
      className={`slide rounded-xl w-full h-full ${isActive ? 'active' : ''}`}
      style={{ ...style, overflow: 'hidden' }}
    >
      <iframe
        src={src}
        style={{ border: 0, width: '100%', height: 'calc(100% + 36px)' }}
        allowFullScreen
        className="rounded-xl"
      ></iframe>
    </div>
  )
}

export default GoogleSlide
