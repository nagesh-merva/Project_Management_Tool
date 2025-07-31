import React, { useState, useEffect } from 'react'
import {
    User,
    Mail,
    Phone,
    MapPin,
    Calendar,
    DollarSign,
    TrendingUp,
    Award,
    Clock,
    Briefcase,
    Building,
    UserCheck,
    Target,
    FileText
} from 'lucide-react'

import EmployeeHeader from './EmployeeHeader'
import DynamicSection from './DynamicSection'
import SalaryAccountManager from './SalaryAccountManager'
import NotificationToast from '../NotificationToast'
import PopupForm from '../Home/PopUpForm'

const EmployeeDetails = ({ emp }) => {
    const [notifications, setNotifications] = useState([])
    const [employeeData, setEmployeeData] = useState(emp)
    const [showDocPopup, setShowDocPopup] = useState(false);

    React.useEffect(() => {
        setEmployeeData(emp)
    }, [emp])

    const showNotification = (message, type = 'success') => {
        const id = Date.now();
        setNotifications(prev => [...prev, { id, message, type }])
    }

    const removeNotification = (id) => {
        setNotifications(prev => prev.filter(n => n.id !== id))
    }

    useEffect(() => {
        notifications.forEach(notification => {
            setTimeout(() => {
                removeNotification(notification.id)
            }, 5000)
        })
    }, [notifications])

    const updateEmployee = async (empId, updateData) => {
        if ('emp_id' in updateData) {
            delete updateData.emp_id;
        }
        try {
            const response = await fetch(`http://127.0.0.1:8000/employee/update?emp_id=${empId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updateData),
            });

            if (!response.ok) {
                throw new Error('Failed to update employee information');
            }

            return await response.json();
        } catch (error) {
            console.error('Error updating employee info:', error);
            throw error;
        }
    }

    const handleUpdate = async (section, data) => {
        try {
            switch (section) {
                case 'personal':
                    await updateEmployee(employeeData.emp_id, data);
                    break;
                case 'job':
                    await updateEmployee(employeeData.emp_id, data);
                    break;
                case 'financial':
                    if (data.salary_monthly !== undefined) {
                        await updateEmployee(employeeData.emp_id, { salary_monthly: data.salary_monthly });
                    }
                    if (data.bonus !== undefined) {
                        await updateEmployee(employeeData.emp_id, { bonus: data.bonus });
                    }
                    break;
                case 'performance':
                    await updateEmployee(employeeData.emp_id, { performance_metrics: data });
                    break;
                case 'leaves':
                    await updateEmployee(employeeData.emp_id, data);
                    break;
                case 'salary_account':
                    await updateEmployee(employeeData.emp_id, {
                        salary_account: [...employeeData.salary_account, data]
                    });
                    break;
                case 'delete_salary_record':
                    // Handle salary record deletion
                    break;
                default:
                    break;
            }

            // Update local state
            setEmployeeData(prev => ({
                ...prev,
                ...data,
                performance_metrics: section === 'performance' ? { ...prev.performance_metrics, ...data } : prev.performance_metrics
            }))

            showNotification(`${section} updated successfully!`, 'success')
        } catch (error) {
            showNotification(`Failed to update ${section}`, 'error')
            throw error;
        }
    }

    // const handleSalaryIncrement = (percentage) => {
    //     return (
    //         <div className="flex gap-1 ml-2">
    //             <button
    //                 onClick={() => {
    //                     const newSalary = employeeData.salary_monthly * (1 + percentage / 100);
    //                     handleUpdate('financial', { salary_monthly: newSalary });
    //                 }}
    //                 className="px-2 py-1 bg-green-100 text-green-700 rounded text-sm hover:bg-green-200 transition-colors"
    //             >
    //                 +{percentage}%
    //             </button>
    //         </div>
    //     )
    // }

    const personalFields = [
        {
            name: 'email',
            label: 'Email',
            type: 'email',
            icon: Mail,
            placeholder: 'Enter email address'
        },
        {
            name: 'contact',
            label: 'Phone',
            type: 'tel',
            icon: Phone,
            placeholder: 'Enter phone number'
        },
        {
            name: 'address',
            label: 'Address',
            type: 'textarea',
            icon: MapPin,
            placeholder: 'Enter address',
            rows: 2
        },
        {
            name: 'joined_on',
            label: 'Joined',
            type: 'display',
            icon: Calendar,
            format: (value) => new Date(value).toLocaleDateString()
        },
        {
            name: 'hired_by',
            label: 'Hired by',
            type: 'display',
            icon: UserCheck
        }
    ]

    const jobFields = [
        {
            name: 'emp_dept',
            label: 'Department',
            type: 'display',
            icon: Building
        },
        {
            name: 'role',
            label: 'Role',
            type: 'text',
            icon: Award,
            placeholder: 'Enter role'
        },
        {
            name: 'status',
            label: 'Status',
            type: 'select',
            options: [
                { value: 'Active', label: 'Active' },
                { value: 'On Leave', label: 'On Leave' },
                { value: 'Resigned', label: 'Resigned' }
            ]
        }
    ]

    const financialFields = [
        {
            name: 'salary_monthly',
            label: 'Monthly Salary',
            type: 'number',
            format: (value) => `₹${value}`,
            specialAction: (
                <div className="flex gap-1">
                    {[5, 10, 15].map(percentage => (
                        <button
                            key={percentage}
                            onClick={() => {
                                const newSalary = employeeData.salary_monthly * (1 + percentage / 100);
                                handleUpdate('financial', { salary_monthly: newSalary });
                            }}
                            className="px-2 py-1 bg-green-100 text-green-700 rounded text-sm hover:bg-green-200 transition-colors"
                        >
                            +{percentage}%
                        </button>
                    ))}
                </div>
            )
        },
        {
            name: 'bonus',
            label: 'Current Bonus',
            type: 'number',
            format: (value) => `₹${value}`
        },
        {
            name: 'total_compensation',
            label: 'Total Compensation',
            type: 'display',
            format: () => `₹${(employeeData.salary_monthly + employeeData.bonus).toLocaleString()}`,
            className: 'text-lg font-bold text-green-700'
        }
    ]

    const performanceFields = [
        {
            name: 'completed_projects',
            label: 'Completed Projects',
            type: 'display',
            nested: 'performance_metrics',
            className: 'text-lg font-semibold text-purple-600'
        },
        {
            name: 'ratings',
            label: 'Rating',
            type: 'rating',
            nested: 'performance_metrics'
        },
        {
            name: 'remarks',
            label: 'Remarks',
            type: 'textarea',
            nested: 'performance_metrics',
            placeholder: 'Add performance remarks...',
            rows: 3
        }
    ]

    const leaveFields = [
        {
            name: 'leaves_taken',
            label: 'Leaves Taken',
            type: 'number',
            format: (value) => `${value} days`,
            min: 0,
            max: 365
        },
        {
            name: 'remaining_leave',
            label: 'Remaining Leave',
            type: 'display',
            format: () => `${Math.max(0, 30 - employeeData.leaves_taken)} days`,
            className: 'text-lg font-semibold text-green-600'
        }
    ]

    console.log(employeeData.emp_documents)

    const empDocumentsFields = [
        {
            name: 'emp_documents',
            label: 'Employee Documents',
            type: 'documents',
            render: (docs) => (
                <div className="space-y-3">
                    {docs && docs.length > 0 ? docs.map((doc, idx) => (
                        <a
                            key={idx}
                            href={doc.doc_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                        >
                            <div className="flex flex-col">
                                <span className="font-medium">{doc.doc_name}</span>
                                <span className="font-thin text-xs">{doc.doc_type}</span>
                            </div>
                            <span className="text-sm text-gray-500">{doc.uploaded_at?.split("T")[0]}</span>
                        </a>
                    )) : (
                        <div className="text-gray-500 text-sm text-center mt-4">
                            No documents available
                        </div>
                    )}
                </div>
            )
        }
    ]

    const empDocumentFields = [
        { name: "emp_id", type: "stored", value: employeeData.emp_id },
        { name: "file", type: "file", optional: false }
    ]

    if (!employeeData) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading employee details...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen w-full bg-gray-50 py-8 px-4">
            <NotificationToast
                notifications={notifications}
                onRemove={removeNotification}
            />

            <div className="max-w-6xl mx-auto">
                <EmployeeHeader emp={employeeData} />

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <DynamicSection
                        title="Personal Information"
                        icon={User}
                        data={employeeData}
                        fields={personalFields}
                        onUpdate={(data) => handleUpdate('personal', data)}
                        colorScheme="blue"
                    />

                    <DynamicSection
                        title="Job Information"
                        icon={Briefcase}
                        data={employeeData}
                        fields={jobFields}
                        onUpdate={(data) => handleUpdate('job', data)}
                        colorScheme="blue"
                    />

                    <DynamicSection
                        title="Financial Information"
                        icon={DollarSign}
                        data={employeeData}
                        fields={financialFields}
                        onUpdate={(data) => handleUpdate('financial', data)}
                        colorScheme="green"
                    />
                    <DynamicSection
                        title="Performance Metrics"
                        icon={TrendingUp}
                        data={employeeData}
                        fields={performanceFields}
                        onUpdate={(data) => handleUpdate('performance', data)}
                        colorScheme="purple"
                    />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
                    <div className="bg-white rounded-xl shadow-sm p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                                <Target className="text-blue-600" size={24} />
                                Current Projects
                            </h2>

                        </div>

                        <div className="space-y-3">
                            {employeeData.current_projects && employeeData.current_projects.length > 0 ? (
                                employeeData.current_projects.map((project, index) => (
                                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                        <span className="font-medium text-gray-900">{project.project_name}</span>
                                        <span className='font-thin text-xs px-2 py-0.5 rounded-full bg-blue-200 text-center'>{project.client_name}</span>
                                    </div>
                                ))
                            ) : (
                                <p className="text-gray-500 text-center py-4">No current projects assigned</p>
                            )}
                        </div>
                    </div>

                    <DynamicSection
                        title="Leave Management"
                        icon={Clock}
                        data={employeeData}
                        fields={leaveFields}
                        onUpdate={(data) => handleUpdate('leaves', data)}
                        colorScheme="orange"
                        specialActions={
                            <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                                <div
                                    className="bg-orange-500 h-2 rounded-full transition-all duration-300"
                                    style={{ width: `${(employeeData.leaves_taken / 30) * 100}%` }}
                                ></div>
                            </div>
                        }
                    />
                    <div>
                        <DynamicSection
                            title="Employee Documents"
                            icon={FileText}
                            data={employeeData}
                            onUpdate={() => setShowDocPopup(true)}
                            isDocument={true}
                            fields={empDocumentsFields}
                            colorScheme="orange"
                        />
                    </div>
                </div>

                <div className="mt-6">
                    <SalaryAccountManager
                        employee={employeeData}
                        onUpdate={(section, data) => handleUpdate(section, data)}
                    />
                </div>
            </div>
            <PopupForm
                isVisible={showDocPopup}
                onClose={() => setShowDocPopup(false)}
                formTitle="Upload Employee Document"
                endpoint="http://127.0.0.1:8000/add-emp-documents"
                fields={empDocumentFields}
                onSuccess={() => {
                    setShowDocPopup(false);
                }}
            />
        </div>
    )
}

export default EmployeeDetails