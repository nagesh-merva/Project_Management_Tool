import Member from "./Member"
import { Users, Users2 } from "lucide-react"
import PopupForm from "../Home/PopUpForm"
import { useState, useEffect } from "react"
import { useMainContext } from "../../context/MainContext"
import { useParams } from "react-router-dom"
const Teammember = ({ members }) => {
    const [showPopup, setShowPopup] = useState(false)
    const { allEmps } = useMainContext()
    const { id } = useParams()
    const [fields, setFields] = useState([
        {
            name: "project_id",
            type: "stored",
            value: id
        },
        {
            name: "team_members",
            type: "select",
            multi: false,
            fields: []
        },

    ])

    useEffect(() => {
        // console.table(allEmps)
        setEmployees()
    }, [])

    const setEmployees = () => {
        const selectOptions = allEmps?.map(emp => ({
            name: `${emp.emp_id} - ${emp.emp_name} - ${emp.role}`,
            value: emp.emp_id
        }))
        setFields(prevFields =>
            prevFields.map(field =>
                field.name === "team_members"
                    ? { ...field, fields: selectOptions }
                    : field
            )
        )
    }

    return (
        <>
            <div className="w-2/5 h-auto  bg-gray-50 rounded-xl shadow-xl overflow-y-scroll custom-scrollbar p-4">
                <div className="flex justify-between items-center mb-4">
                    <div className="px-2 flex space-x-3">
                        <Users color="#FF911B" className="h-5 w-5 " />
                        <h1 className="font-semibold text-base">Team Members</h1>
                    </div>
                    <button onClick={() => setShowPopup(true)} className="flex items-center bg-btncol rounded-full text-sm h-8 px-4 text-white hover:scale-95 transition-all shadow-lg">
                        <Users2 className="h-4 w-4 mr-2" />
                        <h1>Add</h1>
                    </button>
                </div>
                <div className="space-y-3">
                    {members?.length > 0 ? (
                        members.map((member, index) => (
                            <Member
                                key={index}
                                name={member.name}
                                id={member.emp_id}
                                role={member.role}
                                dept={member.dept}
                                profile={member.profile}
                            />
                        ))
                    ) : (
                        <p className="text-gray-500 text-center mt-10">No team members assigned yet.</p>
                    )}
                </div>
            </div>
            <PopupForm
                isVisible={showPopup}
                onClose={() => setShowPopup(false)}
                formTitle="Add Team Member"
                endpoint="https://project-management-tool-uh55.onrender.com/add-team-member"
                fields={fields}
            />
        </>
    )
}

export default Teammember
