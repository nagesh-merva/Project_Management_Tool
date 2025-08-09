import { useEffect, useState, useRef } from "react"
import { useParams } from "react-router-dom"
import { BarChartBig, TrendingUp, Calendar, Target, Activity } from "lucide-react"
import { differenceInCalendarDays, parseISO, isValid, addDays } from "date-fns"
import ManageProjectForm from "./ManageProjectForm"

const COLORS = {
    completed: "bg-gradient-to-r from-green-500 to-green-600",
    in_progress: "bg-gradient-to-r from-amber-500 to-orange-500",
    not_started: "bg-gradient-to-r from-blue-500 to-blue-600",
}

const STATUS_COLORS = {
    completed: "bg-green-100 text-green-800 border-green-200",
    in_progress: "bg-amber-100 text-amber-800 border-amber-200",
    not_started: "bg-blue-100 text-blue-800 border-blue-200",
}

const parseDate = (dateInput) => {
    if (!dateInput) return null

    let date
    if (typeof dateInput === 'string') {
        if (dateInput.includes('T')) {
            date = parseISO(dateInput)
        } else {
            date = new Date(dateInput)
        }
    } else {
        date = new Date(dateInput)
    }

    return isValid(date) ? date : null
}

const getWeekNumber = (targetDate, baseDate) => {
    if (!targetDate || !baseDate) return null
    const days = differenceInCalendarDays(targetDate, baseDate)
    return Math.floor(days / 7) + 1
}

const ProjectProgressChart = ({ projectPhases, currentProgress }) => {
    const { id } = useParams()
    const [weeks, setWeeks] = useState([])
    const [progress, setProgress] = useState(0)
    const [predicted, setPredicted] = useState(0)
    const [stats, setStats] = useState({ completed: 0, inProgress: 0, notStarted: 0, total: 0 })
    const [isInitialized, setInitialized] = useState(false)
    const [showForm, setShowForm] = useState(false)
    const [timelineData, setTimelineData] = useState([])

    const [isDragging, setIsDragging] = useState(false)
    const [dragStart, setDragStart] = useState({ x: 0, scrollLeft: 0 })
    const timelineRef = useRef(null)

    useEffect(() => {
        if (!projectPhases || projectPhases.length === 0) return

        let maxWeeks = 0
        let completedCount = 0
        let inProgressCount = 0
        let notStartedCount = 0
        let totalCount = 0
        const processedData = []

        let earliestDate = null
        let latestDate = null

        projectPhases.forEach(phase => {
            phase.subphases.forEach(sub => {
                const startDate = parseDate(sub.start_date)
                const endDate = parseDate(sub.closed_date)

                if (startDate) {
                    if (!earliestDate || startDate < earliestDate) {
                        earliestDate = startDate
                    }
                }

                const relevantEndDate = endDate || (startDate ? addDays(startDate, 14) : new Date())
                if (!latestDate || relevantEndDate > latestDate) {
                    latestDate = relevantEndDate
                }
            })
        })

        if (!earliestDate) {
            earliestDate = new Date()
        }
        if (!latestDate) {
            latestDate = addDays(earliestDate, 84)
        }

        maxWeeks = Math.max(getWeekNumber(latestDate, earliestDate) || 12, 12);

        projectPhases.forEach((phase) => {
            const phaseData = {
                ...phase,
                subphases: []
            }

            phase.subphases.forEach((sub) => {
                const startDate = parseDate(sub.start_date)
                const endDate = parseDate(sub.closed_date)

                let startWeek = null
                let endWeek = null
                let duration = 2

                if (startDate) {
                    startWeek = getWeekNumber(startDate, earliestDate)

                    if (endDate) {
                        endWeek = getWeekNumber(endDate, earliestDate)
                        duration = Math.max(endWeek - startWeek + 1, 1)
                    } else {
                        endWeek = startWeek + 1
                        duration = 2
                    }
                } else {
                    startWeek = null
                    endWeek = null
                }

                const processedSub = {
                    ...sub,
                    startWeek,
                    endWeek,
                    duration,
                    startDate,
                    endDate
                }

                phaseData.subphases.push(processedSub)

                if (sub.status === "completed") completedCount++
                else if (sub.status === "in_progress") inProgressCount++
                else notStartedCount++;
                totalCount++
            })

            processedData.push(phaseData)
        })

        const allWeeks = [];
        for (let i = 1; i <= maxWeeks; i++) {
            allWeeks.push(`W${i}`)
        }

        setWeeks(allWeeks)
        setTimelineData(processedData)
        setProgress(Math.floor((completedCount / totalCount) * 100));
        setPredicted(Math.min(progress + 20, 100));
        setStats({
            completed: completedCount,
            inProgress: inProgressCount,
            notStarted: notStartedCount,
            total: totalCount
        })
        setInitialized(projectPhases && projectPhases.length > 0)
    }, [projectPhases, progress])

    const handleMouseDown = (e) => {
        if (!timelineRef.current) return

        setIsDragging(true)
        setDragStart({
            x: e.pageX,
            scrollLeft: timelineRef.current.scrollLeft
        })

        e.preventDefault()
    }

    const handleMouseMove = (e) => {
        if (!isDragging || !timelineRef.current) return

        e.preventDefault()
        const x = e.pageX
        const deltaX = x - dragStart.x
        timelineRef.current.scrollLeft = dragStart.scrollLeft - deltaX
    }

    const handleMouseUp = () => {
        setIsDragging(false)
    }

    const handleMouseLeave = () => {
        setIsDragging(false)
    }

    useEffect(() => {
        if (isDragging) {
            document.addEventListener('mousemove', handleMouseMove)
            document.addEventListener('mouseup', handleMouseUp)

            return () => {
                document.removeEventListener('mousemove', handleMouseMove)
                document.removeEventListener('mouseup', handleMouseUp)
            }
        }
    }, [isDragging, dragStart])

    const toggleForm = () => setShowForm(prev => !prev)

    const totalSubphases = projectPhases?.reduce((total, phase) => total + phase.subphases.length, 0) || 0

    const isCompact = totalSubphases > 8
    const isVeryCompact = totalSubphases > 12
    const needsScroll = totalSubphases > 7

    if (showForm || !projectPhases || projectPhases.length === 0) {
        return (
            <div className="w-2/5 md:w-2/3 max-w-4xl mx-auto bg-white p-6 rounded-xl shadow-md pb-20 ">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold text-gray-800">Manage Project</h2>
                    <button
                        onClick={toggleForm}
                        className="bg-red-500 hover:bg-red-600 text-white px-4 py-1.5 rounded-lg text-sm"
                    >
                        Cancel
                    </button>
                </div>
                <ManageProjectForm
                    projectId={id}
                    projectPhases={projectPhases}
                    isInitialized={isInitialized}
                    setInitialized={setInitialized}
                    overallProgress={currentProgress}
                />
            </div>
        )
    }

    return (
        <div className="w-2/5 md:w-2/3 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden flex flex-col max-h-full">
            <div className={`${isVeryCompact ? 'p-3' : isCompact ? 'p-4' : 'p-4'} text-black flex-shrink-0`}>
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                            <BarChartBig size={20} />
                        </div>
                        <div>
                            <h2 className={`font-semibold ${isVeryCompact ? 'text-sm' : 'text-base'}`}>Project Timeline</h2>
                            <p className={`text-gray-600 ${isVeryCompact ? 'text-xs' : 'text-xs'}`}>Track progress across all phases</p>
                        </div>
                    </div>
                    <button onClick={toggleForm} className={`${isVeryCompact ? 'px-2 py-1 text-sm' : 'px-3 py-1.5'} bg-btncol hover:bg-btncol/40 text-white rounded-lg transition-all duration-200 backdrop-blur-sm`}>
                        <Activity size={16} className="inline mr-2" />
                        Update
                    </button>
                </div>
            </div>

            <div className={`${isVeryCompact ? 'p-1 px-4' : isCompact ? 'p-2 px-6' : 'p-2 px-8'} space-y-4 flex-1 overflow-hidden flex flex-col`}>
                <div className={`grid grid-cols-4 ${isVeryCompact ? 'gap-2' : 'gap-4'} flex-shrink-0`}>
                    <div className={`bg-green-50 border border-green-200 rounded-lg ${isVeryCompact ? 'p-1.5' : 'p-2'} text-center`}>
                        <div className={`${isVeryCompact ? 'text-lg' : 'text-2xl'} font-bold text-green-600`}>{stats.completed}</div>
                        <div className={`${isVeryCompact ? 'text-xs' : 'text-xs'} text-green-700 font-medium`}>Completed</div>
                    </div>
                    <div className={`bg-amber-50 border border-amber-200 rounded-lg ${isVeryCompact ? 'p-1.5' : 'p-2'} text-center`}>
                        <div className={`${isVeryCompact ? 'text-lg' : 'text-2xl'} font-bold text-amber-600`}>{stats.inProgress}</div>
                        <div className={`${isVeryCompact ? 'text-xs' : 'text-xs'} text-amber-700 font-medium`}>In Progress</div>
                    </div>
                    <div className={`bg-blue-50 border border-blue-200 rounded-lg ${isVeryCompact ? 'p-1.5' : 'p-2'} text-center`}>
                        <div className={`${isVeryCompact ? 'text-lg' : 'text-2xl'} font-bold text-blue-600`}>{stats.notStarted}</div>
                        <div className={`${isVeryCompact ? 'text-xs' : 'text-xs'} text-blue-700 font-medium`}>Not Started</div>
                    </div>
                    <div className={`bg-gray-50 border border-gray-200 rounded-lg ${isVeryCompact ? 'p-1.5' : 'p-2'} text-center`}>
                        <div className={`${isVeryCompact ? 'text-lg' : 'text-2xl'} font-bold text-gray-600`}>{stats.total}</div>
                        <div className={`${isVeryCompact ? 'text-xs' : 'text-xs'} text-gray-700 font-medium`}>Total Phases</div>
                    </div>
                </div>

                <div className={`space-y-${isVeryCompact ? '2' : '4'} flex-shrink-0`}>
                    <div className={`space-y-${isVeryCompact ? '1' : '3'}`}>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Target className="text-green-600" size={isVeryCompact ? 16 : 18} />
                                <span className={`${isVeryCompact ? 'text-xs' : 'text-sm'} font-semibold text-gray-700`}>Current Progress</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className={`${isVeryCompact ? 'text-lg' : 'text-2xl'} font-bold text-green-600`}>{Math.round(currentProgress, 2)}%</span>
                            </div>
                        </div>
                        <div className="relative">
                            <div className={`w-full bg-gray-200 rounded-full ${isVeryCompact ? 'h-3' : 'h-4'} shadow-inner`}>
                                <div
                                    className={`${isVeryCompact ? 'h-3' : 'h-4'} rounded-full bg-gradient-to-r from-green-500 to-green-600 shadow-sm transition-all duration-1000 ease-out relative overflow-hidden`}
                                    style={{ width: `${currentProgress}%` }}
                                >
                                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse"></div>
                                </div>
                            </div>
                            {!isVeryCompact && (
                                <div className="flex justify-between text-xs text-gray-500 mt-1">
                                    <span>0%</span>
                                    <span>50%</span>
                                    <span>100%</span>
                                </div>
                            )}
                        </div>
                    </div>
                    <div className={`space-y-${isVeryCompact ? '1' : '3'}`}>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <TrendingUp className="text-purple-600" size={isVeryCompact ? 16 : 18} />
                                <span className={`${isVeryCompact ? 'text-xs' : 'text-sm'} font-semibold text-gray-700`}>Predicted Completion</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className={`${isVeryCompact ? 'text-lg' : 'text-2xl'} font-bold text-purple-600`}>{Math.round(predicted, 2)}%</span>
                                <span className={`${isVeryCompact ? 'text-xs' : 'text-xs'} text-gray-500 bg-gray-100 px-2 py-1 rounded-full`}>Est.</span>
                            </div>
                        </div>
                        <div className="relative">
                            <div className={`w-full bg-gray-200 rounded-full ${isVeryCompact ? 'h-3' : 'h-4'} shadow-inner`}>
                                <div
                                    className={`${isVeryCompact ? 'h-3' : 'h-4'} rounded-full bg-gradient-to-r from-purple-500 to-purple-600 shadow-sm transition-all duration-1000 ease-out relative overflow-hidden`}
                                    style={{ width: `${predicted}%` }}
                                >
                                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse"></div>
                                </div>
                            </div>
                            {!isVeryCompact && (
                                <div className="flex justify-between text-xs text-gray-500 mt-1">
                                    <span>0%</span>
                                    <span>50%</span>
                                    <span>100%</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="bg-gray-50 rounded-lg flex-1 overflow-hidden flex flex-col">
                    <div className="flex items-center gap-2 p-3 flex-shrink-0">
                        <Calendar className="text-gray-600" size={isVeryCompact ? 16 : 18} />
                        <h3 className={`font-semibold text-gray-800 ${isVeryCompact ? 'text-sm' : 'text-base'}`}>Project Timeline</h3>
                        <div className={`ml-auto text-gray-500 ${isVeryCompact ? 'text-xs' : 'text-sm'} flex items-center gap-1`}>
                            <span>🖱️</span>
                            <span>Click & drag to scroll</span>
                        </div>
                    </div>

                    <div
                        className={`${needsScroll ? 'overflow-auto' : 'overflow-hidden'} flex-1 custom-scrollbar ${isDragging ? 'cursor-grabbing' : 'cursor-grab'} select-none`}
                        ref={timelineRef}
                        onMouseDown={handleMouseDown}
                        onMouseLeave={handleMouseLeave}
                        style={{
                            scrollbarWidth: 'thin',
                            scrollbarColor: '#9CA3AF #F3F4F6'
                        }}
                    >
                        <div className="min-w-[600px] pointer-events-none">
                            <div className="flex mb-1">
                                <div className={`w-48 flex-shrink-0 ${isVeryCompact ? 'p-2' : 'p-3'} bg-gradient-to-r from-purple-600 to-purple-700 text-white font-semibold rounded-l-lg`}>
                                    <span className={isVeryCompact ? 'text-xs' : 'text-sm'}>Phase / Task</span>
                                </div>
                                <div className="flex flex-1">
                                    {weeks.map((week, idx) => (
                                        <div key={idx} className={`flex-1 min-w-[${isVeryCompact ? '32px' : '40px'}] ${isVeryCompact ? 'p-1' : 'p-2'} bg-purple-600 text-white text-center ${isVeryCompact ? 'text-xs' : 'text-sm'} font-medium border-l border-purple-500 first:border-l-0 last:rounded-r-lg`}>
                                            {week}
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className={`space-y-${isVeryCompact ? '0.5' : '1'}`}>
                                {timelineData.map((phase, phaseIdx) => (
                                    <div key={`phase-${phaseIdx}`} className={`space-y-${isVeryCompact ? '0.5' : '1'}`}>
                                        <div className="flex">
                                            <div className={`w-48 flex-shrink-0 ${isVeryCompact ? 'p-1.5' : 'p-2'} bg-gradient-to-r from-gray-700 to-gray-800 ${isVeryCompact ? 'text-xs' : 'text-sm'} text-white font-bold rounded-lg`}>
                                                {phase.parent_phase.toUpperCase()}
                                            </div>
                                        </div>
                                        {phase.subphases.map((sub, subIdx) => (
                                            <div key={`subphase-${phaseIdx}-${subIdx}`} className="flex hover:bg-white transition-colors duration-200 rounded-lg">
                                                <div className={`w-48 flex-shrink-0 ${isVeryCompact ? 'p-1' : 'p-1.5'} bg-white border border-gray-200 rounded-l-lg`}>
                                                    <div className={`${isVeryCompact ? 'text-xs' : 'text-sm'} font-medium text-gray-800 mb-1`}>{sub.subphase}</div>
                                                    <span className={`inline-block px-2 py-0.5 rounded-full ${isVeryCompact ? 'text-[9px]' : 'text-[10px]'} font-medium border ${STATUS_COLORS[sub.status]}`}>
                                                        {sub.status.replace('_', ' ')}
                                                    </span>
                                                </div>
                                                <div className="flex flex-1 bg-white border-t border-r border-b border-gray-200 rounded-r-lg relative">
                                                    {weeks.map((week, weekIdx) => (
                                                        <div key={weekIdx} className={`flex-1 min-w-[${isVeryCompact ? '28px' : '36px'}] ${isVeryCompact ? 'p-1' : 'p-2'} border-l border-gray-100 first:border-l-0 relative`}>
                                                        </div>
                                                    ))}
                                                    {sub.startWeek && sub.endWeek && (
                                                        <div
                                                            className="absolute top-1/2 transform -translate-y-1/2"
                                                            style={{
                                                                left: `${((sub.startWeek - 1) / weeks.length) * 100}%`,
                                                                width: `${((sub.endWeek - sub.startWeek + 1) / weeks.length) * 100}%`,
                                                            }}
                                                        >
                                                            <div className={`${isVeryCompact ? 'h-4' : 'h-6'} rounded-lg ${COLORS[sub.status]} shadow-sm mx-1 relative overflow-hidden`}>
                                                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                <div className={`flex items-center justify-center ${isVeryCompact ? 'gap-4' : 'gap-6'} ${isVeryCompact ? 'pt-2' : 'pt-4'} border-t border-gray-200 flex-shrink-0`}>
                    <div className="flex items-center gap-2">
                        <div className={`${isVeryCompact ? 'w-3 h-3' : 'w-4 h-4'} rounded bg-gradient-to-r from-green-500 to-green-600`}></div>
                        <span className={`${isVeryCompact ? 'text-xs' : 'text-sm'} text-gray-600`}>Completed</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className={`${isVeryCompact ? 'w-3 h-3' : 'w-4 h-4'} rounded bg-gradient-to-r from-amber-500 to-orange-500`}></div>
                        <span className={`${isVeryCompact ? 'text-xs' : 'text-sm'} text-gray-600`}>In Progress</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className={`${isVeryCompact ? 'w-3 h-3' : 'w-4 h-4'} rounded bg-gradient-to-r from-blue-500 to-blue-600`}></div>
                        <span className={`${isVeryCompact ? 'text-xs' : 'text-sm'} text-gray-600`}>Not Started</span>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ProjectProgressChart