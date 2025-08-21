import { useEffect, useState } from "react"
import { ChevronRight, FileText, Menu, X, Scale, Workflow, BookOpen, BookTemplate as FileTemplate, Search, User } from "lucide-react"
import Header from "../components/header"
import Navigation from "../components/Navigation/Navigation"
import { useParams } from "react-router-dom"

export default function Policies() {
    const [navOpen, setNavOpen] = useState(false)
    const { doctype } = useParams()
    const [activeSection, setActiveSection] = useState(doctype)
    const [searchTerm, setSearchTerm] = useState('')
    const [selectedDocument, setSelectedDocument] = useState(null)

    const handleDocumentClick = (item) => {
        setSelectedDocument(item)
    }

    useEffect(() => {
        setActiveSection(doctype)
        console.log(doctype)
    }, [doctype])

    const navigationItems = [
        { id: 'policies', label: 'Policies', icon: FileText },
        { id: 'legal-docs', label: 'Legal Docs', icon: Scale },
        { id: 'templates', label: 'Templates', icon: FileTemplate },
        { id: 'workflow', label: 'Workflow', icon: Workflow },
        { id: 'guidelines', label: 'Guidelines', icon: BookOpen },
    ]

    const policyData = {
        policies: {
            title: "Internal Policies",
            description: "Comprehensive operational and employee policies governing daily business conduct, workplace standards, and organizational procedures.",
            items: [
                {
                    id: "1.1",
                    title: "Employee Code of Conduct",
                    description: "Standards of professional behavior, ethics, and workplace conduct expectations for all team members.",
                    content: "This policy establishes the fundamental principles of professional conduct expected from all employees. It encompasses standards for interpersonal communication, client interactions, confidentiality requirements, and adherence to company values. All team members are expected to maintain the highest level of professionalism in their daily interactions and represent the organization with integrity and respect.",
                    lastUpdated: "2024-01-15"
                },
                {
                    id: "1.2",
                    title: "Remote Work and Flexible Arrangements",
                    description: "Guidelines for remote work eligibility, productivity standards, and communication protocols.",
                    content: "This comprehensive policy outlines the framework for remote work arrangements, including eligibility criteria, performance expectations, and communication standards. It addresses equipment provisioning, security protocols, meeting participation requirements, and productivity metrics to ensure consistent service delivery regardless of work location.",
                    lastUpdated: "2024-01-12"
                },
                {
                    id: "1.3",
                    title: "Data Privacy and Information Security",
                    description: "Protocols for handling sensitive information, client data protection, and cybersecurity measures.",
                    content: "This policy establishes strict guidelines for the handling, storage, and transmission of confidential information. It includes requirements for password management, secure file sharing, client data protection protocols, and incident reporting procedures to maintain the highest standards of data security and privacy compliance.",
                    lastUpdated: "2024-01-08"
                },
                {
                    id: "1.4",
                    title: "Professional Development and Training",
                    description: "Framework for continuous learning, skill development, and career advancement opportunities.",
                    content: "This policy outlines the organization's commitment to professional growth and continuous learning. It details available training programs, certification support, conference attendance guidelines, and performance review processes designed to foster career development and maintain industry-leading expertise.",
                    lastUpdated: "2024-01-05"
                }
            ]
        },
        'legal-docs': {
            title: "Legal Documentation",
            description: "Formal legal agreements, compliance documents, and regulatory frameworks governing business operations and client relationships.",
            items: [
                {
                    id: "2.1",
                    title: "Master Service Agreement Template",
                    description: "Standardized legal framework for client engagements and service delivery terms.",
                    content: "This comprehensive legal document establishes the foundational terms and conditions for all client engagements. It includes scope of services, payment terms, intellectual property rights, liability limitations, and dispute resolution mechanisms. This template ensures consistent legal protection across all client relationships while maintaining flexibility for project-specific requirements.",
                    lastUpdated: "2024-01-18"
                },
                {
                    id: "2.2",
                    title: "Non-Disclosure Agreements",
                    description: "Confidentiality agreements for protecting proprietary information and client data.",
                    content: "This legal instrument establishes binding confidentiality obligations for all parties handling sensitive information. It defines the scope of confidential information, permitted uses, disclosure restrictions, and remedies for breach. The agreement ensures robust protection of proprietary business information and client data throughout all business relationships.",
                    lastUpdated: "2024-01-16"
                },
                {
                    id: "2.3",
                    title: "Intellectual Property Rights Framework",
                    description: "Legal framework governing ownership, licensing, and protection of intellectual property.",
                    content: "This document establishes clear guidelines for intellectual property ownership, licensing arrangements, and protection mechanisms. It addresses work-for-hire provisions, attribution requirements, licensing terms, and infringement protocols to ensure proper handling of all intellectual property matters in client projects and internal development.",
                    lastUpdated: "2024-01-14"
                },
                {
                    id: "2.4",
                    title: "Compliance and Regulatory Standards",
                    description: "Documentation ensuring adherence to industry regulations and legal requirements.",
                    content: "This comprehensive framework outlines all applicable regulatory requirements and compliance standards relevant to the organization's operations. It includes data protection regulations, industry-specific requirements, reporting obligations, and audit procedures to ensure full legal compliance across all business activities.",
                    lastUpdated: "2024-01-10"
                },
                {
                    id: "2.5",
                    title: "Contract Amendment and Modification Procedures",
                    description: "Formal processes for modifying existing legal agreements and contracts.",
                    content: "This procedure document establishes the formal process for amending existing contracts and legal agreements. It includes authorization requirements, documentation standards, approval workflows, and implementation protocols to ensure all contract modifications are properly executed and legally binding.",
                    lastUpdated: "2024-01-07"
                }
            ]
        },
        templates: {
            title: "Business Templates",
            description: "Pre-defined, reusable templates for common business processes, client communications, and project documentation.",
            items: [
                {
                    id: "3.1",
                    title: "Project Proposal Template",
                    description: "Standardized format for client project proposals and scope documentation.",
                    content: "This comprehensive template provides a structured approach to project proposals, including executive summary sections, detailed scope of work, timeline specifications, resource allocation, and pricing structures. It ensures consistency in client communications while maintaining flexibility for project-specific customizations and requirements.",
                    lastUpdated: "2024-01-20"
                },
                {
                    id: "3.2",
                    title: "Client Onboarding Checklist",
                    description: "Step-by-step process for new client integration and project initiation.",
                    content: "This detailed checklist ensures smooth client onboarding through systematic documentation of all required steps. It includes client information gathering, system access provisioning, communication protocol establishment, and project kickoff procedures to guarantee consistent and thorough client integration experiences.",
                    lastUpdated: "2024-01-17"
                },
                {
                    id: "3.3",
                    title: "Change Request Form",
                    description: "Standardized documentation for project scope changes and modifications.",
                    content: "This formal template provides a structured approach to documenting and approving project modifications. It includes impact assessment sections, resource requirement analysis, timeline adjustments, and approval workflows to ensure all scope changes are properly evaluated and documented before implementation.",
                    lastUpdated: "2024-01-13"
                },
                {
                    id: "3.4",
                    title: "Project Status Report Template",
                    description: "Regular reporting format for project progress, milestones, and deliverables.",
                    content: "This comprehensive reporting template ensures consistent communication of project status to all stakeholders. It includes progress summaries, milestone tracking, risk assessments, and next steps documentation to maintain transparency and alignment throughout the project lifecycle.",
                    lastUpdated: "2024-01-11"
                },
                {
                    id: "3.5",
                    title: "Invoice and Billing Template",
                    description: "Standardized format for client billing and payment processing documentation.",
                    content: "This professional template provides a consistent format for all client billing activities. It includes detailed service descriptions, hourly breakdowns, expense documentation, and payment terms to ensure accurate and professional invoice presentation while streamlining the accounts receivable process.",
                    lastUpdated: "2024-01-09"
                }
            ]
        },
        workflow: {
            title: "Standard Operating Procedures",
            description: "Step-by-step processes and workflows for consistent project delivery, quality assurance, and operational efficiency.",
            items: [
                {
                    id: "4.1",
                    title: "Project Initiation Workflow",
                    description: "Systematic process for project setup, team assignment, and initial planning phases.",
                    content: "This detailed workflow outlines the complete project initiation process from initial client contact through project kickoff. It includes client needs assessment, technical feasibility analysis, team resource allocation, timeline development, and formal project authorization procedures to ensure consistent and thorough project startup processes.",
                    lastUpdated: "2024-01-22"
                },
                {
                    id: "4.2",
                    title: "Quality Assurance Protocol",
                    description: "Comprehensive testing and review procedures for deliverable quality control.",
                    content: "This protocol establishes systematic quality assurance procedures throughout the project lifecycle. It includes code review standards, testing methodologies, client feedback integration, and final delivery approval processes to ensure all deliverables meet the highest quality standards before client presentation.",
                    lastUpdated: "2024-01-19"
                },
                {
                    id: "4.3",
                    title: "Client Communication Framework",
                    description: "Structured approach to client interactions, updates, and feedback management.",
                    content: "This framework provides guidelines for all client communication activities, including meeting schedules, progress reporting, feedback collection, and issue escalation procedures. It ensures consistent, professional, and transparent communication throughout all client relationships and project phases.",
                    lastUpdated: "2024-01-15"
                },
                {
                    id: "4.4",
                    title: "Crisis Management Procedures",
                    description: "Emergency response protocols for critical issues and project risks.",
                    content: "This comprehensive procedure outlines the systematic response to critical issues and project emergencies. It includes risk assessment protocols, escalation procedures, stakeholder notification requirements, and recovery planning to ensure rapid and effective resolution of critical situations while maintaining client relationships.",
                    lastUpdated: "2024-01-12"
                }
            ]
        },
        guidelines: {
            title: "Best Practices & Guidelines",
            description: "Professional recommendations, industry best practices, and strategic guidance for optimal service delivery and team performance.",
            items: [
                {
                    id: "5.1",
                    title: "Design System Standards",
                    description: "Guidelines for maintaining consistent visual identity and user experience across projects.",
                    content: "These comprehensive standards establish design consistency across all client projects and internal tools. They include typography guidelines, color palette specifications, component libraries, and accessibility requirements to ensure cohesive and professional visual presentation while maintaining brand integrity and user experience excellence.",
                    lastUpdated: "2024-01-25"
                },
                {
                    id: "5.2",
                    title: "Development Best Practices",
                    description: "Technical guidelines for code quality, security, and maintainability standards.",
                    content: "This guide outlines essential development practices including code structure standards, security protocols, performance optimization techniques, and documentation requirements. It ensures consistent technical quality across all development projects while promoting maintainable, scalable, and secure software solutions.",
                    lastUpdated: "2024-01-21"
                },
                {
                    id: "5.3",
                    title: "Client Relationship Management",
                    description: "Strategic approaches to building and maintaining strong client partnerships.",
                    content: "These guidelines provide strategic approaches to client relationship development and maintenance. They include communication best practices, expectation management techniques, feedback integration strategies, and long-term partnership development to ensure sustained client satisfaction and business growth.",
                    lastUpdated: "2024-01-18"
                },
                {
                    id: "5.4",
                    title: "Team Collaboration Principles",
                    description: "Framework for effective internal communication and collaborative work practices.",
                    content: "This framework establishes principles for effective team collaboration including meeting protocols, decision-making processes, conflict resolution strategies, and knowledge sharing practices. It promotes a collaborative culture that maximizes team productivity and maintains positive working relationships.",
                    lastUpdated: "2024-01-16"
                },
                {
                    id: "5.5",
                    title: "Performance Optimization Guidelines",
                    description: "Best practices for maximizing efficiency and productivity across all operations.",
                    content: "These guidelines provide strategic recommendations for optimizing performance across all operational areas. They include workflow optimization techniques, resource allocation strategies, productivity measurement methods, and continuous improvement practices to ensure maximum efficiency and service quality.",
                    lastUpdated: "2024-01-14"
                },
                {
                    id: "5.6",
                    title: "Innovation and Technology Adoption",
                    description: "Framework for evaluating and implementing new technologies and methodologies.",
                    content: "This framework provides structured approaches to technology evaluation and adoption including feasibility assessment, implementation planning, training requirements, and success measurement criteria. It ensures strategic technology adoption that enhances service delivery while maintaining operational stability.",
                    lastUpdated: "2024-01-11"
                }
            ]
        }
    }

    const currentSection = policyData[activeSection];
    const filteredItems = currentSection.items.filter(item =>
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(searchTerm.toLowerCase())
    )

    return (
        <div className="relative h-full w-full flex flex-col bg-gray-100 min-h-screen min-w-[500px]">
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
                <Header value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                <div className="pl-10 pr-7 w-full h-full">
                    <div className="flex mb-4">
                        <div className="text-gray-700 text-lg font-semibold ">
                            <main className="p-8">
                                <div className="max-w-6xl mx-auto">
                                    <div className="mb-8">
                                        <h1 className="text-3xl font-bold text-gray-900 mb-3">
                                            {currentSection.title}
                                        </h1>
                                        <p className="text-gray-600 text-lg leading-relaxed max-w-4xl">
                                            {currentSection.description}
                                        </p>
                                    </div>
                                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                                        {filteredItems.map((item) => (
                                            <div
                                                key={item.id}
                                                onClick={() => handleDocumentClick(item)}
                                                className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow cursor-pointer group"
                                            >
                                                <div className="flex items-start justify-between mb-4">
                                                    <div className="flex-1">
                                                        <div className="flex items-center space-x-2 mb-2">
                                                            <span className="text-xs font-mono text-blue-600 bg-blue-50 px-2 py-1 rounded">
                                                                {item.id}
                                                            </span>
                                                        </div>
                                                        <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                                                            {item.title}
                                                        </h3>
                                                    </div>
                                                    <ChevronRight className="text-gray-400 group-hover:text-blue-600 transition-colors" size={20} />
                                                </div>

                                                <p className="text-gray-600 text-sm leading-relaxed mb-4">
                                                    {item.description}
                                                </p>

                                                <div className="border-t border-gray-100 pt-4">
                                                    <p className="text-gray-500 text-xs line-clamp-3">
                                                        {item.content}
                                                    </p>
                                                    <div className="mt-3 flex items-center justify-between">
                                                        <span className="text-xs text-gray-400">
                                                            Last updated: {item.lastUpdated}
                                                        </span>
                                                        <span className="text-xs text-blue-600 font-medium">
                                                            View Details
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    {filteredItems.length === 0 && (
                                        <div className="text-center py-12">
                                            <div className="text-gray-400 mb-4">
                                                <FileText size={48} className="mx-auto" />
                                            </div>
                                            <h3 className="text-lg font-medium text-gray-900 mb-2">
                                                No documents found
                                            </h3>
                                            <p className="text-gray-600">
                                                Try adjusting your search terms or browse a different section.
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </main>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
