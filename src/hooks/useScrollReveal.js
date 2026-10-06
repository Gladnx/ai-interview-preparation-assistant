import { useEffect, useRef, useState } from 'react'

/**
 * Custom hook to observe an element's scroll visibility both ways.
 * 
 * @param {Object} options
 * @param {number} options.threshold - Threshold for triggering (0.0 - 1.0)
 * @param {string} options.rootMargin - Margin around the root
 * @param {boolean} options.bothWays - Whether to trigger on both scroll in and scroll out
 * @returns {[React.RefObject, boolean]}
 */
export function useScrollReveal({
  threshold = 0.12,
  rootMargin = '0px 0px -40px 0px',
  bothWays = true,
} = {}) {
  const ref = useRef(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const node = ref.current
    if (!node) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        } else if (bothWays) {
          setIsVisible(false)
        }
      },
      { threshold, rootMargin }
    )

    observer.observe(node)

    return () => {
      observer.disconnect()
    }
  }, [threshold, rootMargin, bothWays])

  return [ref, isVisible]
}
