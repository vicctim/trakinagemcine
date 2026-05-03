'use client'

import React, { useRef, useEffect, ReactNode } from 'react'
import { motion, useInView, useAnimation, Variant } from 'framer-motion'

interface ScrollRevealProps {
  children: ReactNode
  direction?: 'up' | 'down' | 'left' | 'right'
  delay?: number
  duration?: number
  distance?: number
  once?: boolean
  className?: string
}

const directionMap: Record<string, { x?: number; y?: number }> = {
  up: { y: 40 },
  down: { y: -40 },
  left: { x: 40 },
  right: { x: -40 },
}

export function ScrollReveal({
  children,
  direction = 'up',
  delay = 0,
  duration = 0.6,
  distance = 40,
  once = true,
  className,
}: ScrollRevealProps) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once, margin: '-80px' })
  const controls = useAnimation()

  const offset = directionMap[direction] || { y: distance }

  useEffect(() => {
    if (isInView) {
      controls.start('visible')
    }
  }, [isInView, controls])

  const hidden: Variant = {
    opacity: 0,
    ...(offset.x !== undefined ? { x: offset.x } : {}),
    ...(offset.y !== undefined ? { y: offset.y } : {}),
  }

  const visible: Variant = {
    opacity: 1,
    x: 0,
    y: 0,
    transition: {
      duration,
      delay,
      ease: [0.25, 0.4, 0.25, 1],
    },
  }

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={controls}
      variants={{ hidden, visible }}
      className={className}
    >
      {children}
    </motion.div>
  )
}
