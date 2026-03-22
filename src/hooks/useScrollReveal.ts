'use client'

import { useEffect } from 'react'

export function useScrollReveal() {
  useEffect(() => {
    const reveals = document.querySelectorAll('.reveal')

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible')
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    )

    reveals.forEach((el) => observer.observe(el))

    return () => observer.disconnect()
  }, [])
}

export function useCounterAnimation() {
  useEffect(() => {
    const counters = document.querySelectorAll<HTMLElement>('.stat-num[data-count]')

    const animateCounter = (el: HTMLElement) => {
      const target = parseInt(el.dataset.count || '0', 10)
      const suffix = el.dataset.suffix || ''
      const duration = 1500
      const startTime = performance.now()

      const update = (currentTime: number) => {
        const elapsed = currentTime - startTime
        const progress = Math.min(elapsed / duration, 1)
        const eased = 1 - Math.pow(1 - progress, 3)
        const current = Math.floor(eased * target)
        el.textContent = current + suffix
        if (progress < 1) requestAnimationFrame(update)
      }

      requestAnimationFrame(update)
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animateCounter(entry.target as HTMLElement)
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.5 }
    )

    counters.forEach((el) => observer.observe(el))

    return () => observer.disconnect()
  }, [])
}
