import { useState, useEffect } from "react"
import { useParams } from "react-router-dom"
import Loading from "../Loading"

const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
]

const dept = [
    "DEV", "DESIGN", "SALES", "MAINTENANCE", "ADMIN"
]

const FinancialDataForm = ({ isVisible, onClose, existingData, onSubmit }) => {
    const { id: project_id } = useParams()

    const [budget, setBudget] = useState(existingData.total_budget || "")
    const [revenue, setRevenue] = useState(existingData.expected_revenue || "")
    const [costs, setCosts] = useState(existingData.cost_breakdown || [])
    const [spenditure, setSpenditure] = useState(existingData.spenditure_analysis || [])

    const [budgetChanged, setBudgetChanged] = useState(false)
    const [revenueChanged, setRevenueChanged] = useState(false)
    const [loading, setLoading] = useState(false)

    // console.log(existingData)

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        try {
            const filteredCosts = costs
                .map(c => {
                    const copy = { ...c }
                    if (!copy.id) delete copy.id
                    return copy
                })
                .filter(c =>
                    c.title?.trim() &&
                    c.calc_brief?.trim() &&
                    c.cost !== "" &&
                    c.cost !== null &&
                    c.cost !== undefined
                );

            const filteredSpenditure = spenditure
                .map(s => {
                    const copy = { ...s };
                    if (!copy.id) delete copy.id
                    copy.cost = parseFloat(copy.cost)
                    return copy
                })
                .filter(s =>
                    s.month?.trim() &&
                    s.dept?.trim() &&
                    s.cost !== "" &&
                    s.cost !== null &&
                    s.cost !== undefined
                )

            const payload = {
                project_id,
                cost_breakdown: filteredCosts,
                spenditure_analysis: filteredSpenditure,
            }

            if (budgetChanged) payload.total_budget = Number(budget)
            if (revenueChanged) payload.expected_revenue = Number(revenue)
            if (budgetChanged || revenueChanged) payload.profit_margin = Number(profitMargin)

            console.log(payload)
            await onSubmit(payload)
            window.location.reload()
        } catch (e) {
            console.error(e)
        } finally {
            setLoading(false)
            onClose()
        }
    }

    const updateCost = (index, key, value) => {
        const updated = [...costs]
        updated[index][key] = value
        setCosts(updated)
    }

    const updateSpenditure = (index, key, value) => {
        const updated = [...spenditure]
        updated[index][key] = value
        setSpenditure(updated)
    }
    if (!isVisible) return null

    return (
        <div className="fixed inset-0 -top-12 bg-black bg-opacity-50 flex items-center justify-center z-50">
            {loading ? (
                <Loading />
            ) : (
                <form onSubmit={handleSubmit} className="relative bg-white w-[90%] max-w-2xl p-6 rounded-lg shadow-lg overflow-y-auto max-h-[90%] space-y-6">
                    <button
                        onClick={onClose}
                        className="absolute top-2 right-2 text-gray-600 hover:text-red-500 text-lg"
                    >
                        &times;
                    </button>
                    <h2 className="text-xl font-bold text-gray-800">Manage Financial Data</h2>
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">Total Budget (₹)</label>
                        <input
                            type="number"
                            value={budget}
                            onChange={(e) => {
                                setBudget(e.target.value);
                                setBudgetChanged(true);
                            }}
                            placeholder={budget}
                            className="w-full border p-2 rounded"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">Expected Revenue (₹)</label>
                        <input
                            type="number"
                            value={revenue}
                            onChange={(e) => {
                                setRevenue(e.target.value);
                                setRevenueChanged(true);
                            }}
                            placeholder={revenue}
                            className="w-full border p-2 rounded"
                        />
                    </div>
                    {(budgetChanged || revenueChanged) && (
                        <div>
                            <p className="text-sm text-gray-600">Calculated Profit Margin: <strong>{profitMargin}%</strong></p>
                        </div>
                    )}
                    <div>
                        <h3 className="font-semibold text-gray-800 mb-2">Cost Breakdown</h3>
                        {costs.map((cost, idx) => (
                            <div key={idx} className="grid grid-cols-3 gap-3 mb-2">
                                <input
                                    type="text"
                                    value={cost.title}
                                    onChange={(e) => updateCost(idx, "title", e.target.value)}
                                    placeholder="Title"
                                    className="border p-2 rounded"
                                />
                                <input
                                    type="text"
                                    value={cost.calc_brief}
                                    onChange={(e) => updateCost(idx, "calc_brief", e.target.value)}
                                    placeholder="Calculation Brief"
                                    className="border p-2 rounded"
                                />
                                <input
                                    type="number"
                                    value={cost.cost}
                                    onChange={(e) => updateCost(idx, "cost", e.target.value)}
                                    placeholder="Cost"
                                    className="border p-2 rounded"
                                />
                            </div>
                        ))}
                        <button type="button" onClick={() => setCosts([...costs, { title: "", cost: "", calc_brief: "" }])}
                            className="text-blue-600 hover:underline text-sm mt-1">
                            + Add Cost Breakdown
                        </button>
                    </div>
                    <div>
                        <h3 className="font-semibold text-gray-800 mb-2">Spenditure Analysis</h3>
                        {spenditure.map((entry, idx) => (
                            <div key={idx} className="grid grid-cols-3 gap-3 mb-2">
                                <select
                                    value={entry.month}
                                    onChange={(e) => updateSpenditure(idx, "month", e.target.value)}
                                    className="border p-2 rounded"
                                >
                                    <option value="">Select Month</option>
                                    {months.map((m) => (
                                        <option key={m} value={m}>{m}</option>
                                    ))}
                                </select>
                                <select
                                    value={entry.dept}
                                    onChange={(e) => updateSpenditure(idx, "dept", e.target.value)}
                                    className="border p-2 rounded"
                                >
                                    <option value="">Select Department</option>
                                    {dept.map((d) => (
                                        <option key={d} value={d}>{d}</option>
                                    ))}
                                </select>
                                <input
                                    type="number"
                                    value={entry.cost}
                                    onChange={(e) => updateSpenditure(idx, "cost", e.target.value)}
                                    placeholder="Cost"
                                    className="border p-2 rounded"
                                />
                            </div>
                        ))}
                        <button type="button" onClick={() => setSpenditure([...spenditure, { month: "", dept: "", cost: "" }])}
                            className="text-blue-600 hover:underline text-sm mt-1">
                            + Add Spenditure
                        </button>
                    </div>

                    <div className="flex justify-end pt-4">
                        <button type="submit" className="bg-btncol text-white px-6 py-2 rounded hover:bg-gray-800">
                            Save Financials
                        </button>
                    </div>
                </form>
            )}
        </div>
    )
}

export default FinancialDataForm

