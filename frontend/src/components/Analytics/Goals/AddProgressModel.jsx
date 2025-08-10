import { Plus, X } from "lucide-react"
import { useState } from "react"

const AddProgressModal = ({ goal, onSave, onClose }) => {
    const [formData, setFormData] = useState({
        progress_percentage: goal?.current_progress || goal?.currentProgress || 0,
        notes: '',
        updated_by: 'Current User'
    })

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            await onSave(goal.id, formData)
        } catch (error) {
            console.error('Error adding progress:', error)
            alert('Failed to add progress. Please try again.')
        }
    }

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
    )
}

export default AddProgressModal