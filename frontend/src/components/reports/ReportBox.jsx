import { MoveRight } from "lucide-react"

const ReportBox = ({ ...props }) => {
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
        let timeAgo = ""
        if (seconds < 60) {
            timeAgo = `${seconds} sec${seconds !== 1 ? "s" : ""} ago`
        } else if (minutes < 60) {
            timeAgo = `${minutes} min${minutes !== 1 ? "s" : ""} ago`
        } else if (hours < 24) {
            timeAgo = ` ${hours} hour${hours !== 1 ? "s" : ""} ago`
        } else if (days < 30) {
            timeAgo = `${days} day${days !== 1 ? "s" : ""} ago`
        } else if (months < 12) {
            timeAgo = `${months} month${months !== 1 ? "s" : ""} ago`
        } else {
            timeAgo = ` ${years} year${years !== 1 ? "s" : ""} ago`
        }
        return `Updated${timeAgo}`
    }
    return (
        <div className={`relative shadow-xl rounded-lg w-64 h-72 flex flex-col p-5 ${props.bg} `}>
            <div className="flex justify-between my-2">
                <div className=" p-1 bg-white rounded-sm">
                    {props.icon}
                </div>
                <h1 className="text-xs px-3 font-normal h-fit w-auto  p-1 rounded-xl bg-white ">{props.type}</h1>
            </div>
            <div>
                <h1 className="font-semibold text-base ">{props.title}</h1>
                <p className="text-xs my-2 font-normal ">{props.desc}</p>
            </div>
            <div className=" absolute bottom-3 right-2 left-2 w-auto flex justify-between">
                <div className="flex gap-2">
                    <div className="h-4 w-4 mt-2 bg-green-400 rounded-full"></div>
                    <h1 className="text-xs font-normal w-20">{getTimeAgo(props.time)}</h1>
                </div>
                <a href={props.link} className="flex items-center space-x-2 font-medium   px-4 bg-white rounded-xl">
                    <h1 className="text-xs ">
                        View Report </h1>
                    <MoveRight size={18} className="" /></a>
            </div>
        </div>
    )
}
export default ReportBox;