import { useEffect, useState } from "react"
import Actives from "./BriefProjectBox"
import Loading from "../Loading"
import PopupForm from "../Home/PopUpForm"
import { Plus } from "lucide-react"
import { useMainContext } from "../../context/MainContext"
import { ClipboardList, AlertTriangle, CheckCircle } from 'lucide-react'

export default function ProjectsDashboard() {
    const [activeProjs, setActiveProjs] = useState([])
    const [issuedProjs, setIssuedProjs] = useState([])
    const [completedProjs, setCompltProjs] = useState([])
    const [loading, setLoading] = useState(false)
    const [showPopup, setShowPopup] = useState(false)
    const { allEmps, emp } = useMainContext()
    const isAdmin = emp.role === "Admin" || emp.role === "Manager" || emp.role === "Founder" || emp.role === "Co-Founder"
    const url = isAdmin ? `http://127.0.0.1:8000/get-projects?role=${emp.role}` : `http://127.0.0.1:8000/get-project-empid?emp_id=${emp.emp_id}`

    const [fields, setFields] = useState([
        {
            name: "project_name",
            type: "text",
            optional: false
        },
        {
            name: "descp",
            type: "textarea"
        },
        {
            name: "start_date",
            type: "date",
            allowPastDate: false
        },
        {
            name: "deadline",
            type: "date",
            allowPastDate: false
        },
        {
            name: "team_members",
            type: "select",
            fields: [],
            multi: true
        },
        {
            name: "client_details",
            type: "select",
            multi: false,
            fields: []
        },
    ])

    useEffect(() => {
        const fetchAllData = async () => {
            setLoading(true)
            await GetProjects()
            await getAllClients()
            setEmployees()
            setLoading(false)
        }

        fetchAllData()
    }, [])

    const getAllClients = async () => {
        try {
            const response = await fetch("http://127.0.0.1:8000/clients/briefs", {
                method: "GET",
            })

            const data = await response.json()

            if (response.ok) {
                const selectOptions = data.map(client => ({
                    name: `${client.client_id} - ${client.name} - ${client.domain}`,
                    value: client.client_id
                }))
                setFields(prevFields =>
                    prevFields.map(field =>
                        field.name === "client_details"
                            ? { ...field, fields: selectOptions }
                            : field
                    )
                )
            }
        } catch (err) {
            alert("Error: " + err.message)
        }
    }

    const setEmployees = () => {
        if (!allEmps || allEmps.length === 0) return
        const selectOptions = allEmps.map(emp => ({
            name: `${emp.emp_id} - ${emp.emp_name} - ${emp.role}`,
            value: emp.emp_id
        }))
        setFields(prevFields =>
            prevFields.map(field =>
                field.name === "team_members"
                    ? { ...field, fields: selectOptions }
                    : field
            )
        )
    }

    const GetProjects = async () => {
        // console.log("Fetching projects from:", url)
        try {
            const response = await fetch(url, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
            })

            const data = await response.json()
            if (response.status === 200 || response.status === 201) {
                const actives = []
                const issued = []
                const completed = []
                for (let i = 0; i < data.length; i++) {
                    if (data[i].status === "active") {
                        actives.push(data[i])
                    } else if (data[i].status === "issued") {
                        issued.push(data[i])
                    } else {
                        completed.push(data[i])
                    }
                }
                // console.log("sizes of all", actives.length, issued.length, completed.length)
                setActiveProjs(actives)
                setIssuedProjs(issued)
                setCompltProjs(completed)
            }
            // console.log(data)
        }
        catch (err) {
            console.error(err)
        }
    }

    // console.table(completedProjs[0])
    return (
        <>
            <div className=" h-full min-h-screen px-6 py-0 w-full">
                {loading ? (
                    <div className="w-full h-full ">
                        <Loading />
                    </div>
                ) : (
                    <>
                        <div className="flex items-center justify-between bg-white rounded-md shadow-sm p-4 mb-4">
                            <div>
                                <h2 className="text-lg font-semibold mb-1">Projects Dashboard</h2>
                                <p className="text-sm text-gray-500">Efficiently manage your active, issued, and completed projects.</p>
                            </div>
                            <div className="flex gap-4 text-sm text-gray-700">
                                <div className="flex items-center gap-1">
                                    <ClipboardList className="w-4 h-4 text-blue-500" />
                                    <span className="font-medium">{activeProjs.length}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <AlertTriangle className="w-4 h-4 text-yellow-500" />
                                    <span className="font-medium">{issuedProjs.length}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <CheckCircle className="w-4 h-4 text-green-500" />
                                    <span className="font-medium">{completedProjs.length}</span>
                                </div>
                            </div>
                        </div>
                        <>
                            <button onClick={() => setShowPopup(true)} className="absolute right-5 top-5 px-5 py-1.5 bg-btncol rounded-full flex items-center justify-center text-white hover:scale-95 transition-transform"><Plus /> <p className="hidden lg:block">New Project</p></button>
                            <h2 className="pb-1 pl-2 font-bold ">Active Projects</h2>
                            <div className="w-full mb-5 px-5 h-0.5 bg-gray-400 rounded-full"></div>
                            <section className="mb-10 overflow-x-scroll custom-scrollbar">
                                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 ">
                                    {activeProjs && activeProjs.map((project, index) => (
                                        <Actives key={index} project={project} />
                                    ))}
                                </div>
                            </section>
                            <h2 className="pb-1 pl-2 font-bold whitespace-nowrap">Issues Reported in</h2>
                            <div className="w-full mb-5 px-5 h-0.5 bg-gray-400 rounded-full"></div>
                            <section className="mb-10 overflow-x-scroll custom-scrollbar">
                                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4  ">
                                    {issuedProjs && issuedProjs.map((project, index) => (
                                        <Actives key={index} project={project} />
                                    ))}
                                </div>
                            </section>
                            <h2 className="pb-1 pl-2 font-bold whitespace-nowrap ">Completed Projects</h2>
                            <div className="w-full mb-5 px-5 h-0.5 bg-gray-400 rounded-full"></div>
                            <section className="mb-10 overflow-x-scroll custom-scrollbar">
                                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 ">
                                    {completedProjs && completedProjs.map((project, index) => (
                                        <Actives key={index} project={project} />
                                    ))}
                                </div>
                            </section>
                        </>
                    </>
                )}
            </div>
            <PopupForm
                isVisible={showPopup}
                onClose={() => setShowPopup(false)}
                formTitle="Add New Project"
                endpoint="http://127.0.0.1:8000/add-project"
                fields={fields}
            />
        </>
    )
} 
