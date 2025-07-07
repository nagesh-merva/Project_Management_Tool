import { useState } from 'react'
import { DollarSign, Plus, Calendar, CreditCard, Clock, Trash2, Eye, EyeOff } from 'lucide-react'

const SalaryAccountManager = ({ emp, onUpdate }) => {
    const [showAccount, setShowAccount] = useState(false)
    const [isAddingRecord, setIsAddingRecord] = useState(false)
    const [newRecord, setNewRecord] = useState({
        salary_paid: emp.salary_monthly || 0,
        date: new Date().toISOString().split('T')[0],
        reference_id: '',
        working_days: 30
    })

    const isAdmin = () => {
        try {
            const user = JSON.parse(localStorage.getItem('emp') || '{}')
            return user.role === 'admin' || user.emp_dept === "SALES"
        } catch {
            return false
        }
    }

    const handleAddRecord = async () => {
        try {
            await onUpdate('salary_account', newRecord)
            setIsAddingRecord(false)
            setNewRecord({
                salary_paid: emp.salary_monthly || 0,
                date: new Date().toISOString().split('T')[0],
                reference_id: '',
                working_days: 30
            })
        } catch (error) {
            console.error('Failed to add salary record:', error)
        }
    }

    const handleDeleteRecord = async (index) => {
        if (window.confirm('Are you sure you want to delete this salary record?')) {
            try {
                await onUpdate('delete_salary_record', { index })
            } catch (error) {
                console.error('Failed to delete salary record:', error)
            }
        }
    }

    const calculateTotalPaid = () => {
        return emp.salary_account?.reduce((total, record) => total + record.salary_paid, 0) || 0
    }

    const getLatestPayment = () => {
        if (!emp.salary_account || emp.salary_account.length === 0) return null
        return emp.salary_account.sort((a, b) => new Date(b.date) - new Date(a.date))[0]
    }

    const latestPayment = getLatestPayment()

    return (
        <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                    <DollarSign className="text-green-600" size={24} />
                    Salary Account Management
                </h2>
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setShowAccount(!showAccount)}
                        className="p-2 text-gray-500 hover:text-green-600 transition-colors"
                    >
                        {showAccount ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                    {isAdmin() && (
                        <button
                            onClick={() => setIsAddingRecord(true)}
                            className="p-2 text-gray-500 hover:text-green-600 transition-colors"
                        >
                            <Plus size={20} />
                        </button>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                    <div className="flex items-center gap-2 mb-2">
                        <DollarSign className="text-green-600" size={20} />
                        <span className="text-sm font-medium text-green-800">Total Paid</span>
                    </div>
                    <p className="text-2xl font-bold text-green-700">
                        ₹{calculateTotalPaid().toLocaleString()}
                    </p>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                    <div className="flex items-center gap-2 mb-2">
                        <Calendar className="text-blue-600" size={20} />
                        <span className="text-sm font-medium text-blue-800">Last Payment</span>
                    </div>
                    <p className="text-lg font-semibold text-blue-700">
                        {latestPayment ? new Date(latestPayment.date).toLocaleDateString() : 'No payments'}
                    </p>
                </div>

                <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                    <div className="flex items-center gap-2 mb-2">
                        <CreditCard className="text-purple-600" size={20} />
                        <span className="text-sm font-medium text-purple-800">Records</span>
                    </div>
                    <p className="text-2xl font-bold text-purple-700">
                        {emp.salary_account?.length || 0}
                    </p>
                </div>
            </div>

            {isAddingRecord && isAdmin() && (
                <div className="bg-gray-50 p-4 rounded-lg mb-6 border border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Add Salary Payment Record</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Salary Paid (₹)
                            </label>
                            <input
                                type="number"
                                value={newRecord.salary_paid}
                                onChange={(e) => setNewRecord(prev => ({ ...prev, salary_paid: parseFloat(e.target.value) || 0 }))}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                min="0"
                                step="0.01"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Payment Date
                            </label>
                            <input
                                type="date"
                                value={newRecord.date}
                                onChange={(e) => setNewRecord(prev => ({ ...prev, date: e.target.value }))}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Reference ID
                            </label>
                            <input
                                type="text"
                                value={newRecord.reference_id}
                                onChange={(e) => setNewRecord(prev => ({ ...prev, reference_id: e.target.value }))}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                placeholder="Transaction reference ID"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Working Days
                            </label>
                            <input
                                type="number"
                                value={newRecord.working_days}
                                onChange={(e) => setNewRecord(prev => ({ ...prev, working_days: parseInt(e.target.value) || 0 }))}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                min="1"
                                max="31"
                            />
                        </div>
                    </div>
                    <div className="flex gap-2 mt-4">
                        <button
                            onClick={handleAddRecord}
                            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                        >
                            <Plus size={16} />
                            Add Record
                        </button>
                        <button
                            onClick={() => setIsAddingRecord(false)}
                            className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            )}

            {showAccount && (
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse border border-gray-200 rounded-lg">
                        <thead>
                            <tr className="bg-gray-50">
                                <th className="border border-gray-200 px-4 py-3 text-left text-sm font-semibold text-gray-900">
                                    Date
                                </th>
                                <th className="border border-gray-200 px-4 py-3 text-left text-sm font-semibold text-gray-900">
                                    Amount Paid
                                </th>
                                <th className="border border-gray-200 px-4 py-3 text-left text-sm font-semibold text-gray-900">
                                    Reference ID
                                </th>
                                <th className="border border-gray-200 px-4 py-3 text-left text-sm font-semibold text-gray-900">
                                    Working Days
                                </th>
                                {isAdmin() && (
                                    <th className="border border-gray-200 px-4 py-3 text-left text-sm font-semibold text-gray-900">
                                        Actions
                                    </th>
                                )}
                            </tr>
                        </thead>
                        <tbody>
                            {emp.salary_account && emp.salary_account.length > 0 ? (
                                emp.salary_account
                                    .sort((a, b) => new Date(b.date) - new Date(a.date))
                                    .map((record, index) => (
                                        <tr key={index} className="hover:bg-gray-50">
                                            <td className="border border-gray-200 px-4 py-3 text-sm text-gray-900">
                                                {new Date(record.date).toLocaleDateString()}
                                            </td>
                                            <td className="border border-gray-200 px-4 py-3 text-sm font-semibold text-green-600">
                                                ₹{record.salary_paid.toLocaleString()}
                                            </td>
                                            <td className="border border-gray-200 px-4 py-3 text-sm text-gray-900 font-mono">
                                                {record.reference_id}
                                            </td>
                                            <td className="border border-gray-200 px-4 py-3 text-sm text-gray-900">
                                                {record.working_days} days
                                            </td>
                                            {isAdmin() && (
                                                <td className="border border-gray-200 px-4 py-3 text-sm">
                                                    <button
                                                        onClick={() => handleDeleteRecord(index)}
                                                        className="text-red-600 hover:text-red-800 transition-colors"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </td>
                                            )}
                                        </tr>
                                    ))
                            ) : (
                                <tr>
                                    <td
                                        colSpan={isAdmin() ? 5 : 4}
                                        className="border border-gray-200 px-4 py-8 text-center text-gray-500"
                                    >
                                        No salary records found
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    )
}

export default SalaryAccountManager