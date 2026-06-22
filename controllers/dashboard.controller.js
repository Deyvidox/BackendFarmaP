import { GetDashboardStats } from "../modules/dashboard.modules.js"

export const GetDashboardStatsControl = async (req, res, next) => {
    try {
        const { data } = await GetDashboardStats()
        req.message = { type: "Successfully", message: { stats: data }, status: 200 }
        return next()
    } catch (err) {
        req.message = { type: "Error", message: err.message, status: 500 }
        return next()
    }
}
