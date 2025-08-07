import {
    FolderOpen,
    Users,
    Calendar,
    DollarSign,
    Star,
    AlertTriangle,
    TrendingUp,
    Clock,
} from 'lucide-react'

const ProjectAnalyticsCard = ({ project }) => {
    const getStatusColor = (status) => {
        switch (status) {
            case 'Completed': return 'bg-green-100 text-green-800 border-green-200'
            case 'In Progress': return 'bg-blue-100 text-blue-800 border-blue-200'
            case 'Delayed': return 'bg-red-100 text-red-800 border-red-200'
            case 'On Hold': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
            default: return 'bg-gray-100 text-gray-800 border-gray-200'
        }
    }

    const getProfitabilityColor = (profitability) => {
        if (profitability > 20) return 'text-green-600'
        if (profitability > 0) return 'text-yellow-600'
        return 'text-red-600'
    }

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
                <div>
                    <h3 className="font-semibold text-gray-900">{project.name}</h3>
                    <p className="text-sm text-gray-600">{project.id}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(project.status)}`}>
                    {project.status}
                </span>
            </div>
            <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center gap-2">
                    <FolderOpen className="text-gray-400" size={16} />
                    <span className="text-sm text-gray-600">{project.current_phase}</span>
                </div>
                <div className="flex items-center gap-2">
                    <Users className="text-gray-400" size={16} />
                    <span className="text-sm text-gray-600">{project.teamSize} members</span>
                </div>
            </div>
            <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">Timeline Progress</span>
                    <span className="text-sm text-gray-600">{project.progress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                        className={`h-2 rounded-full transition-all duration-500 ${project.progress >= 100 ? 'bg-green-500' :
                            project.progress >= 75 ? 'bg-blue-500' :
                                project.progress >= 50 ? 'bg-yellow-500' : 'bg-red-500'
                            }`}
                        style={{ width: `${project.progress}%` }}
                    ></div>
                </div>
            </div>
            <div className="mb-4">
                <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                    <DollarSign className="text-green-600" size={16} />
                    Budget Analysis
                </h4>
                <div className="grid grid-cols-2 gap-3">
                    <div className="text-center p-2 bg-blue-50 rounded-lg">
                        <p className="text-xs text-gray-600">Budget</p>
                        <p className="text-sm font-bold text-blue-600">₹{project.budget.toLocaleString()}</p>
                    </div>
                    <div className="text-center p-2 bg-orange-50 rounded-lg">
                        <p className="text-xs text-gray-600">Actual</p>
                        <p className="text-sm font-bold text-orange-600">₹{project.actualCost.toLocaleString()}</p>
                    </div>
                </div>
                <div className="mt-2">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                            className={`h-2 rounded-full transition-all duration-500 ${(project.actualCost / project.budget) > 1 ? 'bg-red-500' :
                                (project.actualCost / project.budget) > 0.8 ? 'bg-yellow-500' : 'bg-green-500'
                                }`}
                            style={{ width: `${Math.min((project.actualCost / project.budget) * 100, 100)}%` }}
                        ></div>
                    </div>
                </div>
            </div>
            <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700 flex items-center gap-2">
                        <Star className="text-yellow-500" size={16} />
                        Client Satisfaction
                    </span>
                    <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                            <span
                                key={i}
                                className={`text-sm ${i < Math.floor(project.clientSatisfaction) ? 'text-yellow-400' : 'text-gray-300'}`}
                            >
                                ★
                            </span>
                        ))}
                        <span className="text-sm text-gray-600 ml-1">{project.clientSatisfaction}/5</span>
                    </div>
                </div>
            </div>
            <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="text-center p-2 bg-purple-50 rounded-lg">
                    <TrendingUp className="text-purple-600 mx-auto mb-1" size={16} />
                    <p className="text-xs text-gray-600">Profitability</p>
                    <p className={`text-sm font-bold ${getProfitabilityColor(project.profitability)}`}>
                        {project.profitability > 0 ? '+' : ''}{project.profitability}%
                    </p>
                </div>
                <div className="text-center p-2 bg-red-50 rounded-lg">
                    <AlertTriangle className="text-red-600 mx-auto mb-1" size={16} />
                    <p className="text-xs text-gray-600">Issues</p>
                    <p className="text-sm font-bold text-red-600">{project.issues}</p>
                </div>
            </div>
            <div className="flex items-center justify-between text-xs text-gray-600">
                <div className="flex items-center gap-1">
                    <Calendar size={12} />
                    <span>Start: {project.startDate.split("T")[0]}</span>
                </div>
                <div className="flex items-center gap-1">
                    <Clock size={12} />
                    <span>Deadline: {project.dueDate.split("T")[0]}</span>
                </div>
            </div>
            {project.roadblocks && project.roadblocks.length > 0 && (
                <div className="mt-4 pt-4 border-t border-gray-100">
                    <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                        <AlertTriangle className="text-red-600" size={14} />
                        Top Roadblocks
                    </h4>
                    <div className="space-y-1">
                        {project.roadblocks.slice(0, 2).map((roadblock, index) => (
                            <div key={index} className="text-xs text-gray-600 bg-red-50 px-2 py-1 rounded">
                                {roadblock}
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}

export default ProjectAnalyticsCard