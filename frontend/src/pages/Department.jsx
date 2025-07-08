import { useState } from "react"
import PopupForm from "../components/Home/PopUpForm"
import Navigation from "../components/Navigation/Navigation"
import Header from "../components/header"
import { Menu, X } from "lucide-react"
import Employees from "../components/Departments/Emplooyees"
import { useMainContext } from "../context/MainContext"

const employeeFields = [
    { name: "emp_name", type: "text" },
    {
        name: "emp_dept", type: "select",
        multi: false,
        fields: [
            {
                name: "Development",
                value: "DEV"
            },
            {
                name: "Sales",
                value: "SALES"
            },
            {
                name: "Design",
                value: "DESIGN"
            },
            {
                name: "Maintenance",
                value: "MAINTENANCE"
            },
        ]
    },
    { name: "role", type: "text", optional: false },
    { name: "email", type: "email" },
    { name: "password", type: "text", optional: false },
    { name: "address", type: "text", optional: false },
    { name: "contact", type: "text", optional: false },
    { name: "joined_on", type: "date" },
    { name: "hired_by", type: "id" },
    { name: "salary_monthly", type: "number" },
    { name: "emergency_contact", type: "text", optional: true },
    { name: "bank_account_number", type: "text", optional: true },
    { name: "bank_ifsc", type: "text", optional: true },
]

export default function Department() {
    const [navOpen, setNavOpen] = useState(false)
    const { selectedDepartment } = useMainContext()

    const [showPopup, setShowPopup] = useState(false)

    const handleSuccess = () => {
        console.log("Employee added successfully")
    }

    return (
        <div className="relative h-full min-h-screen w-full flex flex-col bg-gray-100 min-w-[800px]">
            <button
                className="fixed top-4 left-4 z-50 md:hidden bg-white p-2 rounded shadow"
                onClick={() => setNavOpen(!navOpen)}
                aria-label="Toggle navigation"
            >
                {navOpen ? <X size={32} /> : <Menu size={32} />}
            </button>

            <div className={`fixed top-0 left-0 h-full transition-transform duration-300 ${navOpen ? "translate-x-0" : "-translate-x-full"} hidden md:fixed md:top-0 md:left-0 md:h-full md:w-[13%] md:z-40 md:translate-x-0 md:block`} >
                <Navigation />
            </div>

            {navOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-30 z-30 md:hidden" onClick={() => setNavOpen(false)} />
            )}

            <div className="w-full md:w-[87%] h-full pt-20 flex place-self-end justify-center transition-all duration-300">

                <Header />
                <div className="px-10 w-full h-full z-20">
                    <div className="flex justify-end mb-4">
                        <button
                            onClick={() => setShowPopup(true)}
                            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                        >
                            Add New Employee
                        </button>
                    </div>

                    <Employees selectedDepartment={selectedDepartment} />
                </div>
            </div>
            {showPopup && (
                <PopupForm
                    isVisible={showPopup}
                    onClose={() => setShowPopup(false)}
                    formTitle="Add New Employee"
                    endpoint="http://127.0.0.1:8000/add-employee"
                    fields={employeeFields}
                    onSuccess={handleSuccess}
                />
            )}
        </div>
    )
}
