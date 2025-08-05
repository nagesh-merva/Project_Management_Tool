
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

        return Updated`${timeAgo}`
    }
    return (
        <div className="bg-white shadow-xl rounded-lg w-60 h-auto flex flex-col justify-between p-3">
            <div className="flex justify-between my-2">
                <div className="mt-1">
                    {props.icon}
                </div>

                <h1 className="text-sm font-normal px-3 py-1 rounded-xl bg-blue-300">{props.type}</h1>

            </div>
        </div>
    )
}
export default ReportBox;