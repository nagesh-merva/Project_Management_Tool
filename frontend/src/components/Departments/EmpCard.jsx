import { Settings, Star } from "lucide-react"
import { useNavigate } from "react-router-dom"

const EmployeeCard = ({ employee, dept }) => {
    const navigate = useNavigate()

    const ViewEmployee = (id) => {
        let route = "/departments/" + id
        navigate(route)
    }
    return (
        <div className="relative bg-white w-full h-full rounded-2xl shadow-xl p-4 ">
            <div className="w-2/5 flex justify-center items-center">
                <div className="h-16 w-16 rounded-full border-2 border-violet-500 bg-btncol/20 flex justify-center items-center scale-75 md:scale-90 lg:scale-100">
                    {employee.profile ? (
                        <img src={employee.profile} alt="Profile" className="h-full w-full rounded-full object-cover" />
                    ) : (
                        <p className="text-2xl font-bold text-btncol">{employee.emp_name[0]}</p>
                    )}
                </div>
                <div className="absolute top-0 right-4 bg-blue-100 w-1/2 h-[100px] rounded-t-lg flex flex-col items-center justify-center ">
                    <button onClick={() => ViewEmployee(employee.emp_id)}><Settings size={20} className="absolute right-1 top-1 text-gray-500 hover:text-black cursor-pointer text-md" /></button>
                    <div className="flex justify-center ">
                        {Array.from({ length: employee.performance_metrics.ratings }).map((_, index) => (
                            <Star key={index} className="text-violet-500 text-sm lg:text-md xl:text-lg mx-[1px]" />
                        ))}
                    </div>
                    <p className="text-sm font-semibold mt-1 px-2 text-center" >{employee.role}</p>
                </div>
            </div>
            <div className="mt-5 h-2/3">
                <div className="h-full bg-blue-100 p-3 rounded-l-lg rounded-br-lg text-sm leading-6">
                    <p><span className="font-semibold">Name :</span> {employee.emp_name}</p>
                    <p><span className="font-semibold">Role :</span> {employee.role}</p>
                    <p><span className="font-semibold">Department :</span> {dept}</p>
                    <p><span className="font-semibold">Performance :</span> {employee.performance_metrics.ratings}</p>
                    <p><span className="font-semibold">Remark :</span></p>
                    <p className="line-clamp-2 text-ellipsis">{employee.performance_metrics.remarks}</p>
                </div>
            </div>
        </div>
    )
}

export default EmployeeCard
