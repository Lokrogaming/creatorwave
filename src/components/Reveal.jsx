import { useEffect, useRef } from 'react'

export default function Reveal({ children, className = '', as: Tag = 'div' }) {
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add('visible')
          io.unobserve(e.target)
        }
      }),
      { threshold: 0.12 },
    )
    el.querySelectorAll('.reveal').forEach((n) => io.observe(n))
    if (el.classList.contains('reveal')) io.observe(el)
    return () => io.disconnect()
  }, [])

  return (
    <Tag ref={ref} className={className}>
      {children}
    </Tag>
  )
}
