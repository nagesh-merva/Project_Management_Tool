import { useState, useEffect } from 'react'
import { Edit2, Save, X, Plus } from 'lucide-react'
import { useMainContext } from '../../context/MainContext';

const DynamicSection = ({
    title,
    icon: Icon,
    data,
    fields,
    isUpdatable = true,
    onUpdate,
    colorScheme = 'blue',
    isDocument,
    specialActions = null
}) => {
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({});
    const [loading, setLoading] = useState(false);
    const { emp } = useMainContext()

    const isAdmin = () => {
        try {
            return emp.role === 'admin' || emp.emp_dept === 'ADMIN'
        } catch {
            return false
        }
    }

    const canEdit = isUpdatable && isAdmin()

    useEffect(() => {
        const initialData = {};
        fields.forEach(field => {
            if (field.nested) {
                initialData[field.name] = data[field.nested]?.[field.name] || field.defaultValue || ''
            } else {
                initialData[field.name] = data[field.name] || field.defaultValue || ''
            }
        })
        setFormData(initialData)
    }, [data, fields])

    const colorSchemes = {
        blue: {
            icon: 'text-blue-600',
            button: 'bg-blue-600 hover:bg-blue-700',
            focus: 'focus:ring-blue-500 focus:border-blue-500',
            hover: 'hover:text-blue-600'
        },
        green: {
            icon: 'text-green-600',
            button: 'bg-green-600 hover:bg-green-700',
            focus: 'focus:ring-green-500 focus:border-green-500',
            hover: 'hover:text-green-600'
        },
        purple: {
            icon: 'text-purple-600',
            button: 'bg-purple-600 hover:bg-purple-700',
            focus: 'focus:ring-purple-500 focus:border-purple-500',
            hover: 'hover:text-purple-600'
        },
        orange: {
            icon: 'text-orange-600',
            button: 'bg-orange-600 hover:bg-orange-700',
            focus: 'focus:ring-orange-500 focus:border-orange-500',
            hover: 'hover:text-orange-600'
        }
    }

    const colors = colorSchemes[colorScheme]

    const handleEdit = () => {
        setIsEditing(true)
    }

    const handleCancel = () => {
        setIsEditing(false)
        const initialData = {}
        fields.forEach(field => {
            if (field.nested) {
                initialData[field.name] = data[field.nested]?.[field.name] || field.defaultValue || ''
            } else {
                initialData[field.name] = data[field.name] || field.defaultValue || ''
            }
        })
        setFormData(initialData)
    }

    const handleSave = async () => {
        setLoading(true)

        const filteredData = {}
        fields.forEach(field => {
            if (field.type !== 'display') {
                filteredData[field.name] = formData[field.name]
            }
        })
        console.log(filteredData)
        try {
            await onUpdate(filteredData)
            setIsEditing(false)
        } catch (error) {
            console.error('Update failed:', error)
        } finally {
            setLoading(false)
        }
    }

    const newDocUpload = () => {
        onUpdate()
        return
    }

    const handleInputChange = (fieldName, value) => {
        const field = fields.find(f => f.name === fieldName);
        if (field && field.nested) {
            setFormData(prev => ({ ...prev, [fieldName]: value }))
        } else {
            setFormData(prev => ({ ...prev, [fieldName]: value }))
        }
    }

    const renderField = (field) => {
        const value = field.nested ? data[field.nested]?.[field.name] : data[field.name]
        const formValue = formData[field.name]

        switch (field.type) {
            case 'text':
            case 'email':
            case 'tel':
                return isEditing ? (
                    <input
                        type={field.type}
                        value={formValue || ''}
                        onChange={(e) => handleInputChange(field.name, e.target.value)}
                        className={`flex-1 px-3 py-2 border border-gray-300 rounded-lg ${colors.focus}`}
                        placeholder={field.placeholder}
                    />
                ) : (
                    <span className="text-gray-700">{value || 'Not provided'}</span>
                )

            case 'textarea':
                return isEditing ? (
                    <textarea
                        value={formValue || ''}
                        onChange={(e) => handleInputChange(field.name, e.target.value)}
                        className={`w-full px-3 py-2 border border-gray-300 rounded-lg ${colors.focus} resize-none`}
                        rows={field.rows || 2}
                        placeholder={field.placeholder}
                    />
                ) : (
                    <p className="text-gray-700 bg-gray-50 p-3 rounded-lg">
                        {value || 'No information provided'}
                    </p>
                );

            case 'number':
                return isEditing ? (
                    <input
                        type="number"
                        value={formValue || ''}
                        onChange={(e) => handleInputChange(field.name, parseFloat(e.target.value) || 0)}
                        className={`w-32 px-3 py-2 border border-gray-300 rounded-lg ${colors.focus}`}
                        min={field.min}
                        max={field.max}
                        step={field.step}
                    />
                ) : (
                    <span className={`text-lg font-semibold ${colors.icon}`}>
                        {field.format ? field.format(value) : value}
                    </span>
                )

            case 'select':
                return isEditing ? (
                    <select
                        value={formValue || ''}
                        onChange={(e) => handleInputChange(field.name, e.target.value)}
                        className={`w-full px-3 py-2 border border-gray-300 rounded-lg ${colors.focus}`}
                    >
                        {field.options.map(option => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                ) : (
                    <span className="text-gray-700">{value}</span>
                )

            case 'display':
                return (
                    <span className={field.className || 'text-gray-700'}>
                        {field.format ? field.format(value) : value}
                    </span>
                )

            case 'rating':
                return (
                    <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                            <span
                                key={i}
                                className={`text-lg ${i < Math.floor(value) ? 'text-yellow-400' : 'text-gray-300'}`}
                            >
                                ★
                            </span>
                        ))}
                        <span className="ml-2 text-sm text-gray-600">{value}/5</span>
                    </div>
                )

            default:
                return <span className="text-gray-700">{value}</span>;
        }
    }

    return (
        <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                    <Icon className={colors.icon} size={24} />
                    {title}
                </h2>
                {canEdit && (
                    <button
                        onClick={isEditing ? handleCancel : handleEdit}
                        className={`p-2 text-gray-500 ${colors.hover} transition-colors`}
                    >
                        {isEditing ? <X size={20} className='cursor-pointer ' /> : <Edit2 size={20} className='cursor-pointer ' />}
                    </button>
                )}
            </div>

            <div className="space-y-4">
                {fields.map((field, index) => {
                    if (field.render) {
                        return (
                            <div key={field.name} className="mb-4">
                                <h3 className="font-semibold mb-2">{field.label}</h3>
                                {field.render(data[field.name])}
                            </div>
                        )
                    }

                    return (
                        <div key={index} className={field.type === 'textarea' ? 'block' : 'flex items-center justify-between'}>
                            {field.icon && (
                                <field.icon className="text-gray-400 mr-3" size={20} />
                            )}
                            <div className={field.type === 'textarea' ? 'w-full' : 'flex items-center gap-3 flex-1'}>
                                {field.type !== 'textarea' && (
                                    <span className="text-gray-600 min-w-0 flex-shrink-0">
                                        {field.label}
                                    </span>
                                )}
                                {field.type === 'textarea' && (
                                    <span className="text-gray-600 block mb-2">{field.label}</span>
                                )}
                                <div className="flex-1">
                                    {renderField(field)}
                                </div>
                            </div>
                            {field.specialAction && isEditing && field.specialAction}
                        </div>
                    )
                })}

                {specialActions && specialActions}

                {isEditing && canEdit && (
                    <>
                        {isDocument ? (
                            <button
                                className="bg-orange-600 text-white px-4 py-2 rounded"
                                onClick={newDocUpload}
                            >
                                Upload New Document
                            </button>
                        ) : (
                            <div className="flex gap-2 pt-4 border-t border-gray-100">
                                <button
                                    onClick={handleSave}
                                    disabled={loading}
                                    className={`flex items-center gap-2 px-4 py-2 ${colors.button} text-white rounded-lg disabled:opacity-50 transition-colors`}
                                >
                                    {loading ? (
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                    ) : (
                                        <Save size={16} />
                                    )}
                                    Save Changes
                                </button>
                                <button
                                    onClick={handleCancel}
                                    className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                                >
                                    Cancel
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div >
        </div >
    )
}

export default DynamicSection