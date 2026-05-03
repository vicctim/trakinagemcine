'use client'

import React, { useRef, useEffect, useState } from 'react'
import CountUp from 'react-countup'
import { useInView } from 'react-intersection-observer'

interface AnimatedCounterProps {
  end: number
  suffix?: string
  prefix?: string
  duration?: number
  label: string
}

export function AnimatedCounter({
  end,
  suffix = '',
  prefix = '',
  duration = 2.5,
  label,
}: AnimatedCounterProps) {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.3 })
  const [started, setStarted] = useState(false)

  useEffect(() => {
    if (inView && !started) setStarted(true)
  }, [inView, started])

  return (
    <div ref={ref} className="counter">
      <span className="counter__value">
        {prefix}
        {started ? <CountUp end={end} duration={duration} separator="." /> : '0'}
        {suffix}
      </span>
      <span className="counter__label">{label}</span>

      <style>{`
        .counter {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.5rem;
        }

        .counter__value {
          font-family: var(--font-heading);
          font-size: clamp(2rem, 4vw, 3.5rem);
          font-weight: 600;
          color: var(--color-accent);
          line-height: 1;
        }

        .counter__label {
          font-size: 0.85rem;
          color: inherit;
          opacity: 0.65;
          text-align: center;
        }
      `}</style>
    </div>
  )
}
