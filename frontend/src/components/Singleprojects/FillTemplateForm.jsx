import { useEffect, useState } from "react"
import { CheckSquare, Square, X } from "lucide-react"
import clsx from "clsx"
import { useParams } from "react-router-dom"
import { useMainContext } from "../../context/MainContext"

const FillTemplateForm = ({ template, close }) => {
    const [remarks, setRemarks] = useState({})
    const [originalRemarks, setOriginalRemarks] = useState({})
    const { id } = useParams()
    const { emp } = useMainContext()

    const handleToggle = (fieldId) => {
        if (!originalRemarks[fieldId]) {
            setRemarks(prev => ({ ...prev, [fieldId]: !prev[fieldId] }))
        }
    }

    const CanVerify = () => {
        if (emp.emp_dept === template.department) {
            return true
        } else {
            return false
        }
    }

    const isFieldLocked = (fieldId) => {
        return originalRemarks[fieldId] === true
    }

    useEffect(() => {
        if (template?.fields) {
            const initialRemarks = {}
            const originalRemarksState = {}

            for (const field of template.fields) {
                const originalValue = field.remark || false
                initialRemarks[field.id] = originalValue
                originalRemarksState[field.id] = originalValue
            }

            setRemarks(initialRemarks)
            setOriginalRemarks(originalRemarksState)
        }
    }, [template])

    // console.log("Template Data:", template)
    // console.log("Original Remarks:", originalRemarks)
    // console.log("Current Remarks:", remarks)

    const handleSubmit = async (e) => {
        e.preventDefault()
        const checkedIds = Object.entries(remarks)
            .filter(([fieldId, isChecked]) => {
                return isChecked && (!originalRemarks[fieldId] || isChecked !== originalRemarks[fieldId])
            })
            .map(([fieldId]) => fieldId)

        if (checkedIds.length === 0) {
            alert("No new items to update")
            return
        }

        try {
            const res = await fetch("http://127.0.0.1:8000/mark-template-remarks", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    project_id: id,
                    template_id: template.id,
                    verified_ids: checkedIds
                })
            })

            if (res.ok) {
                alert("Checklist Submitted Successfully!")
                close()
                window.location.reload()
            } else {
                alert("Submission Failed.")
            }
        } catch (err) {
            console.error(err)
            alert("Error occurred during submission.")
        }
    }

    // console.log(CanVerify())

    return (
        <div className="fixed -top-12 inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="p-6 w-full max-w-3xl mx-auto bg-white rounded-xl shadow-lg">
                <div className="flex w-full justify-between mb-4">
                    <div className="">
                        <h2 className="text-2xl font-bold mb-1">Fill Template</h2>
                        <p className="text-gray-600 mb-4">{template.template_name}</p>
                    </div>
                    <X onClick={close} className="text-black cursor-pointer " />
                </div>

                <form onSubmit={handleSubmit}>
                    <table className="w-full text-sm mb-6 border-separate border-spacing-y-2">
                        <thead>
                            <tr className="bg-violet-200">
                                <th className="p-2 text-left">Sr</th>
                                <th className="p-2 text-left">Check List Item</th>
                                <th className="p-2 text-left">Remark</th>
                            </tr>
                        </thead>
                        <tbody>
                            {template.fields?.map((item, index) => {
                                const isLocked = isFieldLocked(item.id)
                                const isChecked = remarks[item.id]
                                const canModify = CanVerify() && !template?.verified

                                return (
                                    <tr key={item.id} className="bg-violet-100">
                                        <td className="p-2">{index + 1}</td>
                                        <td className="p-2">
                                            <div className="flex items-center gap-2">
                                                <span>{item.title}</span>
                                                {isLocked && (
                                                    <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                                                        Verified
                                                    </span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="p-2">
                                            {canModify && !isLocked ? (
                                                <>
                                                    {isChecked ? (
                                                        <CheckSquare
                                                            className="text-green-600 h-5 w-5 cursor-pointer hover:text-green-700"
                                                            onClick={(e) => {
                                                                e.stopPropagation()
                                                                handleToggle(item.id)
                                                            }}
                                                        />
                                                    ) : (
                                                        <Square
                                                            className="text-gray-600 h-5 w-5 hover:text-blue-500 cursor-pointer"
                                                            onClick={(e) => {
                                                                e.stopPropagation()
                                                                handleToggle(item.id)
                                                            }}
                                                        />
                                                    )}
                                                </>
                                            ) : (
                                                <div className="flex items-center">
                                                    {isChecked ? (
                                                        <CheckSquare className={`h-5 w-5 ${isLocked ? 'text-green-600' : 'text-green-600'}`} />
                                                    ) : (
                                                        <Square className="text-gray-400 h-5 w-5" />
                                                    )}
                                                    {isLocked && (
                                                        <span className="ml-2 text-xs text-gray-500">Locked</span>
                                                    )}
                                                </div>
                                            )}
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                    <div className="flex justify-center space-x-4">
                        <button
                            type="submit"
                            className={clsx(
                                "bg-blue-800 text-white px-6 py-2 rounded-full font-semibold",
                                Object.keys(remarks).length > 0 ? "hover:bg-blue-900" : "opacity-50 cursor-not-allowed"
                            )}
                            disabled={Object.keys(remarks).length === 0}
                        >
                            Save Changes
                        </button>
                        <button
                            type="button"
                            className="bg-white text-gray-800 border border-gray-800 px-6 py-2 rounded-full font-semibold hover:bg-gray-300"
                            onClick={() => {
                                close()
                            }}
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default FillTemplateForm