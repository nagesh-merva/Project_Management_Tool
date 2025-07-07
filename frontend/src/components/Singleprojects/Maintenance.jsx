import {
    ArrowDownToLine,
    Database,
    GitBranch,
    Newspaper,
    Server
} from "lucide-react"

const Maintenance = ({ MaintObj, HostingObj }) => {
    const getIconForHost = (text) => {
        const lowerText = text?.toLowerCase() || ""
        if (lowerText.includes("backend")) return <Server className="w-4 h-4" />
        if (lowerText.includes("frontend")) return <GitBranch className="w-4 h-4" />
        if (lowerText.includes("database")) return <Database className="w-4 h-4" />
        return <Server className="w-4 h-4" />
    };

    return (
        <div className="relative w-full h-auto p-4 flex flex-col rounded-xl border border-gray-300 bg-white shadow-lg">
            <div className="flex gap-2 items-center mb-2">
                <Server color="#0C098C" fill="#FDDC5C" className="h-5 w-7" />
                <h1 className="font-semibold text-base">Issues and Maintenance </h1>
            </div>

            <h1 className="text-md px-2 mt-3 font-semibold">Maintenance</h1>
            <div className="px-2 flex flex-col gap-4 mt-2">
                {MaintObj?.map((item, idx) => (
                    <div
                        key={item.id || idx}
                        className="w-full h-auto min-h-[51px] bg-maintenance rounded-lg flex items-center justify-between py-1.5 px-3"
                    >
                        <div>
                            <h1 className="text-md">
                                {item.title}
                                <p className="text-[10px] text-paracolor">{item.descp}</p>
                            </h1>
                        </div>
                        <a
                            href={item.doc_link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className=" hover:opacity-70 text-download flex items-center"
                        >
                            <ArrowDownToLine color="#6347FF" className="h-5 w-7" />
                            Download
                        </a>
                    </div>
                ))}
            </div>

            <button className="w-2/3 h-auto my-3 py-1 bg-quickbtn rounded-xl text-white flex items-center justify-center text-lg font-semibold place-self-center hover:scale-95 hover:bg-btncol/80 transition-all">
                <Newspaper color="#FFFFFF" className="w-5 h-5 mx-1.5" /> Add New
            </button>

            <div className="w-full h-auto p-4 bg-maintenance rounded-lg">
                <h1 className="font-semibold text-lg">Hosting Details</h1>
                <p className="text-paracolor text-sm">Primary Servers, Databases , Content Delivery Network</p>
                <div className="grid grid-rows-auto gap-3 mt-3">
                    {HostingObj?.map((host, idx) => (
                        <a
                            key={idx}
                            href={host.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 text-download hover:underline"
                        >
                            {getIconForHost(`${host.title} ${host.link}`)}
                            <div className="px-1.5">
                                <h6>{host.title}</h6>
                                <p className="text-sm text-gray-500">{host.descp}</p>
                            </div>
                        </a>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default Maintenance