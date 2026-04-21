import { useEffect } from 'react'
import './DeleteModal.css'

function DeleteModal({ invoiceId, onConfirm, onCancel }) {
  // Close on ESC key
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'Escape') onCancel()
    }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [onCancel])

  // Trap focus inside modal when open
  useEffect(() => {
    const previouslyFocused = document.activeElement
    return () => previouslyFocused?.focus()
  }, [])

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