import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
    ArrowLeft,
    Edit,
    Trash2,
    Building,
    Globe,
    MapPin,
    User,
    Mail,
    Phone,
    Linkedin,
    Calendar,
    Tag,
    DollarSign,
    FileText,
    AlertCircle,
    ExternalLink,
    Briefcase,
    TrendingUp,
    Menu,
    X
} from 'lucide-react'
import Navigation from '../components/Navigation/Navigation'
import Header from '../components/header'

const ClientDetails = () => {
    const { id } = useParams()
    const navigate = useNavigate()
    const [client, setClient] = useState(null)
    const [loading, setLoading] = useState(true)
    const [navOpen, setNavOpen] = useState(false)

    console.log(client)

    useEffect(() => {
        const fetchClientDetails = async () => {
            setLoading(true)
            try {
                const response = await fetch(
                    `http://127.0.0.1:8000/client/alldetails?client_id=${id}`,
                    {
                        method: "GET",
                        headers: { "Content-Type": "application/json" },
                    }
                )
                const data = await response.json()
                if (response.status === 201 || response.status === 200) {
                    setClient(data)
                }
            } catch (err) {
                console.error(err)
            } finally {
                setTimeout(() => {
                    setLoading(false)
                }, 2000)
            }
        }

        fetchClientDetails()
    }, [id])

    const handleBack = () => {
        navigate('/clients')
    }

    const handleEdit = () => {
        navigate(`/clients/${id}/edit`)
    }

    const handleDelete = () => {
        if (window.confirm('Are you sure you want to delete this client? This action cannot be undone.')) {
            console.log('Deleting client:', id)
            navigate('/clients')
        }
    }

    const getTagColor = (tag) => {
        const colors = {
            'priority': 'bg-red-100 text-red-800 border-red-200',
            'recurring': 'bg-green-100 text-green-800 border-green-200',
            'enterprise': 'bg-blue-100 text-blue-800 border-blue-200',
            'startup': 'bg-purple-100 text-purple-800 border-purple-200'
        }
        return colors[tag] || 'bg-gray-100 text-gray-800 border-gray-200'
    }

    const getPaymentStatusColor = (status) => {
        const colors = {
            'active': 'bg-green-100 text-green-800 border-green-200',
            'suspended': 'bg-red-100 text-red-800 border-red-200',
            'pending': 'bg-yellow-100 text-yellow-800 border-yellow-200'
        }
        return colors[status] || 'bg-gray-100 text-gray-800 border-gray-200'
    }

    if (loading) {
        return (
            <div className="relative h-full w-full flex flex-col bg-gray-100 min-w-[800px]">
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
                                fixed top-0 left-0 h-full z-40 transition-transform duration-300
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
                    <div className="pl-10 pr-7 w-full h-full">
                        <div className="mb-8">
                            <div className="h-6 bg-gray-200 rounded w-24 mb-4 animate-pulse"></div>
                            <div className="bg-white rounded-xl p-6 animate-pulse">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center gap-4">
                                        <div className="w-16 h-16 bg-gray-200 rounded-lg"></div>
                                        <div>
                                            <div className="h-8 bg-gray-200 rounded w-48 mb-2"></div>
                                            <div className="h-4 bg-gray-200 rounded w-32"></div>
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <div className="w-10 h-10 bg-gray-200 rounded-lg"></div>
                                        <div className="w-10 h-10 bg-gray-200 rounded-lg"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {[...Array(6)].map((_, index) => (
                                <div key={index} className="bg-white rounded-xl p-6 animate-pulse">
                                    <div className="h-6 bg-gray-200 rounded w-32 mb-4"></div>
                                    <div className="space-y-3">
                                        <div className="h-4 bg-gray-200 rounded w-full"></div>
                                        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                                        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    if (!client) {
        return (
            <div className="relative h-full w-full flex flex-col bg-gray-100 min-w-[800px]">
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
                    <div className="pl-10 pr-7 w-full h-full">
                        <div className="text-center">
                            <AlertCircle className="mx-auto text-red-500 mb-4" size={48} />
                            <h2 className="text-xl font-semibold text-gray-900 mb-2">Client Not Found</h2>
                            <p className="text-gray-600 mb-4">The client you're looking for doesn't exist.</p>
                            <button
                                onClick={handleBack}
                                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                            >
                                <ArrowLeft size={16} />
                                Back to Clients
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="relative h-full w-full flex flex-col bg-gray-100 min-w-[800px]">
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
                        fixed top-0 left-0 h-full z-40 transition-transform duration-300
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
                <div className="pl-10 pr-7 w-full h-full">
                    <button
                        onClick={handleBack}
                        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
                    >
                        <ArrowLeft size={20} />
                        Back to Clients
                    </button>
                    <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center overflow-hidden">
                                    {client.logo_url ? (
                                        <img
                                            src={client.logo_url}
                                            alt={`${client.name} logo`}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <Building className="text-white" size={32} />
                                    )}
                                </div>
                                <div>
                                    <h1 className="text-2xl font-bold text-gray-900">{client.name}</h1>
                                    <p className="text-gray-600">{client.brand_name}</p>
                                    <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                                        <span className="flex items-center gap-1">
                                            <Building size={14} />
                                            {client.type}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <Briefcase size={14} />
                                            {client.industry}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <MapPin size={14} />
                                            {client.location}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={handleEdit}
                                    className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                    title="Edit Client"
                                >
                                    <Edit size={20} />
                                </button>
                                <button
                                    onClick={handleDelete}
                                    className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                    title="Delete Client"
                                >
                                    <Trash2 size={20} />
                                </button>
                            </div>
                        </div>
                        <div className="mt-4 pt-4 border-t border-gray-100">
                            <div className="flex items-center gap-6 text-sm">
                                <span className="text-gray-600">
                                    <strong>Client ID:</strong> {client.client_id}
                                </span>
                                <span className="text-gray-600">
                                    <strong>GSTIN:</strong> {client.gst_id}
                                </span>
                                {client.website && (
                                    <a
                                        href={client.website}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-1 text-blue-600 hover:text-blue-800 transition-colors"
                                    >
                                        <Globe size={14} />
                                        Website
                                        <ExternalLink size={12} />
                                    </a>
                                )}
                            </div>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div className="bg-white rounded-xl shadow-sm p-6">
                            <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2 mb-4">
                                <User className="text-blue-600" size={20} />
                                Primary Contact
                            </h2>
                            <div className="space-y-3">
                                <div>
                                    <p className="font-medium text-gray-900">{client.primary_contact.name}</p>
                                    <p className="text-gray-600 text-sm">{client.primary_contact.designation}</p>
                                </div>
                                <div className="space-y-2">
                                    <a
                                        href={`mailto:${client.primary_contact.email}`}
                                        className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors"
                                    >
                                        <Mail size={16} />
                                        {client.primary_contact.email}
                                    </a>
                                    <a
                                        href={`tel:${client.primary_contact.phone}`}
                                        className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors"
                                    >
                                        <Phone size={16} />
                                        {client.primary_contact.phone}
                                    </a>
                                    {client.primary_contact.linkedin && (
                                        <a
                                            href={client.primary_contact.linkedin}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors"
                                        >
                                            <Linkedin size={16} />
                                            LinkedIn Profile
                                            <ExternalLink size={12} />
                                        </a>
                                    )}
                                </div>
                            </div>
                        </div>
                        <div className="bg-white rounded-xl shadow-sm p-6">
                            <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2 mb-4">
                                <Calendar className="text-green-600" size={20} />
                                Engagement Info
                            </h2>
                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <span className="text-gray-600">Joined Date</span>
                                    <span className="font-medium">{client.engagement.joined_date.split("T")[0]}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-gray-600">Source</span>
                                    <span className="font-medium">{client.engagement?.source}</span>
                                </div>
                                <div>
                                    <span className="text-gray-600 block mb-2">Tags</span>
                                    <div className="flex flex-wrap gap-2">
                                        {client.engagement?.tags.map((tag, index) => (
                                            <span
                                                key={index}
                                                className={`px-2 py-1 rounded-full text-xs font-medium border ${getTagColor(tag)}`}
                                            >
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="bg-white rounded-xl shadow-sm p-6">
                            <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2 mb-4">
                                <TrendingUp className="text-purple-600" size={20} />
                                Metrics Overview
                            </h2>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="text-center p-3 bg-blue-50 rounded-lg">
                                    <p className="text-2xl font-bold text-blue-600">{client.metrics.total_projects}</p>
                                    <p className="text-sm text-gray-600">Total Projects</p>
                                </div>
                                <div className="text-center p-3 bg-green-50 rounded-lg">
                                    <p className="text-2xl font-bold text-green-600">
                                        ${client.metrics.total_billed.toLocaleString()}
                                    </p>
                                    <p className="text-sm text-gray-600">Total Billed</p>
                                </div>
                            </div>
                            <div className="mt-4 space-y-2">
                                <div className="flex items-center justify-between">
                                    <span className="text-gray-600">Last Project</span>
                                    <span className="font-medium">{client.metrics.last_project_date.split("T")[0]}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-gray-600">Payment Status</span>
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getPaymentStatusColor(client.metrics.payment_status)}`}>
                                        {client.metrics.payment_status}
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div className="bg-white rounded-xl shadow-sm p-6">
                            <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2 mb-4">
                                <FileText className="text-orange-600" size={20} />
                                Documents
                            </h2>
                            <div className="space-y-3">
                                {client.documents.nda_link && (
                                    <a
                                        href={client.documents.nda_link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                                    >
                                        <span className="font-medium">NDA Document</span>
                                        <ExternalLink size={16} className="text-gray-400" />
                                    </a>
                                )}
                                {client.documents.agreement_link && (
                                    <a
                                        href={client.documents.agreement_link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                                    >
                                        <span className="font-medium">Service Agreement</span>
                                        <ExternalLink size={16} className="text-gray-400" />
                                    </a>
                                )}
                            </div>
                        </div>
                    </div>
                    <div className="mt-6 space-y-6">
                        <div className="bg-white rounded-xl shadow-sm p-6">
                            <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2 mb-4">
                                <Tag className="text-blue-600" size={20} />
                                Onboarding Notes
                            </h2>
                            <p className="text-gray-700 leading-relaxed bg-gray-50 p-4 rounded-lg">
                                {client.engagement_info?.onboarding_notes}
                            </p>
                        </div>
                        <div className="bg-white rounded-xl shadow-sm p-6">
                            <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2 mb-4">
                                <MapPin className="text-green-600" size={20} />
                                Billing Address
                            </h2>
                            <p className="text-gray-700">{client.billing_address}</p>
                        </div>
                        <div className="bg-white rounded-xl shadow-sm p-6">
                            <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2 mb-4">
                                <FileText className="text-purple-600" size={20} />
                                Additional Notes
                            </h2>
                            <p className="text-gray-700 leading-relaxed bg-gray-50 p-4 rounded-lg">
                                {client.extra_notes}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ClientDetails