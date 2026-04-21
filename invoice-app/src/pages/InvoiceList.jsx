import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import useLocalStorage from '../hooks/useLocalStorage'
import sampleInvoices from '../data/sampleInvoices'
import InvoiceCard from '../components/InvoiceCard'
import FilterDropdown from '../components/FilterDropdown'
import { useTheme } from '../context/ThemeContext'
import './InvoiceList.css'

function InvoiceList() {
  const [invoices, setInvoices] = useLocalStorage('invoices', sampleInvoices)
  const [filterStatuses, setFilterStatuses] = useState([])
  const { theme, toggleTheme } = useTheme()
  const navigate = useNavigate()

  const filtered = filterStatuses.length === 0
    ? invoices
    : invoices.filter(inv => filterStatuses.includes(inv.status))

  const invoiceCount = filtered.length

  return (
    <div className="app-layout">

      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar__logo">
          <div className="sidebar__logo-bg">
            <span className="sidebar__logo-text">F</span>
          </div>
        </div>
        <div className="sidebar__bottom">
          <button
            className="sidebar__theme-btn"
            onClick={toggleTheme}
            aria-label="Toggle theme"
          >
            {theme === 'light' ? '🌙' : '☀️'}
          </button>
          <div className="sidebar__avatar">M</div>
        </div>
      </aside>

      {/* Main content */}
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
              onClick={() => navigate('/invoices/new')}
            >
              <span className="btn__icon">+</span>
              <span>New <span className="btn__hide-mobile">Invoice</span></span>
            </button>
          </div>
        </div>

        {/* Invoice list or empty state */}
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
    </div>
  )
}

export default InvoiceList