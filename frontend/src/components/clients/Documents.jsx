import { useState } from 'react'
import PopupForm from '../Home/PopUpForm';
import { ExternalLink, FileText, Plus } from "lucide-react"
import { useParams } from 'react-router-dom';

const Documents = ({ documents }) => {
    const [showPopup, setShowPopup] = useState(false)
    const { clientid } = useParams()
    const [fields, setFields] = useState([
        { name: "client_id", type: "stored", value: clientid },
        { name: "doc_type", type: "select", fields: [{ name: "NDA", value: "NDA" }, { name: "SLA", value: "SLA" }, { name: "SOW", value: "SOW" }, { name: "Quotation", value: "Quotation" }, { name: "Contract", value: "Contract" }, { name: "Invoice", value: "Invoice" }, { name: "Report", value: "Report" }, { name: "Other", value: "Other" }] },
        { name: "doc_name", type: "text", optional: false },
        { name: "file", type: "file" },
    ])

    console.log("Documents:", documents);

    return (
        <>
            <div className="bg-white rounded-xl shadow-sm p-6 h-64">
                <div className='w-full flex items-center justify-between mb-4'>
                    <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2 mb-4">
                        <FileText className="text-orange-600" size={20} />
                        Documents
                    </h2>
                    <button onClick={() => setShowPopup(true)} className='p-2 bg-gray-100 rounded-md hover:scale-105 hover:bg-gray-200 transition-all'><Plus size={24} /></button>
                </div>
                <div className="space-y-3 h-40 overflow-y-auto scrollbar-none">
                    {documents && documents.map((doc, index) => (
                        <a
                            key={index}
                            href={doc.doc_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                        >
                            <div className="flex flex-col">
                                <span className="font-medium">{doc.doc_name}</span>
                                <span className="font-thin text-xs">{doc.doc_type}</span>

                            </div>
                            <div className='flex flex-col items-end space-y-2'>
                                <ExternalLink size={16} className="text-gray-400" />
                                <span className="text-[10px] text-gray-500">{doc.uploaded_at?.split("T")[0]}</span>
                            </div>
                        </a>
                    ))}
                    {documents && documents.length === 0 && (
                        <div className="text-gray-500 text-sm text-center mt-4">
                            No documents available
                        </div>
                    )}
                </div>
            </div>
            <PopupForm
                isVisible={showPopup}
                onClose={() => setShowPopup(false)}
                formTitle="Add a new Document"
                endpoint="http://127.0.0.1:8000/add-client-documents"
                fields={fields}
            />
        </>
    )
}

export default Documents