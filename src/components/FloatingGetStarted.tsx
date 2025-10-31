'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import CTAButton from '@/components/ui/CTAButton'

type FloatingGetStartedProps = {
  heroSelector?: string
  footerSelector?: string
}

export default function FloatingGetStarted({
  heroSelector = '#homepage-hero',
  footerSelector = 'footer',
}: FloatingGetStartedProps) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const heroEl = document.querySelector(heroSelector)
    const footerEl = document.querySelector(footerSelector)

    // If we can't find elements, default to showing the button
    if (!heroEl && !footerEl) {
      setVisible(true)
      return
    }

    const handleVisibility = () => {
      const heroInView = heroEl ? isElementInViewport(heroEl) : false
      const footerInView = footerEl ? isElementInViewport(footerEl) : false
      setVisible(!(heroInView || footerInView))
    }

    const observer = new IntersectionObserver(
      () => handleVisibility(),
      { root: null, threshold: [0, 0.1, 0.25, 0.5] }
    )

    heroEl && observer.observe(heroEl)
    footerEl && observer.observe(footerEl)

    // Also compute on scroll/resize in case
    handleVisibility()
    window.addEventListener('scroll', handleVisibility, { passive: true })
    window.addEventListener('resize', handleVisibility)

    return () => {
      observer.disconnect()
      window.removeEventListener('scroll', handleVisibility)
      window.removeEventListener('resize', handleVisibility)
    }
  }, [heroSelector, footerSelector])

  return (
    <div
      aria-hidden={!visible}
      className={`fixed bottom-4 right-4 z-50 transition-opacity duration-200 ${
        visible ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
      }`}
    >
      <Link href="/contact">
        <CTAButton variant="accent-primary" size="md">
          Get Started
        </CTAButton>
      </Link>
    </div>
  )
}

function isElementInViewport(el: Element): boolean {
  const rect = el.getBoundingClientRect()
  const vh = window.innerHeight || document.documentElement.clientHeight
  const vw = window.innerWidth || document.documentElement.clientWidth
  // Consider in view if any part of it is on screen
  return rect.bottom > 0 && rect.right > 0 && rect.top < vh && rect.left < vw
}


