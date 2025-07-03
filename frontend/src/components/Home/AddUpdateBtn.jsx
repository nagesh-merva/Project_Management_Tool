import { useState } from "react"
import PopupForm from "./PopUpForm"

const AddUpdateButton = () => {
    const [showPopup, setShowPopup] = useState(false)

    const fields = [
        {
            name: "title",
            type: "text"
        },
        {
            name: "brief",
            type: "textarea"
        },
        {
            name: "update_by",
            type: "id"
        },
        {
            name: "to",
            type: "select"
        },
        {
            name: "link",
            type: "text",
            optional: true
        }
    ]

    return (
        <>
            <button
                onClick={() => setShowPopup(true)}
                className="mt-1 px-6 py-2 text-nowrap bg-btncol rounded-3xl h-10 text-sm font-semibold text-white hover:scale-95 hover:bg-btncol/80 transition-all shadow-xl"
            >
                Add Update
            </button>

            <PopupForm
                isVisible={showPopup}
                onClose={() => setShowPopup(false)}
                formTitle="Add New Update"
                endpoint="http://127.0.0.1:8000/add-update"
                fields={fields}
            />
        </>
    )
}

export default AddUpdateButton
