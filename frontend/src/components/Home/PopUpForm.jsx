import { useState } from "react"

function PopupForm({ isVisible, onClose, formTitle, endpoint, fields, onSuccess }) {
    const [formData, setFormData] = useState({})
    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData({ ...formData, [name]: value })
    }
    const [isSubmiting, setIsSubmiting] = useState(false)
    // console.log(id)

    const handleSelectChange = (e, name, isMulti) => {
        if (isMulti) {
            const options = Array.from(e.target.selectedOptions).map(opt => opt.value)
            setFormData({ ...formData, [name]: options })
        } else {
            setFormData({ ...formData, [name]: e.target.value })
        }
    }

    const validateTo = (field) => {
        if (Array.isArray(field) && field.includes("all")) {
            return ["all"]
        }
        return field
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setIsSubmiting(true)
        const newFormData = { ...formData }

        for (const f of fields) {
            if (
                newFormData[f.name] === undefined &&
                !f.optional &&
                f.type !== "stored" &&
                !(f.type === "select" && f.optional === true)
            ) {
                alert(`Please fill the ${f.name.replace(/_/g, " ")}`)
                setIsSubmiting(false)
                return
            }

            if (f.type === "stored") {
                newFormData[f.name] = f.value;
            }

            if (f.name === "to") {
                newFormData[f.name] = validateTo(newFormData[f.name]);
            }

            if (f.type === "date") {
                const rawDate = newFormData[f.name];
                const parsedDate = new Date(rawDate);
                newFormData[f.name] = parsedDate;
            }

            if (
                f.type === "select" &&
                ((Array.isArray(newFormData[f.name]) && newFormData[f.name].length === 0) ||
                    newFormData[f.name] === undefined)
            ) {
                if (f.multi) {
                    newFormData[f.name] = [f.fields[0]?.value];
                } else {
                    if (!f.optional) {
                        alert("Please select " + f.name.replace(/_/g, " ").replace(/\b\w/g, l => l.toUpperCase()))
                        setIsSubmiting(false)
                        return
                    }
                }
            }

            if (f.type === "number" && newFormData[f.name] !== undefined) {
                const val = newFormData[f.name];
                if (val === "" || val === null) {
                    newFormData[f.name] = null;
                } else if (val.toString().includes(".")) {
                    newFormData[f.name] = parseFloat(val);
                } else {
                    newFormData[f.name] = parseInt(val, 10);
                }
            }
        }

        const hasFile = fields.some(f => f.type === "file")
        console.log(newFormData)
        try {
            let response
            if (hasFile) {
                const formDataToSend = new FormData()
                for (const key in newFormData) {
                    formDataToSend.append(key, newFormData[key])
                }

                response = await fetch(endpoint, {
                    method: "POST",
                    body: formDataToSend,
                })
            } else {
                response = await fetch(endpoint, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(newFormData),
                })
            }

            if (response === 200 || response === 201 || response.ok) {
                alert('Successfully submitted!')
                onClose()
                window.location.reload()
                if (onSuccess) onSuccess()
            }

            if (response.status === 409) {
                const message = await response.json()
                alert(message.detail || message.message || 'Conflict occurred!')
                return
            }
            if (!response.ok) {
                alert('Failed to perform the task!' + response.message)
            }
        } catch (err) {
            alert('Failed to submit!' + err.message || err.statusText || err.headers)
        } finally {
            setIsSubmiting(false)
        }
    }

    if (!isVisible) return null

    return (
        <div className="fixed inset-0 -top-12 bg-black bg-opacity-50 flex items-center justify-center z-50">
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
                        if (field.type === "stored") return null

                        if (field.type === "text") {
                            return (
                                <input
                                    key={field.name}
                                    type="text"
                                    name={field.name}
                                    required={!field.optional}
                                    placeholder={
                                        field.name
                                            .replace(/_/g, " ")
                                            .replace(/\b\w/g, l => l.toUpperCase()) +
                                        (field.optional === false ? "*" : "")
                                    }
                                    onChange={handleChange}
                                    className="border p-2 rounded"
                                />
                            )
                        }

                        if (field.type === "email") {
                            return (
                                <input
                                    key={field.name}
                                    type="email"
                                    name={field.name}
                                    required={!field.optional}
                                    placeholder={field.name.replace(/_/g, " ").replace(/\b\w/g, l => l.toUpperCase()) +
                                        (field.optional === false ? "*" : "")}
                                    onChange={handleChange}
                                    className="border p-2 rounded"
                                />
                            )
                        }

                        if (field.type === "number") {
                            return (
                                <input
                                    key={field.name}
                                    type="number"
                                    name={field.name}
                                    required={!field.optional}
                                    placeholder={field.name.replace(/_/g, " ").replace(/\b\w/g, l => l.toUpperCase()) +
                                        (field.optional === false ? "*" : "")}
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
                                    placeholder={field.name.replace(/_/g, " ").replace(/\b\w/g, l => l.toUpperCase()) +
                                        (field.optional === false ? "*" : "")}
                                    onChange={handleChange}
                                    className="border p-2 rounded resize-none"
                                />
                            )
                        }

                        if (field.type === "file") {
                            return (
                                <div key={field.name}>
                                    <label className="block mb-1 font-medium">
                                        {field.name.replace(/_/g, " ").replace(/\b\w/g, l => l.toUpperCase())}:
                                    </label>
                                    <input
                                        type="file"
                                        name={field.name}
                                        required={!field.optional}
                                        onChange={(e) =>
                                            setFormData({ ...formData, [field.name]: e.target.files[0] })
                                        }
                                        className="border p-2 rounded w-full"
                                    />
                                </div>
                            )
                        }

                        if (field.type === "date") {
                            const now = new Date();
                            const formattedNow = now.toISOString().slice(0, 16)

                            return (
                                <label key={field.name} className="font-medium">
                                    {field.name.replace(/_/g, " ").replace(/\b\w/g, l => l.toUpperCase())}:<br />
                                    <input
                                        type="datetime-local"
                                        name={field.name}
                                        required={!field.optional}
                                        onChange={handleChange}
                                        className="border p-2 rounded"
                                        min={!field.allowPastDate ? formattedNow : undefined}
                                    />
                                </label>
                            );
                        }

                        if (field.type === "select") {
                            return (
                                <div key={field.name}>
                                    <label className="block mb-1 font-medium">
                                        {field.name.replace(/_/g, " ").replace(/\b\w/g, l => l.toUpperCase())}:
                                    </label>
                                    <div className="relative">
                                        <select
                                            multiple={field.multi}
                                            onChange={e => handleSelectChange(e, field.name, field.multi)}
                                            className={`border p-2 rounded w-full ${field.multi ? 'min-h-[100px]' : ''} bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-400 scrollbar-thin scrollbar-thumb-blue-300`}
                                            value={formData[field.name] || (field.multi ? [] : '')}
                                        >
                                            {!field.multi && (<option value={""}>Please Select {field.name.replace(/_/g, " ").replace(/\b\w/g, l => l.toUpperCase())}</option>)}
                                            {field.fields.map((option, idx) => (
                                                <option key={idx} value={option.value}>
                                                    {option.name}
                                                </option>
                                            ))}
                                        </select>
                                        <span className="absolute right-3 top-3 text-gray-400 pointer-events-none">
                                            <svg width="16" height="16" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" strokeWidth="2" d="M7 10l5 5 5-5" /></svg>
                                        </span>
                                    </div>
                                    {field.multi && <div className="text-xs text-gray-500 mt-1">Hold Ctrl (Windows) or Cmd (Mac) to select multiple options.</div>}
                                </div>
                            )
                        }

                        return null
                    })}

                    <button
                        type="submit"
                        disabled={isSubmiting}
                        className="bg-blue-600 hover:bg-blue-700 text-white py-2 rounded"
                    >
                        {isSubmiting ? 'Submitting...' : 'Submit'}
                    </button>
                </form>
            </div>
        </div>
    )
}

export default PopupForm
