import React from 'react'

interface GoogleSlideProps extends React.HTMLAttributes<HTMLDivElement> {
  isActive: boolean
  children: React.ReactNode
  className?: string
}

const GoogleSlide: React.FC<GoogleSlideProps> = ({
  isActive,
  children,
  className,
  ...props
}) => {
  return (
    <div
      className={`slide rounded-xl w-full h-full ${isActive ? 'active' : ''} ${className || ''}`}
      {...props}
    >
      {children}
    </div>
  )
}

export default GoogleSlide
