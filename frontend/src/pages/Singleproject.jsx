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
function Singleproject() {
    return (
        <div className="relative h-full w-full flex flex-col bg-[#EAEAEA]">
            <Navigation />
            <Header />
            <div className="w-5/6 h-full mt-24 pr-16 place-self-end ">
                <Brief />
                <div className="w-full h-full flex ml-10 my-5">
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