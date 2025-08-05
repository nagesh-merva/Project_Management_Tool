import { Calendar } from "lucide-react"


const EngagementInfo = ({ engagement }) => {

    const getTagColor = (tag) => {
        const colors = {
            'priority': 'bg-red-100 text-red-800 border-red-200',
            'recurring': 'bg-green-100 text-green-800 border-green-200',
            'enterprise': 'bg-blue-100 text-blue-800 border-blue-200',
            'startup': 'bg-purple-100 text-purple-800 border-purple-200'
        }
        return colors[tag] || 'bg-gray-100 text-gray-800 border-gray-200'
    }

    return (
        <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2 mb-4">
                <Calendar className="text-green-600" size={20} />
                Engagement Info
            </h2>
            <div className="space-y-3">
                <div className="flex items-center justify-between">
                    <span className="text-gray-600">Joined Date</span>
                    <span className="font-medium">{engagement.joined_date.split("T")[0]}</span>
                </div>
                <div className="flex items-center justify-between">
                    <span className="text-gray-600">Source</span>
                    <span className="font-medium">{engagement?.source}</span>
                </div>
                <div>
                    <span className="text-gray-600 block mb-2">Tags</span>
                    <div className="flex flex-wrap gap-2">
                        {engagement?.tags.map((tag, index) => (
                            <span
                                key={index}
                                className={`px-2 py-1 rounded-full text-xs font-medium border ${getTagColor(tag)}`}
                            >
                                {tag}
                            </span>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default EngagementInfo