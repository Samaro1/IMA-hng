import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import useLocalStorage from '../hooks/useLocalStorage'
import sampleInvoices from '../data/sampleInvoices'
import StatusBadge from '../components/StatusBadge'
import DeleteModal from '../components/DeleteModal'
import { useTheme } from '../context/ThemeContext'
import Sidebar from '../components/Sidebar'

import './InvoiceDetail.css'

function InvoiceDetail() {
  
  const { id } = useParams()
  const navigate = useNavigate()
  const [invoices, setInvoices] = useLocalStorage('invoices', sampleInvoices)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const { theme, toggleTheme } = useTheme()

  const invoice = invoices.find(inv => inv.id === id)

  // Redirect if invoice not found
  if (!invoice) {
    return (
      <div className="not-found">
        <p>Invoice not found.</p>
        <button className="btn btn--soft" onClick={() => navigate('/invoices')}>
          Go back
        </button>
      </div>
    )
  }

  const formatDate = (dateStr) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    })
  }

  const formatAmount = (amount) => {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP'
    }).format(amount)
  }

  const handleMarkAsPaid = () => {
    setInvoices(prev =>
      prev.map(inv =>
        inv.id === id ? { ...inv, status: 'paid' } : inv
      )
    )
  }

  const handleDelete = () => {
    setInvoices(prev => prev.filter(inv => inv.id !== id))
    navigate('/invoices')
  }

  return (
    <div className="app-layout">
        <Sidebar />
      {/* Main content */}
      <main className="detail-content">

        {/* Back button */}
        <button
          className="back-btn"
          onClick={() => navigate('/invoices')}
        >
          <span className="back-btn__arrow">‹</span>
          Go back
        </button>

        {/* Status bar */}
        <div className="detail-status-bar">
          <span className="detail-status-bar__label">Status</span>
          <StatusBadge status={invoice.status} />
          <div className="detail-status-bar__actions">
            {invoice.status !== 'paid' && (
              <button
                className="btn btn--secondary"
                onClick={() => navigate(`/invoices/${id}/edit`)}
              >
                Edit
              </button>
            )}
            <button
              className="btn btn--danger"
              onClick={() => setShowDeleteModal(true)}
            >
              Delete
            </button>
            {invoice.status === 'pending' && (
              <button
                className="btn btn--primary"
                onClick={handleMarkAsPaid}
              >
                Mark as Paid
              </button>
            )}
          </div>
        </div>

        {/* Invoice card */}
        <div className="detail-card">

          {/* Top: ID + addresses */}
          <div className="detail-card__top">
            <div>
              <h2 className="detail-card__id">
                <span className="detail-card__hash">#</span>{invoice.id}
              </h2>
              <p className="detail-card__desc">{invoice.description}</p>
            </div>
            <address className="detail-card__sender">
              <p>{invoice.senderAddress.street}</p>
              <p>{invoice.senderAddress.city}</p>
              <p>{invoice.senderAddress.postCode}</p>
              <p>{invoice.senderAddress.country}</p>
            </address>
          </div>

          {/* Middle: dates + client info */}
          <div className="detail-card__meta">
            <div className="detail-card__meta-col">
              <div>
                <p className="detail-label">Invoice Date</p>
                <p className="detail-value">{formatDate(invoice.createdAt)}</p>
              </div>
              <div>
                <p className="detail-label">Payment Due</p>
                <p className="detail-value">{formatDate(invoice.paymentDue)}</p>
              </div>
            </div>
            <div className="detail-card__meta-col">
              <p className="detail-label">Bill To</p>
              <p className="detail-value">{invoice.clientName}</p>
              <address className="detail-card__client-addr">
                <p>{invoice.clientAddress.street}</p>
                <p>{invoice.clientAddress.city}</p>
                <p>{invoice.clientAddress.postCode}</p>
                <p>{invoice.clientAddress.country}</p>
              </address>
            </div>
            <div className="detail-card__meta-col">
              <p className="detail-label">Sent To</p>
              <p className="detail-value">{invoice.clientEmail}</p>
            </div>
          </div>

          {/* Items table */}
          <div className="detail-items">
            <div className="detail-items__header">
              <span>Item Name</span>
              <span>QTY.</span>
              <span>Price</span>
              <span>Total</span>
            </div>
            {invoice.items.map(item => (
              <div key={item.id} className="detail-items__row">
                <span className="detail-items__name">{item.name}</span>
                <span className="detail-items__qty">{item.quantity}</span>
                <span className="detail-items__price">{formatAmount(item.price)}</span>
                <span className="detail-items__total">{formatAmount(item.total)}</span>
              </div>
            ))}
            <div className="detail-items__footer">
              <span>Amount Due</span>
              <span className="detail-items__grand-total">
                {formatAmount(invoice.total)}
              </span>
            </div>
          </div>

        </div>

        {/* Mobile action bar */}
        <div className="detail-mobile-actions">
          {invoice.status !== 'paid' && (
            <button
              className="btn btn--secondary"
              onClick={() => navigate(`/invoices/${id}/edit`)}
            >
              Edit
            </button>
          )}
          <button
            className="btn btn--danger"
            onClick={() => setShowDeleteModal(true)}
          >
            Delete
          </button>
          {invoice.status === 'pending' && (
            <button
              className="btn btn--primary"
              onClick={handleMarkAsPaid}
            >
              Mark as Paid
            </button>
          )}
        </div>

      </main>

      {/* Delete modal */}
      {showDeleteModal && (
        <DeleteModal
          invoiceId={invoice.id}
          onConfirm={handleDelete}
          onCancel={() => setShowDeleteModal(false)}
        />
      )}
    </div>
  )
}

export default InvoiceDetail