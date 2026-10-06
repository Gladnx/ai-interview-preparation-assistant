import { useEffect, useRef, useState } from 'react'

/**
 * ScrollReveal component that animates elements when they enter/leave the viewport
 * Supports both scrolling down and scrolling back up ("both ways").
 */
export default function ScrollReveal({
  children,
  animation = 'fade-up',
  delay = 0,
  duration = 650,
  threshold = 0.12,
  rootMargin = '0px 0px -40px 0px',
  bothWays = true,
  className = '',
  as: Component = 'div',
  ...props
}) {
  const elementRef = useRef(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const el = elementRef.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        } else if (bothWays) {
          // If bothWays is enabled, reset visibility when exiting viewport
          setIsVisible(false)
        }
      },
      {
        threshold,
        rootMargin,
      }
    )

    observer.observe(el)

    return () => {
      observer.disconnect()
    }
  }, [threshold, rootMargin, bothWays])

  const animClasses = {
    'fade-up': 'translate-y-8 opacity-0',
    'fade-down': '-translate-y-8 opacity-0',
    'fade-left': '-translate-x-8 opacity-0',
    'fade-right': 'translate-x-8 opacity-0',
    'zoom-in': 'scale-95 opacity-0',
    'blur-in': 'blur-sm opacity-0 translate-y-4',
  }

  const baseAnim = animClasses[animation] || animClasses['fade-up']
  const revealedState = 'translate-y-0 translate-x-0 scale-100 blur-0 opacity-100'

  const style = {
    transitionDuration: `${duration}ms`,
    transitionDelay: `${delay}ms`,
    transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
  }

  return (
    <Component
      ref={elementRef}
      style={style}
      className={`transition-all will-change-[transform,opacity] ${
        isVisible ? revealedState : baseAnim
      } ${className}`}
      {...props}
    >
      {children}
    </Component>
  )
}
