import { TrendingUp } from "lucide-react"


const MetricsOverview = ({ metrics }) => {
    const getPaymentStatusColor = (status) => {
        const colors = {
            'active': 'bg-green-100 text-green-800 border-green-200',
            'suspended': 'bg-red-100 text-red-800 border-red-200',
            'pending': 'bg-yellow-100 text-yellow-800 border-yellow-200'
        }
        return colors[status] || 'bg-gray-100 text-gray-800 border-gray-200'
    }

    return (
        <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2 mb-4">
                <TrendingUp className="text-purple-600" size={20} />
                Metrics Overview
            </h2>
            <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-blue-50 rounded-lg">
                    <p className="text-2xl font-bold text-blue-600">{metrics.total_projects}</p>
                    <p className="text-sm text-gray-600">Total Projects</p>
                </div>
                <div className="text-center p-3 bg-green-50 rounded-lg">
                    <p className="text-2xl font-bold text-green-600">
                        ₹{metrics.total_billed.toLocaleString()}
                    </p>
                    <p className="text-sm text-gray-600">Total Billed</p>
                </div>
            </div>
            <div className="mt-4 space-y-2">
                <div className="flex items-center justify-between">
                    <span className="text-gray-600">Last Project</span>
                    <span className="font-medium">{metrics.last_project_date?.split("T")[0]}</span>
                </div>
                <div className="flex items-center justify-between">
                    <span className="text-gray-600">Payment Status</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getPaymentStatusColor(metrics.payment_status)}`}>
                        {metrics.payment_status}
                    </span>
                </div>
            </div>
        </div>
    )
}

export default MetricsOverview