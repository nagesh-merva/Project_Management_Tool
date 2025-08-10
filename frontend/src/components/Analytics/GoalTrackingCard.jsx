import React, { useState } from 'react';
import {
    Calendar,
    TrendingUp,
    AlertTriangle,
    CheckCircle,
    Clock,
    Users,
    BarChart3,
    Edit,
    Eye,
    Plus,
    Activity,
    Award,
    X,
    Save,
    Trash2
} from 'lucide-react';

// API service functions
const api = {
    async updateGoal(goalId, updateData) {
        const response = await fetch(`http://127.0.0.1:8000/goals/${goalId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updateData)
        });
        if (!response.ok) throw new Error('Failed to update goal');
        return response.json();
    },

    async addProgress(goalId, progressData) {
        const response = await fetch(`http://127.0.0.1:8000/goals/progress/`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ goal_id: goalId, ...progressData })
        });
        if (!response.ok) throw new Error('Failed to add progress');
        return response.json();
    },

    async updateMilestone(goalId, milestoneName, updateData) {
        const response = await fetch(`http://127.0.0.1:8000/goals/milestones/`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                goal_id: goalId,
                milestone_name: milestoneName,
                ...updateData
            })
        });
        if (!response.ok) throw new Error('Failed to update milestone');
        return response.json();
    },

    async deleteGoal(goalId) {
        const response = await fetch(`http://127.0.0.1:8000/goals/${goalId}`, {
            method: 'DELETE'
        });
        if (!response.ok) throw new Error('Failed to delete goal');
        return response.json();
    }
};

// Modal Component for Edit Goal
const EditGoalModal = ({ goal, onSave, onClose }) => {
    const [formData, setFormData] = useState({
        name: goal?.name || '',
        target_metric: goal?.target_metric || goal?.targetMetric || '',
        responsible_department: goal?.responsible_department || goal?.responsibleDepartment || '',
        deadline: goal?.deadline ? new Date(goal.deadline).toISOString().split('T')[0] : '',
        goal_category: goal?.goal_category || goal?.goalCategory || 'quarterly',
        audit_period: goal?.audit_period || goal?.auditPeriod || 'monthly'
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await onSave(goal.id, formData);
        } catch (error) {
            console.error('Error saving goal:', error);
            alert('Failed to update goal. Please try again.');
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold">Edit Goal</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Goal Name</label>
                        <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Target Metric</label>
                        <input
                            type="text"
                            value={formData.target_metric}
                            onChange={(e) => setFormData({ ...formData, target_metric: e.target.value })}
                            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Responsible Department</label>
                        <select
                            value={formData.responsible_department}
                            onChange={(e) => setFormData({ ...formData, responsible_department: e.target.value })}
                            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                            required
                        >
                            <option value="">Select Department</option>
                            <option value="SALES">Sales</option>
                            <option value="DESIGN">Design</option>
                            <option value="DEV">Development</option>
                            <option value="Maintenance">Maintenance</option>
                            <option value="ADMIN">Company</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Deadline</label>
                        <input
                            type="date"
                            value={formData.deadline}
                            onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Goal Category</label>
                        <select
                            value={formData.goal_category}
                            onChange={(e) => setFormData({ ...formData, goal_category: e.target.value })}
                            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="quarterly">Quarterly</option>
                            <option value="6months">6 Months</option>
                            <option value="yearly">Yearly</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Audit Period</label>
                        <select
                            value={formData.audit_period}
                            onChange={(e) => setFormData({ ...formData, audit_period: e.target.value })}
                            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="weekly">Weekly</option>
                            <option value="monthly">Monthly</option>
                            <option value="quarterly">Quarterly</option>
                        </select>
                    </div>

                    <div className="flex gap-2 pt-4">
                        <button
                            type="submit"
                            className="flex-1 bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 flex items-center justify-center gap-2"
                        >
                            <Save size={16} />
                            Save Changes
                        </button>
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

// Modal Component for Add Progress
const AddProgressModal = ({ goal, onSave, onClose }) => {
    const [formData, setFormData] = useState({
        progress_percentage: goal?.current_progress || goal?.currentProgress || 0,
        notes: '',
        updated_by: 'Current User' // In real app, get from auth context
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await onSave(goal.id, formData);
        } catch (error) {
            console.error('Error adding progress:', error);
            alert('Failed to add progress. Please try again.');
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold">Add Progress Update</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Progress Percentage</label>
                        <input
                            type="number"
                            min="0"
                            max="100"
                            value={formData.progress_percentage}
                            onChange={(e) => setFormData({ ...formData, progress_percentage: parseInt(e.target.value) || 0 })}
                            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Notes</label>
                        <textarea
                            value={formData.notes}
                            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                            className="w-full p-2 border rounded-lg h-24 focus:ring-2 focus:ring-purple-500"
                            placeholder="Add any notes about this progress update..."
                        />
                    </div>

                    <div className="flex gap-2 pt-4">
                        <button
                            type="submit"
                            className="flex-1 bg-purple-600 text-white p-2 rounded-lg hover:bg-purple-700 flex items-center justify-center gap-2"
                        >
                            <Plus size={16} />
                            Add Progress
                        </button>
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

// Goal Details Modal
const GoalDetailsModal = ({ goal, onClose, onMilestoneUpdate }) => {
    const formatDate = (dateString) => {
        if (!dateString) return 'Not set';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const handleMilestoneToggle = async (milestone) => {
        try {
            await onMilestoneUpdate(goal.id, milestone.name, {
                completed: !milestone.completed,
                completion_date: !milestone.completed ? new Date().toISOString() : null
            });
        } catch (error) {
            console.error('Error updating milestone:', error);
            alert('Failed to update milestone. Please try again.');
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4 max-h-[80vh] overflow-y-auto">
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
    );
};

// Main GoalTrackingCard Component with integrated functionality
const GoalTrackingCard = ({ goal, onUpdate }) => {
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [progressModalOpen, setProgressModalOpen] = useState(false);
    const [detailsModalOpen, setDetailsModalOpen] = useState(false);
    const [goalData, setGoalData] = useState(goal);

    // Update local state when prop changes
    React.useEffect(() => {
        setGoalData(goal);
    }, [goal]);

    const processedGoalData = {
        name: goalData.name,
        targetMetric: goalData.target_metric || goalData.targetMetric,
        currentProgress: goalData.current_progress || goalData.currentProgress,
        responsibleDepartment: goalData.responsible_department || goalData.responsibleDepartment,
        deadline: goalData.deadline,
        successProbability: goalData.success_probability || goalData.successProbability,
        goalCategory: goalData.goal_category || goalData.goalCategory,
        auditPeriod: goalData.audit_period || goalData.auditPeriod,
        milestones: goalData.milestones || [],
        risks: goalData.risks || [],
        status: goalData.status || 'active',
        progressHistory: goalData.progress_history || [],
        auditHistory: goalData.audit_history || []
    };

    const getSuccessProbabilityColor = (probability) => {
        if (probability >= 80) return 'text-green-600 bg-green-100';
        if (probability >= 60) return 'text-blue-600 bg-blue-100';
        if (probability >= 40) return 'text-yellow-600 bg-yellow-100';
        return 'text-red-600 bg-red-100';
    };

    const getRiskColor = (risk) => {
        switch (risk.level) {
            case 'Low': return 'bg-green-100 text-green-800 border-green-200';
            case 'Medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'High': return 'bg-red-100 text-red-800 border-red-200';
            default: return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'active': return 'bg-green-100 text-green-800';
            case 'completed': return 'bg-blue-100 text-blue-800';
            case 'paused': return 'bg-yellow-100 text-yellow-800';
            case 'cancelled': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getCategoryBadgeColor = (category) => {
        switch (category) {
            case 'yearly': return 'bg-purple-100 text-purple-800';
            case '6months': return 'bg-blue-100 text-blue-800';
            case 'quarterly': return 'bg-green-100 text-green-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'Not set';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const calculateDaysRemaining = (deadline) => {
        if (!deadline) return 0;
        const today = new Date();
        const deadlineDate = new Date(deadline);
        const diffTime = deadlineDate - today;
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    };

    const daysRemaining = calculateDaysRemaining(processedGoalData.deadline);
    const milestonesCompleted = processedGoalData.milestones.filter(m => m.completed).length;
    const totalMilestones = processedGoalData.milestones.length;

    // API handler functions
    const handleSaveGoal = async (goalId, updateData) => {
        try {
            const updatedGoal = await api.updateGoal(goalId, updateData);
            setGoalData(updatedGoal);
            setEditModalOpen(false);
            // Call parent update function if provided
            if (onUpdate) onUpdate();
        } catch (error) {
            console.error('Error updating goal:', error);
            throw error;
        }
    };

    const handleAddProgress = async (goalId, progressData) => {
        try {
            await api.addProgress(goalId, progressData);
            // Optionally refetch goal data or update local state
            setProgressModalOpen(false);
            // Call parent update function if provided
            if (onUpdate) onUpdate();
        } catch (error) {
            console.error('Error adding progress:', error);
            throw error;
        }
    };

    const handleMilestoneUpdate = async (goalId, milestoneName, updateData) => {
        try {
            await api.updateMilestone(goalId, milestoneName, updateData);
            // Update local milestone state
            const updatedMilestones = processedGoalData.milestones.map(milestone => {
                if (milestone.name === milestoneName) {
                    return { ...milestone, ...updateData };
                }
                return milestone;
            });
            setGoalData(prev => ({
                ...prev,
                milestones: updatedMilestones
            }));
            // Call parent update function if provided
            if (onUpdate) onUpdate();
        } catch (error) {
            console.error('Error updating milestone:', error);
            throw error;
        }
    };

    const handleDeleteGoal = async () => {
        if (window.confirm('Are you sure you want to delete this goal? This action cannot be undone.')) {
            try {
                await api.deleteGoal(goalData.id);
                // Call parent update function if provided
                if (onUpdate) onUpdate();
            } catch (error) {
                console.error('Error deleting goal:', error);
                alert('Failed to delete goal. Please try again.');
            }
        }
    };

    const handleViewDetails = () => {
        setDetailsModalOpen(true);
    };

    const handleEditGoal = () => {
        setEditModalOpen(true);
    };

    const handleAddProgressClick = () => {
        setProgressModalOpen(true);
    };

    return (
        <>
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-semibold text-gray-900 text-lg leading-tight">{processedGoalData.name}</h3>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(processedGoalData.status)}`}>
                                {processedGoalData.status}
                            </span>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{processedGoalData.targetMetric}</p>
                        <div className="flex items-center gap-2 flex-wrap">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryBadgeColor(processedGoalData.goalCategory)}`}>
                                {processedGoalData.goalCategory?.replace('6months', '6 Months') || 'Not set'}
                            </span>
                            {processedGoalData.auditPeriod && (
                                <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                    {processedGoalData.auditPeriod} audits
                                </span>
                            )}
                        </div>
                    </div>
                    <div className="flex items-center gap-2 ml-4">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getSuccessProbabilityColor(processedGoalData.successProbability)}`}>
                            {processedGoalData.successProbability}% Success
                        </span>
                        <div className="flex items-center gap-1">
                            <button
                                onClick={handleViewDetails}
                                className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                                title="View Details"
                            >
                                <Eye size={16} />
                            </button>
                            <button
                                onClick={handleEditGoal}
                                className="p-1 text-gray-400 hover:text-green-600 transition-colors"
                                title="Edit Goal"
                            >
                                <Edit size={16} />
                            </button>
                            <button
                                onClick={handleAddProgressClick}
                                className="p-1 text-gray-400 hover:text-purple-600 transition-colors"
                                title="Add Progress"
                            >
                                <Plus size={16} />
                            </button>
                            <button
                                onClick={handleDeleteGoal}
                                className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                                title="Delete Goal"
                            >
                                <Trash2 size={16} />
                            </button>
                        </div>
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
                                strokeDashoffset={`${2 * Math.PI * 50 * (1 - processedGoalData.currentProgress / 100)}`}
                                className={`transition-all duration-1000 ${processedGoalData.currentProgress >= 80 ? 'text-green-500' :
                                    processedGoalData.currentProgress >= 60 ? 'text-blue-500' :
                                        processedGoalData.currentProgress >= 40 ? 'text-yellow-500' : 'text-red-500'
                                    }`}
                                strokeLinecap="round"
                            />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="text-center">
                                <div className="text-2xl font-bold text-gray-900">{processedGoalData.currentProgress}%</div>
                                <div className="text-xs text-gray-600">Complete</div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-3 gap-3 mb-4">
                    <div className="text-center p-3 bg-blue-50 rounded-lg">
                        <Users className="text-blue-600 mx-auto mb-1" size={16} />
                        <p className="text-sm font-medium text-blue-800">{processedGoalData.responsibleDepartment}</p>
                        <p className="text-xs text-gray-600">Department</p>
                    </div>
                    <div className="text-center p-3 bg-orange-50 rounded-lg">
                        <Calendar className="text-orange-600 mx-auto mb-1" size={16} />
                        <p className="text-sm font-medium text-orange-800">{daysRemaining > 0 ? `${daysRemaining} days` : 'Overdue'}</p>
                        <p className="text-xs text-gray-600">{daysRemaining > 0 ? 'Remaining' : 'Past Deadline'}</p>
                    </div>
                    <div className="text-center p-3 bg-purple-50 rounded-lg">
                        <Award className="text-purple-600 mx-auto mb-1" size={16} />
                        <p className="text-sm font-medium text-purple-800">{milestonesCompleted}/{totalMilestones}</p>
                        <p className="text-xs text-gray-600">Milestones</p>
                    </div>
                </div>

                {processedGoalData.milestones.length > 0 && (
                    <div className="mb-4">
                        <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                            <BarChart3 className="text-purple-600" size={16} />
                            Milestone Progress ({milestonesCompleted}/{totalMilestones})
                        </h4>
                        <div className="space-y-2">
                            {processedGoalData.milestones.slice(0, 3).map((milestone, index) => (
                                <div key={index} className="flex items-center gap-3">
                                    <div className={`w-4 h-4 rounded-full flex items-center justify-center ${milestone.completed ? 'bg-green-500' : 'bg-gray-300'
                                        }`}>
                                        {milestone.completed && <CheckCircle className="text-white" size={10} />}
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center justify-between">
                                            <span className={`text-sm ${milestone.completed ? 'text-gray-900 font-medium line-through' : 'text-gray-600'
                                                }`}>
                                                {milestone.name}
                                            </span>
                                            <span className="text-xs text-gray-500">
                                                {formatDate(milestone.due_date || milestone.dueDate)}
                                            </span>
                                        </div>
                                        {milestone.completed && milestone.completion_date && (
                                            <div className="text-xs text-green-600">
                                                Completed: {formatDate(milestone.completion_date)}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                            {processedGoalData.milestones.length > 3 && (
                                <div className="text-center">
                                    <button
                                        onClick={handleViewDetails}
                                        className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                                    >
                                        View {processedGoalData.milestones.length - 3} more milestones
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {processedGoalData.risks.length > 0 && (
                    <div className="mb-4">
                        <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                            <AlertTriangle className="text-red-600" size={16} />
                            Identified Risks ({processedGoalData.risks.length})
                        </h4>
                        <div className="space-y-2">
                            {processedGoalData.risks.slice(0, 2).map((risk, index) => (
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
                            {processedGoalData.risks.length > 2 && (
                                <div className="text-center">
                                    <button
                                        onClick={handleViewDetails}
                                        className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                                    >
                                        View {processedGoalData.risks.length - 2} more risks
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {(processedGoalData.progressHistory.length > 0 || processedGoalData.auditHistory.length > 0) && (
                    <div className="mb-4">
                        <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                            <Activity className="text-blue-600" size={16} />
                            Recent Activity
                        </h4>
                        <div className="space-y-2">
                            {processedGoalData.progressHistory.slice(-2).map((progress, index) => (
                                <div key={`progress-${index}`} className="flex items-center gap-3 p-2 bg-blue-50 rounded-lg">
                                    <TrendingUp className="text-blue-600" size={14} />
                                    <div className="flex-1">
                                        <p className="text-sm font-medium text-gray-900">
                                            Progress updated to {progress.progress_percentage}%
                                        </p>
                                        <p className="text-xs text-gray-600">
                                            {formatDate(progress.date)} by {progress.updated_by}
                                        </p>
                                    </div>
                                </div>
                            ))}
                            {processedGoalData.auditHistory.slice(-1).map((audit, index) => (
                                <div key={`audit-${index}`} className="flex items-center gap-3 p-2 bg-green-50 rounded-lg">
                                    <CheckCircle className="text-green-600" size={14} />
                                    <div className="flex-1">
                                        <p className="text-sm font-medium text-gray-900">Audit completed</p>
                                        <p className="text-xs text-gray-600">
                                            {formatDate(audit.audit_date)} by {audit.auditor}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {daysRemaining <= 30 && daysRemaining > 0 && (
                    <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                        <div className="flex items-center gap-2">
                            <Clock className="text-yellow-600" size={16} />
                            <span className="text-sm font-medium text-yellow-800">
                                Deadline approaching in {daysRemaining} days
                            </span>
                        </div>
                    </div>
                )}

                {daysRemaining <= 0 && (
                    <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                        <div className="flex items-center gap-2">
                            <AlertTriangle className="text-red-600" size={16} />
                            <span className="text-sm font-medium text-red-800">
                                Goal is overdue by {Math.abs(daysRemaining)} days
                            </span>
                        </div>
                    </div>
                )}

                <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between text-sm text-gray-500">
                    <span>Due: {formatDate(processedGoalData.deadline)}</span>
                    <span>Last updated: {formatDate(goalData.updated_at)}</span>
                </div>
            </div>

            {/* Modals */}
            {editModalOpen && (
                <EditGoalModal
                    goal={goalData}
                    onSave={handleSaveGoal}
                    onClose={() => setEditModalOpen(false)}
                />
            )}

            {progressModalOpen && (
                <AddProgressModal
                    goal={goalData}
                    onSave={handleAddProgress}
                    onClose={() => setProgressModalOpen(false)}
                />
            )}

            {detailsModalOpen && (
                <GoalDetailsModal
                    goal={goalData}
                    onClose={() => setDetailsModalOpen(false)}
                    onMilestoneUpdate={handleMilestoneUpdate}
                />
            )}
        </>
    );
};

export default GoalTrackingCard;