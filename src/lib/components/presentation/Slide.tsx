import React from 'react'

interface SlideProps extends React.HTMLAttributes<HTMLDivElement> {
  isActive: boolean
  children: React.ReactNode
}

const Slide: React.FC<SlideProps> = ({
  isActive,
  children,
  className,
  ...props
}) => {
  return (
    <div
      className={`slide px-5 py-2 rounded-xl w-full h-full ${isActive ? 'active' : ''} ${className || ''}`}
      {...props}
    >
      {children}
    </div>
  )
}

export default Slide
