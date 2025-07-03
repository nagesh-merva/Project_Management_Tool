


const Actives = ({ proname, role, phase, team, description, start, deadline, per, editLink, codeLink, webLink }) => {
    return (
        <div className="w-full min-w-[380px]  rounded-lg bg-white shadow-md p-4 flex flex-col">
            <div className=" border-2 border-black p-4 rounded-lg">
                <div className="w-full flex justify-between border-b border-black pb-2 mb-4">
                    <h1 className="text-sm font-semibold font-sans">{proname}</h1>
                    <p className="text-sm font-semibold font-sans text-orange-600">{per}</p>
                </div>


                <div className="flex justify-between items-start mb-4">
                    <div>
                        <p className="text-sm text-gray-700">{`Your role: ${role}`}</p>
                        <p className="text-sm text-gray-700">{`Current phase: ${phase}`}</p>
                    </div>
                    <div className="text-sm text-gray-400 text-right">
                        <p>{`Start: ${start}`}</p>
                        <p>{`Deadline: ${deadline}`}</p>
                    </div>
                </div>


                <div className="flex items-center mb-4">
                    <p className="text-sm text-gray-700 mr-2">Team:</p>
                    <div className="flex -space-x-1">
                        {team.map((member, idx) => (
                            <img
                                key={idx}
                                src={member}
                                alt={`Team member ${idx + 1}`}
                                className="w-6 h-6 rounded-full border border-white hover:bg-gray-200 "
                            />
                        ))}
                    </div>
                </div>

                <div className="flex items-center justify-between">

                    <p className="text-sm text-gray-700 text-wrap w-[64%]">{`Description: ${description}`}</p>
                    <div className="flex space-x-2 place-self-end">
                        <a
                            href={editLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center"
                        >
                            <button className="p-1 rounded-lg hover:bg-gray-200 ">
                            <PenTool  color="#6347FF" className="h-6 w-full"/> 
                            </button>
                        </a>
                        <div className="w-px h-6 bg-black"></div>

                        <a
                            href={codeLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center"
                        >
                            <button className="p-1 rounded-lg hover:bg-gray-200">
                            <SquareDashedBottomCode   color="#47FF72" className="h-6 w-full"/>  
                            </button>
                        </a>
                        <div className="w-px h-6 bg-black"></div>

                        <a
                            href={webLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center"
                        >
                            <button className="p-1 rounded-lg hover:bg-gray-200">
                            <Globe color="#0C098C" className="h-6 w-full place-self-end bg-[FDDC5C] " />
                            </button>
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Actives;