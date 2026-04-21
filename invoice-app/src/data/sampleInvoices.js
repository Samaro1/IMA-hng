const sampleInvoices = [
  {
    id: "RT3080",
    createdAt: "2021-08-18",
    paymentDue: "2021-08-19",
    description: "Re-branding",
    paymentTerms: 1,
    clientName: "Jensen Huang",
    clientEmail: "jensenh@mail.com",
    status: "paid",
    senderAddress: { street: "19 Union Terrace", city: "London", postCode: "E1 3EZ", country: "United Kingdom" },
    clientAddress: { street: "106 Kendell Street", city: "Sherbrooke", postCode: "QC J1H 5N3", country: "Canada" },
    items: [{ id: "1", name: "Brand Guidelines", quantity: 1, price: 1800.90, total: 1800.90 }],
    total: 1800.90
  },
  {
    id: "XM9141",
    createdAt: "2021-08-21",
    paymentDue: "2021-09-20",
    description: "Graphic Design",
    paymentTerms: 30,
    clientName: "Alex Grim",
    clientEmail: "alexgrim@mail.com",
    status: "pending",
    senderAddress: { street: "19 Union Terrace", city: "London", postCode: "E1 3EZ", country: "United Kingdom" },
    clientAddress: { street: "84 Church Way", city: "Bradford", postCode: "BD1 9PB", country: "United Kingdom" },
    items: [
      { id: "1", name: "Banner Design", quantity: 1, price: 156.00, total: 156.00 },
      { id: "2", name: "Email Design", quantity: 2, price: 200.00, total: 400.00 }
    ],
    total: 556.00
  },
  {
    id: "RG0314",
    createdAt: "2021-09-24",
    paymentDue: "2021-10-01",
    description: "Website Redesign",
    paymentTerms: 7,
    clientName: "John Morrison",
    clientEmail: "jm@myco.com",
    status: "draft",
    senderAddress: { street: "19 Union Terrace", city: "London", postCode: "E1 3EZ", country: "United Kingdom" },
    clientAddress: { street: "79 Dover Road", city: "Westhall", postCode: "IP19 3PF", country: "United Kingdom" },
    items: [{ id: "1", name: "Website Redesign", quantity: 1, price: 14002.33, total: 14002.33 }],
    total: 14002.33
  },
  {
    id: "AA1449",
    createdAt: "2021-10-07",
    paymentDue: "2021-10-14",
    description: "UI UX Design",
    paymentTerms: 7,
    clientName: "Alysa Werner",
    clientEmail: "alysa@email.co.uk",
    status: "pending",
    senderAddress: { street: "19 Union Terrace", city: "London", postCode: "E1 3EZ", country: "United Kingdom" },
    clientAddress: { street: "63 Warwick Road", city: "Carlisle", postCode: "CA20 2TG", country: "United Kingdom" },
    items: [{ id: "1", name: "UI Design", quantity: 3, price: 100.00, total: 300.00 }],
    total: 300.00
  },
  {
    id: "TY9141",
    createdAt: "2021-10-11",
    paymentDue: "2021-10-12",
    description: "Logo Concept",
    paymentTerms: 1,
    clientName: "Mellisa Clarke",
    clientEmail: "mellisa.clarke@example.com",
    status: "paid",
    senderAddress: { street: "19 Union Terrace", city: "London", postCode: "E1 3EZ", country: "United Kingdom" },
    clientAddress: { street: "46 Abbey Row", city: "Cambridge", postCode: "CB5 6EG", country: "United Kingdom" },
    items: [
      { id: "1", name: "Logo Sketches", quantity: 5, price: 200.00, total: 1000.00 }
    ],
    total: 1000.00
  }
]

export default sampleInvoices