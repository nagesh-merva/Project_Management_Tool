import Navigation from "../components/Navigation/Navigation"
import Header from "../components/header"

import Projectcomponent from "../components/Projects/projectcomponent"
function ProjectsPage() {
    return (
        <div className="relative h-max w-full overflow-hidden flex flex-col bg-[#EAEAEA]">
            <Navigation />
            <Header />
            <div className="w-5/6 h-full mt-24 flex place-self-end">
                <Projectcomponent />
            </div>
        </div>
    )
}

export default ProjectsPage