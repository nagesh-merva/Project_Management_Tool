import { Tag, Plus } from "lucide-react"
import { useState } from "react"
import PopupForm from '../Home/PopUpForm'
import { useParams } from "react-router-dom"

const Notes = ({ notes }) => {
    const [showPopup, setShowPopup] = useState(false)
    const { clientid } = useParams()
    const [fields, setFields] = useState([
        { name: "client_id", type: "stored", value: clientid },
        { name: "note", type: "textarea" },
    ])
    return (
        <>
            <div className="bg-white rounded-xl shadow-sm p-6">
                <div className='w-full flex items-center justify-between mb-4'>
                    <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2 mb-4">
                        <Tag className="text-blue-600" size={20} />
                        Additional Notes
                    </h2>
                    <button onClick={() => setShowPopup(true)} className='p-2 bg-gray-100 rounded-md hover:scale-105 hover:bg-gray-200 transition-all'><Plus size={24} /></button>
                </div>
                {notes && notes.length > 0 ? (
                    <ul className="list-disc pl-5 space-y-2">
                        {notes.map((note, index) => (
                            <li key={index} className="text-gray-700">
                                {note.note} <span className="text-gray-500 text-sm">({new Date(note.created_at).toLocaleDateString()})</span>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-gray-500">No additional notes available.</p>
                )}
            </div>
            <PopupForm
                isVisible={showPopup}
                onClose={() => setShowPopup(false)}
                formTitle="Add a Note"
                endpoint="http://127.0.0.1:8000/add-client-notes"
                fields={fields}
            />
        </>
    )
}

export default Notes