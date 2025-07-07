import { useEffect, useState } from "react"
import Actives from "./BriefProjectBox"
import Loading from "../Loading"
import PopupForm from "../Home/PopUpForm"
import { Plus } from "lucide-react"
import { useMainContext } from "../../context/MainContext"

export default function ProjectsDashboard() {
    const [activeProjs, setActiveProjs] = useState([])
    const [issuedProjs, setIssuedProjs] = useState([])
    const [completedProjs, setCompltProjs] = useState([])
    const [loading, setLoading] = useState(false)
    const [showPopup, setShowPopup] = useState(false)
    const emp = JSON.parse(localStorage.getItem("emp"))
    const { allEmps } = useMainContext()

    const [fields, setFields] = useState([
        {
            name: "project_name",
            type: "text"
        },
        {
            name: "descp",
            type: "textarea"
        },
        {
            name: "start_date",
            type: "date"
        },
        {
            name: "deadline",
            type: "date"
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
        GetProjects()
        setEmployees()
    }, [])

    const setEmployees = () => {
        const selectOptions = allEmps.map(emp => ({
            name: `${emp.emp_id} - ${emp.emp_name} - ${emp.role}`,
            value: emp.emp_id
        }))
        setFields(prevFields =>
            prevFields.map(field =>
                field.name === "members_assigned"
                    ? { ...field, fields: selectOptions }
                    : field
            )
        )
    }

    const GetProjects = async () => {
        setLoading(true)
        try {
            const response = await fetch(`http://127.0.0.1:8000/get-project-empid?emp_id=${emp.emp_id}`, {
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
                console.log("sizes of all", actives.length, issued.length, completed.length)
                setActiveProjs(actives)
                setIssuedProjs(issued)
                setCompltProjs(completed)
            }
            // console.log(data)
        }
        catch (err) {
            console.error(err)
        }
        finally {
            setTimeout(() => {
                setLoading(false)
            }, 1000)
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
                        <button className="absolute right-5 top-5 px-5 py-1.5 bg-btncol rounded-full flex items-center justify-center text-white hover:scale-95 transition-transform"><Plus /> New Project</button>
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
                )}
            </div>
            <PopupForm
                isVisible={showPopup}
                onClose={() => setShowPopup(false)}
                formTitle="Add New Update"
                endpoint="http://127.0.0.1:8000/add-project"
                fields={fields}
            />
        </>
    )
} 
