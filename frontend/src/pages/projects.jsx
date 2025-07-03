import Navigation from "../components/Navigation/Navigation"
import Header from "../components/header"

import ProjectsDashboard from "../components/Projects/ProjectsDashboard"

function ProjectsPage() {

    return (
        <div className="relative h-full w-full flex flex-col bg-gray-100 min-w-[800px]">
            <Navigation />
            <div className="w-full md:w-[87%] h-full pt-20 flex place-self-end justify-center">
                <Header />
                <div className="md:pl-10 w-full h-full">
                    <ProjectsDashboard />
                </div>
            </div>
        </div>
    )
}

export default ProjectsPage