import React, { useState, useEffect } from 'react'
import { Search, Plus, Building, Users, Filter, Menu, X } from 'lucide-react'
import ClientCard from '../components/clients/ClientCard'
import Navigation from '../components/Navigation/Navigation'
import Header from '../components/header'
import PopupForm from '../components/Home/PopUpForm'

const ClientsList = () => {
    const [clients, setClients] = useState([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState('')
    const [filterType, setFilterType] = useState('All')
    const [navOpen, setNavOpen] = useState(false)
    const [showPopup, setShowPopup] = useState(false)
    const [fields, setFields] = useState([
        {
            name: "name",
            type: "text",
            optional: false
        },
        {
            name: "brand_name",
            type: "text",
            optional: false
        },
        {
            name: "file",
            type: "file",
            optional: false
        },
        {
            name: "type",
            type: "select",
            multi: false,
            fields: [
                { name: "LLC", value: "LLC" },
                { name: "PVT-LTD", value: "PVT-LTD" },
                { name: "Partnership", value: "Partnership" },
                { name: "Sole-Proprietorship", value: "Sole-Proprietorship" },
                { name: "Startup", value: "Startup" },
                { name: "NGO", value: "NGO" },
                { name: "Enterprise", value: "Enterprise" },
                { name: "Individual", value: "Individual" },
            ]
        },
        {
            name: "industry",
            type: "text",
            optional: false
        },
        {
            name: "source",
            type: "select",
            multi: false,
            fields: [
                { name: "Word of Mount / Recommeded", value: "recommended" },
                { name: "Instagram", value: "instagram" },
                { name: "Linkedin", value: "linkedin" },
                { name: "Twitter", value: "twitter" },
                { name: "Our Website", value: "website" },
                { name: "Event", value: "event" }
            ]
        },
        {
            name: "location",
            type: "text",
            optional: false
        },
        {
            name: "website",
            type: "text",
            optional: true
        },
        {
            name: "gst_id",
            type: "text",
            optional: false
        },
        {
            name: "contact_name",
            type: "text",
            optional: false
        },
        {
            name: "contact_designation",
            type: "text",
            optional: false
        },
        {
            name: "contact_email",
            type: "email",
            optional: false
        },
        {
            name: "contact_phone",
            type: "text",
            optional: false
        }
    ])

    useEffect(() => {
        const fetchClients = async () => {
            setLoading(true)
            try {
                const response = await fetch(
                    "http://127.0.0.1:8000/clients/briefs",
                    {
                        method: "GET",
                        headers: { "Content-Type": "application/json" },
                    }
                )
                const data = await response.json()
                if (response.status === 201 || response.status === 200) {
                    setClients(data)
                }
            } catch (err) {
                console.error(err)
            } finally {
                setTimeout(() => {
                    setLoading(false)
                }, 2000)
            }
        }

        fetchClients()
    }, [])



    const filteredClients = clients.filter(client => {
        const matchesSearch = client.domain.toLowerCase().includes(searchTerm.toLowerCase())

        const matchesFilter = filterType === 'All' || client.type === filterType

        return matchesSearch && matchesFilter
    })

    const clientTypes = ['All', ...new Set(clients.map(client => client.type))]

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

                <div className={`fixed top-0 left-0 h-full w-[30%] transition-transform duration-300 ${navOpen ? "translate-x-0" : "-translate-x-full"} md:fixed md:top-0 md:left-0 md:h-full md:w-[13%] md:z-40 md:translate-x-0 md:block`} >
                    <Navigation />
                </div>

                {navOpen && (
                    <div className="fixed inset-0 bg-black bg-opacity-30 z-30 md:hidden" onClick={() => setNavOpen(false)} />
                )}

                <div className="w-full md:w-[87%] h-full pt-20 flex place-self-end justify-center transition-all duration-300">

                    <Header />
                    <div className="px-10 w-full h-full z-20">
                        <div className="mb-8">
                            <div className="h-8 bg-gray-200 rounded w-48 mb-4 animate-pulse"></div>
                            <div className="h-4 bg-gray-200 rounded w-96 animate-pulse"></div>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-4 mb-8">
                            <div className="h-12 bg-gray-200 rounded-lg flex-1 animate-pulse"></div>
                            <div className="h-12 bg-gray-200 rounded-lg w-32 animate-pulse"></div>
                            <div className="h-12 bg-gray-200 rounded-lg w-40 animate-pulse"></div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {[...Array(8)].map((_, index) => (
                                <div key={index} className="bg-white rounded-xl p-6 animate-pulse">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
                                        <div className="w-8 h-8 bg-gray-200 rounded-lg"></div>
                                    </div>
                                    <div className="space-y-3">
                                        <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                                        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                                        <div className="h-6 bg-gray-200 rounded w-1/3"></div>
                                        <div className="h-8 bg-gray-200 rounded w-full"></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <>
            <div className="relative h-full min-h-screen w-full flex flex-col bg-gray-100 min-w-[800px]">
                <button
                    className="fixed top-4 left-4 z-50 md:hidden bg-white p-2 rounded shadow"
                    onClick={() => setNavOpen(!navOpen)}
                    aria-label="Toggle navigation"
                >
                    {navOpen ? <X size={32} /> : <Menu size={32} />}
                </button>

                <div className={`fixed top-0 left-0 h-full w-[30%] transition-transform duration-300 ${navOpen ? "translate-x-0" : "-translate-x-full"} md:fixed md:top-0 md:left-0 md:h-full md:w-[13%] md:z-40 md:translate-x-0 md:block`} >
                    <Navigation />
                </div>

                {navOpen && (
                    <div className="fixed inset-0 bg-black bg-opacity-30 z-30 md:hidden" onClick={() => setNavOpen(false)} />
                )}

                <div className="w-full md:w-[87%] h-full pt-20 flex place-self-end justify-center transition-all duration-300">
                    <Header />
                    <div className="px-10 py-5 w-full h-full z-20">
                        <div className="mb-8">
                            <div className="flex items-center gap-3 mb-4">
                                <Building className="text-blue-600" size={32} />
                                <h1 className="text-3xl font-bold text-gray-900">Clients Management</h1>
                            </div>
                            <p className="text-gray-600">
                                Manage and view all your clients in one place. Track projects, billing, and relationships.
                            </p>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-4 mb-8">
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                                <input
                                    type="text"
                                    placeholder="Search clients..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                                />
                            </div>
                            <div className="relative">
                                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                                <select
                                    value={filterType}
                                    onChange={(e) => setFilterType(e.target.value)}
                                    className="pl-10 pr-8 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white appearance-none cursor-pointer min-w-32"
                                >
                                    {clientTypes.map(type => (
                                        <option key={type} value={type}>{type}</option>
                                    ))}
                                </select>
                            </div>
                            <button
                                onClick={() => setShowPopup(true)}
                                className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                            >
                                <Plus size={20} />
                                Add Client
                            </button>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                            <div className="bg-white rounded-lg p-4 border border-gray-100">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                        <Users className="text-blue-600" size={20} />
                                    </div>
                                    <div>
                                        <p className="text-2xl font-bold text-gray-900">{clients.length}</p>
                                        <p className="text-sm text-gray-600">Total Clients</p>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-white rounded-lg p-4 border border-gray-100">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                                        <Building className="text-green-600" size={20} />
                                    </div>
                                    <div>
                                        <p className="text-2xl font-bold text-gray-900">
                                            {clients.filter(c => c.type === 'Enterprise').length}
                                        </p>
                                        <p className="text-sm text-gray-600">Enterprise</p>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-white rounded-lg p-4 border border-gray-100">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                                        <Building className="text-purple-600" size={20} />
                                    </div>
                                    <div>
                                        <p className="text-2xl font-bold text-gray-900">
                                            {clients.filter(c => c.type === 'Startup').length}
                                        </p>
                                        <p className="text-sm text-gray-600">Startups</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="mb-6">
                            <p className="text-gray-600">
                                Showing {filteredClients.length} of {clients.length} clients
                                {searchTerm && ` for "${searchTerm}"`}
                                {filterType !== 'All' && ` in ${filterType}`}
                            </p>
                        </div>
                        {filteredClients.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                {filteredClients.map((client) => (
                                    <ClientCard key={client.client_id} client={client} />
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-12">
                                <Building className="mx-auto text-gray-400 mb-4" size={48} />
                                <h3 className="text-lg font-medium text-gray-900 mb-2">No clients found</h3>
                                <p className="text-gray-600 mb-6">
                                    {searchTerm || filterType !== 'All'
                                        ? 'Try adjusting your search or filter criteria.'
                                        : 'Get started by adding your first client.'
                                    }
                                </p>
                                {(!searchTerm && filterType === 'All') && (
                                    <button
                                        onClick={() => setShowPopup(true)}
                                        className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                    >
                                        <Plus size={16} />
                                        Add First Client
                                    </button>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <PopupForm
                isVisible={showPopup}
                onClose={() => setShowPopup(false)}
                formTitle="Add New Client"
                endpoint="http://127.0.0.1:8000/clients/add"
                fields={fields}
            />
        </>
    )
}

export default ClientsList