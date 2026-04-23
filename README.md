# Invoice App

A fully functional invoice management application built with React and Vite.

## Setup Instructions

### Prerequisites
- Node.js 16+

### Installation
```bash
npm install
```

### Development
```bash
npm run dev
```

### Build
```bash
npm run build
```

### Preview
```bash
npm run preview
```

## Architecture

**Tech Stack**
- React 19 for UI components
- React Router v7 for client-side routing
- Vite for fast builds and HMR
- CSS custom properties for theming

**Project Structure**
```
src/
├── pages/          # Route pages (InvoiceList, InvoiceDetail)
├── components/     # Reusable UI components
├── context/        # React Context (ThemeContext)
├── hooks/          # Custom hooks (useLocalStorage)
├── utils/          # Helper functions (invoice calculations, ID generation)
├── data/           # Sample data
├── styles/         # Global variables and theme tokens
└── App.jsx         # Router setup
```

**Key Components**
- `InvoiceList`: Browse, filter, and create invoices
- `InvoiceDetail`: View invoice details, edit, mark paid, delete
- `InvoiceForm`: Create/edit invoices with validation
- `DeleteModal`: Confirmation modal with accessibility features
- `FilterDropdown`: Multi-status filter with All/Draft/Pending/Paid
- `StatusBadge`: Visual status indicator
- `Sidebar`: Fixed navigation with theme toggle
- `ThemeContext`: Global light/dark mode management

## Trade-offs

- **LocalStorage only** (not IndexedDB/backend): Simpler initial implementation but limited to browser storage; easily upgradeable to a backend API
- **No pagination**: Works well for small invoice sets; would need pagination for thousands of invoices
- **Form overlay vs modal page**: Single panel form maximizes screen usage on mobile but requires careful focus management
- **Inline edit vs separate edit page**: Form modal approach avoids route complexity; could be refactored to a dedicated page if needed

## Accessibility Notes

- **Semantic HTML**: Proper `<label>`, `<button>`, `<address>` elements
- **ARIA labels**: All modals use `role="dialog"`, `aria-modal="true"`, form uses `aria-labelledby`
- **Keyboard navigation**: ESC closes modals, Tab traps focus inside modals, Enter activates buttons
- **Focus management**: Focus restored after modal close, initial focus set on form open
- **Color contrast**: WCAG AA compliant in both light and dark modes
- **Hover/active states**: Clear visual feedback on all interactive elements

## Improvements Beyond Requirements

- **Focus trapping**: Modals trap keyboard focus to prevent accidental background interaction
- **Overlay dismiss**: Click outside form/modal to close
- **Mobile top bar**: Sidebar converts to horizontal top nav on mobile (<768px)
- **Responsive detail page**: Invoice details adapt layout for small screens
- **Error summary**: Form shows validation errors before submission
- **Saved state persistence**: Theme preference survives page reload
- **Invoice calculations**: Automatic item total and grand total computation
- **Date formatting**: Locale-aware date display
- **Rich status filtering**: All invoices view + multi-status filter with smart toggle
- **Vercel deployment ready**: `vercel.json` configured for SPA routing
