import { Save, X } from "lucide-react"
import { useState } from "react";

const EditGoalModal = ({ goal, onSave, onClose }) => {
    const [formData, setFormData] = useState({
        name: goal?.name || '',
        target_metric: goal?.target_metric || goal?.targetMetric || '',
        responsible_department: goal?.responsible_department || goal?.responsibleDepartment || '',
        deadline: goal?.deadline ? new Date(goal.deadline).toISOString().split('T')[0] : '',
        goal_category: goal?.goal_category || goal?.goalCategory || 'quarterly',
        audit_period: goal?.audit_period || goal?.auditPeriod || 'monthly'
    })

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await onSave(goal.id, formData);
        } catch (error) {
            console.error('Error saving goal:', error);
            alert('Failed to update goal. Please try again.');
        }
    }

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
    )
}

export default EditGoalModal