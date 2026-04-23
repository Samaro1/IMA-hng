import { useState } from 'react'
import './FilterDropdown.css'

const STATUSES = ['all', 'draft', 'pending', 'paid']

function FilterDropdown({ selected, onChange }) {
  const [open, setOpen] = useState(false)

  const handleToggle = (status) => {
    if (status === 'all') {
      onChange(['all'])
      return
    }

    if (selected.includes('all')) {
      onChange([status])
      return
    }

    if (selected.includes(status)) {
      const next = selected.filter(s => s !== status)
      onChange(next.length === 0 ? ['all'] : next)
    } else {
      onChange([...selected, status])
    }
  }

  return (
    <div className="filter">
      <button
        className="filter__trigger"
        onClick={() => setOpen(prev => !prev)}
        aria-expanded={open}
        aria-haspopup="listbox"
      >
        <span>Filter <span className="filter__hide-mobile">by status</span></span>
        <span className={`filter__chevron ${open ? 'filter__chevron--open' : ''}`}>▾</span>
      </button>

      {open && (
        <div className="filter__dropdown" role="listbox">
          {STATUSES.map(status => (
            <label key={status} className="filter__option">
              <input
                type="checkbox"
                checked={selected.includes(status)}
                onChange={() => handleToggle(status)}
              />
              <span className="filter__checkbox-custom" />
              <span className="filter__label">
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </span>
            </label>
          ))}
        </div>
      )}
    </div>
  )
}

export default FilterDropdown