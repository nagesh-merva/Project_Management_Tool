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
  const [allReports, setAllReports] = useState([])
  useEffect(() => {
    GetReports()
  }, [])

  const GetReports = async () => {
    setLoading(true)
    try {
      const response = await fetch(`http://127.0.0.1:8000/all-reports`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },

      })
      const data = await response.json()
      if (response.status === 201 || response.status === 200) {
        setAllReports(data)
      }
    }
    catch (err) {
      console.error(err)
    }
    finally {
      setLoading(false)
    }
  }

  const totalReports  =  allReports?.length || 0
  const totalOpen = allReports?.filter(r => r.is_open)?.length || 0
  const thisMonth = allReports?.filter(r => {
      const created = new Date(r.uploaded_on)
      const now = new Date()
      return created.getMonth() === now.getMonth() && created.getFullYear() === now.getFullYear()
  })?.length || 0

  const data = [
    { title: "Total Reports", value:totalReports, percentage: 12, icon: <DockIcon className="text-blue-700" /> },
    { title: "Active Projects", value: totalOpen, percentage: 32, icon: <DockIcon className="text-red-600" /> },
    { title: "Reports Type", value: 8, percentage: 0, icon: <DockIcon className="text-purple-600" /> },
    { title: "This Month", value: thisMonth, percentage: 39, icon: <DockIcon className="text-green-600" /> },]

  const sortedReports = allReports?.slice().sort((a, b) => 
      new Date(b.uploaded_on).getTime() - new Date(a.uploaded_on).getTime()
    ) || []

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
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 ">
                  {sortedReports.map((items, index) => (
                    <ReportBox key={index} type={items.type} title={items.report_name} desc={items.description} time={items.uploaded_on} link={items.document_link} isOpen={items.is_open} />
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
