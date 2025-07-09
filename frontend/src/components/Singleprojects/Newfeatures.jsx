import { useState } from "react"
import { ChevronDown, ChevronUp, CheckSquare, Square } from "lucide-react"
import { useParams } from "react-router-dom"
const Newfeatures = ({ feature }) => {
    const [isOpen, setIsOpen] = useState(false)
    const [isVerified, setIsVerified] = useState(feature.verified)
    const { id } = useParams()
    const handleVerify = async () => {
        if (isVerified) return
        console.log('Verifying feature:', feature.id, 'for project:', id)
        try {
            const response = await fetch('http://127.0.0.1:8000/verify-feature', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ feature_id: feature.id, project_id: id })
            })

            if (response.ok) {
                setIsVerified(true)
            } else {
                alert('Verification failed')
            }
        } catch (err) {
            alert('Error: ' + err.message)
        }
    }

    return (
        <div className="my-3 mx-4 p-4 bg-white rounded-xl border border-gray-300 shadow-sm hover:shadow-md transition cursor-pointer">
            <div className="flex justify-between items-center" onClick={() => setIsOpen(!isOpen)}>
                <div className="flex items-start gap-4">
                    <div onClick={(e) => { e.stopPropagation(); handleVerify(); }}>
                        {isVerified ? (
                            <CheckSquare className="text-green-600 h-5 w-5" />
                        ) : (
                            <Square className="text-gray-600 h-5 w-5 hover:text-blue-500" />
                        )}
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold text-gray-800">{feature.title}</h3>
                        <p className="text-sm text-gray-500">{feature.descp}</p>
                        <p className="text-xs text-gray-400 mt-1">Created by: {feature.created_by}</p>
                    </div>
                </div>
                {isOpen ? <ChevronUp className="text-gray-500" /> : <ChevronDown className="text-gray-500" />}
            </div>

            {isOpen && (
                <div className="mt-3 ml-7">
                    <h4 className="text-sm font-semibold text-gray-700 mb-1">Associated Tasks:</h4>
                    {feature.tasks.length > 0 ? (
                        feature.tasks.map((taskId, index) => (
                            <p key={index} className="text-sm text-gray-600">- {taskId}</p>
                        ))
                    ) : (
                        <p className="text-sm text-gray-400">No associated tasks</p>
                    )}
                </div>
            )}
        </div>
    )
}

export default Newfeatures
