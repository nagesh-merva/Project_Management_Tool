import { useEffect, useState } from "react";
import Actives from "./BriefProjectBox";


export default function ProjectsDashboard() {
    const [activeProjs, setActiveProjs] = useState([])
    const [issuedProjs, setIssuedProjs] = useState([])
    const [completedProjs, setCompltProjs] = useState([])
    const emp = JSON.parse(localStorage.getItem("emp"))

    useEffect(() => {
        GetProjects()
    }, [])

    const GetProjects = async () => {
        try {
            const response = await fetch(`http://127.0.0.1:8000/get-project-empid?emp_id=${emp.emp_id}`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
            })

            const data = await response.json()
            if (response.status === 200 || response.status === 201) {
                const actives = [];
                const issued = [];
                const completed = [];
                for (let i = 0; i < data.length; i++) {
                    if (data[i].status === "active") {
                        actives.push(data[i]);
                    } else if (data[i].status === "issued") {
                        issued.push(data[i]);
                    } else {
                        completed.push(data[i]);
                    }
                }
                console.log("sizes of all", actives.length, issued.length, completed.length)
                setActiveProjs(actives);
                setIssuedProjs(issued);
                setCompltProjs(completed);
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
            <div className="min-h-screen px-6 py-0 w-full">

                <h2 className="pb-1 pl-2 font-bold ">Active Projects</h2>
                <section className="mb-10 overflow-x-scroll custom-scrollbar">
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 ">
                        {activeProjs && activeProjs.map((project, index) => (
                            <Actives key={index} project={project} />
                        ))}
                    </div>
                </section>
                <h2 className="pb-1 pl-2 font-bold whitespace-nowrap">Issues Reported in</h2>

                <section className="mb-10 overflow-x-scroll custom-scrollbar">
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4  ">
                        {issuedProjs && issuedProjs.map((project, index) => (
                            <Actives key={index} project={project} />
                        ))}
                    </div>
                </section>
                <h2 className="pb-1 pl-2 font-bold whitespace-nowrap ">Completed Projects</h2>
                <section className="mb-10 overflow-x-scroll custom-scrollbar">
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 ">
                        {completedProjs && completedProjs.map((project, index) => (
                            <Actives key={index} project={project} />
                        ))}
                    </div>
                </section>
            </div>
        </>
    )
} 
