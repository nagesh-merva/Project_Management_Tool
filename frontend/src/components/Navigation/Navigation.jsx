import React from "react"
import { useNavigate } from "react-router-dom"
import { useMainContext } from "../../context/MainContext"

const Navlinks = [
    {
        name: "Home",
        link: "/dashboard",
        icon: "./icons/home.png"
    },
    {
        name: "Projects",
        link: "/projects",
        icon: "./icons/project.png"
    },
    {
        name: "Team",
        link: "/team",
        icon: "./icons/team.png"
    },
    {
        name: "Clients",
        link: "/clients",
        icon: "./icons/client.png"
    },
    {
        name: "Reports",
        link: "/reports",
        icon: "./icons/report.png"
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
]

const policies = [
    {
        name: "Legal Docs",
        link: "/legaldocs"
    },
    {
        name: "Templates",
        link: "/template"
    },
    {
        name: "Workflow",
        link: "/workflow"
    },
    {
        name: "Guidelines",
        link: "/guidelines"
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
            <img src="/logo.png" alt="logo" className="h-fit w-28 pb-5" />
            <div className="flex flex-col space-y-2 text-md font-sans font-semibold text-white">
                {Navlinks.map((link, index) => (
                    <a key={index} onClick={() => Goto(link.link)} className="flex space-x-3 hover:text-gray-300 hover:scale-95 transition-all cursor-pointer"><img src={link.icon} className="h-6 w-fit " /><p>{link.name}</p></a>
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