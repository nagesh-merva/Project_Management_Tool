import React from "react"
import { useNavigate } from "react-router-dom"
import { useMainContext } from "../../context/MainContext"
import { Home, PanelsTopLeft, Users, ClipboardPlus, Handshake, FileChartColumn } from "lucide-react"

const Navlinks = [
    {
        name: "Home",
        link: "/dashboard",
        icon: <Home />
    },
    {
        name: "Projects",
        link: "/projects",
        icon: <PanelsTopLeft />
    },
    {
        name: "Analytics",
        link: "/analytics",
        icon: <FileChartColumn />
    },
    {
        name: "Clients",
        link: "/clients",
        icon: <Handshake />
    },
    {
        name: "Reports",
        link: "/reports",
        icon: <ClipboardPlus />
    },
]

const Departments = [
    {
        name: "Sales",
    },
    {
        name: "Design",
    },
    {
        name: "Dev",
    },
    {
        name: "Maintenance",
    },
    {
        name: "Admin"
    }
]

const policies = [
    {
        name: "Policies",
        link: "/docs/policies"
    },
    {
        name: "Legal Docs",
        link: "/docs/legal-docs"
    },
    {
        name: "Templates",
        link: "/docs/templates"
    },
    {
        name: "Workflow",
        link: "/docs/workflow"
    },
    {
        name: "Guidelines",
        link: "/docs/guidelines"
    }
]

export default function Navigation() {
    const navigate = useNavigate()
    const { setDepartment } = useMainContext()

    const Goto = (link) => {
        navigate(link)
    }

    const SetDept = (name) => {
        setDepartment(name)
        navigate("/departments")
    }

    return (
        <div className="flex flex-col items-center py-10 pr-8 w-full md:w-full h-svh fixed left-0 bg-[#1E1E1E] rounded-r-[43px] shadow-2xl">
            <img src="/logo.png" alt="logo" className="self-start h-auto w-20 pb-5 mx-8" />
            <div className="flex flex-col space-y-2 text-md font-sans font-semibold text-white">
                {Navlinks.map((link, index) => (
                    <a key={index} onClick={() => Goto(link.link)} className="flex space-x-3 hover:text-gray-300 hover:scale-95 transition-all cursor-pointer">{link.icon}<p>{link.name}</p></a>
                ))}
                <h1 className="border-b-2 border-indigo-700 pt-5">Departments</h1>
                {Departments.map((link, index) => (
                    <a key={index} onClick={() => SetDept(link.name.toUpperCase())} className="flex space-x-3 hover:text-gray-300 hover:scale-95 transition-all cursor-pointer">{link.name}</a>
                ))}
                <h1 className="border-b-2 border-indigo-700 pt-5">Polices</h1>
                {policies.map((link, index) => (
                    <a key={index} onClick={() => Goto(link.link)} className="flex space-x-3 hover:text-gray-300 hover:scale-95 transition-all cursor-pointer">{link.name}</a>
                ))}
            </div>
        </div>
    )
}