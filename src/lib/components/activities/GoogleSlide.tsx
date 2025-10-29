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
  title,
  style,
}) => {
  return (
    <div className="w-full h-full flex flex-col">
      {/* Title */}
      {title && (
        <h2 className="text-xl font-bold text-indigo-700 text-center py-4 bg-white/80">
          {title}
        </h2>
      )}
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
  slides: Array<{ url: string; title?: string }>
  backgroundUrl: string
  title?: string
  onClose?: () => void
}

const GoogleSlide: React.FC<GoogleSlideProps> = ({
  slides,
  backgroundUrl,
  title,
  onClose,
}) => {
  const googleSlides = useMemo(
    () =>
      slides.map((slideData) => ({ isActive }: { isActive: boolean }) => (
        <Slide isActive={isActive}>
          <GoogleSlideCore
            src={slideData.url}
            isActive={isActive}
            title={slideData.title || title}
          />
        </Slide>
      )),
    [slides, title],
  )

  return (
    <PresentationShell
      slides={googleSlides}
      backgroundUrl={backgroundUrl}
      onHomeClick={onClose}
      showNavButtons={true}
      showSlideCounter={slides.length > 1}
    />
  )
}

export default GoogleSlide
