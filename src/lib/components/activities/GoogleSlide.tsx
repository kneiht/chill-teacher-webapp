import React, { useMemo } from 'react'

// Components
import PresentationShell from '@/lib/components/presentation/PresentationShell'
import Slide from '@/lib/components/presentation/Slide'

interface GoogleSlideCoreProps {
  isActive: boolean
  src: string
  title?: string
  style?: React.CSSProperties
}

const GoogleSlideCore: React.FC<GoogleSlideCoreProps> = ({
  isActive,
  src,
  style,
}) => {
  return (
    <div className="w-full h-full flex flex-col">
      <div
        className={`flex-1 slide rounded-xl ${isActive ? 'active' : ''}`}
        style={{ ...style, overflow: 'hidden' }}
      >
        <iframe
          src={src}
          style={{ border: 0, width: '100%', height: 'calc(100% + 36px)' }}
          allowFullScreen
          className="rounded-xl"
        ></iframe>
      </div>
    </div>
  )
}

// Activity Interface
interface GoogleSlideProps {
  url: string
  backgroundUrl: string
  title?: string
  onClose?: () => void
}

const GoogleSlide: React.FC<GoogleSlideProps> = ({
  url,
  backgroundUrl,
  title,
  onClose,
}) => {
  const googleSlides = useMemo(
    () => [
      ({ isActive }: { isActive: boolean }) => (
        <Slide isActive={isActive} style={{ margin: 0, padding: 0 }}>
          <GoogleSlideCore src={url} isActive={isActive} title={title} />
        </Slide>
      ),
    ],
    [url, title],
  )

  return (
    <PresentationShell
      slides={googleSlides}
      backgroundUrl={backgroundUrl}
      onHomeClick={onClose}
      showNavButtons={false}
      showSlideCounter={false}
    />
  )
}

export default GoogleSlide
