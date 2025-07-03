import { useState } from "react"
import PopupForm from "./PopUpForm"

const AddTaskButton = () => {
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
            name: "created_by",
            type: "id"
        },
        {
            name: "deadline",
            type: "date"
        },
        {
            name: "members_assigned",
            type: "select"
        },
        {
            name: "proj_id",
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
                Add Task
            </button>

            <PopupForm
                isVisible={showPopup}
                onClose={() => setShowPopup(false)}
                formTitle="Add New Task"
                endpoint="http://127.0.0.1:8000/add-task"
                fields={fields}
            />
        </>
    )
}

export default AddTaskButton
