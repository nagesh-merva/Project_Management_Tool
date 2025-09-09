import { TrendingUp, Star, Briefcase, Calendar, Clock, DollarSign } from "lucide-react"
import { useEffect, useState } from "react"
import Loading from "../Loading"
import { useMainContext } from "../../context/MainContext"

export default function MyEmpStats() {
    const [loading, setLoading] = useState(false)
    const { emp } = useMainContext()
    const [metrics, setMetricsData] = useState(
        {
            completedProjects: 0,
            performanceRating: 4.0,
            activeProjects: 0,
            leavesTaken: 0,
            yearsOfService: 0,
            monthlySalary: 0
        }
    )

    const fetchMetrics = async () => {
        try {
            setLoading(true)

            const response = await fetch(`https://project-management-tool-uh55.onrender.com/dashboard-metrics?emp_id=${emp.emp_id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            })

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`)
            }

            const result = await response.json()

            if (result.success) {
                setMetricsData(result.data)
                setError(null)
            } else {
                throw new Error(result.message || 'Failed to fetch metrics')
            }
        } catch (err) {
            console.error('Error fetching metrics:', err)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchMetrics()
    }, [])

    const formatSalary = (amount) => {
        if (amount >= 100000) {
            return `₹${(amount / 100000).toFixed(1)}L`
        } else if (amount >= 1000) {
            return `₹${(amount / 1000).toFixed(0)}K`
        }
        return `₹${amount}`
    }

    const renderMiniStars = (rating) => {
        const fullStars = Math.floor(rating)
        const stars = []
        for (let i = 0; i < fullStars; i++) {
            stars.push(<Star key={i} className="w-2 h-2 fill-yellow-400 text-yellow-400" />)
        }
        if (rating % 1 !== 0) {
            stars.push(<Star key="half" className="w-2 h-2 fill-yellow-400/50 text-yellow-400" />)
        }
        return stars.slice(0, 5)
    }

    const metricCards = [
        {
            title: "Projects",
            value: metrics.completedProjects,
            icon: <TrendingUp className="w-5 h-5 text-green-600" />,
            color: "text-green-600"
        },
        {
            title: "Rating",
            value: (
                <div className="flex items-center gap-0.5">
                    <span className="text-sm font-bold">{metrics.performanceRating}</span>
                    <div className="flex gap-0.5">
                        {renderMiniStars(metrics.performanceRating)}
                    </div>
                </div>
            ),
            icon: <Star className="w-5 h-5 text-yellow-600" />,
            color: "text-yellow-600"
        },
        {
            title: "Active",
            value: metrics.activeProjects,
            icon: <Briefcase className="w-5 h-5 text-blue-600" />,
            color: "text-blue-600"
        },
        {
            title: "Leaves",
            value: `${metrics.leavesTaken}d`,
            icon: <Calendar className="w-5 h-5 text-orange-600" />,
            color: "text-orange-600"
        },
        {
            title: "Exp",
            value: `${metrics.yearsOfService}y`,
            icon: <Clock className="w-5 h-5 text-purple-600" />,
            color: "text-purple-600"
        },
        {
            title: "Salary",
            value: formatSalary(metrics.monthlySalary),
            icon: <DollarSign className="w-5 h-5 text-emerald-600" />,
            color: "text-emerald-600"
        }
    ]

    return (
        <div className="relative pb-4 flex flex-col items-start h-full w-full md:w-5/12 lg:w-2/5 min-w-[290px]">
            <h1 className="pb-2 pl-2 font-bold text-md ">My Metrics</h1>
            {loading ? (
                <div className="flex items-center justify-center w-full h-full bg-white p-4 rounded-2xl shadow-lg">
                    <Loading />
                </div>
            ) : (
                <div className="grid grid-cols-2 gap-2 w-full h-full bg-white p-4 rounded-2xl shadow-lg">

                    {metricCards.map((metric, index) => (
                        <div
                            key={index}
                            className="bg-gray-50 rounded-md p-2 hover:bg-gray-100 transition-colors duration-200 flex flex-col justify-between min-h-[60px]"
                        >
                            <div className="flex items-center justify-between mb-1">
                                {metric.icon}
                                <div className="text-sm text-gray-600 font-medium">
                                    {metric.title}
                                </div>
                            </div>

                            <div className={`text-md font-bold ${metric.color} leading-tight`}>
                                {metric.value}
                            </div>
                        </div>
                    ))}

                </div>
            )}
        </div>
    )
}