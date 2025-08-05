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
    SquarePercent
} from "lucide-react"
import { useState, useEffect } from "react"
import EmployeeAnalyticsCard from "../components/Analytics/EmployeeAnalyticsCard"
import DepartmentAnalyticsCard from "../components/Analytics/DepartmentAnalyticsCard"
import GoalTrackingCard from "../components/Analytics/GoalTrackingCard"
import ProjectAnalyticsCard from "../components/Analytics/ProjectAnalyticsCard"
import SalesFinanceCard from "../components/Analytics/SalesFinanceCard"
import Loading from "../components/Loading"

export default function Analytics() {
    const [navOpen, setNavOpen] = useState(false)
    const [activeTab, setActiveTab] = useState('overview')
    const [searchTerm, setSearchTerm] = useState('')
    const [loading, setLoading] = useState(false)
    const [employeesData, setEmployeesData] = useState([])
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
        setLoading(true)
        FetchOverviewData()
        FetchDeptData()
        FetchEmpsData()
        setLoading(false)
    }, [])

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
                        percentChange = ((curr - prev) / prev) * 100  // [ change - 1 ]* curr /100
                    }

                    let formattedValue = curr;
                    if (stat.type === 'monthly_completed_project_revenue') {
                        formattedValue = `₹${(curr / 100000).toFixed(1)}L`
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

    const projectsData = [
        {
            id: 'PRJ001',
            name: 'E-commerce Platform',
            department: 'Development',
            status: 'In Progress',
            progress: 75,
            teamSize: 6,
            budget: 150000,
            actualCost: 120000,
            clientSatisfaction: 4.5,
            profitability: 15,
            issues: 3,
            startDate: '2024-01-15',
            dueDate: '2024-04-15',
            roadblocks: ['API Integration Delays', 'Third-party Service Issues']
        },
        {
            id: 'PRJ002',
            name: 'Brand Redesign',
            department: 'Design',
            status: 'Completed',
            progress: 100,
            teamSize: 4,
            budget: 80000,
            actualCost: 75000,
            clientSatisfaction: 4.8,
            profitability: 25,
            issues: 1,
            startDate: '2023-11-01',
            dueDate: '2024-01-31',
            roadblocks: []
        },
        {
            id: 'PRJ003',
            name: 'Sales Campaign',
            department: 'Sales',
            status: 'Delayed',
            progress: 60,
            teamSize: 5,
            budget: 100000,
            actualCost: 85000,
            clientSatisfaction: 4.2,
            profitability: 8,
            issues: 5,
            startDate: '2024-02-01',
            dueDate: '2024-03-31',
            roadblocks: ['Budget Constraints', 'Resource Allocation Issues']
        }
    ]

    const salesData = {
        totalDeals: 45,
        monthlyRevenue: 850000,
        quarterlyGrowth: 12.5,
        costPerClient: 15000,
        revenueTrend: [650000, 720000, 680000, 750000, 820000, 850000],
        topClients: [
            { name: 'TechCorp Inc.', region: 'North', revenue: 250000, projects: 3 },
            { name: 'Global Solutions', region: 'East', revenue: 180000, projects: 2 },
            { name: 'Innovation Labs', region: 'West', revenue: 150000, projects: 4 }
        ],
        salesByRegion: [
            { region: 'North', sales: 320000 },
            { region: 'South', sales: 280000 },
            { region: 'East', sales: 150000 },
            { region: 'West', sales: 100000 }
        ],
        pendingInvoices: 8,
        pendingAmount: 125000,
        pendingClearances: 3
    }

    const goalsData = [
        {
            name: 'Increase Revenue by 25%',
            targetMetric: '₹10M Annual Revenue',
            currentProgress: 68,
            responsibleDepartment: 'Sales',
            deadline: '2024-12-31',
            successProbability: 75,
            milestones: [
                { name: 'Q1 Target', completed: true, dueDate: '2024-03-31' },
                { name: 'Q2 Target', completed: true, dueDate: '2024-06-30' },
                { name: 'Q3 Target', completed: false, dueDate: '2024-09-30' },
                { name: 'Q4 Target', completed: false, dueDate: '2024-12-31' }
            ],
            risks: [
                {
                    description: 'Market Competition',
                    level: 'Medium',
                    mitigation: 'Enhanced marketing strategy and competitive pricing'
                },
                {
                    description: 'Resource Constraints',
                    level: 'Low',
                    mitigation: 'Planned hiring and training programs'
                }
            ]
        },
        {
            name: 'Improve Client Satisfaction',
            targetMetric: '4.8/5 Average Rating',
            currentProgress: 85,
            responsibleDepartment: 'All',
            deadline: '2024-06-30',
            successProbability: 90,
            milestones: [
                { name: 'Feedback System', completed: true, dueDate: '2024-01-31' },
                { name: 'Process Improvement', completed: true, dueDate: '2024-03-31' },
                { name: 'Training Program', completed: false, dueDate: '2024-05-31' }
            ],
            risks: [
                {
                    description: 'Staff Turnover',
                    level: 'Low',
                    mitigation: 'Employee retention programs and competitive benefits'
                }
            ]
        }
    ]

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
                    <div className="max-w-4xl mx-auto">
                        <SalesFinanceCard salesData={salesData} />
                    </div>
                )

            case 'goals':
                return (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {goalsData.map((goal, index) => (
                            <GoalTrackingCard key={index} goal={goal} />
                        ))}
                    </div>
                )

            default:
                return null
        }
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
                                        <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
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

                                    {(activeTab === 'employees' || activeTab === 'projects') && (
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
        </div>
    )

}