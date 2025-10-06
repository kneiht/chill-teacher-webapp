import React, { useState, useEffect } from 'react'

interface GoogleSlideProps {
  isActive: boolean
  src: string
  style?: React.CSSProperties
}

const GoogleSlide: React.FC<GoogleSlideProps> = ({ isActive, src, style }) => {
  const [iframeHeight, setIframeHeight] = useState('103.9%')

  useEffect(() => {
    const calculateHeight = () => {
      const screenWidth = window.innerWidth
      const minWidth = 340 // Breakpoint for small screens
      const maxWidth = 1920 // Breakpoint for large screens
      const maxHeight = 120 // Height for small screens
      const minHeight = 103.9 // Height for large screens

      // Linear interpolation between the two points
      const slope = (screenWidth - minWidth) / (maxWidth - minWidth)
      const height = minHeight + slope * (screenWidth - minWidth)

      setIframeHeight(`${height}%`)
      console.log(height)
    }

    calculateHeight() // Calculate initial height

    window.addEventListener('resize', calculateHeight)

    return () => {
      window.removeEventListener('resize', calculateHeight)
    }
  }, [])

  return (
    <div
      className={`slide rounded-xl w-full h-full ${isActive ? 'active' : ''}`}
      style={{ ...style, overflow: 'hidden' }}
    >
      <iframe
        src={src}
        style={{ border: 0 }}
        width="100%"
        height={iframeHeight}
        allowFullScreen
        className="rounded-xl"
      ></iframe>
    </div>
  )
}

export default GoogleSlide
