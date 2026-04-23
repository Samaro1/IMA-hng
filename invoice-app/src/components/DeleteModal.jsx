import { useEffect, useRef } from 'react'
import './DeleteModal.css'

function DeleteModal({ invoiceId, onConfirm, onCancel }) {
  const modalRef = useRef(null)

  useEffect(() => {
    const previouslyFocused = document.activeElement
    const focusableElements = () => Array.from(
      modalRef.current?.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])') || []
    ).filter(el => !el.hasAttribute('disabled'))

    const handleKey = (e) => {
      if (e.key === 'Escape') {
        onCancel()
        return
      }

      if (e.key !== 'Tab') return

      const focusable = focusableElements()
      if (focusable.length === 0) return

      const first = focusable[0]
      const last = focusable[focusable.length - 1]

      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault()
          last.focus()
        }
      } else if (document.activeElement === last) {
        e.preventDefault()
        first.focus()
      }
    }

    document.addEventListener('keydown', handleKey)
    modalRef.current?.querySelector('button')?.focus()

    return () => {
      document.removeEventListener('keydown', handleKey)
      previouslyFocused?.focus()
    }
  }, [onCancel])

  return (
    <div
      className="modal-overlay"
      onClick={onCancel}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div
        className="modal"
        ref={modalRef}
        onClick={e => e.stopPropagation()}
      >
        <h2 id="modal-title" className="modal__title">Confirm Deletion</h2>
        <p className="modal__body">
          Are you sure you want to delete invoice <strong>#{invoiceId}</strong>?
          This action cannot be undone.
        </p>
        <div className="modal__actions">
          <button
            className="btn btn--soft"
            onClick={onCancel}
          >
            Cancel
          </button>
          <button
            className="btn btn--danger"
            onClick={onConfirm}
            autoFocus
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  )
}

export default DeleteModal