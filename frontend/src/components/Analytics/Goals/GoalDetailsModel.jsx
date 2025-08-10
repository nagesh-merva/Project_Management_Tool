import { CheckCircle, TrendingUp, X } from "lucide-react";

const GoalDetailsModal = ({ goal, onClose, onMilestoneUpdate }) => {
    const formatDate = (dateString) => {
        if (!dateString) return 'Not set';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        })
    }

    const handleMilestoneToggle = async (milestone) => {
        try {
            await onMilestoneUpdate(goal.id, milestone.name, {
                completed: !milestone.completed,
                completion_date: !milestone.completed ? new Date().toISOString() : null
            });
        } catch (error) {
            console.error('Error updating milestone:', error)
            alert('Failed to update milestone. Please try again.')
        }
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-semibold">{goal.name}</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        <X size={24} />
                    </button>
                </div>

                <div className="space-y-6">
                    <div>
                        <h4 className="font-medium mb-2">Target Metric</h4>
                        <p className="text-gray-700">{goal.target_metric || goal.targetMetric}</p>
                    </div>

                    <div>
                        <h4 className="font-medium mb-2">Goal Details</h4>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                                <span className="text-gray-600">Department:</span>
                                <p className="font-medium">{goal.responsible_department || goal.responsibleDepartment}</p>
                            </div>
                            <div>
                                <span className="text-gray-600">Category:</span>
                                <p className="font-medium">{goal.goal_category || goal.goalCategory}</p>
                            </div>
                            <div>
                                <span className="text-gray-600">Audit Period:</span>
                                <p className="font-medium">{goal.audit_period || goal.auditPeriod}</p>
                            </div>
                            <div>
                                <span className="text-gray-600">Success Probability:</span>
                                <p className="font-medium">{goal.success_probability || goal.successProbability}%</p>
                            </div>
                        </div>
                    </div>

                    {goal.milestones && goal.milestones.length > 0 && (
                        <div>
                            <h4 className="font-medium mb-3">All Milestones</h4>
                            <div className="space-y-3">
                                {goal.milestones.map((milestone, index) => (
                                    <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                        <button
                                            onClick={() => handleMilestoneToggle(milestone)}
                                            className={`w-5 h-5 rounded-full flex items-center justify-center transition-colors ${milestone.completed ? 'bg-green-500' : 'bg-gray-300 hover:bg-gray-400'
                                                }`}
                                        >
                                            {milestone.completed && <CheckCircle className="text-white" size={12} />}
                                        </button>
                                        <div className="flex-1">
                                            <div className="flex items-center justify-between">
                                                <span className={`font-medium ${milestone.completed ? 'text-gray-500 line-through' : 'text-gray-900'
                                                    }`}>
                                                    {milestone.name}
                                                </span>
                                                <span className="text-sm text-gray-500">
                                                    Due: {formatDate(milestone.due_date || milestone.dueDate)}
                                                </span>
                                            </div>
                                            {milestone.completed && milestone.completion_date && (
                                                <div className="text-sm text-green-600 mt-1">
                                                    Completed: {formatDate(milestone.completion_date)}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {goal.risks && goal.risks.length > 0 && (
                        <div>
                            <h4 className="font-medium mb-3">All Risks</h4>
                            <div className="space-y-3">
                                {goal.risks.map((risk, index) => (
                                    <div key={index} className="p-3 border rounded-lg">
                                        <div className="flex justify-between items-center mb-2">
                                            <span className="font-medium">{risk.description}</span>
                                            <span className={`px-2 py-1 rounded text-xs font-medium ${risk.level === 'Low' ? 'bg-green-100 text-green-800' :
                                                risk.level === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                                                    'bg-red-100 text-red-800'
                                                }`}>
                                                {risk.level}
                                            </span>
                                        </div>
                                        <p className="text-sm text-gray-600">{risk.mitigation}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {goal.progress_history && goal.progress_history.length > 0 && (
                        <div>
                            <h4 className="font-medium mb-3">Progress History</h4>
                            <div className="space-y-2 max-h-48 overflow-y-auto">
                                {goal.progress_history.map((progress, index) => (
                                    <div key={index} className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                                        <TrendingUp className="text-blue-600" size={16} />
                                        <div className="flex-1">
                                            <p className="font-medium">Progress: {progress.progress_percentage}%</p>
                                            <p className="text-sm text-gray-600">
                                                {formatDate(progress.date)} by {progress.updated_by}
                                            </p>
                                            {progress.notes && (
                                                <p className="text-sm text-gray-700 mt-1">{progress.notes}</p>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {goal.audit_history && goal.audit_history.length > 0 && (
                        <div>
                            <h4 className="font-medium mb-3">Audit History</h4>
                            <div className="space-y-2 max-h-48 overflow-y-auto">
                                {goal.audit_history.map((audit, index) => (
                                    <div key={index} className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                                        <CheckCircle className="text-green-600" size={16} />
                                        <div className="flex-1">
                                            <p className="font-medium">Audit Completed</p>
                                            <p className="text-sm text-gray-600">
                                                {formatDate(audit.audit_date)} by {audit.auditor}
                                            </p>
                                            {audit.notes && (
                                                <p className="text-sm text-gray-700 mt-1">{audit.notes}</p>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                <div className="mt-6 pt-4 border-t">
                    <button
                        onClick={onClose}
                        className="w-full bg-gray-100 text-gray-700 p-2 rounded-lg hover:bg-gray-200"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    )
}

export default GoalDetailsModal