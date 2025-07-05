import Actives from "./Actives"
import { useState, useEffect } from "react"
import Loading from "../Loading"

function Activeproject() {
    const [loading, setLoading] = useState(false)
    const [activeProj, setActive] = useState(() => {
        const stored = sessionStorage.getItem("active-projects")
        return stored ? JSON.parse(stored) : []
    })

    useEffect(() => {
        // console.log("called effect")
        Getprojects()
    }, [])

    const Getprojects = async () => {
        setLoading(true)
        const emp = JSON.parse(localStorage.getItem("emp"))
        // console.log(emp)
        try {
            const response = await fetch(`http://127.0.0.1:8000/get-active-projects?emp_id=${emp.emp_id}`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },

            })
            const data = await response.json()
            if (response.status === 201 || response.status === 200) {
                sessionStorage.setItem("active-projects", JSON.stringify(data));
                // console.log("Ative Projects:", data);
                setActive(data)
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
        <div className=" md:w-7/12 lg:w-3/5 md:h-4/5 lg:h-full flex flex-col">
            <h1 className="pb-2 pl-2 font-bold text-md">Active Projects</h1>
            <div className="bg-white grid grid-cols-1 lg:grid-cols-2 gap-4 w-full h-full rounded-2xl shadow-lg p-4 overflow-y-auto custom-scrollbar">
                {loading ? (
                    <Loading />
                ) : (
                    <>
                        {activeProj.length === 0 ? (
                            <div className="col-span-full text-center text-gray-500 py-8">
                                No active projects found.
                            </div>
                        ) : (
                            activeProj.map((activeProj, index) => (
                                <Actives key={index} project={activeProj} />
                            ))
                        )}
                    </>
                )}
            </div>
        </div>
    )
}

export default Activeproject