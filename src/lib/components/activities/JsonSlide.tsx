import React, { useMemo, useState, useEffect } from 'react'
import PresentationShell from '@/lib/components/presentation/PresentationShell'
import Slide from '@/lib/components/presentation/Slide'
import './JsonSlide.css'

interface SlideElement {
  type: string
  content: string
  styles?: string[]
  position?: {
    top?: string
    left?: string
    right?: string
    bottom?: string
  }
  customStyles?: React.CSSProperties
}

interface SlideBackground {
  type: 'gradient' | 'image'
  style?: string
  imageId?: string
  overlay?: string
}

interface SlideData {
  id: string
  background?: SlideBackground
  elements?: SlideElement[]
}

interface Image {
  id: string
  url: string
}

interface JsonSlideData {
  images: Image[]
  slides: SlideData[]
}

interface JsonSlideProps {
  data: JsonSlideData
  onClose?: () => void
}

const JsonSlideCore: React.FC<{
  slide: SlideData
  isActive: boolean
  imagesData: Record<string, string>
}> = ({ slide, isActive, imagesData }) => {
  let backgroundStyle: React.CSSProperties = {}
  let backgroundClasses = ''

  if (slide.background) {
    if (slide.background.type === 'gradient') {
      backgroundClasses += ` ${slide.background.style}`
    } else if (slide.background.type === 'image') {
      const imageUrl = imagesData[slide.background.imageId || '']
      if (imageUrl) {
        backgroundStyle.backgroundImage = `url('${imageUrl}')`
        backgroundClasses += ` ${slide.background.style}`
      }
      if (slide.background.overlay) {
        backgroundClasses += ` ${slide.background.overlay}`
      }
    }
  }

  const isAnimationClass = (className: string) => {
    const animations = [
      'fade-in',
      'slide-in-up',
      'slide-in-left',
      'slide-in-right',
      'zoom-in',
    ]
    return animations.includes(className)
  }

  return (
    <div
      className={`json-slide ${isActive ? 'active' : ''} ${backgroundClasses}`}
      style={backgroundStyle}
      id={slide.id}
    >
      {slide.elements?.map((el, elIndex) => {
        const wrapperStyle: React.CSSProperties = {}
        if (el.position) {
          if (el.position.top) wrapperStyle.top = el.position.top
          if (el.position.left) wrapperStyle.left = el.position.left
          if (el.position.right) wrapperStyle.right = el.position.right
          if (el.position.bottom) wrapperStyle.bottom = el.position.bottom
        }

        const wrapperClasses = ['slide-element']
        if (el.styles) {
          el.styles.forEach((style) => {
            if (!isAnimationClass(style)) {
              wrapperClasses.push(style)
            }
            if (isAnimationClass(style)) {
              wrapperClasses.push(style)
            }
          })
        }

        return (
          <div
            key={elIndex}
            className={wrapperClasses.join(' ')}
            style={wrapperStyle}
          >
            <div
              className="animate-content"
              style={el.customStyles}
              dangerouslySetInnerHTML={{ __html: el.content }}
            />
          </div>
        )
      })}
    </div>
  )
}

const JsonSlide: React.FC<JsonSlideProps> = ({ data, onClose }) => {
  const [imagesData, setImagesData] = useState<Record<string, string>>({})

  useEffect(() => {
    const imgMap: Record<string, string> = {}
    data.images.forEach((img) => {
      imgMap[img.id] = img.url
    })
    setImagesData(imgMap)
  }, [data])

  const slides = useMemo(
    () =>
      data.slides.map((slide) => ({ isActive }: { isActive: boolean }) => (
        <Slide isActive={isActive} style={{ padding: 0, margin: 0 }}>
          <JsonSlideCore
            slide={slide}
            isActive={isActive}
            imagesData={imagesData}
          />
        </Slide>
      )),
    [data.slides, imagesData],
  )

  return (
    <PresentationShell
      slides={slides}
      onHomeClick={onClose}
      showNavButtons={true}
      showSlideCounter={true}
      showFullscreenButton={true}
    />
  )
}

export default JsonSlide
