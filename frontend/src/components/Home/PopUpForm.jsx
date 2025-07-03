import { useEffect, useState } from "react"

function PopupForm({ isVisible, onClose, formTitle, endpoint, fields, onSuccess }) {
    const [formData, setFormData] = useState({})
    const [employees, setEmployees] = useState([])

    useEffect(() => {
        if (isVisible) {
            fetchEmployees()
        }
    }, [isVisible])

    const fetchEmployees = async () => {
        try {
            const response = await fetch('http://127.0.0.1:8000/all-employees')
            const data = await response.json()
            if (response.ok) {
                setEmployees(data)
            } else {
                alert("Failed to fetch employees")
            }
        } catch (err) {
            alert(err.message)
        }
    }

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData({ ...formData, [name]: value })
    }

    const handleMultiSelect = (e, name) => {
        const options = Array.from(e.target.selectedOptions).map(opt => opt.value)
        setFormData({ ...formData, [name]: options })
    }

    const validateTo = (to) => {
        if (Array.isArray(to) && to.includes("all")) {
            return ["all"];
        }
        return to;
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        const emp = JSON.parse(localStorage.getItem("emp"))
        // Add all id fields from fields array
        const newFormData = { ...formData }
        fields.forEach(f => {
            if (f.type === "id") {
                newFormData[f.name] = emp.emp_id
            }
            if (f.name === "to") {
                newFormData[f.name] = validateTo(newFormData[f.name])
            }
        })
        try {
            const response = await fetch(endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newFormData),
            })

            if (response.ok) {
                alert('Successfully submitted!')
                onClose();
                if (onSuccess) onSuccess()
            } else {
                alert('Failed to submit!')
            }
        } catch (err) {
            alert(err.message)
        }
    }

    if (!isVisible) return null

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white w-[90%] md:w-[600px] p-6 rounded-lg shadow-lg relative overflow-y-auto max-h-[90%]">
                <button
                    onClick={onClose}
                    className="absolute top-2 right-2 text-gray-600 hover:text-red-500 text-lg"
                >
                    &times;
                </button>

                <h2 className="text-xl font-bold mb-4">{formTitle}</h2>

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    {fields.map(field => {
                        if (field.type === "id") return null // skip rendering id fields

                        if (field.type === "text") {
                            return (
                                <input
                                    key={field.name}
                                    type="text"
                                    name={field.name}
                                    required={!field.optional}
                                    placeholder={field.name.replace(/_/g, " ").replace(/\b\w/g, l => l.toUpperCase())}
                                    onChange={handleChange}
                                    className="border p-2 rounded"
                                />
                            )
                        }
                        if (field.type === "textarea") {
                            return (
                                <textarea
                                    key={field.name}
                                    name={field.name}
                                    required={!field.optional}
                                    placeholder={field.name.replace(/_/g, " ").replace(/\b\w/g, l => l.toUpperCase())}
                                    onChange={handleChange}
                                    className="border p-2 rounded resize-none"
                                />
                            )
                        }
                        if (field.type === "date") {
                            return (
                                <label>
                                    Deadline<br />
                                    <input
                                        key={field.name}
                                        type="datetime-local"
                                        name={field.name}
                                        required={!field.optional}
                                        onChange={handleChange}
                                        className="border p-2 rounded"
                                    />
                                </label>
                            )
                        }
                        if (field.type === "select") {
                            return (
                                <div key={field.name}>
                                    <label className="block mb-1 font-medium">
                                        {field.name.replace(/_/g, " ").replace(/\b\w/g, l => l.toUpperCase())}:
                                    </label>
                                    <div className="relative">
                                        <select
                                            multiple
                                            onChange={e => handleMultiSelect(e, field.name)}
                                            className="border p-2 rounded w-full min-h-[100px] bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-400 scrollbar-thin scrollbar-thumb-blue-300"
                                            value={formData[field.name] || []}
                                        >
                                            {field.name === "to" && (
                                                <option value="all">All</option>
                                            )}
                                            {employees.map((emp, idx) => (
                                                <option key={idx} value={emp.emp_id}>
                                                    {emp.emp_id} - {emp.emp_name || emp.name} - {emp.role}
                                                </option>
                                            ))}
                                        </select>
                                        <span className="absolute right-3 top-3 text-gray-400 pointer-events-none">
                                            <svg width="16" height="16" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" strokeWidth="2" d="M7 10l5 5 5-5" /></svg>
                                        </span>
                                    </div>
                                    <div className="text-xs text-gray-500 mt-1">Hold Ctrl (Windows) or Cmd (Mac) to select multiple employees.</div>
                                </div>
                            )
                        }
                        return null
                    })}

                    <button
                        type="submit"
                        className="bg-blue-600 hover:bg-blue-700 text-white py-2 rounded"
                    >
                        Submit
                    </button>
                </form>
            </div>
        </div>
    )
}

export default PopupForm
