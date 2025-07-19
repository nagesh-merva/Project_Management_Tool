import { useState } from "react"
import { CheckSquare, Square, X } from "lucide-react"
import clsx from "clsx"
import { useParams } from "react-router-dom"

const FillTemplateForm = ({ template, close }) => {
    const [remarks, setRemarks] = useState({})
    const { id } = useParams()

    const handleToggle = (id) => {
        setRemarks(prev => ({ ...prev, [id]: !prev[id] }))
    }

    console.log("Template Data:", template)

    const handleSubmit = async (e) => {
        e.preventDefault();
        const checkedIds = Object.entries(remarks)
            .filter(([_, v]) => v === true)
            .map(([k]) => k)

        try {
            const res = await fetch("http://127.0.0.1:8000/mark-template-remarks", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ project_id: id, template_id: template.id, verified_ids: checkedIds })
            })

            if (res.ok) {
                alert("Checklist Submitted Successfully!")
                close();
                window.location.reload();
            } else {
                alert("Submission Failed.")
            }
        } catch (err) {
            console.error(err);
            alert("Error occurred during submission.")
        }
    }


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
                            {template.fields?.map((item, index) => (
                                <tr key={item.id} className="bg-violet-100">
                                    <td className="p-2">{index + 1}</td>
                                    <td className="p-2">{item.title}</td>
                                    <td className="p-2">
                                        {item.remark ? (
                                            <CheckSquare className="text-green-600 h-5 w-5" />
                                        ) : (
                                            <Square
                                                onClick={(e) => {
                                                    e.stopPropagation()
                                                    handleToggle(item.id)
                                                }}
                                                className="text-gray-600 h-5 w-5 hover:text-blue-500 cursor-pointer"
                                            />
                                        )}
                                    </td>
                                </tr>
                            ))}
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
                            Save
                        </button>
                        <button
                            type="button"
                            className={clsx(
                                "bg-white text-gray-800 border border-gray-800 px-6 py-2 rounded-full font-semibold",
                                Object.keys(remarks).length > 0 ? "hover:bg-gray-300" : "opacity-50 cursor-not-allowed"
                            )}
                            disabled={Object.keys(remarks).length === 0}
                            onClick={() => {
                                setRemarks({});
                                close();
                            }}
                        >
                            cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default FillTemplateForm
