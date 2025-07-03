import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
const Teammem = [
    {
        profile: "/icons/face.png",
        name: "Nagesh Merva",
        role: " Backend Developer",
        Dep: "Department : Admin"
    },
    {
        profile: "/icons/face.png",
        name: "Pratham Naik",
        role: " Frontend Developer",
        Dep: "Department : Dev"
    },
    {
        profile: "/icons/face.png",
        name: "Prayag Naik",
        role: " Frontend developer",
        Dep: "Department : Dev"
    },
    {
        profile: "/icons/face.png",
        name: "Shankar",
        role: " Frontend developer",
        Dep: "Department : Dev"
    },
]
const AddMembers = [
    {
        type: "checkbox",
        label: "Project Manager",
        value: "projectManager",
    },
    {
        type: "checkbox",
        label: "Frontend Developer",
        value: "frontendDeveloper",
    },
    {
        type: "select",
        title: "Members",
        label: "Members",
        value: "members",
        options: [
            { value: "member1", label: "Member 1" },
            { value: "member2", label: "Member 2" },
            { value: "member3", label: "Member 3" },
        ],
    },
    {
        type: "button",
        do: "Save Feature Information"
    }
]

import Memberss from "./Members"
function Teammember() {
    const [List, setList] = useState([])
    const navigate = useNavigate()
    const FetchData = () => {
        const response = Teammem
        setList(response)
    }

    useEffect(() => {
        FetchData()
    }, [])

    const Addmem = () => {
        navigate("/view", { state: { fields: AddMembers, title: "Add Member", subtitle: "Add All details" } })
    }

    console.log(List)

    return (
        <div className="w-3/5 aspect-[4/2] bg-gray-50 rounded-xl drop-shadow-xl overflow-y-scroll custom-scrollbar">
            <div className="flex justify-between">
                <h1 className="font-semibold mt-3 mb-1 mx-5">Team Member</h1>
                <button onClick={Addmem} className="mx-6 mt-4 mb-1 flex items-center bg-blue-700 rounded-3xl text-sm text-nowrap h-6 w-16 text-white hover:scale-95 hover:bg-btncol/80 transition-all shadow-xl font-normal">
                    <h1 className="ml-4 font-semibold">ADD</h1>
                </button>
            </div>
            {List.map((members, index) => (
                <Memberss key={index} name={members.name} profile={members.profile} role={members.role} dept={members.Dep} />
            ))}
        </div>
    )
}
export default Teammember