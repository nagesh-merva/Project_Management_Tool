import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import PopupForm from '../components/Home/PopUpForm'
import {
    ArrowLeft,
    Edit,
    Trash2,
    Building,
    Globe,
    MapPin,
    Tag,
    FileText,
    AlertCircle,
    ExternalLink,
    Briefcase,
    Menu,
    X,
} from 'lucide-react'
import Navigation from '../components/Navigation/Navigation'
import Header from '../components/header'
import PrimaryContact from '../components/clients/PrimaryContact'
import EngagementInfo from '../components/clients/EngagementInfo'
import MetricsOverview from '../components/clients/MetricsOverview'
import Documents from '../components/clients/Documents'
import Notes from '../components/clients/Notes'
import BillingAddress from '../components/clients/BillingAddress'
import { useMainContext } from '../context/MainContext'


const ClientDetails = () => {
    const { clientid } = useParams()
    const navigate = useNavigate()
    const { emp } = useMainContext()
    const canView = emp.emp_dept === "SALES" && (emp.role === "Admin" || emp.role === "Manager" || emp.role === "Founder" || emp.role === "Co-Founder")
    const [client, setClient] = useState(null)
    const [loading, setLoading] = useState(true)
    const [navOpen, setNavOpen] = useState(false)

    console.log(client)
    const [showPopup, setShowPopup] = useState(false);
    const [fields, setFields] = useState([
        {
            name: "client_id",
            type: "stored",
            value: clientid
        },
        {
            name: "name",
            type: "text",
            optional: true
        },
        {
            name: "brand_name",
            type: "text",
            optional: true
        },
        {
            name: "logo_url",
            type: "text",
            optional: true

        },
        {
            name: "location",
            type: "text",
            optional: true
        },
        {
            name: "website",
            type: "text",
            optional: true
        },
        {
            name: "gst_id",
            type: "text",
            optional: true
        },
        {
            name: "contect_name",
            type: "text",
            optional: true
        },
        {
            name: "contact_designation",
            type: "text",
            optional: true
        },
        {
            name: "contect_email",
            type: "email",
            optional: true
        },
        {
            name: "contect_phone",
            type: "number",
            optional: true
        }

    ])
    useEffect(() => {
        const fetchClientDetails = async () => {
            setLoading(true)
            if (!canView) {
                alert("You do not have permission to view client details.")
                navigate('/clients')
                return
            }
            try {
                const response = await fetch(
                    `http://127.0.0.1:8000/client/alldetails?client_id=${clientid}`,
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
    }, [clientid])

    const handleBack = () => {
        navigate('/clients')
    }

    const handleDelete = () => {
        if (window.confirm('Are you sure you want to delete this client? This action cannot be undone.')) {
            console.log('Deleting client:', id)
            navigate('/clients')
        }
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
        <>
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
                                                className="w-full h-fit object-cover"
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
                                        onClick={() => setShowPopup(true)}
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
                            <PrimaryContact primary_contact={client.primary_contact} />
                            <EngagementInfo engagement={client.engagement} />
                            <MetricsOverview metrics={client.metrics} />
                            <Documents documents={client.documents} />
                        </div>
                        <div className="my-6 space-y-6">
                            <Notes notes={client.notes} />
                            <BillingAddress location={client.location} />
                        </div>
                    </div>
                </div>
            </div>
            <PopupForm
                isVisible={showPopup}
                onClose={() => setShowPopup(false)}
                formTitle="Manage clients details"
                endpoint="http://127.0.0.1:8000/update-client"
                fields={fields}
            />
        </>
    )
}

export default ClientDetails