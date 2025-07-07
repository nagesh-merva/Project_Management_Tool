import {
    Bug,
    ClipboardCheck,
    Megaphone,
    Palette,
    BookOpen,
    FastForward
} from "lucide-react"
import { useState } from "react"
import { useNavigate } from "react-router-dom"

const QuickActions = ({ links }) => {
    const navigate = useNavigate()
    const [showPopup, setShowPopup] = useState(false)
    const [fields, setFields] = useState([])

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
        <div className="h-fit w-2/5 md:w-1/3 grid gap-2 bg-gray-50 rounded-lg shadow-lg p-4">
            <div className="flex gap-2 items-center mb-2">
                <FastForward className="h-5 w-7" />
                <h1 className="font-semibold text-base">Quick Actions</h1>
            </div>

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
                    <div className="w-1/5 h-full"></div>
                    {action.icon}
                    {action.label}
                </button>
            ))}
        </div>
    )
}

export default QuickActions