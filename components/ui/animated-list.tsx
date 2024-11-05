"use client"

import React, {
  ReactElement,
  ReactNode,
  useEffect,
  useState,
  useRef,
} from "react"
import { AnimatePresence, motion } from "framer-motion"

export interface AnimatedListProps {
  className?: string
  children: React.ReactNode
  delay?: number
}

export const AnimatedList = React.memo(
  ({ className, children, delay = 1000 }: AnimatedListProps) => {
    const [messages, setMessages] = useState<ReactNode[]>([])
    const [isInView, setIsInView] = useState(false)
    const containerRef = useRef<HTMLDivElement>(null)
    const childrenArray = React.Children.toArray(children)

    useEffect(() => {
      const observer = new IntersectionObserver(
        ([entry]) => {
          setIsInView(entry.isIntersecting)
        },
        {
          threshold: 0.1, // Trigger when 10% of the component is visible
          rootMargin: "50px", // Start loading slightly before the component is in view
        }
      )

      if (containerRef.current) {
        observer.observe(containerRef.current)
      }

      return () => observer.disconnect()
    }, [])

    useEffect(() => {
      let interval: NodeJS.Timeout

      if (isInView) {
        interval = setInterval(() => {
          if (messages.length < childrenArray.length) {
            setMessages((prev) => [childrenArray[messages.length], ...prev])
          } else {
            clearInterval(interval)
          }
        }, delay)
      }

      return () => clearInterval(interval)
    }, [childrenArray, delay, messages.length, isInView])

    return (
      <div 
        ref={containerRef}
        className={`flex flex-col-reverse items-center gap-4 ${className}`}
      >
        <AnimatePresence>
          {messages.map((item) => (
            <AnimatedListItem key={(item as ReactElement).key}>
              {item}
            </AnimatedListItem>
          ))}
        </AnimatePresence>
      </div>
    )
  }
)

AnimatedList.displayName = "AnimatedList"

export function AnimatedListItem({ children }: { children: React.ReactNode }) {
  const animations = {
    initial: { scale: 0, opacity: 0 },
    animate: { scale: 1, opacity: 1, originY: 0 },
    exit: { scale: 0, opacity: 0 },
    transition: { type: "spring", stiffness: 350, damping: 40 },
  }

  return (
    <motion.div {...animations} layout className="mx-auto w-full">
      {children}
    </motion.div>
  )
}