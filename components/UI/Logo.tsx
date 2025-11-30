import React from 'react'
import { cn } from '@/lib/utils'

interface LogoProps {
  size?: 'sm' | 'md' | 'lg'
  showText?: boolean
  className?: string
}

export const Logo: React.FC<LogoProps> = ({ 
  size = 'md', 
  showText = true,
  className 
}) => {
  const sizes = {
    sm: {
      icon: 'w-10 h-10',
      text: 'text-xl',
      iconText: 'text-base',
    },
    md: {
      icon: 'w-12 h-12',
      text: 'text-2xl',
      iconText: 'text-lg',
    },
    lg: {
      icon: 'w-16 h-16',
      text: 'text-3xl sm:text-4xl',
      iconText: 'text-2xl',
    },
  }

  const currentSize = sizes[size]

  return (
    <div className={cn('flex items-center gap-3', className)}>
      {/* Logomarca */}
      <div className={cn(
        currentSize.icon,
        'rounded-xl bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800',
        'flex items-center justify-center shadow-lg shadow-primary-500/30',
        'relative overflow-hidden'
      )}>
        {/* Efeito de brilho sutil */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent"></div>
        <span className={cn(
          'text-white font-bold relative z-10',
          currentSize.iconText
        )}>
          DX
        </span>
      </div>
      
      {showText && (
        <div className="text-center">
          <h1 className={cn(
            'font-bold bg-gradient-to-r from-primary-600 via-primary-700 to-primary-800',
            'bg-clip-text text-transparent tracking-tight',
            currentSize.text
          )}>
            DemandeX
          </h1>
          {size !== 'sm' && (
            <p className="text-base sm:text-lg md:text-xl mt-3 font-semibold italic tracking-wide leading-relaxed max-w-xs mx-auto px-4 relative">
              <span className="text-slate-700 drop-shadow-sm">
                Gerenciando sua vida com{' '}
                <span className="text-primary-600 font-bold">inteligência</span>
              </span>
            </p>
          )}
        </div>
      )}
    </div>
  )
}

