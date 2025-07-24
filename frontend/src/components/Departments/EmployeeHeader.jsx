
const EmployeeHeader = ({ emp }) => {
    const StatusBadge = ({ status }) => {
        const statusColors = {
            'Active': 'bg-green-100 text-green-800 border-green-200',
            'Resigned': 'bg-red-100 text-red-800 border-red-200',
            'On Leave': 'bg-yellow-100 text-yellow-800 border-yellow-200'
        }

        return (
            <span className={`px-3 py-1 rounded-full text-sm font-medium border ${statusColors[status] || 'bg-gray-100 text-gray-800 border-gray-200'}`}>
                {status}
            </span>
        )
    }

    return (
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                        {emp.profile ? (
                            <img src={emp.profile} alt="Profile" className="h-full w-full rounded-full object-cover" />
                        ) : (
                            <p className="text-2xl font-bold text-btncol">{emp?.emp_name?.charAt(0)}</p>
                        )}
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">{emp.emp_name}</h1>
                        <p className="text-gray-600">{emp.role} • {emp.emp_dept}</p>
                        <p className="text-sm text-gray-500">Employee ID: {emp.emp_id}</p>
                    </div>
                </div>
                <StatusBadge status={emp.status} />
            </div>
        </div>
    )
}

export default EmployeeHeader