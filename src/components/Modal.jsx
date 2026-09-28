import { useEffect, useRef } from 'react'

/** Nativer <dialog>-Wrapper als JSX-Komponente (Ticket/KI/Post-Dialoge). */
export default function Modal({ open, onClose, children, wide }) {
  const ref = useRef(null)

  useEffect(() => {
    const d = ref.current
    if (!d) return
    if (open && !d.open) d.showModal()
    if (!open && d.open) d.close()
  }, [open ])

  useEffect(() => {
    const d = ref.current
    if (!d) return
    const onCancel = (e) => {
      e.preventDefault()
      onClose?.()
    }
    const onClick = (e) => {
      if (e.target === d) onClose?.()
    }
    d.addEventListener('cancel', onCancel)
    d.addEventListener('click', onClick)
    return () => {
      d.removeEventListener('cancel', onCancel)
      d.removeEventListener('click', onClick)
    }
  }, [onClose])

  return (
    <dialog ref={ref} className={wide ? 'w-[min(680px,94vw)]' : 'w-[min(560px,92vw)]'}>
      {children}
    </dialog>
  )
}
