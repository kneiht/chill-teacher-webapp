import React, { useMemo } from 'react'

// Components
import PresentationShell from '@/lib/components/presentation/PresentationShell'
import Slide from '@/lib/components/presentation/Slide'

interface EmbedPageSlideCoreProps {
  isActive: boolean
  src: string
  title?: string
}

const EmbedPageSlideCore: React.FC<EmbedPageSlideCoreProps> = ({
  isActive,
  src,
  title,
}) => {
  return (
    <div className="w-full h-full flex items-center justify-center">
      {isActive && (
        <iframe
          src={src}
          className="w-full h-full border-0 rounded-xl"
          title={title || 'Embedded Page'}
        />
      )}
    </div>
  )
}

// Activity Interface
interface EmbedPageSlideProps {
  url: string
  backgroundUrl: string
  title?: string
  onClose?: () => void
}

const EmbedPageSlide: React.FC<EmbedPageSlideProps> = ({
  url,
  backgroundUrl,
  title,
  onClose,
}) => {
  const embedSlide = useMemo(
    () => [
      ({ isActive }: { isActive: boolean }) => (
        <Slide isActive={isActive} style={{ margin: 0, padding: 0 }}>
          <EmbedPageSlideCore src={url} isActive={isActive} title={title} />
        </Slide>
      ),
    ],
    [url, title],
  )

  return (
    <PresentationShell
      slides={embedSlide}
      backgroundUrl={backgroundUrl}
      onHomeClick={onClose}
      showNavButtons={false}
      showSlideCounter={false}
    />
  )
}

export default EmbedPageSlide
