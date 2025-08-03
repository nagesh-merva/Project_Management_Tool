import React, { useState } from 'react'
import {
    User,
    Briefcase,
    Target,
    CheckCircle,
    TrendingUp,
    Calendar,
    FileText,
    Award,
} from 'lucide-react'

const EmployeeAnalyticsCard = ({ employee }) => {
    const [showDetails, setShowDetails] = useState(false)

    const getPerformanceColor = (score) => {
        if (score >= 8) return 'text-green-600 bg-green-100'
        if (score >= 6) return 'text-yellow-600 bg-yellow-100'
        return 'text-red-600 bg-red-100'
    }

    const getAttendanceColor = (percentage) => {
        if (percentage >= 95) return 'bg-green-500'
        if (percentage >= 85) return 'bg-yellow-500'
        return 'bg-red-500'
    }

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                        {employee.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                        <h3 className="font-semibold text-gray-900">{employee.name}</h3>
                        <p className="text-sm text-gray-600">{employee.id}</p>
                    </div>
                </div>
                <button
                    onClick={() => setShowDetails(!showDetails)}
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                >
                    {showDetails ? 'Less' : 'Details'}
                </button>
            </div>
            <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center gap-2">
                    <Briefcase className="text-gray-400" size={16} />
                    <span className="text-sm text-gray-600">{employee.role}</span>
                </div>
                <div className="flex items-center gap-2">
                    <User className="text-gray-400" size={16} />
                    <span className="text-sm text-gray-600">{employee.department}</span>
                </div>
            </div>
            <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="text-center p-3 bg-blue-50 rounded-lg">
                    <div className="flex items-center justify-center gap-1 mb-1">
                        <Target className="text-blue-600" size={16} />
                        <span className="text-xs text-gray-600">Projects</span>
                    </div>
                    <p className="text-lg font-bold text-blue-600">{employee.totalProjects}</p>
                </div>
                <div className="text-center p-3 bg-green-50 rounded-lg">
                    <div className="flex items-center justify-center gap-1 mb-1">
                        <CheckCircle className="text-green-600" size={16} />
                        <span className="text-xs text-gray-600">Completed</span>
                    </div>
                    <p className="text-lg font-bold text-green-600">{employee.completedProjects}</p>
                </div>
            </div>
            <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">Performance Score</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPerformanceColor(employee.performanceScore)}`}>
                        {employee.performanceScore}/10
                    </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                        className="bg-gradient-to-r from-blue-500 to-green-500 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${employee.performanceScore * 10}%` }}
                    ></div>
                </div>
            </div>
            <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">Attendance</span>
                    <span className="text-sm text-gray-600">{employee.attendance}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                        className={`h-2 rounded-full transition-all duration-500 ${getAttendanceColor(employee.attendance)}`}
                        style={{ width: `${employee.attendance}%` }}
                    ></div>
                </div>
            </div>
            {showDetails && (
                <div className="border-t border-gray-100 pt-4 space-y-4">
                    <div>
                        <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                            <TrendingUp className="text-green-600" size={16} />
                            Salary Trend
                        </h4>
                        <div className="flex items-end gap-1 h-16">
                            {employee.salaryHistory.map((salary, index) => (
                                <div
                                    key={index}
                                    className="bg-gradient-to-t from-green-500 to-green-400 rounded-t flex-1 relative group"
                                    style={{ height: `${(salary / Math.max(...employee.salaryHistory)) * 100}%` }}
                                >
                                    <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                                        ₹{salary.toLocaleString()}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-700 flex items-center gap-2">
                            <Award className="text-purple-600" size={16} />
                            Last Promotion
                        </span>
                        <span className="text-sm text-gray-600">{employee.lastPromotion}</span>
                    </div>
                    <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-700 flex items-center gap-2">
                            <Calendar className="text-orange-600" size={16} />
                            Leaves Taken
                        </span>
                        <span className="text-sm text-gray-600">{employee.leavesTaken} days</span>
                    </div>
                    <div>
                        <span className="text-sm font-medium text-gray-700 flex items-center gap-2 mb-2">
                            <FileText className="text-blue-600" size={16} />
                            Documents
                        </span>
                        <div className="flex gap-2">
                            {employee.documents.map((doc, index) => (
                                <button
                                    key={index}
                                    className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs hover:bg-blue-200 transition-colors"
                                >
                                    {doc}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default EmployeeAnalyticsCard