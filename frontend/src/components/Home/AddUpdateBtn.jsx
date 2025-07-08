import { useEffect, useState } from "react"
import PopupForm from "./PopUpForm"
import { useMainContext } from "../../context/MainContext"

const AddUpdateButton = () => {
    const [showPopup, setShowPopup] = useState(false)
    const { allEmps } = useMainContext()
    const [fields, setFields] = useState([
        {
            name: "title",
            type: "text",
            optional: false
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
            type: "select",
            fields: [],
            multi: true
        },
        {
            name: "link",
            type: "text",
            optional: true
        }
    ])

    useEffect(() => {
        // console.table(allEmps)
        setEmployees()
    }, [])

    const setEmployees = () => {
        const selectOptions = allEmps.map(emp => ({
            name: `${emp.emp_id} - ${emp.emp_name} - ${emp.role}`,
            value: emp.emp_id
        }))
        setFields(prevFields =>
            prevFields.map(field =>
                field.name === "to"
                    ? { ...field, fields: selectOptions }
                    : field
            )
        )
    }

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
