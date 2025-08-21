import { useEffect, useState } from "react"
import { Menu, X, DockIcon, Plus, Filter } from "lucide-react"
import Header from "../components/header"
import Navigation from "../components/Navigation/Navigation"
import Loading from "../components/Loading"
import Reports_Header from "../components/reports/Reports_Header"
import SetsDiv from "../components/reports/SetsDiv"
import Available_Header from "../components/reports/Available_Header"
import ReportBox from "../components/reports/ReportBox"
import { useMainContext } from "../context/MainContext"
import PopupForm from "../components/Home/PopUpForm"
import FilterSidebar from "../components/reports/FilterSidebar"

export default function Reports() {
  const { emp } = useMainContext()
  const [navOpen, setNavOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [allReports, setAllReports] = useState([])
  const [showPopup, setShowPopup] = useState(false)
  const [filterOpen, setFilterOpen] = useState(false)
  const [fields, setFields] = useState([
    {
      name: "uploaded_by",
      type: "stored",
      value: emp.emp_name
    },
    {
      name: "department",
      type: "stored",
      value: emp.emp_dept
    },
    {
      name: "report_name",
      type: "text",
      optional: false
    },
    {
      name: "description",
      type: "textarea",
      optional: false
    },
    {
      name: "document_link",
      type: "text",
      optional: false
    },
    {
      name: "type",
      type: "select",
      fields: [
        {
          name: "Departmental",
          value: "departmental"
        },
        {
          name: "Project",
          value: "project"
        },
        {
          name: "Financial",
          value: "financial"
        },
        {
          name: "HR",
          value: "hr"
        },
        {
          name: "Client",
          value: "client"
        },
        {
          name: "Issue",
          value: "issue"
        },
        {
          name: "Analytics",
          value: "analytics"
        },
        {
          name: "Compliance",
          value: "compliance"
        },
      ],
      multi: false
    },
  ])
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

  const totalReports = allReports?.length || 0
  const totalOpen = allReports?.filter(r => r.is_open)?.length || 0
  const thisMonth = allReports?.filter(r => {
    const created = new Date(r.uploaded_on)
    const now = new Date()
    return created.getMonth() === now.getMonth() && created.getFullYear() === now.getFullYear()
  })?.length || 0

  const data = [
    { title: "Total Reports", value: totalReports, percentage: 12, icon: <DockIcon className="text-blue-700" /> },
    { title: "Active Projects", value: totalOpen, percentage: 32, icon: <DockIcon className="text-red-600" /> },
    { title: "Reports Type", value: 8, percentage: 0, icon: <DockIcon className="text-purple-600" /> },
    { title: "This Month", value: thisMonth, percentage: 39, icon: <DockIcon className="text-green-600" /> },
    { title: "Reporting Departments", value: 5, percentage: 39, icon: <DockIcon className="text-green-600" /> },]

  const sortedReports = allReports?.slice().sort((a, b) =>
    new Date(b.uploaded_on).getTime() - new Date(a.uploaded_on).getTime()
  ) || []

  const [filteredReports, setFilteredReports] = useState(sortedReports)

  const handleFilterChange = (filtered) => {
    setFilteredReports(filtered)
  }

  return (
    <>
      <div className="relative h-full w-full flex flex-col bg-gray-100 min-w-[500px]">
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
                  <div className="flex justify-between items-center max-w-5xl">
                    <Reports_Header />
                    <button onClick={() => setShowPopup(true)} className=" absolute right-5 top-5 px-5 py-1.5 bg-btncol rounded-full flex items-center justify-center text-white hover:scale-95 transition-transform"><Plus /> <p className="hidden lg:block">New Report</p></button>
                    <button
                      onClick={() => setFilterOpen(!filterOpen)}
                      className="flex items-center h-fit gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors "
                    >
                      <Filter size={16} />
                      Filters
                    </button>
                  </div>

                  <div className="flex space-x-3">
                    {data.map((item, index) => (
                      <SetsDiv key={index} title={item.title} value={item.value} percentage={item.percentage} icon={item.icon} />
                    ))}
                  </div>
                  <Available_Header />
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 ">
                    {filteredReports.map((items, index) => (
                      <ReportBox key={index} dept={items.department} type={items.type} title={items.report_name} desc={items.description} time={items.uploaded_on} link={items.document_link} isOpen={items.is_open} />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <FilterSidebar
        isOpen={filterOpen}
        onClose={() => setFilterOpen(false)}
        allReports={allReports}
        onFilterChange={handleFilterChange}
      />
      <PopupForm
        isVisible={showPopup}
        onClose={() => setShowPopup(false)}
        formTitle="Add New Project"
        endpoint="http://127.0.0.1:8000/add-report"
        fields={fields}
      /></>
  )
}
