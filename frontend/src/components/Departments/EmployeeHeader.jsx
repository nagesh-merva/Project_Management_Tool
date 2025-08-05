import { useState } from "react"
import PopupForm from "../Home/PopUpForm"
import { HandHelping } from "lucide-react"
import { useMainContext } from "../../context/MainContext"

const EmployeeHeader = ({ employee }) => {
    const [showPopup, setShowPopup] = useState(false)
    const Fields = [
        { name: "emp_id", type: "stored", value: employee.emp_id },
        { name: "role", type: "text", optional: false },
        { name: "salary", type: "number", optional: false }
    ]
    const { emp } = useMainContext()

    const isAdmin = () => {
        try {
            return emp.role === 'admin' || emp.emp_dept === 'ADMIN'
        } catch {
            return false
        }
    }

    const StatusBadge = ({ status }) => {
        const statusColors = {
            'Active': 'bg-green-100 text-green-800 border-green-200',
            'Resigned': 'bg-red-100 text-red-800 border-red-200',
            'On Leave': 'bg-yellow-100 text-yellow-800 border-yellow-200'
        }

        return (
            <span className={`px-3 py-1.5 rounded-full text-sm font-medium border ${statusColors[status] || 'bg-gray-100 text-gray-800 border-gray-200'}`}>
                {status}
            </span>
        )
    }

    return (
        <>
            <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                            {employee.profile ? (
                                <img src={employee.profile} alt="Profile" className="h-full w-full rounded-full object-cover" />
                            ) : (
                                <p className="text-2xl text-white font-bold">{employee?.emp_name?.charAt(0)}</p>
                            )}
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">{employee.emp_name}</h1>
                            <p className="text-gray-600">{employee.role} • {employee.emp_dept}</p>
                            <p className="text-sm text-gray-500">Employee ID: {employee.emp_id}</p>
                        </div>
                    </div>
                    <div className="flex space-x-4">
                        <StatusBadge status={employee.status} />
                        {isAdmin && (
                            <button onClick={() => setShowPopup(true)} className="flex items-center px-4 py-1.5 bg-blue-200 rounded-full text-blue-500 font-semibold space-x-1 hover:scale-95 transition-transform"><HandHelping /><span>Promote</span></button>
                        )}
                    </div>
                </div>
            </div>
            <PopupForm
                isVisible={showPopup}
                onClose={() => setShowPopup(false)}
                formTitle="Promote Employee"
                endpoint="http://127.0.0.1:8000/add-emp-promotion"
                fields={Fields}
                onSuccess={() => {
                    setShowPopup(false)
                }}
            />
        </>
    )
}

export default EmployeeHeader