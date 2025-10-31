import React, { useMemo } from 'react'

// Components
import PresentationShell from '@/lib/components/presentation/PresentationShell'
import Slide from '@/lib/components/presentation/Slide'
import HtmlLike, { type HtmlNode } from '@/lib/components/ui/HtmlLike'

interface HtmlLikePageData {
  title?: string
  subtitle?: string
  root: HtmlNode | HtmlNode[]
  footer?: string
  containerClassName?: string
  scrollable?: boolean
}

interface HtmlLikeSlideCoreProps {
  isActive: boolean
  pageData: HtmlLikePageData
  title?: string
}

const HtmlLikeSlideCore: React.FC<HtmlLikeSlideCoreProps> = ({
  isActive,
  pageData,
}) => {
  return (
    <Slide isActive={isActive} scrollable={pageData.scrollable !== false}>
      <div className="flex flex-col items-center justify-start min-h-full text-center p-6">
        <div
          className={
            pageData.containerClassName ||
            'bg-white bg-opacity-90 rounded-xl p-10 shadow-2xl w-full max-w-6xl'
          }
        >
          <div className="text-left">
            <HtmlLike root={pageData.root} />
          </div>

          {pageData.footer && (
            <p className="text-lg text-gray-600 mt-8 italic text-center">
              {pageData.footer}
            </p>
          )}
        </div>
      </div>
    </Slide>
  )
}

export interface HtmlLikeActivityProps {
  pageData: HtmlLikePageData
  backgroundUrl: string
  title?: string
  onClose?: () => void
  showNavButtons?: boolean
  showSlideCounter?: boolean
}

const HtmlLikeActivity: React.FC<HtmlLikeActivityProps> = ({
  pageData,
  backgroundUrl,
  title,
  onClose,
  showNavButtons = false,
  showSlideCounter = false,
}) => {
  const slides = useMemo(
    () => [
      ({ isActive }: { isActive: boolean }) => (
        <HtmlLikeSlideCore
          isActive={isActive}
          pageData={pageData}
          title={title}
        />
      ),
    ],
    [pageData, title],
  )

  return (
    <PresentationShell
      slides={slides}
      backgroundUrl={backgroundUrl}
      onHomeClick={onClose}
      showNavButtons={showNavButtons}
      showOutlineButton={false}
      showSlideCounter={showSlideCounter}
    />
  )
}

export default HtmlLikeActivity
