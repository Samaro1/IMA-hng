import { useNavigate } from 'react-router-dom'
import StatusBadge from './StatusBadge'
import './InvoiceCard.css'

function InvoiceCard({ invoice }) {
  const navigate = useNavigate()

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

  return (
    <div
      className="invoice-card"
      onClick={() => navigate(`/invoices/${invoice.id}`)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && navigate(`/invoices/${invoice.id}`)}
    >
      <span className="invoice-card__id">
        <span className="invoice-card__hash">#</span>{invoice.id}
      </span>
      <span className="invoice-card__due">
        Due {formatDate(invoice.paymentDue)}
      </span>
      <span className="invoice-card__client">{invoice.clientName}</span>
      <span className="invoice-card__amount">{formatAmount(invoice.total)}</span>
      <StatusBadge status={invoice.status} />
      <span className="invoice-card__arrow">›</span>
    </div>
  )
}

export default InvoiceCard