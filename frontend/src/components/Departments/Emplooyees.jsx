import { useEffect, useState } from "react"
import EmployeeCard from "./EmpCard"
import Loading from "../Loading"
import { FaUsers, FaMoneyBillWave, FaChartLine, FaBalanceScale } from "react-icons/fa"
import { MdOutlineBusinessCenter } from "react-icons/md"

const Employees = ({ selectedDepartment }) => {
    const [employeesData, setEmployees] = useState([])
    const [details, setDetails] = useState({})
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        GetEmployees();
    }, [selectedDepartment])

    const GetEmployees = async () => {
        setLoading(true);
        try {
            const response = await fetch(
                `http://127.0.0.1:8000/employees-bydept?dept=${selectedDepartment}`,
                {
                    method: "GET",
                    headers: { "Content-Type": "application/json" },
                }
            )
            const data = await response.json()
            if (response.status === 201 || response.status === 200) {
                setEmployees(data.employees)
                setDetails(data.details)
                // console.table(data)
            }
        } catch (err) {
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    const formatCurrency = (amount) =>
        amount?.toLocaleString("en-IN", { style: "currency", currency: "INR" })

    const formatMonth = (monthStr) => {
        const date = new Date(monthStr + "-01")
        return date.toLocaleString("default", { month: "short", year: "numeric" })
    }

    return (
        <div className="flex flex-col items-center min-h-screen w-full ">
            {loading ? (
                <Loading />
            ) : (
                <div className="w-full ">
                    <div className="bg-white rounded-xl shadow-lg p-6 mb-8 flex flex-col md:flex-row items-center justify-between gap-6">
                        <div className="flex items-center gap-4">
                            <MdOutlineBusinessCenter className="text-4xl text-blue-600" />
                            <div>
                                <h1 className="text-2xl font-bold text-gray-800">{details.dept_name || "Department"}</h1>
                                <p className="text-gray-500 text-sm">Dept ID: {details.dept_id}</p>
                            </div>
                        </div>
                        <div className="flex gap-8 flex-wrap">
                            <div className="flex items-center gap-2">
                                <FaUsers className="text-xl text-green-600" />
                                <span className="font-semibold">{details.no_of_employees}</span>
                                <span className="text-gray-500 text-sm">Employees</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <FaMoneyBillWave className="text-xl text-yellow-600" />
                                <span className="font-semibold">
                                    {formatCurrency(
                                        details.revenue_stats?.reduce((acc, cur) => acc + cur.amount, 0) || 0
                                    )}
                                </span>
                                <span className="text-gray-500 text-sm">Total Revenue</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <FaChartLine className="text-xl text-red-500" />
                                <span className="font-semibold">
                                    {formatCurrency(
                                        details.spenditure_stats?.reduce((acc, cur) => acc + cur.amount, 0) || 0
                                    )}
                                </span>
                                <span className="text-gray-500 text-sm">Total Spend</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <FaBalanceScale className="text-xl text-indigo-600" />
                                <span className="font-semibold">{details.revenue_to_spend_ratio || 0}</span>
                                <span className="text-gray-500 text-sm">Revenue/Spend</span>
                            </div>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                        <div className="bg-white rounded-lg shadow p-4">
                            <h2 className="font-semibold text-blue-700 mb-2 flex items-center gap-2">
                                <FaMoneyBillWave /> Revenue (Last Months)
                            </h2>
                            <ul>
                                {details.revenue_stats?.map((stat, idx) => (
                                    <li key={idx} className="flex justify-between py-1 border-b last:border-b-0">
                                        <span>{formatMonth(stat.month)}</span>
                                        <span className="font-medium">{formatCurrency(stat.amount)}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="bg-white rounded-lg shadow p-4">
                            <h2 className="font-semibold text-red-700 mb-2 flex items-center gap-2">
                                <FaChartLine /> Spenditure (Last Months)
                            </h2>
                            <ul>
                                {details.spenditure_stats?.map((stat, idx) => (
                                    <li key={idx} className="flex justify-between py-1 border-b last:border-b-0">
                                        <span>{formatMonth(stat.month)}</span>
                                        <span className="font-medium">{formatCurrency(stat.amount)}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                    <div className="bg-white rounded-xl shadow-lg p-6">
                        <h2 className="text-xl font-bold text-gray-700 mb-4 flex items-center gap-2">
                            <FaUsers className="text-blue-500" /> Employees
                        </h2>
                        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {employeesData && employeesData.length > 0 ? (
                                employeesData.map((emp, index) => (
                                    <EmployeeCard key={emp.emp_id || index} employee={emp} dept={selectedDepartment} />
                                ))
                            ) : (
                                <div className="col-span-full text-center text-gray-400">No employees found.</div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default Employees