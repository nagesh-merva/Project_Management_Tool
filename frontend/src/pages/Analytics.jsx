import Navigation from "../components/Navigation/Navigation"
import Header from "../components/header"
import {
    Menu,
    X, BarChart3,
    Users,
    Building,
    FolderOpen,
    DollarSign,
    Target,
    Search,
    Download,
    RefreshCw,
    TrendingUp,
    CheckCircle,
    Award,
    AlertTriangle,
    Hammer,
    SquarePercent,
    Plus,
    Filter,
} from "lucide-react"
import { useState, useEffect } from "react"
import EmployeeAnalyticsCard from "../components/Analytics/EmployeeAnalyticsCard"
import DepartmentAnalyticsCard from "../components/Analytics/DepartmentAnalyticsCard"
import GoalTrackingCard from "../components/Analytics/GoalTrackingCard"
import CreateGoalModal from "../components/Analytics/Goals/CreateGoalModel"
import ProjectAnalyticsCard from "../components/Analytics/ProjectAnalyticsCard"
import SalesFinanceCard from "../components/Analytics/SalesFinanceCard"
import Loading from "../components/Loading"
import { useMainContext } from "../context/MainContext"

export default function Analytics() {
    const [navOpen, setNavOpen] = useState(false)
    const { activeTab, setActiveTab } = useMainContext()
    const [searchTerm, setSearchTerm] = useState('')
    const [loading, setLoading] = useState(false)
    const [employeesData, setEmployeesData] = useState([])
    const [salesData, setSalesData] = useState({})
    const [projectsData, setProjectsData] = useState([])
    const [goalsData, setGoalsData] = useState([])
    const [goalsDashboard, setGoalsDashboard] = useState({})
    const [goalsLoading, setGoalsLoading] = useState(false)
    const [showCreateGoalModal, setShowCreateGoalModal] = useState(false)
    const [goalsFilter, setGoalsFilter] = useState({
        category: '',
        department: '',
        status: ''
    })

    const [departmentsData, setDepartmentsData] = useState([
        {
            id: "SALES",
            icon: TrendingUp,
            color: 'bg-green-500',
        },
        {
            id: "DEV",
            icon: Building,
            color: 'bg-orange-500',
        },
        {
            id: "DESIGN",
            icon: Award,
            color: 'bg-purple-500',
        },
        {
            id: "MAINTENANCE",
            icon: Hammer,
            color: 'bg-red-500'
        },
        {
            id: "ADMIN",
            icon: SquarePercent,
            color: 'bg-blue-500'
        }
    ])
    const [overviewStats, setOverviewStats] = useState([
        {
            title: 'Total Employees',
            type: "total_employees",
            value: null,
            icon: Users,
            color: 'blue',
            change: null,
            preValue: null
        },
        {
            title: 'Active Projects',
            type: "active_projects",
            value: null,
            icon: FolderOpen,
            color: 'green',
            change: null,
            preValue: null
        },
        {
            title: 'Monthly Revenue',
            type: "monthly_completed_project_revenue",
            value: null,
            icon: DollarSign,
            color: 'purple',
            change: null,
            preValue: null
        },
        {
            title: 'Avg Performance',
            type: "total_emp_performance",
            value: null,
            icon: Award,
            color: 'orange',
            change: null,
            preValue: null
        }
    ])

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true)
            await Promise.all([
                FetchOverviewData(),
                FetchDeptData(),
                FetchEmpsData(),
                FetchSalesData(),
                FetchProjectsData()
            ])
            setLoading(false)
        }
        fetchData()
    }, [])

    useEffect(() => {
        if (activeTab === 'goals') {
            FetchGoalsData()
            FetchGoalsDashboard()
        }
    }, [activeTab, goalsFilter])

    const formatCurrency = (amount) => {
        if (amount >= 10000000) return `₹${(amount / 10000000).toFixed(1)}Cr`
        if (amount >= 100000) return `₹${(amount / 100000).toFixed(1)}L`
        if (amount >= 1000) return `₹${(amount / 1000).toFixed(1)}K`
        return `₹${amount.toLocaleString()}`
    }

    const FetchOverviewData = async () => {
        try {
            const response = await fetch("http://127.0.0.1:8000/overview-analytics-data", {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
            })

            const data = await response.json()

            if (response.status === 200 || response.status === 201) {
                const updatedStats = overviewStats.map(stat => {
                    const metric = data[stat.type]
                    if (!metric) return stat

                    const prev = metric.previous_value
                    const curr = metric.current_value

                    let percentChange = 0;
                    if (typeof prev === 'number' && prev !== 0) {
                        percentChange = ((curr - prev) / prev) * 100
                    }

                    let formattedValue = curr;
                    if (stat.type === 'monthly_completed_project_revenue') {
                        formattedValue = formatCurrency(curr)
                    } else if (stat.type === 'total_emp_performance') {
                        formattedValue = `${curr.toFixed(1)}/5`
                    }

                    return {
                        ...stat,
                        value: formattedValue,
                        change: `${percentChange >= 0 ? '+' : ''}${percentChange.toFixed(1)}%`,
                        preValue: prev
                    }
                })

                setOverviewStats(updatedStats)
            }
        } catch (err) {
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    const FetchDeptData = async () => {
        try {
            const response = await fetch("http://127.0.0.1:8000/dept-performance-analytics", {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
            })

            const data = await response.json()

            if (response.status === 200 || response.status === 201) {
                const mergedData = departmentsData.map(dept => {
                    const stat = data.find(s => s.id === dept.id || s.name?.toUpperCase().includes(dept.id))
                    return stat ? { ...dept, ...stat } : dept
                })

                setDepartmentsData(mergedData)
            }
        } catch (err) {
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    const FetchEmpsData = async () => {
        try {
            const response = await fetch("http://127.0.0.1:8000/employee-analytics", {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
            })

            const data = await response.json()

            if (response.status === 200 || response.status === 201) {
                setEmployeesData(data)
            }
        } catch (err) {
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    const FetchSalesData = async () => {
        try {
            const response = await fetch("http://127.0.0.1:8000/analytics-sales-finance", {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
            })

            const data = await response.json()

            if (response.status === 200 || response.status === 201) {
                setSalesData(data)
            }
        } catch (err) {
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    const FetchProjectsData = async () => {
        try {
            const response = await fetch("http://127.0.0.1:8000/analytics-projects-data", {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
            })

            const data = await response.json()

            if (response.status === 200 || response.status === 201) {
                setProjectsData(data.projectsData)
            }
        } catch (err) {
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    const FetchGoalsData = async () => {
        try {
            setGoalsLoading(true)
            const queryParams = new URLSearchParams()

            if (goalsFilter.category) queryParams.append('category', goalsFilter.category)
            if (goalsFilter.department) queryParams.append('department', goalsFilter.department)
            if (goalsFilter.status) queryParams.append('status', goalsFilter.status)
            queryParams.append('limit', '50')

            const response = await fetch(`http://127.0.0.1:8000/goals/?${queryParams}`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
            })

            if (response.ok) {
                const data = await response.json()
                // console.log(data)
                setGoalsData(data)
            } else {
                console.error('Failed to fetch goals:', response.statusText)
            }
        } catch (err) {
            console.error('Error fetching goals:', err)
        } finally {
            setGoalsLoading(false)
        }
    }

    const FetchGoalsDashboard = async () => {
        try {
            const response = await fetch("http://127.0.0.1:8000/goals/analytics/dashboard", {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
            })

            if (response.ok) {
                const data = await response.json()
                // console.log(data)
                setGoalsDashboard(data)
            } else {
                console.error('Failed to fetch goals dashboard:', response.statusText)
            }
        } catch (err) {
            console.error('Error fetching goals dashboard:', err)
        }
    }

    const handleGoalCreated = (newGoal) => {
        alert('Goal created successfully :', newGoal.name)
        FetchGoalsData()
        FetchGoalsDashboard()
    }


    const handleGoalFilterChange = (filterType, value) => {
        setGoalsFilter(prev => ({
            ...prev,
            [filterType]: value
        }))
    }

    const clearGoalsFilters = () => {
        setGoalsFilter({
            category: '',
            department: '',
            status: ''
        })
    }

    const tabs = [
        { id: 'overview', label: 'Overview', icon: BarChart3 },
        { id: 'employees', label: 'Employees', icon: Users },
        { id: 'departments', label: 'Departments', icon: Building },
        { id: 'projects', label: 'Projects', icon: FolderOpen },
        { id: 'sales', label: 'Sales & Finance', icon: DollarSign },
        { id: 'goals', label: 'Goals', icon: Target }
    ]

    const filteredEmployees = employeesData.filter(emp =>
        emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.department.toLowerCase().includes(searchTerm.toLowerCase())
    )

    const filteredGoals = goalsData.filter(goal =>
        goal.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        goal.responsible_department.toLowerCase().includes(searchTerm.toLowerCase())
    )

    const renderGoalsDashboardStats = () => {
        if (!goalsDashboard.overall_stats) return null

        const stats = goalsDashboard.overall_stats
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
                <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Total Goals</p>
                            <p className="text-2xl font-bold text-gray-900">{stats.total_goals}</p>
                        </div>
                        <Target className="text-blue-600" size={24} />
                    </div>
                </div>

                <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Active Goals</p>
                            <p className="text-2xl font-bold text-green-600">{stats.active_goals}</p>
                        </div>
                        <TrendingUp className="text-green-600" size={24} />
                    </div>
                </div>

                <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Completed</p>
                            <p className="text-2xl font-bold text-blue-600">{stats.completed_goals}</p>
                        </div>
                        <CheckCircle className="text-blue-600" size={24} />
                    </div>
                </div>

                <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Avg Progress</p>
                            <p className="text-2xl font-bold text-purple-600">{stats.avg_progress?.toFixed(1)}%</p>
                        </div>
                        <BarChart3 className="text-purple-600" size={24} />
                    </div>
                </div>

                <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Success Rate</p>
                            <p className="text-2xl font-bold text-orange-600">{stats.avg_success_probability?.toFixed(1)}%</p>
                        </div>
                        <Award className="text-orange-600" size={24} />
                    </div>
                </div>
            </div>
        )
    }

    const renderGoalsFilters = () => (
        <div className="flex flex-wrap items-center gap-4 mb-4 p-4 bg-white rounded-lg border border-gray-200">
            <div className="flex items-center gap-2">
                <Filter className="text-gray-600" size={16} />
                <span className="text-sm font-medium text-gray-700">Filters:</span>
            </div>

            <select
                value={goalsFilter.category}
                onChange={(e) => handleGoalFilterChange('category', e.target.value)}
                className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
                <option value="">All Categories</option>
                <option value="yearly">Yearly</option>
                <option value="6months">6 Months</option>
                <option value="quarterly">Quarterly</option>
            </select>

            <select
                value={goalsFilter.department}
                onChange={(e) => handleGoalFilterChange('department', e.target.value)}
                className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
                <option value="">All Departments</option>
                <option value="SALES">Sales</option>
                <option value="DESIGN">Design</option>
                <option value="DEV">Development</option>
                <option value="Maintenance">Maintenance</option>
                <option value="ADMIN">Company</option>
            </select>

            <select
                value={goalsFilter.status}
                onChange={(e) => handleGoalFilterChange('status', e.target.value)}
                className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
                <option value="">All Status</option>
                <option value="active">Active</option>
                <option value="completed">Completed</option>
                <option value="paused">Paused</option>
                <option value="cancelled">Cancelled</option>
            </select>

            <button
                onClick={clearGoalsFilters}
                className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800 underline"
            >
                Clear All
            </button>

            <div className="ml-auto">
                <button
                    onClick={() => {
                        setShowCreateGoalModal(true)
                    }}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                    <Plus size={16} />
                    New Goal
                </button>
            </div>
        </div>
    )

    const renderTabContent = () => {
        switch (activeTab) {
            case 'overview':
                return (
                    <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {overviewStats?.map((stat, index) => (
                                <div key={index} className="relative group bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                                    <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                                        last month we had {stat.preValue}
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm font-medium text-gray-600 mb-1">{stat.title}</p>
                                            <p className="text-2xl font-bold text-gray-900">{stat?.value}</p>
                                        </div>
                                        <div className={`w-12 h-12 rounded-lg bg-${stat.color}-100 flex items-center justify-center`}>
                                            <stat.icon className={`text-${stat.color}-600`} size={24} />
                                        </div>
                                    </div>
                                    <div className="mt-4 flex items-center">
                                        <span className={`text-sm font-medium ${stat.change?.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                                            {stat?.change}
                                        </span>
                                        <span className="text-sm text-gray-500 ml-2">vs last month</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Department Performance</h3>
                                <div className="space-y-3">
                                    {departmentsData.map((dept, index) => (
                                        <div key={index} className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className={`w-8 h-8 rounded-lg ${dept.color} flex items-center justify-center`}>
                                                    <dept.icon className="text-white" size={16} />
                                                </div>
                                                <span className="font-medium text-gray-900">{dept.name ? dept.name : dept.id}</span>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-bold text-gray-900">{dept.performanceScore}/5</p>
                                                <p className="text-xs text-gray-600">{dept.totalEmployees} employees</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
                                <div className="space-y-3">
                                    <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                                        <CheckCircle className="text-green-600" size={16} />
                                        <div>
                                            <p className="text-sm font-medium text-gray-900">Project Completed</p>
                                            <p className="text-xs text-gray-600">Brand Redesign finished ahead of schedule</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                                        <Users className="text-blue-600" size={16} />
                                        <div>
                                            <p className="text-sm font-medium text-gray-900">New Employee</p>
                                            <p className="text-xs text-gray-600">Alex Johnson joined Development team</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 p-3 bg-yellow-50 rounded-lg">
                                        <AlertTriangle className="text-yellow-600" size={16} />
                                        <div>
                                            <p className="text-sm font-medium text-gray-900">Deadline Alert</p>
                                            <p className="text-xs text-gray-600">Sales Campaign due in 5 days</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )

            case 'employees':
                return (
                    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                        {filteredEmployees.map((employee) => (
                            <EmployeeAnalyticsCard key={employee.id} employee={employee} />
                        ))}
                    </div>
                )

            case 'departments':
                return (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {departmentsData.map((department, index) => (
                            <DepartmentAnalyticsCard key={index} department={department} />
                        ))}
                    </div>
                )

            case 'projects':
                return (
                    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                        {projectsData.map((project) => (
                            <ProjectAnalyticsCard key={project.id} project={project} />
                        ))}
                    </div>
                )

            case 'sales':
                return (
                    <div className="max-w-7xl mx-auto">
                        <SalesFinanceCard salesData={salesData} />
                    </div>
                )

            case 'goals':
                return (
                    <div className="space-y-6">
                        {renderGoalsDashboardStats()}
                        {renderGoalsFilters()}

                        {goalsLoading ? (
                            <div className="flex justify-center py-8">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                            </div>
                        ) : (
                            <>
                                {filteredGoals.length === 0 ? (
                                    <div className="text-center py-8">
                                        <Target className="mx-auto text-gray-400 mb-4" size={48} />
                                        <p className="text-gray-500">No goals found matching your criteria</p>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                        {filteredGoals.map((goal) => (
                                            <GoalTrackingCard key={goal.id} goal={goal} />
                                        ))}
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                )

            default:
                return null
        }
    }

    if (loading) {
        return (
            <div className="relative h-full min-h-screen w-full flex flex-col bg-gray-100 min-w-[800px]">
                <button
                    className="fixed top-4 left-4 z-50 md:hidden bg-white p-2 rounded shadow"
                    onClick={() => setNavOpen(!navOpen)}
                    aria-label="Toggle navigation"
                >
                    {navOpen ? <X size={32} /> : <Menu size={32} />}
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
                    <div className="md:px-10 w-full h-full min-h-svh">
                        <Loading />
                    </div>
                </div>
            </div>
        )
    }
    return (
        <div className="relative h-full min-h-screen w-full flex flex-col bg-gray-100 min-w-[800px]">
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
                    md:fixed md:top-0 md:left-0 md:h-full md:w-[13%] md:z-40 md:translate-x-0  md:block
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
                {loading ? (
                    <Loading />
                ) : (<>
                    <div className="md:px-10 w-full h-full min-h-svh">
                        <div className="p-8">
                            <div className="mb-8">
                                <div className="flex items-center justify-between mb-6">
                                    <div>
                                        <h1 className="text-3xl font-bold text-gray-900 mb-2">Analytics Dashboard</h1>
                                        <p className="text-gray-600">
                                            Comprehensive insights into employee performance, projects, and business metrics
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                                            <Download size={16} />
                                            Export
                                        </button>
                                        <button onClick={() => window.location.reload()} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                                            <RefreshCw size={16} />
                                            Refresh
                                        </button>
                                    </div>
                                </div>
                                <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
                                    <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg overflow-x-auto">
                                        {tabs.map((tab) => (
                                            <button
                                                key={tab.id}
                                                onClick={() => setActiveTab(tab.id)}
                                                className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors whitespace-nowrap ${activeTab === tab.id
                                                    ? 'bg-white text-blue-600 shadow-sm'
                                                    : 'text-gray-600 hover:text-gray-900'
                                                    }`}
                                            >
                                                <tab.icon size={16} />
                                                {tab.label}
                                            </button>
                                        ))}
                                    </div>

                                    {(activeTab === 'employees' || activeTab === 'projects' || activeTab === 'goals') && (
                                        <div className="relative">
                                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                                            <input
                                                type="text"
                                                placeholder={`Search ${activeTab}...`}
                                                value={searchTerm}
                                                onChange={(e) => setSearchTerm(e.target.value)}
                                                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                                            />
                                        </div>
                                    )}
                                </div>
                            </div>
                            {renderTabContent()}
                        </div>
                    </div>
                </>)}
            </div>
            {showCreateGoalModal && (
                <CreateGoalModal 
                    isOpen={showCreateGoalModal}
                    onClose={() => setShowCreateGoalModal(false)}
                    onGoalCreated={handleGoalCreated}
                />
            )}
        </div>
    )

}