import type { Variants } from 'framer-motion'

export const fadeIn: Variants = {
  hidden: { opacity: 0, y: 15, filter: 'blur(4px)' },
  visible: { 
    opacity: 1, 
    y: 0, 
    filter: 'blur(0px)',
    transition: { duration: 0.5, ease: 'easeOut' } 
  }
}

export const staggerContainer = (staggerChildren = 0.1, delayChildren = 0): Variants => ({
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren,
      delayChildren,
    }
  }
})

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.95, filter: 'blur(2px)' },
  visible: { 
    opacity: 1, 
    scale: 1, 
    filter: 'blur(0px)',
    transition: { duration: 0.4, ease: 'easeOut' } 
  }
}

export const slideInLeft: Variants = {
  hidden: { opacity: 0, x: -30, filter: 'blur(2px)' },
  visible: { 
    opacity: 1, 
    x: 0, 
    filter: 'blur(0px)',
    transition: { duration: 0.5, ease: 'easeOut' } 
  }
}

export const slideInRight: Variants = {
  hidden: { opacity: 0, x: 30, filter: 'blur(2px)' },
  visible: { 
    opacity: 1, 
    x: 0, 
    filter: 'blur(0px)',
    transition: { duration: 0.5, ease: 'easeOut' } 
  }
}
