import { useNavigate } from "react-router-dom"
const Issue = [
    {
        type: "text",
        label: "Name the bug",
        title: "Issue",
        value: "issueName",
    },
    {
        type: "checkbox",
        label: "Add Files",
        value: "addfiles",
    },
    {
        type: "textarea",
        label: "Value",
        title: "To Do / Brief"
    },
    {
        type: "button",
        do: "Save Bug Information"
    }

]
const Taskss = [
    {
        type: "text",
        label: "Value",
        title: "Task",
        value: "issueName",
    },
    {
        type: "textarea",
        label: "Feature details",
        title: "To Do / Brief"
    },
    {
        type: "select",
        title: "Members",
        options: [
            { value: "member1", label: "Member 1" },
            { value: "member2", label: "Member 2" },
            { value: "member3", label: "Member 3" },
        ],
    },
    {
        type: "button",
        do: "Add Task"
    }

]
const updates = [
    {
        type: "text",
        label: "Update",
        title: "Update",
        value: "updates",
    },
    {
        type: "text",
        label: "Link",
        title: "Link if any",
        value: "updates",
    },
    {
        type: "textarea",
        label: "Brief",
        title: "Description"
    },
    {
        type: "button",
        do: "Add Update"
    }

]

function Quick() {
    const navigate = useNavigate();
    const issuesrec = () => {
        navigate("/view", { state: { fields: Issue, title: "Fill Issue Information", subtitle: "Enter All details" } })
    }
    const tasksrec = () => {
        navigate("/view", { state: { fields: Taskss, title: "Task Information", subtitle: "Enter All details" } })
    }
    const updatesrec = () => {
        navigate("/view", { state: { fields: updates, title: "CROB Portfolio Website" } })
    }


    return (

        <div className=" h-[365px] w-[429px] ml-10 grid grid-rows-5 gap-2 bg-gray-50 rounded-xl shadow-lg justify-evenly">
            <div className="flex gap-2 ">
                <img src="/play.png" className="h-[24px] w-[26.88]  mt-4" />
                <h1 className=" mt-3 font-bold text-xl"> Quick Actions</h1>
            </div>

            <button onClick={issuesrec} className="w-[370.75px] h-[41px] bg-quickbtn border-2 border-gray-500 rounded-lg text-white flex  gap-4 pt-1 text-lg pl-20  font-semibold  hover:scale-95 hover:bg-btncol/80 transition-all hover:text-white"> <img src="/report.png" className="w-[24px] h-[24px] ml-7  " /> Report Issue</button>
            <button className="w-[370.75px] h-[41px] border-2 border-gray-400 rounded-lg flex  gap-4 pt-1 text-lg pl-20  font-semibold  hover:scale-95 hover:bg-btncol/80 transition-all hover:text-white"> <img src="/design.png" className="w-[24px] h-[24px] ml-7" />View Design</button>
            <button className="w-[370.75px] h-[41px]  bg-quickbtn border-2 border-gray-500 rounded-lg text-white flex  gap-4 pt-1 text-lg  pl-20  font-semibold  hover:scale-95 hover:bg-btncol/80 transition-all hover:text-white"> <img src="/document.png" className="w-[24px] h-[24px] ml-7" />Documentation</button>
            <button onClick={tasksrec} className="w-[370.75px] h-[41px] border-2 border-gray-400 rounded-lg flex  gap-4 pt-1 text-lg pl-20  font-semibold  hover:scale-95 hover:bg-btncol/80 transition-all hover:text-white"><img src="/addtasks.png" className="w-[24px] h-[24px] ml-7" /> Add Tasks</button>
            <button onClick={updatesrec} className="w-[370.75px] h-[41px] bg-quickbtn border-2 border-gray-500 rounded-lg text-white flex  gap-4 pt-1 text-lg pl-20  font-semibold mb-4  hover:scale-95 hover:bg-btncol/80 transition-all hover:text-white"><img src="/addupdate.png" className="w-[24px] h-[24px] ml-7" /> Add Updates</button>
        </div>
    )
}
export default Quick