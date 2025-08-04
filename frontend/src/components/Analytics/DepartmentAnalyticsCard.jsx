import {
    Users,
    FolderOpen,
    TrendingUp,
    DollarSign,
    Target,
    Clock,
    Award,
    AlertCircle
} from 'lucide-react'

const DepartmentAnalyticsCard = ({ department }) => {
    const getBudgetColor = (percentage) => {
        if (percentage >= 90) return 'text-red-600'
        if (percentage >= 70) return 'text-yellow-600'
        return 'text-green-600'
    }

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h3 className="text-xl font-bold text-gray-900">{department.name}</h3>
                    <p className="text-gray-600">Department Analytics</p>
                </div>
                <div className={`w-12 h-12 rounded-lg ${department.color} flex items-center justify-center`}>
                    <department.icon className="text-white" size={24} />
                </div>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <div className="text-center p-3 bg-blue-50 rounded-lg">
                    <Users className="text-blue-600 mx-auto mb-2" size={20} />
                    <p className="text-2xl font-bold text-blue-600">{department.totalEmployees}</p>
                    <p className="text-xs text-gray-600">Employees</p>
                </div>
                <div className="text-center p-3 bg-green-50 rounded-lg">
                    <FolderOpen className="text-green-600 mx-auto mb-2" size={20} />
                    <p className="text-2xl font-bold text-green-600">{department.ongoingProjects}</p>
                    <p className="text-xs text-gray-600">Projects</p>
                </div>
                <div className="text-center p-3 bg-purple-50 rounded-lg">
                    <TrendingUp className="text-purple-600 mx-auto mb-2" size={20} />
                    <p className="text-2xl font-bold text-purple-600">{department.performanceScore}</p>
                    <p className="text-xs text-gray-600">Performance</p>
                </div>
                <div className="text-center p-3 bg-orange-50 rounded-lg">
                    <Target className="text-orange-600 mx-auto mb-2" size={20} />
                    <p className="text-2xl font-bold text-orange-600">{department.deliveryRate}%</p>
                    <p className="text-xs text-gray-600">Delivery</p>
                </div>
            </div>
            <div className="mb-6">
                <div className="flex items-center justify-between mb-3">
                    <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                        <DollarSign className="text-green-600" size={18} />
                        Budget Usage
                    </h4>

                </div>
                <div className="relative">
                    <div className="w-full bg-gray-200 rounded-full h-3">
                        {/* <div
                            className={`h-3 rounded-full transition-all duration-500 ${department.budgetUsage?.percentage >= 90 ? 'bg-red-500' :
                                department.budgetUsage?.percentage >= 70 ? 'bg-yellow-500' : 'bg-green-500'
                                }`}
                            style={{ width: `${department.budgetUsage.percentage}%` }}
                        ></div> */}
                    </div>
                    <div className="flex justify-between text-xs text-gray-600 mt-1">
                        <span>₹{department.budgetUsage.toLocaleString()}</span>
                        {/* <span>₹{department.budgetUsage.allocated.toLocaleString()}</span> */}
                    </div>
                </div>
            </div>
            <div className="mb-6">
                <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <Award className="text-yellow-600" size={18} />
                    Top Performers
                </h4>
                <div className="space-y-2">
                    {department.topPerformers.map((performer, index) => (
                        <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                                    {performer.name.split(' ').map(n => n[0]).join('')}
                                </div>
                                <span className="text-sm font-medium text-gray-900">{performer.name}</span>
                            </div>
                            <div className="flex items-center gap-1">
                                {[...Array(5)].map((_, i) => (
                                    <span
                                        key={i}
                                        className={`text-xs ${i < Math.floor(performer.rating) ? 'text-yellow-400' : 'text-gray-300'}`}
                                    >
                                        ★
                                    </span>
                                ))}
                                <span className="text-xs text-gray-600 ml-1">{performer.rating}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <div>
                <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <Clock className="text-orange-600" size={18} />
                    Pending Requests
                </h4>
                <div className="grid grid-cols-2 gap-3">
                    {department.pendingRequests.map((request, index) => (
                        <div key={index} className="p-3 bg-orange-50 rounded-lg border border-orange-200">
                            <div className="flex items-center gap-2 mb-1">
                                <AlertCircle className="text-orange-600" size={14} />
                                <span className="text-sm font-medium text-orange-800">{request.type}</span>
                            </div>
                            <p className="text-lg font-bold text-orange-600">{request.count}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default DepartmentAnalyticsCard