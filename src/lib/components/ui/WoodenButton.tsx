// src/lib/components/ui/WoodenButton.tsx

import React from 'react'

interface WoodenButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode
}

const WoodenButton: React.FC<WoodenButtonProps> = ({
  children,
  className,
  ...props
}) => {
  return (
    <button
      className={`
        px-8 py-4 rounded-lg font-bold text-white text-2xl
        bg-cover bg-center shadow-lg
        border-b-4 border-yellow-900/50
        transition-all duration-150
        transform
        hover:shadow-xl hover:-translate-y-0.5
        active:border-b-0 active:shadow-inner active:translate-y-0.5
        ${className || ''}
      `}
      style={{
        // Đường dẫn đến ảnh texture gỗ của bạn
        backgroundImage: "url('/textures/wood-texture.webp')",
        // Tạo hiệu ứng chữ được khắc vào gỗ
        textShadow: '2px 2px 4px rgba(0, 0, 0, 0.6)',
      }}
      {...props}
    >
      {children}
    </button>
  )
}

export default WoodenButton
