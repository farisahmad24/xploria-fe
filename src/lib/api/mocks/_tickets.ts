// Mock for GET /tickets (list)
export default [
  {
    id: "1",
    code: "TK-20261108-001",
    visitorName: "Budi Santoso",
    visitDate: "2026-11-25",
    status: "booked",
    items: [{ name: "Tiket Dewasa", quantity: 2 }],
  },
  {
    id: "2",
    code: "TK-20261108-002",
    visitorName: "Siti Rahma",
    visitDate: "2026-11-26",
    status: "validated",
    items: [{ name: "Tiket Anak", quantity: 1 }],
  },
];
