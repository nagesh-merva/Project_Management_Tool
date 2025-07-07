import { useEffect, useState } from "react"
import { BarChartBig } from "lucide-react"
import { differenceInCalendarDays, parseISO } from "date-fns"

const COLORS = {
    completed: "bg-blue-500",
    in_progress: "bg-amber-500",
    not_started: "bg-green-500",
}

const ProjectProgressChart = ({ projectPhases }) => {
    const [weeks, setWeeks] = useState([])
    const [progress, setProgress] = useState(0)
    const [predicted, setPredicted] = useState(0)

    console.table(projectPhases)

    useEffect(() => {
        let maxWeeks = 0
        let completedCount = 0
        let totalCount = 0

        projectPhases?.forEach(phase => {
            phase.subphases.forEach(sub => {
                const start = parseISO(sub.start_date)
                const end = sub.closed_date ? parseISO(sub.closed_date) : new Date()
                const duration = Math.ceil(differenceInCalendarDays(end, start) / 7) || 1

                const startWeek = Math.ceil(differenceInCalendarDays(start, parseISO(projectPhases[0].subphases[0].start_date)) / 7) + 1

                if (startWeek + duration - 1 > maxWeeks) maxWeeks = startWeek + duration - 1

                if (sub.status === "completed") completedCount++
                totalCount++;
            })
        })

        const allWeeks = []
        for (let i = 1; i <= maxWeeks; i++) {
            allWeeks.push(`W${i}`)
        }
        setWeeks(allWeeks)
        setProgress(Math.floor((completedCount / totalCount) * 100));
        setPredicted(Math.min(progress + 20, 100))
    }, [projectPhases])

    if (!projectPhases || projectPhases.length === 0) {
        return (
            <div className="w-full bg-white rounded-lg shadow-lg p-4 space-y-4">
                <h1 className="text-center text-gray-500">No project phase data available.</h1>
            </div>
        );
    }


    return (
        <div className="w-2/5 md:w-2/3 bg-white rounded-xl shadow-xl p-5 space-y-4">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <BarChartBig className="text-blue-700" />
                    <h2 className="text-lg font-semibold">Project Status</h2>
                </div>
                <button className="px-4 py-1 rounded-lg bg-blue-600 text-white hover:bg-blue-500 transition-all ">
                    Update
                </button>
            </div>

            <div className="space-y-2">
                <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Progress</span>
                    <span className="text-sm font-medium">{progress}%</span>
                </div>
                <div className="w-full bg-gray-300 rounded-full h-3 ">
                    <div
                        className="h-3 rounded-full"
                        style={{ width: `${progress}%` }}
                    ></div>
                </div>
                <div className="flex items-center justify-between mt-2">
                    <span className="text-sm font-medium">Predicted</span>
                    <span className="text-sm font-medium">{predicted}%</span>
                </div>
                <div className="w-full bg-gray-300 rounded-full h-3">
                    <div
                        className="h-3 rounded-full bg-purple-600"
                        style={{ width: `${predicted}%` }}
                    ></div>
                </div>
            </div>

            <div className="overflow-x-auto mt-6">
                <table className="w-full border-collapse min-w-[600px]">
                    <thead>
                        <tr>
                            <th className="bg-purple-700 text-white text-left p-2">Phase</th>
                            {weeks.map((week, idx) => (
                                <th key={idx} className="border p-2 text-center">{week}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {projectPhases && projectPhases.map((phase, phaseIdx) => (
                            <>
                                {/* Phase Row */}
                                <tr key={`phase-${phaseIdx}`}>
                                    <td className="bg-gray-200 text-purple-700 font-semibold p-2" colSpan={weeks.length + 1}>
                                        {phase.parent_phase.toUpperCase()}
                                    </td>
                                </tr>

                                {/* Subphases Rows */}
                                {phase.subphases.map((sub, subIdx) => {
                                    const startWeek = Math.ceil(differenceInCalendarDays(parseISO(sub.start_date), parseISO(projectPhases[0].subphases[0].start_date)) / 7) + 1;
                                    const endWeek = sub.closed_date ? Math.ceil(differenceInCalendarDays(parseISO(sub.closed_date), parseISO(projectPhases[0].subphases[0].start_date)) / 7) + 1 : startWeek + 1;

                                    return (
                                        <tr key={`subphase-${phaseIdx}-${subIdx}`} className="hover:bg-gray-100">
                                            <td className="p-2 text-sm">{sub.subphase}</td>
                                            {weeks.map((week, idx) => (
                                                <td key={idx} className="border p-1">
                                                    {idx + 1 >= startWeek && idx + 1 < endWeek && (
                                                        <div className={`h-4 rounded-lg ${COLORS[sub.status]}`}></div>
                                                    )}
                                                </td>
                                            ))}
                                        </tr>
                                    )
                                })}
                            </>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default ProjectProgressChart
