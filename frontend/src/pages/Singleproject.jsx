import Navigation from "../components/Navigation/Navigation"
import Header from "../components/header"
import Brief from "../components/Singleprojects/Brief"
import Teammember from "../components/Singleprojects/Teammembers"
import Features from "../components/Singleprojects/Features"
import QuickActions from "../components/Singleprojects/QuickActions"
import Srs from "../components/Singleprojects/Srs"
import Maintenance from "../components/Singleprojects/Maintenance"
import Templates from "../components/Singleprojects/Templates"
import Financial from "../components/Singleprojects/Financial"
import { Menu, X } from "lucide-react"
import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import Loading from "../components/Loading"
import ProjectProgressChart from "../components/Singleprojects/ProjectProgressChart"

function Singleproject() {
    const [navOpen, setNavOpen] = useState(false)
    const [loading, setLoading] = useState(false)
    const [projectDetails, setProjectDetails] = useState({})
    const { id } = useParams()


    useEffect(() => {
        GetFullProj()
    }, [])

    const GetFullProj = async () => {
        setLoading(true)
        try {
            const response = await fetch(`http://127.0.0.1:8000/get-project?project_id=${id}`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
            })

            const data = await response.json()
            if (response.status === 200 || response.status === 201) {
                setProjectDetails(data)
            }
        } catch (err) {
            console.error(err)
        }
        finally {
            setTimeout(() => {
                setLoading(false)
            }, 1000)
        }
    }

    // console.log(projectDetails.project_status)

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

            <div className="w-full min-h-screen md:w-[87%] h-full pt-20 px-5 flex flex-col place-self-end justify-center transition-all duration-300">
                {loading ? (
                    <Loading />
                ) : (
                    <>
                        <Header />
                        <div className="w-full h-full space-y-5">
                            <Brief clientDetails={projectDetails.client_details} projBrief={projectDetails.descp} status={projectDetails.status} start={projectDetails.start_date} deadline={projectDetails.deadline} />
                            <div className="w-full h-80 flex ">
                                <Teammember members={projectDetails.team_members} />
                                <Features features={projectDetails.features} />
                            </div>
                            <Srs srs={projectDetails.srs} />
                            <div className="w-full h-fit flex space-x-5">
                                <div className="h-full w-2/5 md:w-1/3 space-y-5">
                                    <QuickActions links={projectDetails.links} />
                                    <Maintenance HostingObj={projectDetails.hosting_details} MaintObj={projectDetails.issues_and_maintenance_reports} />
                                </div>
                                <ProjectProgressChart projectPhases={projectDetails.project_status} currentProgress={projectDetails.progress} />
                            </div>
                            <Templates templates={projectDetails.templates} />
                            <Financial FinancialData={projectDetails.financial_data} />
                        </div>
                    </>
                )}
            </div>
        </div>
    )
}

export default Singleproject