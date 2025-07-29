import {
    Bug,
    ClipboardCheck,
    Megaphone,
    Palette,
    BookOpen,
    FastForward,
    Activity
} from "lucide-react"
import { useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import PopupForm from "../Home/PopUpForm"

const QuickActions = ({ links }) => {
    const navigate = useNavigate()
    const [showPopup, setShowPopup] = useState(false)
    const { id } = useParams()
    const [fields, setFields] = useState([
        {
            name: "project_id",
            type: "stored",
            value: id
        },
        {
            name: "linkname",
            type: "text",
            optional: false,
        },
        {
            name: "link",
            type: "text",
            optional: false
        }

    ])
    const issuesrec = () => {
        setShowPopup(true)
        navigate("/view", {
            state: {
                fields: Issue,
                title: "Fill Issue Information",
                subtitle: "Enter All details",
            },
        })
    }

    const tasksrec = () => {
        setShowPopup(true)
        navigate("/view", {
            state: {
                fields: Taskss,
                title: "Task Information",
                subtitle: "Enter All details",
            },
        })
    }

    const updatesrec = () => {
        setShowPopup(true)
        navigate("/view", {
            state: {
                fields: updates,
                title: "CROB Portfolio Website",
            },
        })
    }

    const openExternal = (url) => {
        window.open(url, "_blank")
    }

    const actions = [
        ...(Array.isArray(links) ? links.map((link, idx) => ({
            label: link.label,
            onClick: () => openExternal(link.link),
            icon: idx % 2 === 0 ? <Palette size={20} /> : <BookOpen size={20} />
        })) : []),
        {
            label: "Report Issue",
            onClick: issuesrec,
            icon: <Bug size={20} />
        },
        {
            label: "Add Task",
            onClick: tasksrec,
            icon: <ClipboardCheck size={20} />
        },
        {
            label: "Add Update",
            onClick: updatesrec,
            icon: <Megaphone size={20} />
        }
    ]

    return (
        <>
            <div className="h-2/5 w-full flex flex-col gap-2 bg-gray-50 rounded-lg shadow-lg p-4 ">
                <div className="gap-2 place-self-start flex w-full items-center place-content-between mb-2">
                    <div className="flex gap-2 items-center" >
                        <FastForward className="h-5 w-7" />
                        <h1 className="font-semibold text-base">Quick Actions</h1>
                    </div>
                    <button onClick={() => setShowPopup(true)} className="px-3 py-1.5 bg-btncol hover:bg-btncol/40 text-white rounded-lg transition-all duration-200 backdrop-blur-sm ">
                        <Activity size={16} className="inline mr-2" />
                        Update
                    </button>
                </div>
                <div className="place-self-start h-fit w-full grid gap-2 bg-gray-50 rounded-xl max-h-80 overflow-y-auto custom-scrollbar pt-2">
                    {actions.map((action, idx) => (
                        <button
                            key={idx}
                            onClick={action.onClick}
                            className={`w-full h-[41px] flex items-center  gap-4 px-6 text-sm md:text-base lg:text-md font-semibold rounded-lg border-2 transition-all hover:scale-95 
                        ${idx % 2 === 0
                                    ? "bg-btncol text-white hover:bg-btncol/60 border-purple-600"
                                    : "bg-white text-slate-700 hover:bg-gray-100 border-gray-400"
                                }`}
                        >
                            <div className="w-0 md:w-1/5 lg:w-1/6 xl:w-3/12 h-full"></div>
                            {action.icon}
                            {action.label}
                        </button>
                    ))}
                </div>
            </div>
            <PopupForm
                isVisible={showPopup}
                onClose={() => setShowPopup(false)}
                formTitle="Manage Quick Actions"
                endpoint="http://127.0.0.1:8000/manage-quick-actions"
                fields={fields}
            />
        </>
    )
}

export default QuickActions