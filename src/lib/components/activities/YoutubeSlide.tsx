import React, { useEffect, useRef } from 'react'

interface YoutubeSlideProps {
  isActive: boolean
  src: string
}

const YoutubeSlide: React.FC<YoutubeSlideProps> = ({ isActive, src }) => {
  const iframeRef = useRef<HTMLIFrameElement>(null)

  // Extract video ID from YouTube URL
  const getVideoId = (url: string) => {
    const regExp =
      /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/
    const match = url.match(regExp)
    return match && match[2].length === 11 ? match[2] : null
  }

  const videoId = getVideoId(src)

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

  if (!videoId) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-black text-white">
        <p>Invalid YouTube URL</p>
      </div>
    )
  }

  return (
    <div className="w-full h-full bg-black flex items-center justify-center">
      {isActive && (
        <iframe
          ref={iframeRef}
          src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`}
          title="YouTube video player"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="w-full max-w-[calc(100vh*16/9)] max-h-full"
          style={{ aspectRatio: '16/9' }}
        />
      )}
    </div>
  )
}

export default YoutubeSlide
