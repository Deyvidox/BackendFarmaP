import database from "../database.js"

export const GetDashboardStats = async () => {
    const beneficiariesSql = `SELECT COUNT(*) AS total FROM beneficiaries WHERE status = 'Active'`
    const usersSql = `SELECT COUNT(*) AS total FROM users WHERE status = 'Active'`
    const donationsSql = `SELECT COUNT(*) AS total, COALESCE(SUM(estimated_total_value), 0) AS total_value FROM donations`
    const requestsSql = `SELECT COUNT(*) AS total FROM requests WHERE status = 'Pending'`
    const deliveriesSql = `SELECT COUNT(*) AS total FROM deliveries WHERE status IN ('Scheduled','In Transit')`

    const alertsSql = `
        SELECT COUNT(*) AS total
        FROM medicine_lots
        WHERE status = 'Available' AND expiration_date <= CURRENT_DATE + INTERVAL '30 days'
    `

    const [beneficiaries, users, donations, requests, deliveries, alerts] = await Promise.all([
        database.query(beneficiariesSql),
        database.query(usersSql),
        database.query(donationsSql),
        database.query(requestsSql),
        database.query(deliveriesSql),
        database.query(alertsSql)
    ])

    return {
        results: 1,
        data: {
            beneficiaries: parseInt(beneficiaries.rows[0].total),
            users: parseInt(users.rows[0].total),
            donations: parseInt(donations.rows[0].total),
            donationsValue: parseFloat(donations.rows[0].total_value),
            pendingRequests: parseInt(requests.rows[0].total),
            activeDeliveries: parseInt(deliveries.rows[0].total),
            expiringAlerts: parseInt(alerts.rows[0].total)
        }
    }
}
