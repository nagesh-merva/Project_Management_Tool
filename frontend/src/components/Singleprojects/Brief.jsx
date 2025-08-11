import { Calendar, Timer, SquarePen, CheckCircle, AlertCircle, Pause, Globe, SquareDashedBottomCode } from "lucide-react"
import { useState } from "react"
import PopupForm from "../Home/PopUpForm"
import { useParams } from "react-router-dom"

const Brief = ({ clientDetails, project_name, projBrief, status, start, deadline, quickLinks }) => {
    const [showPopup, setShowPopup] = useState(false)
    const { id } = useParams()

    const [fields, setFields] = useState([
        {
            name: "project_id",
            type: "stored",
            value: id
        },
        {
            name: "descp",
            type: "textarea",
            optional: true
        },
        {
            name: "code_resource_base",
            type: "text",
            optional: true
        },
        {
            name: "live_demo",
            type: "text",
            optional: true
        },
        {
            name: "status",
            type: "select",
            fields: [
                { name: "active", value: "active" },
                { name: "inactive", value: "inactive" },
                { name: "completed", value: "completed" }
            ],
            multi: false,
            optional: true
        },
        {
            name: "deadline",
            type: "date",
            allowPastDate: false,
            optional: true
        },
    ])

    console.log(quickLinks)

    const editclientdetails = () => {
        setShowPopup(true)
    }

    const getStatusConfig = (status) => {
        const configs = {
            active: {
                color: 'bg-green-100 text-green-800',
                icon: CheckCircle,
                label: 'Active'
            },
            inactive: {
                color: 'bg-gray-100 text-gray-600',
                icon: Pause,
                label: 'Inactive'
            },
            completed: {
                color: 'bg-blue-100 text-blue-800',
                icon: CheckCircle,
                label: 'Completed'
            },
            delayed: {
                color: 'bg-red-100 text-red-800',
                icon: AlertCircle,
                label: 'Delayed'
            },
            uncomplete: {
                color: 'bg-orange-100 text-orange-800',
                icon: AlertCircle,
                label: 'Incomplete'
            }
        }
        return configs[status] || configs.inactive
    }

    const statusConfig = getStatusConfig(status)
    const StatusIcon = statusConfig.icon

    return (
        <>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                        {clientDetails?.logo ? (
                            <img
                                src={clientDetails.logo}
                                alt="client logo"
                                className="w-10 h-10 rounded-full object-cover"
                            />
                        ) : (
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                                {clientDetails?.name?.[0] || 'C'}
                            </div>
                        )}
                        <div>
                            <h1 className="font-semibold text-gray-900">{clientDetails?.name || 'Client Name'}</h1>
                            <p className="text-sm text-gray-500">{project_name || 'Project Name'}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${statusConfig.color}`}>
                            <StatusIcon size={12} />
                            {statusConfig.label}
                        </span>
                        <div className="flex h-auto items-center justify-between">
                            <div className="flex place-self-end">
                                <button
                                    onClick={editclientdetails}
                                    className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                                >
                                    <SquarePen size={20} />
                                </button>
                                <div className="w-px h-6 bg-black"></div>
                                <a href={quickLinks?.code_resource_base} target="_blank" rel="noopener noreferrer">
                                    <button className="p-1 rounded-lg hover:bg-gray-100/50 hover:scale-105 transition-all">
                                        <SquareDashedBottomCode size={20} color="#47FF72" />
                                    </button>
                                </a>
                                <div className="w-px h-6 bg-black"></div>
                                <a href={quickLinks?.live_demo} target="_blank" rel="noopener noreferrer">
                                    <button className="p-1 rounded-lg hover:bg-gray-100/50 hover:scale-105 transition-all">
                                        <Globe color="#0C098C" size={20} />
                                    </button>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
                {projBrief && (
                    <div className="mb-3">
                        <p className="text-sm text-gray-600 bg-gray-50 p-2 rounded">{projBrief}</p>
                    </div>
                )}
                <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2 text-gray-600">
                        <Calendar size={14} />
                        <span>Start: {start?.split("T")[0]}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                        <Timer size={14} />
                        <span>Due: {deadline?.split("T")[0]}</span>
                    </div>
                </div>
            </div>

            <PopupForm
                isVisible={showPopup}
                onClose={() => setShowPopup(false)}
                formTitle="Edit Project brief"
                endpoint="http://127.0.0.1:8000/edit-project-brief"
                fields={fields}
            />
        </>
    )
}

export default Brief