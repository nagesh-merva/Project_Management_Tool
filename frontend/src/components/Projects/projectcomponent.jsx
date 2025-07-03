import Actives from "./updatecomponent";

function Projectcomponent() {
    const activeProjects = [
        {
            proname: "Project 11",
            role: " UI/UX designer",
            phase: " Design",
            team: ["./icons/faceicon.png", "./icons/faceicon.png", "./icons/faceicon.png", "./icons/addface.png"],
            description: "This project involves building a new feature for XYZ functionality.",
            start: "20 Jan 23",
            deadline: "20 Jan 23",
            per: "70%",
            editLink: "/singleproject",
            codeLink: "https://github.com/",
            webLink: "www.dummy.com",
        },
        {
            proname: "Project 17",
            role: "frontend dev",
            phase: ": Design",
            team: ["./icons/faceicon.png", "./icons/faceicon.png", "./icons/faceicon.png", "./icons/addface.png"],
            description: "This project involves building a new feature for XYZ functionality.",
            start: "20 Jan 23",
            deadline: "20 Jan 23",
            per: "70%",
            editLink: "/singleproject",
            codeLink: "https://github.com/",
            webLink: "www.dummy.com",
        },
        {
            proname: "Project 45",
            role: "frontend dev",
            phase: ": Design",
            team: ["./icons/faceicon.png", "./icons/faceicon.png", "./icons/faceicon.png", "./icons/addface.png"],
            description: "This project involves building a new feature for XYZ functionality.",
            start: "20 Jan 23",
            deadline: "20 Jan 23",
            per: "70%",
            editLink: "/singleproject",
            codeLink: "https://github.com/",
            webLink: "www.dummy.com",
        },


    ];

    const issuesReported = [
        {
            proname: "Project 8",
            role: " Frontend Developer",
            phase: " Resolve",
            team: ["./icons/faceicon.png", "./icons/faceicon.png", "./icons/faceicon.png", "./icons/addface.png"],
            description: "This project focused on UI/UX redesign for the ABC platform.",
            start: "20 Jan 23",
            deadline: "20 Jan 23",
            per: "100%",
            editLink: "/singleproject",
            codeLink: "https://github.com/",
            webLink: "www.dummy.com",
        },
        {
            proname: "Project 5",
            role: "backend dev",
            phase: " Resolve",
            team: ["./icons/faceicon.png", "./icons/faceicon.png", "./icons/faceicon.png", "./icons/addface.png"],
            description: "This project focused on UI/UX redesign for the ABC platform.",
            start: "20 Jan 23",
            deadline: "20 Jan 23",
            per: "100%",
            editLink: "/singleproject",
            codeLink: "https://github.com/",
            webLink: "www.dummy.com",
        },

    ];

    const completedProjects = [
        {
            proname: "Project 4",
            role: "UI/UX designer",
            phase: " Maintenance",
            team: ["./icons/faceicon.png", "./icons/faceicon.png", "./icons/faceicon.png", "./icons/addface.png"],
            description: "This project involves building a new feature for XYZ functionality.",
            start: "20 Jan 23",
            deadline: "20 Jan 23",
            per: "100%",
            editLink: "/singleproject",
            codeLink: "https://github.com/",
            webLink: "www.dummy.com",
        },

    ];
    return (

        <>
            <div className="min-h-screen px-6 py-0 w-full">

                <h2 className="pb-1 pl-2 font-bold ">Active Projects</h2>
                <section className="mb-10 overflow-x-scroll custom-scrollbar">
                    <div className="grid grid-cols-3 gap-4 min-w-[1200px] ">
                        {activeProjects.map((project, index) => (
                            <Actives key={index} {...project} />
                        ))}
                    </div>
                </section>



                <h2 className="pb-1 pl-2 font-bold whitespace-nowrap">Issues Reported in</h2>

                <section className="mb-10 overflow-x-scroll custom-scrollbar">
                    <div className="grid grid-cols-3 gap-4  min-w-[1200px] ">
                        {issuesReported.map((project, index) => (
                            <Actives key={index} {...project} />
                        ))}
                    </div>
                </section>


                <h2 className="pb-1 pl-2 font-bold whitespace-nowrap ">Completed Projects</h2>
                <section className="mb-10 overflow-x-scroll custom-scrollbar">
                    <div className="grid grid-cols-3 gap-4  min-w-[1200px] ">
                        {completedProjects.map((project, index) => (
                            <Actives key={index} {...project} />
                        ))}
                    </div>
                </section>
            </div>
        </>
    )
}

export default Projectcomponent;