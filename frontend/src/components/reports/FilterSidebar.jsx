import { Building, Calendar, CheckCircle, FileText, Filter, X } from "lucide-react"
import { useEffect, useState } from "react"

const FilterSidebar = ({ isOpen, onClose, allReports, onFilterChange }) => {
    const [filters, setFilters] = useState({
        dateRange: {
            startDate: '',
            endDate: ''
        },
        departments: [],
        status: 'all',
        types: []
    })

    const reportTypes = [
        'departmental',
        'project',
        'financial',
        'hr',
        'client',
        'issue',
        'analytics',
        'compliance'
    ]

    const departments = [...new Set(allReports.map(report => report.department))]
    const statusOptions = [
        { value: 'all', label: 'All Status' },
        { value: 'open', label: 'Open' },
        { value: 'closed', label: 'Closed' }
    ]

    useEffect(() => {
        applyFilters()
    }, [filters])

    const applyFilters = () => {
        let filteredReports = [...allReports]

        if (filters.dateRange.startDate || filters.dateRange.endDate) {
            filteredReports = filteredReports.filter(report => {
                const reportDate = new Date(report.uploaded_on)
                const startDate = filters.dateRange.startDate ? new Date(filters.dateRange.startDate) : null
                const endDate = filters.dateRange.endDate ? new Date(filters.dateRange.endDate) : null

                if (startDate && endDate) {
                    return reportDate >= startDate && reportDate <= endDate
                } else if (startDate) {
                    return reportDate >= startDate
                } else if (endDate) {
                    return reportDate <= endDate
                }
                return true
            })
        }

        if (filters.departments.length > 0) {
            filteredReports = filteredReports.filter(report =>
                filters.departments.includes(report.department)
            )
        }

        if (filters.status !== 'all') {
            filteredReports = filteredReports.filter(report => {
                return filters.status === 'open' ? report.is_open : !report.is_open
            })
        }

        if (filters.types.length > 0) {
            filteredReports = filteredReports.filter(report =>
                filters.types.includes(report.type)
            )
        }

        onFilterChange(filteredReports)
    }

    const handleDateChange = (field, value) => {
        setFilters(prev => ({
            ...prev,
            dateRange: {
                ...prev.dateRange,
                [field]: value
            }
        }))
    }

    const handleDepartmentChange = (department) => {
        setFilters(prev => ({
            ...prev,
            departments: prev.departments.includes(department)
                ? prev.departments.filter(d => d !== department)
                : [...prev.departments, department]
        }))
    }

    const handleStatusChange = (status) => {
        setFilters(prev => ({
            ...prev,
            status: status
        }))
    }

    const handleTypeChange = (type) => {
        setFilters(prev => ({
            ...prev,
            types: prev.types.includes(type)
                ? prev.types.filter(t => t !== type)
                : [...prev.types, type]
        }))
    }

    const clearAllFilters = () => {
        setFilters({
            dateRange: {
                startDate: '',
                endDate: ''
            },
            departments: [],
            status: 'all',
            types: []
        })
    }

    const getActiveFilterCount = () => {
        let count = 0
        if (filters.dateRange.startDate || filters.dateRange.endDate) count++
        if (filters.departments.length > 0) count++
        if (filters.status !== 'all') count++
        if (filters.types.length > 0) count++
        return count
    }

    return (
        <>
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
                    onClick={onClose}
                />
            )}

            <div className={`
                        fixed top-0 right-0 h-screen w-80 bg-white shadow-2xl z-50 transform transition-transform duration-300 overflow-y-auto scrollbar-thin
                        ${isOpen ? 'translate-x-0' : 'translate-x-full'}
                    `}>
                <div className="flex items-center justify-between p-6 border-b bg-gradient-to-r from-blue-50 to-purple-50">
                    <div className="flex items-center gap-2">
                        <Filter className="text-blue-600" size={20} />
                        <h2 className="text-lg font-semibold text-gray-800">Filters</h2>
                        {getActiveFilterCount() > 0 && (
                            <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded-full">
                                {getActiveFilterCount()}
                            </span>
                        )}
                    </div>
                    <div className="flex items-center gap-2">
                        {getActiveFilterCount() > 0 && (
                            <button
                                onClick={clearAllFilters}
                                className="text-xs text-gray-500 hover:text-gray-700 underline"
                            >
                                Clear All
                            </button>
                        )}
                        <button
                            onClick={onClose}
                            className="p-1 hover:bg-gray-100 rounded"
                        >
                            <X size={18} />
                        </button>
                    </div>
                </div>
                <div className="p-6 space-y-6">
                    <div className="space-y-3">
                        <div className="flex items-center gap-2">
                            <Calendar className="text-blue-600" size={16} />
                            <h3 className="font-medium text-gray-800">Date Range</h3>
                        </div>
                        <div className="space-y-2">
                            <input
                                type="date"
                                value={filters.dateRange.startDate}
                                onChange={(e) => handleDateChange('startDate', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="Start Date"
                            />
                            <input
                                type="date"
                                value={filters.dateRange.endDate}
                                onChange={(e) => handleDateChange('endDate', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="End Date"
                            />
                        </div>
                    </div>
                    <div className="space-y-3">
                        <div className="flex items-center gap-2">
                            <Building className="text-green-600" size={16} />
                            <h3 className="font-medium text-gray-800">Departments</h3>
                        </div>
                        <div className="space-y-2 max-h-40 overflow-y-auto">
                            {departments.map(department => (
                                <label key={department} className="flex items-center gap-2 cursor-pointer group">
                                    <input
                                        type="checkbox"
                                        checked={filters.departments.includes(department)}
                                        onChange={() => handleDepartmentChange(department)}
                                        className="w-4 h-4 text-green-600 bg-gray-100 border-gray-300 rounded focus:ring-green-500"
                                    />
                                    <span className="text-sm text-gray-700 group-hover:text-gray-900">
                                        {department}
                                    </span>
                                </label>
                            ))}
                        </div>
                    </div>
                    <div className="space-y-3">
                        <div className="flex items-center gap-2">
                            <CheckCircle className="text-purple-600" size={16} />
                            <h3 className="font-medium text-gray-800">Status</h3>
                        </div>
                        <div className="space-y-2">
                            {statusOptions.map(option => (
                                <label key={option.value} className="flex items-center gap-2 cursor-pointer group">
                                    <input
                                        type="radio"
                                        name="status"
                                        value={option.value}
                                        checked={filters.status === option.value}
                                        onChange={(e) => handleStatusChange(e.target.value)}
                                        className="w-4 h-4 text-purple-600 bg-gray-100 border-gray-300 focus:ring-purple-500"
                                    />
                                    <span className="text-sm text-gray-700 group-hover:text-gray-900">
                                        {option.label}
                                    </span>
                                </label>
                            ))}
                        </div>
                    </div>
                    <div className="space-y-3">
                        <div className="flex items-center gap-2">
                            <FileText className="text-orange-600" size={16} />
                            <h3 className="font-medium text-gray-800">Report Types</h3>
                        </div>
                        <div className="space-y-2 max-h-48 overflow-y-auto scrollbar-thin">
                            {reportTypes.map(type => (
                                <label key={type} className="flex items-center gap-2 cursor-pointer group">
                                    <input
                                        type="checkbox"
                                        checked={filters.types.includes(type)}
                                        onChange={() => handleTypeChange(type)}
                                        className="w-4 h-4 text-orange-600 bg-gray-100 border-gray-300 rounded focus:ring-orange-500"
                                    />
                                    <span className="text-sm text-gray-700 group-hover:text-gray-900 capitalize">
                                        {type}
                                    </span>
                                </label>
                            ))}
                        </div>
                    </div>
                </div>
                <div className="border-t p-4 bg-gray-50">
                    <div className="text-xs text-gray-600 text-center">
                        Showing filtered results • {getActiveFilterCount()} active filters
                    </div>
                </div>
            </div>
        </>
    )
}

export default FilterSidebar