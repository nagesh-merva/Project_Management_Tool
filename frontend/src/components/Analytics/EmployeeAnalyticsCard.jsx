import { useState, useEffect } from 'react'
import {
    User,
    Briefcase,
    Target,
    CheckCircle,
    TrendingUp,
    Calendar,
    FileText,
    Award,
    X,
} from 'lucide-react'

const EmployeeAnalyticsCard = ({ employee }) => {
    const [showDetails, setShowDetails] = useState(false)

    // console.log(employee)

    useEffect(() => {
        if (showDetails) {
            document.body.style.overflow = 'hidden'
        } else {
            document.body.style.overflow = 'unset'
        }

        return () => {
            document.body.style.overflow = 'unset'
        }
    }, [showDetails])

    useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === 'Escape') {
                setShowDetails(false)
            }
        }

        if (showDetails) {
            document.addEventListener('keydown', handleEscape)
        }

        return () => {
            document.removeEventListener('keydown', handleEscape)
        }
    }, [showDetails])

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

    const maxSalary = Math.max(...(employee.PromotionHistory?.map(s => s.salary) || [1]))
    const points = employee.PromotionHistory?.map((entry, index) => {
        const x = (index / (employee.PromotionHistory?.length - 1)) * 100
        const y = 100 - (entry.salary / maxSalary) * 100
        return { ...entry, x, y }
    }) || []

    const CardContent = ({ isModal = false }) => (
        <div className={`bg-white rounded-xl shadow-sm border border-gray-100 ${isModal ? 'w-full max-w-4xl mx-auto my-8' : ''} p-6 hover:shadow-md transition-all duration-300`}>
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
                <div className="flex items-center gap-2">
                    {isModal && (
                        <button
                            onClick={() => setShowDetails(false)}
                            className="text-gray-500 hover:text-gray-700 p-2 rounded-full hover:bg-gray-100 transition-colors"
                            aria-label="Close details"
                        >
                            <X size={20} />
                        </button>
                    )}
                    {!isModal && (
                        <button
                            onClick={() => setShowDetails(!showDetails)}
                            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                        >
                            Details
                        </button>
                    )}
                </div>
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
                        {employee.performanceScore}/5
                    </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                        className="bg-gradient-to-r from-blue-500 to-green-500 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${employee.performanceScore * 20}%` }}
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

            {(showDetails || isModal) && (
                <div className="border-t border-gray-100 pt-4 space-y-6">
                    <div>
                        <h4 className="text-sm font-medium text-gray-700 mb-4 flex items-center gap-2">
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
                        {points.length > 1 && (
                            <div className="bg-gray-50 rounded-lg p-4">
                                <div className="w-full h-40 relative">
                                    <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 w-full h-full">
                                        <polyline
                                            fill="none"
                                            stroke="#10B981"
                                            strokeWidth="2"
                                            points={points.map(p => `${p.x},${p.y}`).join(" ")}
                                        />
                                        {points.map((p, i) => (
                                            <circle key={i} cx={p.x} cy={p.y} r="2.5" fill="#10B981" />
                                        ))}
                                    </svg>
                                </div>
                                <div className="mt-4 grid grid-cols-3 gap-2 text-xs text-gray-600">
                                    {points.map((p, i) => (
                                        <div key={i} className="text-center">
                                            <div className="font-medium">{new Date(p.date).toLocaleDateString()}</div>
                                            <div className="text-green-600">₹{p.salary.toLocaleString()}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                            <span className="text-sm font-medium text-gray-700 flex items-center gap-2">
                                <Award className="text-purple-600" size={16} />
                                Last Promotion
                            </span>
                            <span className="text-sm text-gray-600">{employee.PromotionHistory[0]?.role}</span>
                            <span className="text-sm text-gray-600">{employee.PromotionHistory[0]?.date.split("T")[0]}</span>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                            <span className="text-sm font-medium text-gray-700 flex items-center gap-2">
                                <Calendar className="text-orange-600" size={16} />
                                Leaves Taken
                            </span>
                            <span className="text-sm text-gray-600">{employee.leavesTaken} days</span>
                        </div>
                    </div>

                    <div>
                        <span className="text-sm font-medium text-gray-700 flex items-center gap-2 mb-3">
                            <FileText className="text-blue-600" size={16} />
                            Documents
                        </span>
                        <div className="flex flex-wrap gap-2">
                            {(employee.documents || []).map((doc, index) => (
                                <button
                                    key={index}
                                    className="px-3 py-2 bg-blue-100 text-blue-700 rounded-lg text-sm hover:bg-blue-200 transition-colors"
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

    return (
        <>
            {!showDetails && <CardContent />}
            {showDetails && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-start justify-center overflow-y-auto"
                    onClick={(e) => {
                        if (e.target === e.currentTarget) {
                            setShowDetails(false)
                        }
                    }}
                >
                    <CardContent isModal={true} />
                </div>
            )}
        </>
    )
}
export default EmployeeAnalyticsCard