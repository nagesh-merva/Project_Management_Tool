function Srs() {
    return (
        <div className="ml-10 mr-6 w-full h-fit rounded-lg bg-gray-50 drop-shadow-xl mb-5">
            <div className="ml-6 flex  ">
                <img src="/icons/srss.png" alt="" className="h-6 w-6 my-4 " />
                <p className="my-4 ml-3 font-semibold">SRS And Requirments</p>
            </div>
            <div className="h-3/4 w-[96%] bg-blue-100 mx-6 rounded-xl">
                <p className="ml-8 mb-4 pt-3 font-semibold text-base">Key Requirments</p>
                <div className="ml-9 pb-3">
                    <li>Centralize project information, including milestones, documents, and assignments.</li>
                    <li>Enable team management, assigning roles, and monitoring workloads.</li>
                    <li>Provide bug tracking and reporting mechanisms.</li>
                    <li>Monitor website health metrics post-deployment.</li>
                    <li>Generate detailed analytics and reports for project status and team performance.</li>
                    <li>Ensure seamless communication with real-time notifications and updates.</li>
                </div>
            </div>
            <div className="flex justify-center ">
                <button className="mx-6 my-4 flex items-center bg-violet-500 rounded-3xl text-xl text-nowrap h-12 w-52 text-white hover:scale-95 hover:bg-btncol/80 transition-all shadow-xl font-normal">
                    <h1 className="mx-9 font-semibold">VIEW FULL SRS</h1>
                </button>
            </div>
        </div>
    )
}
export default Srs