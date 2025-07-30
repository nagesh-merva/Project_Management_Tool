import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { Menu, X, DockIcon } from "lucide-react"
import Header from "../components/header"
import Navigation from "../components/Navigation/Navigation"
import EmployeeDetails from "../components/Departments/EmployeeDetails"
import Loading from "../components/Loading"
import Reports_Header from "../components/reports/Reports_Header"
import SetsDiv from "../components/reports/SetsDiv"
import Available_Header from "../components/reports/Available_Header"
import ReportBox from "../components/reports/ReportBox"


export default function Reports() {

  const [navOpen, setNavOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const data = [
    { title: "Total Reports", value: 8, percentage: 12, icon: <DockIcon className="text-blue-700" /> },
    { title: "Active Projects", value: 14, percentage: 32, icon: <DockIcon className="text-red-600" /> },
    { title: "Department", value: 26, percentage: 0, icon: <DockIcon className="text-purple-600" /> },
    { title: "This Month", value: 156, percentage: 39, icon: <DockIcon className="text-green-600" /> },]
  const data2 = [
    { type: "Departmental", title: "Department Performance", icon: <DockIcon />, desc: "Comprehensive analysis of departmental productivity, resource allocation, and performance metrics across all teams.", time: "2024-04-22T23:52:00.000+00:00", link: "https://www.figma.com/design/1wowRmkUI68qVPtKi8pXzu/PROJECT_MANAGEMENT_TOOL?node-id=681-1125&t=NrzttYjOZcowEX6d-0" }
  ]

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
          <div className="flex mb-4">
            {loading ? (
              <Loading />
            ) : (
              <div className="text-gray-700 text-lg font-semibold ">
                <Reports_Header />

                <div className="flex space-x-5">
                  {data.map((item, index) => (
                    <SetsDiv key={index} title={item.title} value={item.value} percentage={item.percentage} icon={item.icon} />
                  ))}
                </div>
                <Available_Header />
                <div className="flex space-x-5">
                  {data2.map((items, index) => (
                    <ReportBox key={index} type={items.type} title={items.title} desc={items.desc} icon={items.icon} time={items.time} link={items.link} />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
