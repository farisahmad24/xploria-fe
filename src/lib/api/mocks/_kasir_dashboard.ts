// Mock for /kasir/Dashboard
export default {
  data: {
    period: { month: "2026-11", comparison_month: "2026-10" },
    summary: {
      tickets_sold: 20,
      validated_tickets: 15,
      visitors: 25,
      ticket_revenue: 750000,
      changes: {
        tickets_sold_percent: 5,
        validated_tickets_percent: 3,
        visitors_percent: 4,
        ticket_revenue_percent: 6
      }
    },
    activity_chart: { period: "7d", start_date: "2026-11-14", end_date: "2026-11-20", data: [] },
    upcoming_calendar: { month: "2026-11", days: [] },
    recent_activities: []
  }
};