import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { generateId, calcPaymentDue, calcItemTotal, calcGrandTotal } from '../utils/invoiceUtils'
import './InvoiceForm.css'

const emptyForm = {
  senderAddress: { street: '', city: '', postCode: '', country: '' },
  clientName: '',
  clientEmail: '',
  clientAddress: { street: '', city: '', postCode: '', country: '' },
  createdAt: new Date().toISOString().split('T')[0],
  paymentTerms: 30,
  description: '',
  items: [{ id: '1', name: '', quantity: 1, price: 0, total: 0 }]
}

function InvoiceForm({ existingInvoice, onClose, setInvoices }) {
  const navigate = useNavigate()

  // If existingInvoice is passed, editing — seed the form with its values
  // Otherwise creating — start with empty form
  const [form, setForm] = useState(() =>
    existingInvoice
      ? {
          senderAddress: { ...existingInvoice.senderAddress },
          clientName: existingInvoice.clientName,
          clientEmail: existingInvoice.clientEmail,
          clientAddress: { ...existingInvoice.clientAddress },
          createdAt: existingInvoice.createdAt,
          paymentTerms: existingInvoice.paymentTerms,
          description: existingInvoice.description,
          items: existingInvoice.items.map(item => ({ ...item }))
        }
      : { ...emptyForm, senderAddress: { ...emptyForm.senderAddress },
          clientAddress: { ...emptyForm.clientAddress },
          items: [{ ...emptyForm.items[0] }]
        }
  )

  // Validation errors — keyed by field name
  const [errors, setErrors] = useState({})
  // Whether user has tried to submit (controls when errors show)
  const [submitted, setSubmitted] = useState(false)

  // --- Field update helpers ---

  const updateField = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }))
  }

  const updateAddress = (addressType, field, value) => {
    setForm(prev => ({
      ...prev,
      [addressType]: { ...prev[addressType], [field]: value }
    }))
  }

  const updateItem = (index, field, value) => {
    setForm(prev => {
      const items = prev.items.map((item, i) => {
        if (i !== index) return item
        const updated = { ...item, [field]: value }
        // Recalculate total whenever quantity or price changes
        updated.total = calcItemTotal(
          field === 'quantity' ? value : item.quantity,
          field === 'price' ? value : item.price
        )
        return updated
      })
      return { ...prev, items }
    })
  }

  const addItem = () => {
    setForm(prev => ({
      ...prev,
      items: [
        ...prev.items,
        {
          id: String(Date.now()),
          name: '',
          quantity: 1,
          price: 0,
          total: 0
        }
      ]
    }))
  }

  const removeItem = (index) => {
    setForm(prev => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index)
    }))
  }

  // --- Validation ---

  const validate = () => {
    const newErrors = {}

    if (!form.senderAddress.street.trim())
      newErrors.senderStreet = "Required"
    if (!form.senderAddress.city.trim())
      newErrors.senderCity = "Required"
    if (!form.senderAddress.postCode.trim())
      newErrors.senderPostCode = "Required"
    if (!form.senderAddress.country.trim())
      newErrors.senderCountry = "Required"

    if (!form.clientName.trim())
      newErrors.clientName = "Required"

    if (!form.clientEmail.trim()) {
      newErrors.clientEmail = "Required"
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.clientEmail)) {
      newErrors.clientEmail = "Must be a valid email"
    }

    if (!form.clientAddress.street.trim())
      newErrors.clientStreet = "Required"
    if (!form.clientAddress.city.trim())
      newErrors.clientCity = "Required"
    if (!form.clientAddress.postCode.trim())
      newErrors.clientPostCode = "Required"
    if (!form.clientAddress.country.trim())
      newErrors.clientCountry = "Required"

    if (!form.description.trim())
      newErrors.description = "Required"

    if (form.items.length === 0) {
      newErrors.items = "Add at least one item"
    } else {
      form.items.forEach((item, i) => {
        if (!item.name.trim())
          newErrors[`item_${i}_name`] = "Required"
        if (Number(item.quantity) <= 0)
          newErrors[`item_${i}_quantity`] = "Must be > 0"
        if (Number(item.price) < 0)
          newErrors[`item_${i}_price`] = "Must be ≥ 0"
      })
    }

    return newErrors
  }

  // --- Save handlers ---

  const handleSaveDraft = () => {
    // Drafts skip validation entirely
    const newInvoice = buildInvoice('draft')

    if (existingInvoice) {
      setInvoices(prev =>
        prev.map(inv => inv.id === existingInvoice.id ? newInvoice : inv)
      )
    } else {
      setInvoices(prev => [...prev, newInvoice])
    }

    onClose ? onClose() : navigate('/invoices')
  }

  const handleSavePending = () => {
    setSubmitted(true)
    const newErrors = validate()
    setErrors(newErrors)

    if (Object.keys(newErrors).length > 0) return  // stop if invalid

    const newInvoice = buildInvoice('pending')

    if (existingInvoice) {
      setInvoices(prev =>
        prev.map(inv => inv.id === existingInvoice.id ? newInvoice : inv)
      )
    } else {
      setInvoices(prev => [...prev, newInvoice])
    }

    onClose ? onClose() : navigate('/invoices')
  }

  const buildInvoice = (status) => {
    const items = form.items.map(item => ({
      ...item,
      quantity: Number(item.quantity),
      price: Number(item.price),
      total: calcItemTotal(item.quantity, item.price)
    }))

    return {
      id: existingInvoice ? existingInvoice.id : generateId(),
      createdAt: form.createdAt,
      paymentDue: calcPaymentDue(form.createdAt, form.paymentTerms),
      description: form.description,
      paymentTerms: Number(form.paymentTerms),
      clientName: form.clientName,
      clientEmail: form.clientEmail,
      status: existingInvoice?.status === 'paid' ? 'paid' : status,
      senderAddress: { ...form.senderAddress },
      clientAddress: { ...form.clientAddress },
      items,
      total: calcGrandTotal(items)
    }
  }

  // Re-validate on every change after first submit attempt
  useEffect(() => {
    if (submitted) setErrors(validate())
  }, [form, submitted])

  const hasErrors = Object.keys(errors).length > 0
  const formRef = useRef(null)

  const closeForm = () => {
    if (onClose) {
      onClose()
    } else {
      navigate('/invoices')
    }
  }

  useEffect(() => {
    formRef.current?.querySelector('input, select, button, textarea')?.focus()

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        closeForm()
      }

      if (e.key !== 'Tab' || !formRef.current) {
        return
      }

      const focusable = Array.from(
        formRef.current.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])')
      ).filter(el => !el.hasAttribute('disabled'))

      if (focusable.length === 0) return

      const first = focusable[0]
      const last = focusable[focusable.length - 1]

      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault()
          last.focus()
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault()
          first.focus()
        }
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [navigate, onClose])

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) closeForm()
  }

  // --- Render ---
  return (
    <div className="form-overlay" onClick={handleOverlayClick}>
      <div
        className="form-panel"
        ref={formRef}
        onClick={e => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="invoice-form-title"
      >

        <h2 id="invoice-form-title" className="form-panel__title">
          {existingInvoice
            ? <>Edit <span>#</span>{existingInvoice.id}</>
            : 'New Invoice'
          }
        </h2>

        <div className="form-body">

          {/* Bill From */}
          <fieldset className="form-section">
            <legend className="form-section__legend">Bill From</legend>
            <div className="form-group form-group--full">
              <label htmlFor="senderStreet">Street Address</label>
              <input
                id="senderStreet"
                className={errors.senderStreet ? 'input--error' : ''}
                value={form.senderAddress.street}
                onChange={e => updateAddress('senderAddress', 'street', e.target.value)}
              />
              {errors.senderStreet && <span className="error-msg">{errors.senderStreet}</span>}
            </div>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="senderCity">City</label>
                <input
                  id="senderCity"
                  className={errors.senderCity ? 'input--error' : ''}
                  value={form.senderAddress.city}
                  onChange={e => updateAddress('senderAddress', 'city', e.target.value)}
                />
                {errors.senderCity && <span className="error-msg">{errors.senderCity}</span>}
              </div>
              <div className="form-group">
                <label htmlFor="senderPostCode">Post Code</label>
                <input
                  id="senderPostCode"
                  className={errors.senderPostCode ? 'input--error' : ''}
                  value={form.senderAddress.postCode}
                  onChange={e => updateAddress('senderAddress', 'postCode', e.target.value)}
                />
                {errors.senderPostCode && <span className="error-msg">{errors.senderPostCode}</span>}
              </div>
              <div className="form-group">
                <label htmlFor="senderCountry">Country</label>
                <input
                  id="senderCountry"
                  className={errors.senderCountry ? 'input--error' : ''}
                  value={form.senderAddress.country}
                  onChange={e => updateAddress('senderAddress', 'country', e.target.value)}
                />
                {errors.senderCountry && <span className="error-msg">{errors.senderCountry}</span>}
              </div>
            </div>
          </fieldset>

          {/* Bill To */}
          <fieldset className="form-section">
            <legend className="form-section__legend">Bill To</legend>
            <div className="form-group form-group--full">
              <label htmlFor="clientName">Client's Name</label>
              <input
                id="clientName"
                className={errors.clientName ? 'input--error' : ''}
                value={form.clientName}
                onChange={e => updateField('clientName', e.target.value)}
              />
              {errors.clientName && <span className="error-msg">{errors.clientName}</span>}
            </div>
            <div className="form-group form-group--full">
              <label htmlFor="clientEmail">Client's Email</label>
              <input
                id="clientEmail"
                type="email"
                className={errors.clientEmail ? 'input--error' : ''}
                value={form.clientEmail}
                onChange={e => updateField('clientEmail', e.target.value)}
              />
              {errors.clientEmail && <span className="error-msg">{errors.clientEmail}</span>}
            </div>
            <div className="form-group form-group--full">
              <label htmlFor="clientStreet">Street Address</label>
              <input
                id="clientStreet"
                className={errors.clientStreet ? 'input--error' : ''}
                value={form.clientAddress.street}
                onChange={e => updateAddress('clientAddress', 'street', e.target.value)}
              />
              {errors.clientStreet && <span className="error-msg">{errors.clientStreet}</span>}
            </div>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="clientCity">City</label>
                <input
                  id="clientCity"
                  className={errors.clientCity ? 'input--error' : ''}
                  value={form.clientAddress.city}
                  onChange={e => updateAddress('clientAddress', 'city', e.target.value)}
                />
                {errors.clientCity && <span className="error-msg">{errors.clientCity}</span>}
              </div>
              <div className="form-group">
                <label htmlFor="clientPostCode">Post Code</label>
                <input
                  id="clientPostCode"
                  className={errors.clientPostCode ? 'input--error' : ''}
                  value={form.clientAddress.postCode}
                  onChange={e => updateAddress('clientAddress', 'postCode', e.target.value)}
                />
                {errors.clientPostCode && <span className="error-msg">{errors.clientPostCode}</span>}
              </div>
              <div className="form-group">
                <label htmlFor="clientCountry">Country</label>
                <input
                  id="clientCountry"
                  className={errors.clientCountry ? 'input--error' : ''}
                  value={form.clientAddress.country}
                  onChange={e => updateAddress('clientAddress', 'country', e.target.value)}
                />
                {errors.clientCountry && <span className="error-msg">{errors.clientCountry}</span>}
              </div>
            </div>
          </fieldset>

          {/* Invoice Details */}
          <fieldset className="form-section">
            <legend className="form-section__legend">Invoice Details</legend>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="createdAt">Invoice Date</label>
                <input
                  id="createdAt"
                  type="date"
                  value={form.createdAt}
                  onChange={e => updateField('createdAt', e.target.value)}
                />
              </div>
              <div className="form-group">
                <label htmlFor="paymentTerms">Payment Terms</label>
                <select
                  id="paymentTerms"
                  value={form.paymentTerms}
                  onChange={e => updateField('paymentTerms', e.target.value)}
                >
                  <option value={1}>Net 1 Day</option>
                  <option value={7}>Net 7 Days</option>
                  <option value={14}>Net 14 Days</option>
                  <option value={30}>Net 30 Days</option>
                </select>
              </div>
            </div>
            <div className="form-group form-group--full">
              <label htmlFor="description">Project Description</label>
              <input
                id="description"
                className={errors.description ? 'input--error' : ''}
                value={form.description}
                onChange={e => updateField('description', e.target.value)}
              />
              {errors.description && <span className="error-msg">{errors.description}</span>}
            </div>
          </fieldset>

          {/* Item List */}
          <div className="form-section">
            <h3 className="form-section__legend form-section__legend--items">
              Item List
            </h3>

            {errors.items && (
              <span className="error-msg error-msg--block">{errors.items}</span>
            )}

            <div className="items-list">
              {/* Header row — desktop only */}
              <div className="items-list__header">
                <span>Item Name</span>
                <span>Qty.</span>
                <span>Price</span>
                <span>Total</span>
                <span></span>
              </div>

              {form.items.map((item, index) => (
                <div key={item.id} className="items-list__row">
                  <div className="form-group">
                    <label className="items-list__mobile-label">Item Name</label>
                    <input
                      className={errors[`item_${index}_name`] ? 'input--error' : ''}
                      value={item.name}
                      onChange={e => updateItem(index, 'name', e.target.value)}
                    />
                    {errors[`item_${index}_name`] && (
                      <span className="error-msg">{errors[`item_${index}_name`]}</span>
                    )}
                  </div>
                  <div className="form-group">
                    <label className="items-list__mobile-label">Qty.</label>
                    <input
                      type="number"
                      min="1"
                      className={errors[`item_${index}_quantity`] ? 'input--error' : ''}
                      value={item.quantity}
                      onChange={e => updateItem(index, 'quantity', e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label className="items-list__mobile-label">Price</label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      className={errors[`item_${index}_price`] ? 'input--error' : ''}
                      value={item.price}
                      onChange={e => updateItem(index, 'price', e.target.value)}
                    />
                  </div>
                  <div className="form-group items-list__total">
                    <label className="items-list__mobile-label">Total</label>
                    <span>
                      {new Intl.NumberFormat('en-GB', {
                        style: 'currency',
                        currency: 'GBP'
                      }).format(item.total)}
                    </span>
                  </div>
                  <button
                    type="button"
                    className="items-list__delete"
                    onClick={() => removeItem(index)}
                    aria-label="Remove item"
                  >
                    🗑
                  </button>
                </div>
              ))}
            </div>

            <button
              type="button"
              className="btn btn--add-item"
              onClick={addItem}
            >
              + Add New Item
            </button>
          </div>

          {/* Global error summary */}
          {submitted && hasErrors && (
            <div className="form-error-summary">
              <p>- All fields must be added</p>
              {errors.items && <p>- An item must be added</p>}
            </div>
          )}

        </div>

        {/* Form actions */}
        <div className="form-actions">
          {existingInvoice ? (
            <>
              <button
                type="button"
                className="btn btn--soft"
                onClick={() => onClose ? onClose() : navigate(-1)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn btn--primary"
                onClick={handleSavePending}
              >
                Save Changes
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                className="btn btn--soft"
                onClick={() => navigate('/invoices')}
              >
                Discard
              </button>
              <button
                type="button"
                className="btn btn--secondary-dark"
                onClick={handleSaveDraft}
              >
                Save as Draft
              </button>
              <button
                type="button"
                className="btn btn--primary"
                onClick={handleSavePending}
              >
                Save & Send
              </button>
            </>
          )}
        </div>

      </div>
    </div>
  )
}

export default InvoiceForm