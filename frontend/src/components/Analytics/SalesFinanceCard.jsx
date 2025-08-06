import React from 'react';
import {
    DollarSign,
    TrendingUp,
    Users,
    MapPin,
    FileText,
    AlertCircle,
    Target,
    Calendar,
    PieChart,
    BarChart3,
    Percent
} from 'lucide-react';

const SalesFinanceCard = ({ salesData }) => {
    const formatCurrency = (amount) => {
        if (amount >= 10000000) return `₹${(amount / 10000000).toFixed(1)}Cr`;
        if (amount >= 100000) return `₹${(amount / 100000).toFixed(1)}L`;
        if (amount >= 1000) return `₹${(amount / 1000).toFixed(1)}K`;
        return `₹${amount.toLocaleString()}`;
    };

    const getROIColor = (roi) => {
        if (roi >= 4) return 'text-green-600';
        if (roi >= 2) return 'text-yellow-600';
        return 'text-red-600';
    };

    const getCompletionColor = (rate) => {
        if (rate >= 80) return 'bg-green-500';
        if (rate >= 60) return 'bg-yellow-500';
        return 'bg-red-500';
    };

    const getGrowthColor = (growth) => {
        if (growth > 0) return 'text-green-600';
        if (growth === 0) return 'text-gray-600';
        return 'text-red-600';
    };

    // Get top regions with revenue > 0
    const topRegions = Object.entries(salesData.revenue.regionWise)
        .filter(([_, revenue]) => revenue > 0)
        .sort(([_, a], [__, b]) => b - a)
        .slice(0, 5);

    // Get monthly trend data (for now just current month)
    const monthlyData = Object.entries(salesData.revenue.monthlyTrend);

    // Calculate client metrics
    const activeClients = salesData.clients.topClientsByRevenue.filter(client => client.total_billed > 0);
    const clientRetentionRate = (salesData.clients.repeatClients / salesData.clients.total) * 100;

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h3 className="text-xl font-bold text-gray-900">Sales & Finance Analytics</h3>
                    <p className="text-gray-600">Revenue & Performance Overview</p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-blue-600 rounded-lg flex items-center justify-center">
                    <DollarSign className="text-white" size={24} />
                </div>
            </div>

            {/* Key Metrics Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <div className="text-center p-4 bg-green-50 rounded-lg border border-green-100">
                    <DollarSign className="text-green-600 mx-auto mb-2" size={20} />
                    <p className="text-2xl font-bold text-green-600">{formatCurrency(salesData.revenue.total)}</p>
                    <p className="text-xs text-gray-600">Total Revenue</p>
                </div>
                <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-100">
                    <Users className="text-blue-600 mx-auto mb-2" size={20} />
                    <p className="text-2xl font-bold text-blue-600">{salesData.clients.total}</p>
                    <p className="text-xs text-gray-600">Total Clients</p>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg border border-purple-100">
                    <Target className="text-purple-600 mx-auto mb-2" size={20} />
                    <p className="text-2xl font-bold text-purple-600">{salesData.projects.total}</p>
                    <p className="text-xs text-gray-600">Total Projects</p>
                </div>
                <div className="text-center p-4 bg-orange-50 rounded-lg border border-orange-100">
                    <Percent className="text-orange-600 mx-auto mb-2" size={20} />
                    <p className="text-2xl font-bold text-orange-600">{salesData.finance.avgProfitMargin.toFixed(1)}%</p>
                    <p className="text-xs text-gray-600">Avg Profit Margin</p>
                </div>
            </div>

            {/* Financial Overview */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                {/* Revenue Breakdown */}
                <div>
                    <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                        <PieChart className="text-green-600" size={18} />
                        Financial Overview
                    </h4>
                    <div className="space-y-3">
                        <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                            <span className="text-sm font-medium text-gray-700">Total Revenue</span>
                            <span className="font-bold text-green-600">{formatCurrency(salesData.revenue.total)}</span>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                            <span className="text-sm font-medium text-gray-700">Total Cost</span>
                            <span className="font-bold text-red-600">{formatCurrency(salesData.finance.totalCost)}</span>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                            <span className="text-sm font-medium text-gray-700">Cost-to-Revenue Ratio</span>
                            <span className="font-bold text-blue-600">{(salesData.finance.costToRevenueRatio * 100).toFixed(2)}%</span>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                            <span className="text-sm font-medium text-gray-700">Avg Project Value</span>
                            <span className="font-bold text-purple-600">{formatCurrency(salesData.revenue.avgProjectValue)}</span>
                        </div>
                    </div>
                </div>

                {/* Project Performance */}
                <div>
                    <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                        <BarChart3 className="text-blue-600" size={18} />
                        Project Performance
                    </h4>
                    <div className="space-y-3">
                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-medium text-gray-700">Completion Rate</span>
                                <span className="text-sm text-gray-600">{salesData.projects.completionRate.toFixed(1)}%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-3">
                                <div
                                    className={`h-3 rounded-full transition-all duration-500 ${getCompletionColor(salesData.projects.completionRate)}`}
                                    style={{ width: `${salesData.projects.completionRate}%` }}
                                ></div>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <div className="text-center p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                                <p className="text-lg font-bold text-yellow-600">{salesData.projects.delayedProjects}</p>
                                <p className="text-xs text-gray-600">Delayed Projects</p>
                            </div>
                            <div className="text-center p-3 bg-indigo-50 rounded-lg border border-indigo-200">
                                <p className="text-lg font-bold text-indigo-600">{Math.round(salesData.projects.avgDurationDays)}</p>
                                <p className="text-xs text-gray-600">Avg Duration (Days)</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Top Clients */}
            <div className="mb-6">
                <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <Users className="text-purple-600" size={18} />
                    Top Clients by Revenue
                </h4>
                <div className="space-y-3">
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

            {/* Regional Performance */}
            <div className="mb-6">
                <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <MapPin className="text-green-600" size={18} />
                    Revenue by Region
                </h4>
                <div className="space-y-2">
                    {topRegions.map(([region, revenue], index) => (
                        <div key={index} className="flex items-center justify-between">
                            <span className="text-sm text-gray-700 truncate flex-1 mr-3">{region}</span>
                            <div className="flex items-center gap-2 flex-1">
                                <div className="flex-1 bg-gray-200 rounded-full h-2">
                                    <div
                                        className="bg-gradient-to-r from-green-500 to-blue-500 h-2 rounded-full transition-all duration-500"
                                        style={{ width: `${(revenue / salesData.revenue.total) * 100}%` }}
                                    ></div>
                                </div>
                                <span className="text-sm font-medium text-gray-900 min-w-fit">{formatCurrency(revenue)}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* ROI Performance */}
            <div className="mb-6">
                <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <TrendingUp className="text-indigo-600" size={18} />
                    Project ROI Performance
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {salesData.projects.roiPerProject.map((project, index) => (
                        <div key={index} className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium text-gray-700">{project.project_id}</span>
                                <span className={`text-sm font-bold ${getROIColor(project.roi)}`}>
                                    {project.roi.toFixed(2)}x
                                </span>
                            </div>
                            <div className="mt-2">
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                    <div
                                        className={`h-2 rounded-full transition-all duration-500 ${project.roi >= 4 ? 'bg-green-500' :
                                            project.roi >= 2 ? 'bg-yellow-500' : 'bg-red-500'
                                            }`}
                                        style={{ width: `${Math.min((project.roi / 5) * 100, 100)}%` }}
                                    ></div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Client Insights */}
            <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="flex items-center gap-2 mb-2">
                        <Users className="text-blue-600" size={16} />
                        <span className="text-sm font-medium text-blue-800">New Clients</span>
                    </div>
                    <p className="text-xl font-bold text-blue-600">{salesData.clients.newClientsThisQuarter}</p>
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

            {/* Revenue Trend */}
            <div className="mb-6">
                <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <TrendingUp className="text-blue-600" size={18} />
                    Revenue Trend (Last 6 Months)
                </h4>
                <div className="flex items-end gap-2 h-32">
                    {salesData.revenueTrend?.map((revenue, index) => (
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

            {/* Top Clients */}
            <div className="mb-6">
                <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <Users className="text-purple-600" size={18} />
                    Top Clients by Revenue
                </h4>
                <div className="space-y-3">
                    {salesData.topClients?.map((client, index) => (
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

            {/* Sales by Region */}
            <div className="mb-6">
                <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <MapPin className="text-green-600" size={18} />
                    Sales by Region
                </h4>
                <div className="space-y-2">
                    {salesData.salesByRegion?.map((region, index) => (
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

            {/* Pending Items */}
            <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                    <div className="flex items-center gap-2 mb-2">
                        <FileText className="text-yellow-600" size={16} />
                        <span className="text-sm font-medium text-yellow-800">Pending Invoices</span>
                    </div>
                    <p className="text-xl font-bold text-yellow-600">{salesData.pendingInvoices}</p>
                    <p className="text-xs text-yellow-700">₹{salesData.pendingAmount?.toLocaleString()}</p>
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
    );
};

export default SalesFinanceCard;