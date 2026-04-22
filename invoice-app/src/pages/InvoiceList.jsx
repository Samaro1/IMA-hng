import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import useLocalStorage from '../hooks/useLocalStorage'
import sampleInvoices from '../data/sampleInvoices'
import InvoiceCard from '../components/InvoiceCard'
import FilterDropdown from '../components/FilterDropdown'
import { useTheme } from '../context/ThemeContext'
import Sidebar from '../components/Sidebar'
import InvoiceForm from '../components/InvoiceForm'
import './InvoiceList.css'

function InvoiceList() {
  const [invoices, setInvoices] = useLocalStorage('invoices', sampleInvoices)
  const [filterStatuses, setFilterStatuses] = useState([])
  const [showForm, setShowForm] = useState(false)
  const { theme } = useTheme()
  const navigate = useNavigate()

  const filtered = filterStatuses.length === 0
    ? invoices
    : invoices.filter(inv => filterStatuses.includes(inv.status))

  const invoiceCount = filtered.length

  return (
    <div className="app-layout">
      <Sidebar />

      <main className="main-content">
        <div className="list-header">
          <div>
            <h1 className="list-header__title">Invoices</h1>
            <p className="list-header__count">
              {invoiceCount === 0
                ? 'No invoices'
                : `There are ${invoiceCount} total invoice${invoiceCount !== 1 ? 's' : ''}`}
            </p>
          </div>
          <div className="list-header__actions">
            <FilterDropdown
              selected={filterStatuses}
              onChange={setFilterStatuses}
            />
            <button
              className="btn btn--primary"
              onClick={() => setShowForm(true)}
            >
              <span className="btn__icon">+</span>
              <span>New <span className="btn__hide-mobile">Invoice</span></span>
            </button>
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state__illustration">📭</div>
            <h2>Nothing here</h2>
            <p>
              {filterStatuses.length > 0
                ? 'No invoices match the selected filter.'
                : 'Create an invoice by clicking the New Invoice button.'}
            </p>
          </div>
        ) : (
          <div className="invoice-list">
            {filtered.map(invoice => (
              <InvoiceCard key={invoice.id} invoice={invoice} />
            ))}
          </div>
        )}
      </main>

      {showForm && (
      <InvoiceForm
        onClose={() => setShowForm(false)}
        setInvoices={setInvoices}
      />
    )}
    </div>
  )
}

export default InvoiceList