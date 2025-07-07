import { PenTool, SquareDashedBottomCode, Globe } from "lucide-react"
import { useNavigate } from "react-router-dom"

const Actives = ({ project }) => {
    const {
        project_id,
        project_name,
        progress,
        current_phase,
        descp,
        start_date,
        deadline,
        team_members,
        quick_links
    } = project

    const currentEmp = JSON.parse(localStorage.getItem("emp"))
    const currentMember = team_members.find(member => member.emp_id === currentEmp.emp_id)
    const role = currentMember?.role || "N/A"
    const navigate = useNavigate()
    const viewFull = () => {
        navigate(`/singleproject/${project_id}`)
    }

    return (
        <div className="relative w-full h-full flex flex-col border-2 border-black p-3 md:p-4 rounded-lg shadow-md bg-white transition-all">
            <div className="w-full flex justify-between border-b border-black pb-2 mb-3">
                <h1 className="text-base font-semibold font-sans truncate">{project_name}</h1>
                <p className="text-sm font-semibold font-sans text-orange-600">{progress}%</p>
            </div>

            <div className="flex justify-between items-start mb-3 flex-wrap gap-2">
                <div>
                    <p className="text-sm text-gray-700">{`Your role: ${role}`}</p>
                    <p className="text-sm text-gray-700">{`Current phase: ${current_phase}`}</p>
                </div>
                <div className="text-xs text-gray-400 text-right min-w-[110px]">
                    <p>{`Start: ${start_date.split("T")[0]}`}</p>
                    <p>{`Deadline: ${deadline.split("T")[0]}`}</p>
                </div>
            </div>

            <div className="flex items-center mb-3">
                <p className="text-sm text-gray-700 mr-2">Team:</p>
                <div className="flex -space-x-1">
                    {team_members.map((member, idx) => (
                        <div
                            key={idx}
                            className="w-6 h-6 rounded-full bg-gray-300 border border-white text-[10px] flex justify-center items-center"
                            title={member.name}
                        >
                            {member.name[0]}
                        </div>
                    ))}
                </div>
            </div>
            <p className="text-sm text-gray-700 break-words mb-8">{`Description: ${descp}`}</p>
            <div className="absolute bottom-2 right-2 flex items-center justify-between">
                <div className="flex place-self-end">
                    <button onClick={viewFull} target="_blank" rel="noopener noreferrer">
                        <button className="p-1 rounded-lg hover:bg-gray-100/50 hover:scale-105 transition-all">
                            <PenTool color="#6347FF" className="h-6 w-full" />
                        </button>
                    </button>
                    <div className="w-px h-6 bg-black"></div>
                    <a href={quick_links.code_resource_base} target="_blank" rel="noopener noreferrer">
                        <button className="p-1 rounded-lg hover:bg-gray-100/50 hover:scale-105 transition-all">
                            <SquareDashedBottomCode color="#47FF72" className="h-6 w-full" />
                        </button>
                    </a>
                    <div className="w-px h-6 bg-black"></div>
                    <a href={quick_links.live_demo} target="_blank" rel="noopener noreferrer">
                        <button className="p-1 rounded-lg hover:bg-gray-100/50 hover:scale-105 transition-all">
                            <Globe color="#0C098C" className="h-6 w-full" />
                        </button>
                    </a>
                </div>
            </div>
        </div>
    )
}

export default Actives