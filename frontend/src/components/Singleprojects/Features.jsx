import { useNavigate } from "react-router-dom"
import Newfeatures from "./Newfeatures"
import { PanelLeftOpen } from "lucide-react"
import PopupForm from "../Home/PopUpForm"
import { useState } from "react"

const Features = ({ features }) => {
    const navigate = useNavigate()
    const [showPopup, setShowPopup] = useState(false)
    const [fields, setFields] = useState([
        {
            name: "project_id",
            type: "id",
        },
        {
            name: "title",
            type: "text",
            optional: false

        },
        {
            name: "descp",
            type: "textarea",
            optional: false
        },
        {
            name: "created_by",
            type: "id"
        }

    ])

    const handleVerifyUpdate = (featureId) => {
        console.log(`Feature ${featureId} verified.`)
        // Optional: You can refetch or update parent state here if needed
    }

    return (
        <>
            <div className="w-3/5 ml-5 h-auto bg-gray-50 rounded-xl drop-shadow-xl overflow-y-scroll custom-scrollbar p-4">
                <div className="flex justify-between mb-4">
                    <div className="px-5 flex items-center">
                        <PanelLeftOpen color="#6347FF" className="h-5 w-5 mr-3" />
                        <p className="font-semibold text-base">Features to Develop</p>
                    </div>
                    <button onClick={() => setShowPopup(true)} className="flex items-center bg-blue-700 rounded-3xl text-sm h-7 px-4 text-white hover:scale-95 hover:bg-blue-600 transition-all shadow font-normal">
                        <h1>Add</h1>
                    </button>
                </div>

                {features && features.map((feat, index) => (
                    <Newfeatures key={index} feature={feat} onVerify={handleVerifyUpdate} />
                ))}
            </div>
            <PopupForm
                isVisible={showPopup}
                onClose={() => setShowPopup(false)}
                formTitle="Add New Feature"
                endpoint="http://127.0.0.1:8000/add-feature"
                fields={fields}
            />
        </>
    )
}

export default Features
