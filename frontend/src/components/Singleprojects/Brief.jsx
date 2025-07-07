import { useNavigate } from "react-router-dom"
import { Calendar, Timer, SquarePen } from "lucide-react";
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
const Brief = ({ clientDetails, projBrief, status, start, deadline }) => {
    const navigate = useNavigate();
    const Portfolioo = () => {
        navigate("/view", { state: { fields: Portfolio, title: "Crob Portfolio Website" } })
    }

    return (
        <div className="w-full h-fit rounded-lg bg-gray-50 drop-shadow-xl">
            <div className="flex h-fit items-center justify-between">
                <div className="flex items-center mx-6 my-3 space-x-5">
                    <h1 className=" text-xl font-semibold">{clientDetails?.name}</h1>
                    {/* {clientDetails.logo ? (
                        <img src={clientDetails.logo} alt="client logo" />
                    ) : ( */}
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-xl font-bold">
                        {clientDetails?.name[0]}
                    </div>
                    {/* )} */}
                </div>
                <div className="flex mx-4">
                    <button className="mx-4 my-3 px-10 py-2 flex items-center bg-green-200 rounded-3xl text-nowrap h-8 w-34 text-green-600 group group-hover:scale-95 hover:bg-btncol/80 transition-all font-normal">
                        <h1 className="font-semibold group-hover:text-white transition-colors">{status}</h1>
                    </button>

                    <SquarePen onClick={Portfolioo} color="#6347FF" className="h-7 w-7 mt-4 mr-1 hover:scale-95 transition-transform" />
                </div>
            </div>
            <div className="w-4/5 mt-3 mb-6 mr-20 ml-6 font-medium text-gray-400">
                <p>{projBrief}</p>
            </div>
            <div className="flex justify-between">
                <div className="flex justify-center">
                    <Calendar alt="" className="h-5 w-5 ml-6  mr-2" />
                    <p className="font-semibold">Start: {start?.split("T")[0]}</p>
                </div>
                <div className="flex justify-center mr-9 ml-1 pb-4">
                    <Timer className="h-5 w-5 ml-9 mr-3" />
                    <p className="font-semibold">Deadline: {deadline?.split("T")[0]}</p>
                </div>
            </div>
        </div>
    )
}
export default Brief