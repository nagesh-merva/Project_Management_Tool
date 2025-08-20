
import { Link } from "react-router-dom"
import {
    User,
    Folder,
    IndianRupee,
    UserCog,
    Landmark,
    AlertTriangle,
    BarChart2,
    Files
} from "lucide-react"

const typeColors = {
    departmental: "#6347FF",
    project: "#47FF72",
    financial: "#298EFF",
    hr: "#FF911B",
    client: "#14AE5C",
    issue: "#FF1B1B",
    analytics: "#6347FF",
    compliance: "#49454F",
}

function getTimeAgo(dateInput) {
    const date = new Date(dateInput)
    const now = new Date()
    const diffMs = now - date

    const seconds = Math.floor(diffMs / 1000)
    const minutes = Math.floor(diffMs / (1000 * 60))
    const hours = Math.floor(diffMs / (1000 * 60 * 60))
    const days = Math.floor(diffMs / (1000 * 60 * 60 * 24))
    const months = Math.floor(diffMs / (1000 * 60 * 60 * 24 * 30))
    const years = Math.floor(diffMs / (1000 * 60 * 60 * 24 * 365))

    if (seconds < 60) return `${seconds}s ago`
    if (minutes < 60) return `${minutes}m ago`
    if (hours < 24) return `${hours}h ago`
    if (days < 30) return `${days}d ago`
    if (months < 12) return `${months}mo ago`
    return `${years}y ago`
}


function getReportIcon(type) {
    const iconMap = {
        departmental: User,
        project: Folder,
        financial: IndianRupee,
        hr: UserCog,
        client: Landmark,
        issue: AlertTriangle,
        analytics: BarChart2,
        compliance: Files
    }

    const IconComponent = iconMap[type] || Folder
    const textColor = typeColors[type.toLowerCase()] || "#6347FF"
    return <IconComponent className={`w-5 h-5 text-[${textColor}]`} />
}

const ReportBox = ({ type, title, desc, time, link, isOpen }) => {
    const bgColor = typeColors[type.toLowerCase()] || "#6347FF"

    return (
        <div
            className="rounded-xl shadow-md p-4 w-60 h-80 flex flex-col justify-between hover:scale-105 transition-transform"
            style={{ backgroundColor: bgColor, color: "#fff" }}
        >
            <div className="flex justify-between items-center">
                <div className="bg-white bg-opacity-20 p-2 rounded-lg">{getReportIcon(type)}</div>
                <span className="px-3 py-1 text-sm rounded-lg bg-white text-black font-medium">
                    {type}
                </span>
            </div>
            <div className="mt-4">
                <h2 className="text-lg font-semibold">{title}</h2>
                <p className="text-sm opacity-90 mt-1">{desc}</p>
            </div>
            <div className="flex justify-between items-center mt-6">
                <div className="flex items-center space-x-2">
                    <span className="w-3 h-3 bg-green-500 rounded-full"></span>
                    <span className="text-[10px]">Updated {getTimeAgo(time)}</span>
                </div>
                <Link
                    to={link}
                    className="px-2 py-1.5 rounded-lg bg-white text-black text-xs font-medium hover:bg-gray-200 text-nowrap"
                >
                    View Report →
                </Link>
            </div>
        </div>
    )
}

export default ReportBox