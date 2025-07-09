import { Files } from "lucide-react"
import { useState } from "react"
import PopupForm from "../Home/PopUpForm"

const Srs = ({ srs }) => {
    // console.log(srs)
    const [showPopup, setShowPopup] = useState(false)
    const [fields, setFields] = useState([
        {
            name: "project_id",
            type: "id",
        },
        {
            name: "srs_key_req",
            type: "text",
            optional: false,
        },
        {
            name: "srs_link",
            type: "text",
            optional: true
        }

    ])
    return (
        <>
            <div className="h-fit rounded-xl bg-gray-50 drop-shadow-xl mb-6 p-6">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                        <Files color="#0C098C" fill="#79EE8D" className="h-7 w-7" />
                        <p className="ml-3 text-lg font-bold text-gray-800">SRS & Requirements</p>
                    </div>
                    <button onClick={() => setShowPopup(true)} className="px-4 py-1 rounded-lg bg-blue-600 text-white hover:bg-blue-500 transition-all ">
                        Update
                    </button>
                </div>
                <div className="w-[96%] bg-blue-50 mx-auto rounded-xl p-5 mb-4 border border-blue-200">
                    <p className="font-semibold text-base text-blue-800 mb-3">Key Requirements</p>
                    <ul className="list-disc ml-6 space-y-2 text-gray-700 text-sm">
                        {srs?.key_req && srs.key_req.map((req, index) => (
                            <li key={index}>{req}</li>
                        ))}
                    </ul>
                </div>
                <div className="flex justify-center">
                    <a href={srs?.srs_doc_link} target="_blank" rel="noopener noreferrer">
                        <button className="flex items-center bg-violet-600 rounded-full text-base h-12 px-8 text-white hover:scale-95 hover:bg-violet-700 transition-all shadow-lg font-medium">
                            View Full SRS
                        </button>
                    </a>
                </div>
            </div>
            <PopupForm
                isVisible={showPopup}
                onClose={() => setShowPopup(false)}
                formTitle="Update SRS & Requirements"
                endpoint="http://127.0.0.1:8000/add-key-req"
                fields={fields}
            />
        </>
    )
}

export default Srs
