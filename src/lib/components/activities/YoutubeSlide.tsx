import React, { useEffect, useRef, useMemo } from 'react'

// Components
import PresentationShell from '@/lib/components/presentation/PresentationShell'
import Slide from '@/lib/components/presentation/Slide'

interface YoutubeSlideCoreProps {
  isActive: boolean
  src: string
  title?: string
}

const YoutubeSlideCore: React.FC<YoutubeSlideCoreProps> = ({
  isActive,
  src,
}) => {
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
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="w-full max-w-[calc(100vh*16/9)] max-h-full rounded-xl"
          style={{ aspectRatio: '16/9' }}
        />
      )}
    </div>
  )
}

// Activity Interface
interface YoutubeSlideProps {
  url: string
  backgroundUrl: string
  title?: string
  onClose?: () => void
}

const YoutubeSlide: React.FC<YoutubeSlideProps> = ({
  url,
  backgroundUrl,
  title,
  onClose,
}) => {
  const youtubeSlide = useMemo(
    () => [
      ({ isActive }: { isActive: boolean }) => (
        <Slide isActive={isActive} style={{ margin: 0, padding: 0 }}>
          <YoutubeSlideCore src={url} isActive={isActive} title={title} />
        </Slide>
      ),
    ],
    [url, title],
  )

  return (
    <PresentationShell
      slides={youtubeSlide}
      backgroundUrl={backgroundUrl}
      onHomeClick={onClose}
      showNavButtons={false}
      showSlideCounter={false}
    />
  )
}

export default YoutubeSlide
