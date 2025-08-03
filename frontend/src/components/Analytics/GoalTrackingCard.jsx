import {
    Target,
    Calendar,
    TrendingUp,
    AlertTriangle,
    CheckCircle,
    Clock,
    Users,
    BarChart3
} from 'lucide-react'

const GoalTrackingCard = ({ goal }) => {

    const getSuccessProbabilityColor = (probability) => {
        if (probability >= 80) return 'text-green-600 bg-green-100'
        if (probability >= 60) return 'text-blue-600 bg-blue-100'
        if (probability >= 40) return 'text-yellow-600 bg-yellow-100'
        return 'text-red-600 bg-red-100'
    }

    const getRiskColor = (risk) => {
        switch (risk.level) {
            case 'Low': return 'bg-green-100 text-green-800 border-green-200'
            case 'Medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
            case 'High': return 'bg-red-100 text-red-800 border-red-200'
            default: return 'bg-gray-100 text-gray-800 border-gray-200'
        }
    }

    const daysRemaining = Math.ceil((new Date(goal.deadline) - new Date()) / (1000 * 60 * 60 * 24));

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-4">
                <div>
                    <h3 className="font-semibold text-gray-900">{goal.name}</h3>
                    <p className="text-sm text-gray-600">{goal.targetMetric}</p>
                </div>
                <div className="flex items-center gap-2">
                    <Target className="text-blue-600" size={20} />
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSuccessProbabilityColor(goal.successProbability)}`}>
                        {goal.successProbability}% Success
                    </span>
                </div>
            </div>
            <div className="flex items-center justify-center mb-6">
                <div className="relative w-32 h-32">
                    <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 120 120">
                        <circle
                            cx="60"
                            cy="60"
                            r="50"
                            stroke="currentColor"
                            strokeWidth="8"
                            fill="transparent"
                            className="text-gray-200"
                        />
                        <circle
                            cx="60"
                            cy="60"
                            r="50"
                            stroke="currentColor"
                            strokeWidth="8"
                            fill="transparent"
                            strokeDasharray={`${2 * Math.PI * 50}`}
                            strokeDashoffset={`${2 * Math.PI * 50 * (1 - goal.currentProgress / 100)}`}
                            className={`transition-all duration-1000 ${goal.currentProgress >= 80 ? 'text-green-500' :
                                goal.currentProgress >= 60 ? 'text-blue-500' :
                                    goal.currentProgress >= 40 ? 'text-yellow-500' : 'text-red-500'
                                }`}
                            strokeLinecap="round"
                        />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center">
                            <div className="text-2xl font-bold text-gray-900">{goal.currentProgress}%</div>
                            <div className="text-xs text-gray-600">Complete</div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="text-center p-3 bg-blue-50 rounded-lg">
                    <Users className="text-blue-600 mx-auto mb-1" size={16} />
                    <p className="text-sm font-medium text-blue-800">{goal.responsibleDepartment}</p>
                    <p className="text-xs text-gray-600">Department</p>
                </div>
                <div className="text-center p-3 bg-orange-50 rounded-lg">
                    <Calendar className="text-orange-600 mx-auto mb-1" size={16} />
                    <p className="text-sm font-medium text-orange-800">{daysRemaining} days</p>
                    <p className="text-xs text-gray-600">Remaining</p>
                </div>
            </div>
            <div className="mb-4">
                <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <BarChart3 className="text-purple-600" size={16} />
                    Milestone Progress
                </h4>
                <div className="space-y-2">
                    {goal.milestones.map((milestone, index) => (
                        <div key={index} className="flex items-center gap-3">
                            <div className={`w-4 h-4 rounded-full flex items-center justify-center ${milestone.completed ? 'bg-green-500' : 'bg-gray-300'
                                }`}>
                                {milestone.completed && <CheckCircle className="text-white" size={10} />}
                            </div>
                            <div className="flex-1">
                                <div className="flex items-center justify-between">
                                    <span className={`text-sm ${milestone.completed ? 'text-gray-900 font-medium' : 'text-gray-600'}`}>
                                        {milestone.name}
                                    </span>
                                    <span className="text-xs text-gray-500">{milestone.dueDate}</span>
                                </div>
                                {milestone.completed && (
                                    <div className="w-full bg-green-200 rounded-full h-1 mt-1">
                                        <div className="bg-green-500 h-1 rounded-full w-full"></div>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <div>
                <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <AlertTriangle className="text-red-600" size={16} />
                    Identified Risks
                </h4>
                <div className="space-y-2">
                    {goal.risks.map((risk, index) => (
                        <div key={index} className="p-3 bg-gray-50 rounded-lg">
                            <div className="flex items-center justify-between mb-1">
                                <span className="text-sm font-medium text-gray-900">{risk.description}</span>
                                <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getRiskColor(risk)}`}>
                                    {risk.level}
                                </span>
                            </div>
                            <p className="text-xs text-gray-600">{risk.mitigation}</p>
                        </div>
                    ))}
                </div>
            </div>
            {daysRemaining <= 30 && (
                <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <div className="flex items-center gap-2">
                        <Clock className="text-yellow-600" size={16} />
                        <span className="text-sm font-medium text-yellow-800">
                            Deadline approaching in {daysRemaining} days
                        </span>
                    </div>
                </div>
            )}
        </div>
    )
}

export default GoalTrackingCard