import React, { useEffect, useRef } from 'react'

interface WordwallSlideProps {
  isActive: boolean
  src: string
}

const WordwallSlide: React.FC<WordwallSlideProps> = ({ isActive, src }) => {
  const iframeRef = useRef<HTMLIFrameElement>(null)

  useEffect(() => {
    if (iframeRef.current && isActive) {
      // Adjust iframe height to maintain 16:9 aspect ratio
      const adjustHeight = () => {
        if (iframeRef.current) {
          const width = iframeRef.current.offsetWidth
          const height = (width * 9) / 16
          iframeRef.current.style.height = `${height}px`
        }
      }

      adjustHeight()
      window.addEventListener('resize', adjustHeight)

      return () => window.removeEventListener('resize', adjustHeight)
    }
  }, [isActive])

  return (
    <div className="w-full h-full bg-black">
      {isActive && (
        <iframe
          ref={iframeRef}
          src={src}
          title="Wordwall activity"
          allowFullScreen
          className="w-full max-w-[calc(110vh*16/9)]"
        />
      )}
    </div>
  )
}

export default WordwallSlide
