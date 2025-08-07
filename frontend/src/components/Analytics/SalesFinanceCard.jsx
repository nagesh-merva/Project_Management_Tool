import {
    DollarSign,
    TrendingUp,
    Users,
    Target,
    PieChart,
    BarChart3,
    Percent,
    Hash,
    Building2,
    Calendar
} from 'lucide-react'

const SalesFinanceCard = ({ salesData }) => {
    const monthlyTrend = salesData?.revenue?.monthlyTrend || []
    const maxRevenue = monthlyTrend.length > 0 ? Math.max(...monthlyTrend) : 1

    const formatCurrency = (amount) => {
        if (amount >= 10000000) return `₹${(amount / 10000000).toFixed(1)}Cr`
        if (amount >= 100000) return `₹${(amount / 100000).toFixed(1)}L`
        if (amount >= 1000) return `₹${(amount / 1000).toFixed(1)}K`
        return `₹${amount.toLocaleString()}`
    }

    const getROIColor = (roi) => {
        if (roi >= 4) return 'text-green-600'
        if (roi >= 2) return 'text-yellow-600'
        return 'text-red-600'
    }

    const getCompletionColor = (rate) => {
        if (rate >= 80) return 'bg-green-500'
        if (rate >= 60) return 'bg-yellow-500'
        return 'bg-red-500'
    }

    const getROIBgColor = (roi) => {
        if (roi >= 4) return 'bg-green-500'
        if (roi >= 2) return 'bg-yellow-500'
        return 'bg-red-500'
    }

    const getROILabel = (roi) => {
        if (roi >= 4) return 'Excellent'
        if (roi >= 2) return 'Good'
        return 'Poor'
    }

    const activeClients = salesData?.clients?.topClientsByRevenue?.filter(client => client.total_billed > 0) || []
    const clientRetentionRate = salesData?.clients?.total > 0 ? (salesData.clients.repeatClients / salesData.clients.total) * 100 : 0

    const getMonthLabels = () => {
        const labels = []
        const now = new Date()
        
        for (let i = 5; i >= 0; i--) {
            const date = new Date(now.getFullYear(), now.getMonth() - i, 1)
            labels.push({
                short: date.toLocaleDateString('en-US', { month: 'short' }),
                full: date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
            })
        }
        return labels
    }
    
    const monthLabels = getMonthLabels()
    
    const getGrowthPercentage = (current, previous) => {
        if (previous === 0) return current > 0 ? 100 : 0
        return ((current - previous) / previous) * 100
    }

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h3 className="text-xl font-bold text-gray-900">Sales & Finance Analytics</h3>
                    <p className="text-gray-600">Revenue & Performance Overview</p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-blue-600 rounded-lg flex items-center justify-center">
                    <DollarSign className="text-white" size={24} />
                </div>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <div className="relative group text-center p-4 bg-green-50 rounded-lg border border-green-100">
                    <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                        {salesData?.revenue?.total || 0}
                    </div>
                    <DollarSign className="text-green-600 mx-auto mb-2" size={20} />
                    <p className="text-2xl font-bold text-green-600">{formatCurrency(salesData?.revenue?.total || 0)}</p>
                    <p className="text-xs text-gray-600">Total Estimated Revenue</p>
                </div>
                <div className="relative group text-center p-4 bg-blue-50 rounded-lg border border-blue-100">
                    <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                        {salesData?.clients?.total || 0}
                    </div>
                    <Users className="text-blue-600 mx-auto mb-2" size={20} />
                    <p className="text-2xl font-bold text-blue-600">{salesData?.clients?.total || 0}</p>
                    <p className="text-xs text-gray-600">Total Clients</p>
                </div>
                <div className="relative group text-center p-4 bg-purple-50 rounded-lg border border-purple-100">
                    <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                        {salesData?.projects?.total || 0}
                    </div>
                    <Target className="text-purple-600 mx-auto mb-2" size={20} />
                    <p className="text-2xl font-bold text-purple-600">{salesData?.projects?.total || 0}</p>
                    <p className="text-xs text-gray-600">Total Projects</p>
                </div>
                <div className="relative group text-center p-4 bg-orange-50 rounded-lg border border-orange-100">
                    <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                        {(salesData?.finance?.avgProfitMargin || 0).toFixed(1)}%
                    </div>
                    <Percent className="text-orange-600 mx-auto mb-2" size={20} />
                    <p className="text-2xl font-bold text-orange-600">{(salesData?.finance?.avgProfitMargin || 0).toFixed(1)}%</p>
                    <p className="text-xs text-gray-600">Avg Profit Margin</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                <div>
                    <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                        <PieChart className="text-green-600" size={18} />
                        Financial Overview
                    </h4>
                    <div className="space-y-3">
                        <div className="relative group flex items-center justify-between p-3 bg-green-50 rounded-lg">
                            <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                                {salesData?.revenue?.total_this_month || 0}
                            </div>
                            <span className="text-sm font-medium text-gray-700">Total Revenue This Month</span>
                            <span className="font-bold text-green-600">{formatCurrency(salesData?.revenue?.total_this_month || 0)}</span>
                        </div>
                        <div className="relative group flex items-center justify-between p-3 bg-red-50 rounded-lg">
                            <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                                {salesData?.finance?.totalCost || 0}
                            </div>
                            <span className="text-sm font-medium text-gray-700">Total Cost</span>
                            <span className="font-bold text-red-600">{formatCurrency(salesData?.finance?.totalCost || 0)}</span>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                            <span className="text-sm font-medium text-gray-700">Cost-to-Revenue Ratio</span>
                            <span className="font-bold text-blue-600">{((salesData?.finance?.costToRevenueRatio || 0) * 100).toFixed(2)}%</span>
                        </div>
                        <div className="relative group flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                            <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                                {salesData?.revenue?.avgProjectValue || 0}
                            </div>
                            <span className="text-sm font-medium text-gray-700">Avg Project Value</span>
                            <span className="font-bold text-purple-600">{formatCurrency(salesData?.revenue?.avgProjectValue || 0)}</span>
                        </div>
                    </div>
                </div>
                <div>
                    <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                        <BarChart3 className="text-blue-600" size={18} />
                        Project Performance
                    </h4>
                    <div className="space-y-3">
                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-medium text-gray-700">Completion Rate</span>
                                <span className="text-sm text-gray-600">{(salesData?.projects?.completionRate || 0).toFixed(1)}%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-3">
                                <div
                                    className={`h-3 rounded-full transition-all duration-500 ${getCompletionColor(salesData?.projects?.completionRate || 0)}`}
                                    style={{ width: `${salesData?.projects?.completionRate || 0}%` }}
                                ></div>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <div className="text-center p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                                <p className="text-lg font-bold text-yellow-600">{salesData?.projects?.delayedProjects || 0}</p>
                                <p className="text-xs text-gray-600">Delayed Projects</p>
                            </div>
                            <div className="text-center p-3 bg-indigo-50 rounded-lg border border-indigo-200">
                                <p className="text-lg font-bold text-indigo-600">{Math.round(salesData?.projects?.avgDurationDays || 0)}</p>
                                <p className="text-xs text-gray-600">Avg Duration (Days)</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="mb-6">
                <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <Users className="text-purple-600" size={18} />
                    Top Clients by Estimated Revenue
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {activeClients.slice(0, 3).map((client, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                                    {client.client_name.charAt(0)}
                                </div>
                                <div>
                                    <p className="font-medium text-gray-900">{client.client_name}</p>
                                    <p className="text-xs text-gray-600">{client.total_projects} projects</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="font-bold text-green-600">{formatCurrency(client.total_billed)}</p>
                                <p className="text-xs text-gray-600">Revenue</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="mb-6">
                <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <TrendingUp className="text-indigo-600" size={18} />
                    Project ROI Performance
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {(salesData?.projects?.roiPerProject || []).map((project, index) => (
                        <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 hover:shadow-md transition-all duration-300 hover:border-blue-200">
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                                        <Hash className="text-blue-600" size={14} />
                                    </div>
                                    <span className="text-sm font-semibold text-gray-700">{project.project_id}</span>
                                </div>
                                <div className={`px-3 py-1 rounded-full text-xs font-bold ${getROIColor(project.roi)}`}>
                                    {project.roi.toFixed(2)}x ROI
                                </div>
                            </div>
                            <div className="mb-4">
                                <h3 className="text-lg font-bold text-gray-900 mb-1 line-clamp-1">
                                    {project.project_name}
                                </h3>
                                <div className="flex items-center gap-2">
                                    <Building2 className="text-gray-400" size={14} />
                                    <span className="text-sm text-gray-600">{project.client_name}</span>
                                </div>
                            </div>
                            <div className="mb-4">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                                        ROI Performance
                                    </span>
                                    <span className={`text-xs font-medium px-2 py-1 rounded ${getROIColor(project.roi)}`}>
                                        {getROILabel(project.roi)}
                                    </span>
                                </div>
                                <div className="relative">
                                    <div className="w-full bg-gray-200 rounded-full h-3">
                                        <div
                                            className={`h-3 rounded-full transition-all duration-500 ${getROIBgColor(project.roi)}`}
                                            style={{ width: `${Math.min((project.roi / 5) * 100, 100)}%` }}
                                        ></div>
                                    </div>
                                    <div className="flex justify-between mt-1 text-xs text-gray-400">
                                        <span>0x</span>
                                        <span>2x</span>
                                        <span>4x</span>
                                        <span>5x+</span>
                                    </div>
                                </div>
                            </div>
                            {project.cost && (
                                <div className="pt-3 border-t border-gray-100">
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-gray-600">Cost</span>
                                        <span className="font-semibold text-green-600">
                                            ₹{project.cost.toLocaleString()}
                                        </span>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="flex items-center gap-2 mb-2">
                        <Users className="text-blue-600" size={16} />
                        <span className="text-sm font-medium text-blue-800">New Clients</span>
                    </div>
                    <p className="text-xl font-bold text-blue-600">{salesData?.clients?.newClientsThisQuarter || 0}</p>
                    <p className="text-xs text-blue-700">This Quarter</p>
                </div>
                <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                    <div className="flex items-center gap-2 mb-2">
                        <Target className="text-green-600" size={16} />
                        <span className="text-sm font-medium text-green-800">Retention Rate</span>
                    </div>
                    <p className="text-xl font-bold text-green-600">{clientRetentionRate.toFixed(1)}%</p>
                    <p className="text-xs text-green-700">Repeat Clients</p>
                </div>
            </div>

            <div className="mb-6">
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                            <TrendingUp className="text-blue-600" size={18} />
                            Monthly Revenue Trend
                        </h4>
                        {monthlyTrend.length >= 2 && (
                            <div className="text-right">
                                <div className="text-sm text-gray-600">This Month vs Last</div>
                                <div className={`text-sm font-semibold ${
                                    getGrowthPercentage(monthlyTrend[monthlyTrend.length - 1], monthlyTrend[monthlyTrend.length - 2]) >= 0 
                                        ? 'text-green-600' : 'text-red-600'
                                }`}>
                                    {getGrowthPercentage(monthlyTrend[monthlyTrend.length - 1], monthlyTrend[monthlyTrend.length - 2]).toFixed(1)}%
                                </div>
                            </div>
                        )}
                    </div>
                    
                    {monthlyTrend.length > 0 ? (
                        <div className="space-y-3">
                            <div className="flex items-end gap-3 h-40 bg-gray-50 rounded-lg p-4">
                                {monthlyTrend.map((revenue, index) => (
                                    <div key={index} className="flex-1 h-full flex flex-col items-center justify-end group">
                                        <div className="relative w-full h-full flex items-end">
                                            <div
                                                className="bg-gradient-to-t from-blue-500 to-blue-400 rounded-t w-full relative transition-all duration-300 group-hover:from-blue-600 group-hover:to-blue-500 min-h-1"
                                                style={{ 
                                                    height: revenue > 0 ? `${(revenue / maxRevenue) * 100}%` : '4px'
                                                }}
                                            >
                                                <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs px-3 py-2 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-200 whitespace-nowrap z-10 shadow-lg">
                                                    <div className="font-semibold">₹{revenue.toLocaleString()}</div>
                                                    <div className="text-gray-300">{monthLabels[index]?.full}</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            
                            <div className="grid grid-cols-6 gap-2">
                                {monthLabels.map((month, index) => (
                                    <div key={index} className="text-center">
                                        <div className="text-xs font-medium text-gray-900">
                                            {month.short}
                                        </div>
                                        <div className="text-xs text-gray-500 mt-1">
                                            ₹{((monthlyTrend[index] || 0) / 1000).toFixed(0)}K
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div className="flex items-center justify-center h-32 bg-gray-50 rounded-lg">
                            <div className="text-center">
                                <Calendar className="text-gray-400 mx-auto mb-2" size={24} />
                                <p className="text-sm text-gray-500">No revenue data available</p>
                                <p className="text-xs text-gray-400 mt-1">Complete some projects to see trends</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default SalesFinanceCard