import { Eye, Building, Globe, MapPin } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useMainContext } from '../../context/MainContext'

const ClientCard = ({ client }) => {
    const navigate = useNavigate()
    const { emp } = useMainContext()
    const canView = emp.emp_dept !== "SALES" || emp.role !== "Admin" || emp.role !== "Manager" || emp.role !== "Founder" || emp.role !== "Co-Founder"

    const getTypeBadgeColor = (type) => {
        const colors = {
            'Startup': 'bg-green-100 text-green-800 border-green-200',
            'Enterprise': 'bg-blue-100 text-blue-800 border-blue-200',
            'Individual': 'bg-purple-100 text-purple-800 border-purple-200',
            'SME': 'bg-orange-100 text-orange-800 border-orange-200',
            'Government': 'bg-gray-100 text-gray-800 border-gray-200'
        };
        return colors[type] || 'bg-gray-100 text-gray-800 border-gray-200'

    }
    console.log(canView)

    const handleViewDetails = () => {
        if (!canView) {
            alert("You do not have permission to view client details.")
            return
        }
        navigate(`/clients/${client.client_id}`)
    }

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center overflow-hidden">
                    {client.logo_url ? (
                        <img
                            src={client.logo_url}
                            alt={`${client.name} logo`}
                            className="w-full h-fit object-cover"
                        />
                    ) : (
                        <Building className="text-white" size={24} />
                    )}
                </div>
                <button
                    onClick={handleViewDetails}
                    className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="View Details"
                >
                    <Eye size={18} />
                </button>
            </div>
            <div className="space-y-3">
                <div>
                    <h3 className="font-semibold text-gray-900 text-lg mb-1 line-clamp-1">
                        {client.name}
                    </h3>
                    <div className="flex items-center text-gray-500 text-sm">
                        <Globe size={14} className="mr-1" />
                        <span className="truncate">{client.domain}</span>
                    </div>
                </div>
                <div className="text-xs text-gray-400 font-mono bg-gray-50 px-2 py-1 rounded">
                    ID: {client.client_id}
                </div>
                <div className="flex items-center justify-between">
                    <span className={`px-3 py-1 rounded-full text-xs text-black  font-medium border ${getTypeBadgeColor(client.type)}`}>
                        {client.type}
                    </span>
                    {client.location && (
                        <div className="flex items-center text-gray-400 text-xs">
                            <MapPin size={12} className="mr-1" />
                            <span className="truncate max-w-20">{client.location}</span>
                        </div>
                    )}
                </div>
            </div>
            <button
                onClick={handleViewDetails}
                className="w-full mt-4 py-2 px-4 bg-gray-50 hover:bg-blue-50 text-gray-700 hover:text-blue-700 rounded-lg transition-colors text-sm font-medium"
            >
                View Details
            </button>
        </div>
    )
}

export default ClientCard