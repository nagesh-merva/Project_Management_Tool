import {
    DollarSign,
    TrendingUp,
    Users,
    MapPin,
    FileText,
    AlertCircle,
    Target,
} from 'lucide-react'

const SalesFinanceCard = ({ salesData }) => {
    const getGrowthColor = (growth) => {
        if (growth > 0) return 'text-green-600'
        if (growth === 0) return 'text-gray-600'
        return 'text-red-600'
    }

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 ">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h3 className="text-xl font-bold text-gray-900">Sales & Finance</h3>
                    <p className="text-gray-600">Revenue & Performance Overview</p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-blue-600 rounded-lg flex items-center justify-center">
                    <DollarSign className="text-white" size={24} />
                </div>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <div className="text-center p-4 bg-green-50 rounded-lg border border-green-100">
                    <Target className="text-green-600 mx-auto mb-2" size={20} />
                    <p className="text-2xl font-bold text-green-600">{salesData.totalDeals}</p>
                    <p className="text-xs text-gray-600">Deals Closed</p>
                </div>
                <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-100">
                    <DollarSign className="text-blue-600 mx-auto mb-2" size={20} />
                    <p className="text-2xl font-bold text-blue-600">₹{salesData.monthlyRevenue.toLocaleString()}</p>
                    <p className="text-xs text-gray-600">Monthly Revenue</p>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg border border-purple-100">
                    <TrendingUp className="text-purple-600 mx-auto mb-2" size={20} />
                    <p className={`text-2xl font-bold ${getGrowthColor(salesData.quarterlyGrowth)}`}>
                        {salesData.quarterlyGrowth > 0 ? '+' : ''}{salesData.quarterlyGrowth}%
                    </p>
                    <p className="text-xs text-gray-600">Quarterly Growth</p>
                </div>
                <div className="text-center p-4 bg-orange-50 rounded-lg border border-orange-100">
                    <Users className="text-orange-600 mx-auto mb-2" size={20} />
                    <p className="text-2xl font-bold text-orange-600">₹{salesData.costPerClient.toLocaleString()}</p>
                    <p className="text-xs text-gray-600">Cost/Client</p>
                </div>
            </div>
            <div className="mb-6">
                <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <TrendingUp className="text-blue-600" size={18} />
                    Revenue Trend (Last 6 Months)
                </h4>
                <div className="flex items-end gap-2 h-32">
                    {salesData.revenueTrend.map((revenue, index) => (
                        <div key={index} className="flex-1 flex flex-col items-center">
                            <div
                                className="bg-gradient-to-t from-blue-500 to-blue-400 rounded-t w-full relative group"
                                style={{ height: `${(revenue / Math.max(...salesData.revenueTrend)) * 100}%` }}
                            >
                                <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                                    ₹{revenue.toLocaleString()}
                                </div>
                            </div>
                            <span className="text-xs text-gray-600 mt-1">M{index + 1}</span>
                        </div>
                    ))}
                </div>
            </div>

            <div className="mb-6">
                <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <Users className="text-purple-600" size={18} />
                    Top Clients by Revenue
                </h4>
                <div className="space-y-3">
                    {salesData.topClients.map((client, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                                    {client.name.charAt(0)}
                                </div>
                                <div>
                                    <p className="font-medium text-gray-900">{client.name}</p>
                                    <p className="text-xs text-gray-600 flex items-center gap-1">
                                        <MapPin size={10} />
                                        {client.region}
                                    </p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="font-bold text-green-600">₹{client.revenue.toLocaleString()}</p>
                                <p className="text-xs text-gray-600">{client.projects} projects</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <div className="mb-6">
                <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <MapPin className="text-green-600" size={18} />
                    Sales by Region
                </h4>
                <div className="space-y-2">
                    {salesData.salesByRegion.map((region, index) => (
                        <div key={index} className="flex items-center justify-between">
                            <span className="text-sm text-gray-700">{region.region}</span>
                            <div className="flex items-center gap-2 flex-1 mx-3">
                                <div className="flex-1 bg-gray-200 rounded-full h-2">
                                    <div
                                        className="bg-gradient-to-r from-green-500 to-blue-500 h-2 rounded-full transition-all duration-500"
                                        style={{ width: `${(region.sales / Math.max(...salesData.salesByRegion.map(r => r.sales))) * 100}%` }}
                                    ></div>
                                </div>
                                <span className="text-sm font-medium text-gray-900">₹{region.sales.toLocaleString()}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                    <div className="flex items-center gap-2 mb-2">
                        <FileText className="text-yellow-600" size={16} />
                        <span className="text-sm font-medium text-yellow-800">Pending Invoices</span>
                    </div>
                    <p className="text-xl font-bold text-yellow-600">{salesData.pendingInvoices}</p>
                    <p className="text-xs text-yellow-700">₹{salesData.pendingAmount.toLocaleString()}</p>
                </div>
                <div className="p-3 bg-red-50 rounded-lg border border-red-200">
                    <div className="flex items-center gap-2 mb-2">
                        <AlertCircle className="text-red-600" size={16} />
                        <span className="text-sm font-medium text-red-800">Clearances</span>
                    </div>
                    <p className="text-xl font-bold text-red-600">{salesData.pendingClearances}</p>
                    <p className="text-xs text-red-700">Awaiting approval</p>
                </div>
            </div>
        </div>
    )
}

export default SalesFinanceCard