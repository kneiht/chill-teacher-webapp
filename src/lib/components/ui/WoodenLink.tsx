import React from 'react'
import { Link  } from '@tanstack/react-router'
import type {LinkProps} from '@tanstack/react-router';

interface WoodenLinkProps extends LinkProps {
  children: React.ReactNode
  className?: string
}

const WoodenLink: React.FC<WoodenLinkProps> = ({
  children,
  className,
  ...props
}) => {
  return (
    <Link
      className={`
        px-8 py-4 rounded-lg font-bold text-white text-2xl
        bg-cover bg-center shadow-lg
        border-b-4 border-yellow-900/50
        transition-all duration-150
        transform text-center flex items-center justify-center
        hover:shadow-xl hover:-translate-y-0.5
        active:border-b-0 active:shadow-inner active:translate-y-0.5
        ${className || ''}
      `}
      style={{
        backgroundImage: "url('/textures/wood-texture.jpg')",
        textShadow: '2px 2px 4px rgba(0, 0, 0, 0.6)',
      }}
      {...props}
    >
      {children}
    </Link>
  )
}

export default WoodenLink
