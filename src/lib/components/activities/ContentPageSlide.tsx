import React, { useMemo } from 'react'

// Components
import PresentationShell from '@/lib/components/presentation/PresentationShell'
import Slide from '@/lib/components/presentation/Slide'

// Types for different content blocks
type ContentBlock =
  | {
      type: 'heading'
      level: 1 | 2 | 3 | 4 | 5 | 6
      text: string
      className?: string
    }
  | { type: 'paragraph'; text: string; className?: string }
  | { type: 'html'; content: string } // For raw HTML if needed
  | { type: 'link'; text: string; href: string; className?: string }
  | {
      type: 'list'
      ordered: boolean
      items: (
        | string
        | ContentBlock
        | { text: string; children?: ContentBlock[] }
      )[]
      className?: string
    }
  | {
      type: 'image'
      src: string
      alt?: string
      caption?: string
      className?: string
    }
  | { type: 'video'; url: string; title?: string; className?: string }
  | {
      type: 'iframe'
      src: string
      title?: string
      height?: string
      className?: string
    }
  | { type: 'divider'; className?: string }
  | {
      type: 'card'
      title?: string
      content: ContentBlock[]
      className?: string
    }
  | { type: 'columns'; columns: ContentBlock[][]; className?: string }
  | { type: 'button'; text: string; href: string; className?: string }
  | { type: 'quote'; text: string; author?: string; className?: string }
  | { type: 'code'; language?: string; code: string; className?: string }
  | { type: 'table'; headers: string[]; rows: string[][]; className?: string }
  | { type: 'spacer'; height?: string }

interface ContentPageData {
  title?: string
  subtitle?: string
  content: ContentBlock[]
  footer?: string
  containerClassName?: string
  scrollable?: boolean
}

interface ContentPageSlideCoreProps {
  isActive: boolean
  pageData: ContentPageData
  title?: string
}

// Render individual content block
const renderContentBlock = (
  block: ContentBlock,
  index: number,
): React.ReactNode => {
  switch (block.type) {
    case 'heading': {
      const HeadingTag = `h${block.level}` as
        | 'h1'
        | 'h2'
        | 'h3'
        | 'h4'
        | 'h5'
        | 'h6'
      const defaultClass = {
        1: 'text-4xl font-bold text-indigo-700 mb-6',
        2: 'text-3xl font-bold text-indigo-600 mb-5',
        3: 'text-2xl font-semibold text-indigo-600 mb-4',
        4: 'text-1xl font-semibold text-gray-800 mb-3',
        5: 'text-xl font-semibold text-gray-800 mb-2',
        6: 'text-lg font-semibold text-gray-700 mb-2',
      }[block.level]
      return (
        <HeadingTag key={index} className={block.className || defaultClass}>
          {block.text}
        </HeadingTag>
      )
    }

    case 'paragraph':
      return (
        <p key={index} className={block.className}>
          {block.text}
        </p>
      )

    case 'html':
      return (
        <div
          key={index}
          dangerouslySetInnerHTML={{ __html: block.content }}
          className="mb-4"
        />
      )

    case 'link':
      return (
        <a
          key={index}
          href={block.href}
          target="_blank"
          rel="noopener noreferrer"
          className={
            block.className ||
            'text-indigo-600 underline hover:text-indigo-800 break-all'
          }
        >
          {block.text}
        </a>
      )

    case 'list':
      const ListTag = block.ordered ? 'ol' : 'ul'
      const listClass = block.ordered ? 'list-decimal' : ''
      return (
        <ListTag
          key={index}
          className={
            `${listClass} list-inside ` + (block.className || '') ||
            `text-xl text-gray-800 space-y-3 mb-6 ml-4`
          }
        >
          {block.items.map((item, i) => {
            // If item is a string, render as plain text
            if (typeof item === 'string') {
              return (
                <li key={i} className="leading-relaxed">
                  {item}
                </li>
              )
            }
            // If item is an object with text and children (for nested content in same li)
            if (
              typeof item === 'object' &&
              'text' in item &&
              !('type' in item)
            ) {
              return (
                <li key={i} className="leading-relaxed">
                  {'bold' in item && (item as any).bold ? (
                    <strong>{(item as any).text}</strong>
                  ) : (
                    <>{(item as any).text}</>
                  )}
                  {item.children && (
                    <div className="mt-2">
                      {item.children.map((child, j) =>
                        renderContentBlock(child, j),
                      )}
                    </div>
                  )}
                </li>
              )
            }
            // If item is a ContentBlock (nested content), render it
            return (
              <li key={i} className="leading-relaxed">
                {renderContentBlock(item, i)}
              </li>
            )
          })}
        </ListTag>
      )

    case 'image':
      return (
        <div key={index} className={block.className || 'mb-6'}>
          <img
            src={block.src}
            alt={block.alt || ''}
            className="w-full rounded-xl shadow-lg"
          />
          {block.caption && (
            <p className="text-center text-gray-600 italic mt-2">
              {block.caption}
            </p>
          )}
        </div>
      )

    case 'video':
      return (
        <div key={index} className={block.className || 'mb-6'}>
          <div className="relative" style={{ paddingBottom: '56.25%' }}>
            <iframe
              src={block.url}
              title={block.title || 'Video'}
              className="absolute top-0 left-0 w-full h-full rounded-xl"
              allowFullScreen
            />
          </div>
        </div>
      )

    case 'iframe':
      return (
        <div key={index} className={block.className || 'mb-6'}>
          <iframe
            src={block.src}
            title={block.title || 'Content'}
            className="w-full rounded-xl border-0"
            style={{ height: block.height || '500px' }}
          />
        </div>
      )

    case 'divider':
      return (
        <hr
          key={index}
          className={block.className || 'my-8 border-t-2 border-gray-300'}
        />
      )

    case 'card':
      return (
        <div
          key={index}
          className={
            block.className ||
            'bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-6 mb-6 shadow-md'
          }
        >
          {block.title && (
            <h3 className="text-2xl font-bold text-indigo-700 mb-4">
              {block.title}
            </h3>
          )}
          {block.content.map((subBlock, i) => renderContentBlock(subBlock, i))}
        </div>
      )

    case 'columns':
      return (
        <div
          key={index}
          className={
            block.className ||
            `grid grid-cols-${block.columns.length} gap-6 mb-6`
          }
        >
          {block.columns.map((column, i) => (
            <div key={i} className="space-y-4">
              {column.map((subBlock, j) => renderContentBlock(subBlock, j))}
            </div>
          ))}
        </div>
      )

    case 'button':
      return (
        <a
          key={index}
          href={block.href}
          target="_blank"
          rel="noopener noreferrer"
          className={
            block.className ||
            'inline-block bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors font-semibold mb-4'
          }
        >
          {block.text}
        </a>
      )

    case 'quote':
      return (
        <blockquote
          key={index}
          className={
            block.className ||
            'border-l-4 border-indigo-500 pl-6 py-4 mb-6 italic text-gray-700 bg-gray-50 rounded-r-lg'
          }
        >
          <p className="text-xl mb-2">"{block.text}"</p>
          {block.author && (
            <footer className="text-gray-600 text-lg">— {block.author}</footer>
          )}
        </blockquote>
      )

    case 'code':
      return (
        <pre
          key={index}
          className={
            block.className ||
            'bg-gray-900 text-gray-100 rounded-lg p-4 mb-6 overflow-x-auto'
          }
        >
          <code className="text-sm">{block.code}</code>
        </pre>
      )

    case 'table':
      return (
        <div key={index} className={block.className || 'mb-6 overflow-x-auto'}>
          <table className="min-w-full bg-white border border-gray-300 rounded-lg">
            <thead className="bg-indigo-100">
              <tr>
                {block.headers.map((header, i) => (
                  <th
                    key={i}
                    className="px-4 py-3 text-left text-sm font-semibold text-gray-700 border-b"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {block.rows.map((row, i) => (
                <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  {row.map((cell, j) => (
                    <td
                      key={j}
                      className="px-4 py-3 text-sm text-gray-700 border-b"
                    >
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )

    case 'spacer':
      return <div key={index} style={{ height: block.height || '2rem' }} />

    default:
      return null
  }
}

const ContentPageSlideCore: React.FC<ContentPageSlideCoreProps> = ({
  isActive,
  pageData,
  title,
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
          {/* Content Blocks */}
          <div className="text-left">
            {pageData.content.map((block, index) =>
              renderContentBlock(block, index),
            )}
          </div>

          {/* Footer */}
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

// Activity Interface
interface ContentPageSlideProps {
  pageData: ContentPageData
  backgroundUrl: string
  title?: string
  onClose?: () => void
  showNavButtons?: boolean
  showSlideCounter?: boolean
}

const ContentPageSlide: React.FC<ContentPageSlideProps> = ({
  pageData,
  backgroundUrl,
  title,
  onClose,
  showNavButtons = false,
  showSlideCounter = false,
}) => {
  const contentSlides = useMemo(
    () => [
      ({ isActive }: { isActive: boolean }) => (
        <ContentPageSlideCore
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
      slides={contentSlides}
      backgroundUrl={backgroundUrl}
      onHomeClick={onClose}
      showNavButtons={showNavButtons}
      showOutlineButton={false}
      showSlideCounter={showSlideCounter}
    />
  )
}

export default ContentPageSlide
