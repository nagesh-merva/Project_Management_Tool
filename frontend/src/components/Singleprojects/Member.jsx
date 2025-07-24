import { User } from "lucide-react"
import { useNavigate } from "react-router-dom"

const Member = ({ name, id, role, dept, profile }) => {
    // console.log(profile)
    const navigate = useNavigate()
    return (
        <div onClick={() => navigate(`/departments/${id}`)} className="flex items-center justify-between  rounded-lg shadow-sm p-4 mb-4 hover:shadow-lg transition-all cursor-pointer border border-gray-500">
            <div className="flex items-center">
                <img
                    src={profile}
                    alt={name}
                    className="h-14 w-14 rounded-full object-cover bg-btncol border-2 border-blue-500"
                />
                <div className="ml-4">
                    <p className="text-lg font-medium text-gray-800">{name}</p>
                    <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs bg-blue-600 text-white px-2 py-0.5 rounded-full">{role}</span>
                        <span className="text-xs bg-gray-300 text-gray-700 px-2 py-0.5 rounded-full">{dept}</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Employee ID: {id}</p>
                </div>
            </div>
            <div className="lg:block hidden p-2 bg-blue-100 rounded-full">
                <User className="text-blue-600" size={20} />
            </div>
        </div>
    )
}

export default Member
