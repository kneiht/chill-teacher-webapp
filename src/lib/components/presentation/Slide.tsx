import React from 'react'

interface SlideProps extends React.HTMLAttributes<HTMLDivElement> {
  isActive: boolean
  children: React.ReactNode
  scrollable?: boolean
}

const Slide: React.FC<SlideProps> = React.memo(
  ({ isActive, children, className, scrollable, ...props }) => {
    if (!scrollable) {
      return (
        <div
          className={`slide px-3 py-2 rounded-xl w-full h-full ${isActive ? 'active' : ''} ${className || ''}`}
          {...props}
        >
          {children}
        </div>
      )
    } else {
      return (
        <div className="h-[98%] overflow-auto">
          <div
            className={`slide px-2 py-2 rounded-xl w-full h-full ${isActive ? 'active' : ''} ${className || ''}`}
            {...props}
          >
            {children}
          </div>
        </div>
      )
    }
  },
)

export default Slide
