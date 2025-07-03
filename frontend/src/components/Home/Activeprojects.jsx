import { Edit } from "lucide-react"
import Actives from "./Actives"
import { useState, useEffect } from "react"

function Activeproject() {
    const [activeProj, setActive] = useState(() => {
        const stored = sessionStorage.getItem("active-projects");
        return stored ? JSON.parse(stored) : [];
    })

    useEffect(() => {
        // console.log("called effect")
        Getprojects()
    }, [])

    const Getprojects = async () => {
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
    }

    return (
        <div className=" h-full w-2/3">
            <h1 className="pb-1 pl-2 font-bold">Active Projects</h1>
            <div className="bg-white grid grid-cols-2 gap-4 w-full h-5/6 rounded-2xl drop-shadow-xl p-4 overflow-y-scroll custom-scrollbar">
                {activeProj.map((activeProj, index) => (
                    <Actives key={index} project={activeProj} />
                ))}
            </div>
        </div>
    )
}

export default Activeproject