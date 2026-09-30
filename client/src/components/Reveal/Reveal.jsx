import { motion } from 'framer-motion'

/**
 * Subtle fade-up-on-scroll wrapper. Animates once, respects reduced-motion
 * implicitly via small distance/duration values.
 */
export default function Reveal({ children, delay = 0, y = 24, className = '', as = 'div' }) {
  const MotionTag = motion[as] ?? motion.div

  return (
    <MotionTag
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </MotionTag>
  )
}
