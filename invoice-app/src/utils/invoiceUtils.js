// Generates a random invoice ID like "RT3080"
export function generateId() {
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
  const randomLetters =
    letters[Math.floor(Math.random() * 26)] +
    letters[Math.floor(Math.random() * 26)]
  const randomNumbers = Math.floor(1000 + Math.random() * 9000)
  return `${randomLetters}${randomNumbers}`
}

// Calculates payment due date from creation date + payment terms (days)
export function calcPaymentDue(createdAt, paymentTerms) {
  const date = new Date(createdAt)
  date.setDate(date.getDate() + Number(paymentTerms))
  return date.toISOString().split('T')[0]  // returns "YYYY-MM-DD"
}

// Calculates total for a single item
export function calcItemTotal(quantity, price) {
  return Number(quantity) * Number(price)
}

// Calculates grand total from all items
export function calcGrandTotal(items) {
  return items.reduce((sum, item) => sum + item.total, 0)
}