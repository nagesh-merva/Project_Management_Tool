import React, { useState } from 'react'
import { X, Plus, Target, Calendar, Users, TrendingUp, AlertCircle } from 'lucide-react'
import { useMainContext } from "../../../context/MainContext"

const CreateGoalModal = ({ isOpen, onClose, onGoalCreated }) => {
    const { emp } = useMainContext()
    const [formData, setFormData] = useState({
        name: '',
        target_metric: '',
        goal_category: 'quarterly',
        responsible_department: '',
        deadline: '',
        success_probability: 50,
        audit_period: 'monthly',
        created_by: emp.emp_name
    })
    const [milestones, setMilestones] = useState([])
    const [risks, setRisks] = useState([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    const departmentOptions = [
        { value: 'SALES', label: 'Sales' },
        { value: 'DESIGN', label: 'Design' },
        { value: 'DEV', label: 'Development' },
        { value: 'Maintenance', label: 'Maintenance' },
        { value: 'ADMIN', label: 'Company' }
    ]

    const categoryOptions = [
        { value: 'quarterly', label: 'Quarterly (3 months)' },
        { value: '6months', label: '6 Months' },
        { value: 'yearly', label: 'Yearly' }
    ]

    const auditPeriodOptions = [
        { value: 'weekly', label: 'Weekly' },
        { value: 'monthly', label: 'Monthly' },
        { value: 'quarterly', label: 'Quarterly' }
    ]

    const handleInputChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: value
        }))
    }

    const addMilestone = () => {
        const newMilestone = {
            id: `MST${Date.now()}`,
            name: '',
            due_date: '',
            completed: false,
            completion_date: null
        }
        setMilestones(prev => [...prev, newMilestone])
    }

    const updateMilestone = (index, field, value) => {
        setMilestones(prev => prev.map((milestone, i) =>
            i === index ? { ...milestone, [field]: value } : milestone
        ))
    }

    const removeMilestone = (index) => {
        setMilestones(prev => prev.filter((_, i) => i !== index))
    }

    const addRisk = () => {
        const newRisk = {
            id: `RISK${Date.now()}`,
            description: '',
            level: 'medium',
            mitigation: ''
        }
        setRisks(prev => [...prev, newRisk])
    }

    const updateRisk = (index, field, value) => {
        setRisks(prev => prev.map((risk, i) =>
            i === index ? { ...risk, [field]: value } : risk
        ))
    }

    const removeRisk = (index) => {
        setRisks(prev => prev.filter((_, i) => i !== index))
    }

    const handleSubmit = async () => {
        setLoading(true)
        setError('')

        try {
            const convertToDatetime = (dateStr) => {
                return dateStr ? new Date(dateStr).toISOString() : null
            }

            const goalData = {
                ...formData,
                deadline: convertToDatetime(formData.deadline),
                success_probability: parseFloat(formData.success_probability),
                milestones: milestones
                    .filter(m => m.name.trim() !== '')
                    .map(m => ({
                        ...m,
                        due_date: convertToDatetime(m.due_date),
                        completion_date: convertToDatetime(m.completion_date)
                    })),
                risks: risks
                    .filter(r => r.description.trim() !== '')
            }

            console.log(goalData)

            const response = await fetch('https://project-management-tool-uh55.onrender.com/goals/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(goalData)
            })

            if (!response.ok) {
                const errorData = await response.json()
                throw new Error(errorData.detail || 'Failed to create goal')
            }

            const createdGoal = await response.json()

            setFormData({
                name: '',
                target_metric: '',
                goal_category: 'quarterly',
                responsible_department: '',
                deadline: '',
                success_probability: 50,
                audit_period: 'monthly',
                created_by: emp.emp_name
            })
            setMilestones([])
            setRisks([])

            if (onGoalCreated) {
                onGoalCreated(createdGoal)
            }

            onClose()
        } catch (err) {
            setError(err.message || 'Failed to create goal')
        } finally {
            setLoading(false)
        }
    }

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-black bg-opacity-50" onClick={onClose} />

            <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto mx-4">
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <div className="flex items-center gap-3">
                        <Target className="text-blue-600" size={24} />
                        <h2 className="text-2xl font-bold text-gray-900">Create New Goal</h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <X size={24} />
                    </button>
                </div>

                <div className="p-6 space-y-6">
                    {error && (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-2">
                            <AlertCircle className="text-red-500" size={20} />
                            <span className="text-red-700">{error}</span>
                        </div>
                    )}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Goal Name *
                            </label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="Enter goal name"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Target Metric *
                            </label>
                            <input
                                type="text"
                                name="target_metric"
                                value={formData.target_metric}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="e.g., Increase sales by 20%"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Category *
                            </label>
                            <select
                                name="goal_category"
                                value={formData.goal_category}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            >
                                {categoryOptions.map(option => (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Responsible Department *
                            </label>
                            <select
                                name="responsible_department"
                                value={formData.responsible_department}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            >
                                <option value="">Select Department</option>
                                {departmentOptions.map(option => (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Deadline *
                            </label>
                            <input
                                type="date"
                                name="deadline"
                                value={formData.deadline}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Success Probability (%)
                            </label>
                            <input
                                type="number"
                                name="success_probability"
                                value={formData.success_probability}
                                onChange={handleInputChange}
                                min="0"
                                max="100"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Audit Period
                            </label>
                            <select
                                name="audit_period"
                                value={formData.audit_period}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            >
                                {auditPeriodOptions.map(option => (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <div>
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-gray-900">Milestones</h3>
                            <button
                                type="button"
                                onClick={addMilestone}
                                className="flex items-center gap-2 px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
                            >
                                <Plus size={16} />
                                Add Milestone
                            </button>
                        </div>

                        {milestones.map((milestone, index) => (
                            <div key={milestone.id} className="bg-gray-50 rounded-lg p-4 mb-3">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    <div>
                                        <input
                                            type="text"
                                            placeholder="Milestone Name"
                                            value={milestone.name}
                                            onChange={(e) => updateMilestone(index, 'name', e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        />
                                    </div>
                                    <div className="flex gap-2">
                                        <input
                                            type="date"
                                            value={milestone.due_date}
                                            onChange={(e) => updateMilestone(index, 'due_date', e.target.value)}
                                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => removeMilestone(index)}
                                            className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                        >
                                            <X size={16} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div>
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-gray-900">Risks</h3>
                            <button
                                type="button"
                                onClick={addRisk}
                                className="flex items-center gap-2 px-3 py-1 text-sm bg-orange-100 text-orange-700 rounded-lg hover:bg-orange-200 transition-colors"
                            >
                                <Plus size={16} />
                                Add Risk
                            </button>
                        </div>
                        {risks.map((risk, index) => (
                            <div key={risk.id} className="bg-gray-50 rounded-lg p-4 mb-3">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                    <div>
                                        <input
                                            type="text"
                                            placeholder="Risk description"
                                            value={risk.description}
                                            onChange={(e) => updateRisk(index, 'description', e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        />
                                    </div>
                                    <div>
                                        <select
                                            value={risk.level}
                                            onChange={(e) => updateRisk(index, 'level', e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        >
                                            <option value="low">Low Impact</option>
                                            <option value="medium">Medium Impact</option>
                                            <option value="high">High Impact</option>
                                        </select>
                                    </div>
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            placeholder="Mitigation plan"
                                            value={risk.mitigation}
                                            onChange={(e) => updateRisk(index, 'mitigation', e.target.value)}
                                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => removeRisk(index)}
                                            className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                        >
                                            <X size={16} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="flex justify-end gap-3 pt-6 border-t border-gray-200">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-6 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="button"
                            onClick={handleSubmit}
                            disabled={loading || !formData.name || !formData.target_metric || !formData.responsible_department || !formData.deadline}
                            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                        >
                            {loading ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                    Creating...
                                </>
                            ) : (
                                <>
                                    <Target size={16} />
                                    Create Goal
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CreateGoalModal