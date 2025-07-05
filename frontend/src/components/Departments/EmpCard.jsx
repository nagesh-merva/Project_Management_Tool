import { Settings, Star } from "lucide-react"

const EmployeeCard = ({ employee, dept }) => {

    return (
        <div className="relative bg-white w-full rounded-2xl shadow-xl p-4 ">
            {/* Top Section */}
            <div className="flex justify-between items-start">
                <div className="h-16 w-16 rounded-full border-2 border-violet-500 bg-btncol/20 flex justify-center items-center">
                    <p className="text-2xl font-bold text-btncol">{employee.emp_name[0]}</p>
                </div>

            </div>

            {/* Rounded Clipped Blue Section */}
            <div className="mt-5">
                {/* Blue Badge */}
                <div className="absolute top-0 right-4 bg-blue-100 w-[160px] h-[100px] rounded-t-lg flex flex-col items-center justify-center ">
                    <Settings size={20} className="absolute right-1 top-1 text-gray-500 hover:text-black cursor-pointer text-md" />
                    <div className="flex justify-center">
                        {Array.from({ length: employee.performance_metrics.ratings }).map((_, index) => (
                            <Star key={index} className="text-violet-500 text-lg mx-[1px]" />
                        ))}
                    </div>
                    <p className="text-sm font-semibold mt-1 px-2 text-center" >{employee.role}</p>
                </div>

                {/* Detail Box */}
                <div className=" bg-blue-100 p-3 rounded-l-lg rounded-br-lg text-sm leading-6">
                    <p><span className="font-semibold">Name :</span> {employee.emp_name}</p>
                    <p><span className="font-semibold">Role :</span> {employee.role}</p>
                    <p><span className="font-semibold">Department :</span> {dept}</p>
                    <p><span className="font-semibold">Performance :</span> {employee.performance_metrics.ratings}</p>
                    <p><span className="font-semibold">Remark :</span></p>
                    <p>{employee.performance_metrics.remarks}</p>
                </div>
            </div>
        </div>
    )
}

export default EmployeeCard
