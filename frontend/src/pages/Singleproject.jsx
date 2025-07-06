import Navigation from "../components/Navigation/Navigation"
import Header from "../components/header"
import Brief from "../components/Singleprojects/Brief"
import Teammember from "../components/Singleprojects/Teammembers"
import Features from "../components/Singleprojects/Features"
import Quick from "../components/Singleprojects/QuickActions"
import Srs from "../components/Singleprojects/Srs"
import Maintenance from "../components/Singleprojects/Maintenance"
import Template from "../components/Singleprojects/Template"
import Financial from "../components/Singleprojects/Financial"
import Breakdownss from "../components/Singleprojects/Breakdowns"
import { Menu, X } from "lucide-react"
import { useState } from "react"
function Singleproject() {
    const [navOpen, setNavOpen] = useState(false)
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

            <div className="w-full md:w-[87%] h-full mt-20 pt-20 flex flex-col place-self-end justify-center transition-all duration-300">
                <Header />
                <Brief />
                <div className="w-fit mr-6 h-full flex ml-10 my-5">
                    <Teammember />
                    <Features />
                </div>
                <Srs />
                <Quick />
                <Maintenance />
                <Template />
                <Financial />
                <Breakdownss />
            </div>


        </div>


    )
}

export default Singleproject