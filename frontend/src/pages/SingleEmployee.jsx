import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { Menu, X } from "lucide-react"
import Header from "../components/header"
import Navigation from "../components/Navigation/Navigation"
import EmployeeDetails from "../components/Departments/EmployeeDetails"
import Loading from "../components/Loading"

export default function SingleEmployee() {
    const { id } = useParams()
    const [navOpen, setNavOpen] = useState(false)
    const [emp, setEmp] = useState({})
    const [loading, setLoading] = useState(false)
    // console.log(id)

    useEffect(() => {
        GetEmployee()
    }, [id])

    // console.log(emp)

    const GetEmployee = async () => {
        setLoading(true)
        try {
            const response = await fetch(`http://127.0.0.1:8000/employee?emp_id=${id}`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },

            })
            const data = await response.json()
            if (response.status === 201 || response.status === 200) {
                setEmp(data)
            }
        }
        catch (err) {
            console.error(err)
        }
        finally {
            setLoading(false)
        }
    }

    return (
        <div className="relative h-full w-full flex flex-col bg-gray-100 min-w-[800px]">
            <button
                className="fixed top-4 left-4 z-50 md:hidden bg-white p-2 rounded shadow"
                onClick={() => setNavOpen(!navOpen)}
                aria-label="Toggle navigation"
            >
                {navOpen ? (
                    <X size={32} />
                ) : (
                    <Menu size={32} />
                )}
            </button>
            <div
                className={`
                        fixed top-0 left-0 h-full w-[30%] z-40 transition-transform duration-300
                        ${navOpen ? "translate-x-0" : "-translate-x-full"}
                        md:fixed md:top-0 md:left-0 md:h-full md:w-[13%] md:z-40 md:translate-x-0 md:block
                    `}
            >
                <Navigation />
            </div>
            {navOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-30 z-30 md:hidden"
                    onClick={() => setNavOpen(false)}
                />
            )}

            <div className="w-full md:w-[87%] h-full pt-20 flex place-self-end justify-center transition-all duration-300">
                <Header />
                <div className="pl-10 pr-7 w-full h-full">
                    <div className="flex justify-end mb-4">
                        {loading ? (
                            <Loading />
                        ) : (
                            <EmployeeDetails emp={emp} />
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
