import { useNavigate } from "react-router-dom";
const Portfolio = [
    {
        type: "select",
        label: "Active",
        title: "Status",
        value: "status",
        options: [
            { value: "member1", label: "Member 1" },
            { value: "member2", label: "Member 2" },
            { value: "member3", label: "Member 3" },
        ],
    },
    {
        type: "text",
        label: "HREF",
        title: "Client Logo",
        value: "clientlogo",
    },
    {
        type: "text",
        label: "Value",
        title: "Deadline",
        value: "deadline",
    },
    {
        type: "textarea",
        label: "Value",
        title: "Description",
        value: "description",
    },
    {
        type: "button",
        do: "Submit"
    }
]
function Brief() {
    const navigate = useNavigate();
    const Portfolioo = () => {
        navigate("/view", { state: { fields: Portfolio, title: "Crob Portfolio Website" } })
    }
    return (
        <div className="ml-10 mr-6 w-fit h-fit rounded-lg bg-gray-50 drop-shadow-xl">
            <div className="flex justify-between">
                <div className="flex ">
                    <h1 className="mx-4 my-3 font-semibold">CROB Portfolio Website</h1>
                    <img src="./icons/star2.png" alt="" className="h-9 w-12 ml-2 mt-2 " />
                </div>
                <div className="flex mx-4">
                    <button className="mx-4 my-3 px-10 py-2 flex items-center bg-green-200 rounded-3xl text-nowrap h-8 w-34 text-green-600 hover:scale-95 hover:bg-btncol/80 transition-all shadow-xl font-normal">
                        <h1 className="font-semibold">Active</h1>
                    </button>

                    <img onClick={Portfolioo} src="./icons/pen.png" alt="" className="h-7 w-7 mt-4 mr-1" />

                </div>
            </div>
            <div className="w-4/5 mt-3 mb-6 mr-20 ml-6 font-medium text-gray-400">
                <p>A complete redesign of the existing e-commerce platform with focus on improved user experience, mobile responsiveness, and enhanced performance metrics.</p>
            </div>
            <div className="flex justify-between">
                <div className="flex">
                    <img src="./icons/calendar.png" alt="" className="h-4 w-4 ml-9 mt-1 mr-2" />
                    <p className="font-semibold">Start: March 1, 2024</p>
                </div>
                <div className="flex mr-9 ml-1 pb-4">
                    <img src="./icons/time.png" alt="" className="h-5 w-5 ml-9 mr-3 mt-1 font-thin" />
                    <p className="font-semibold">Deadline: July 23, 2024</p>
                </div>
            </div>
        </div>
    )
}
export default Brief