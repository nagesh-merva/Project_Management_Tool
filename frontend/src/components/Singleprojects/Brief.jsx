
import { Calendar, Timer, SquarePen } from "lucide-react";
import { useState } from "react";
import PopupForm from "../Home/PopUpForm";
import { useParams } from "react-router-dom";
const Brief = ({ clientDetails, project_name, projBrief, status, start, deadline }) => {
    const [showPopup, setShowPopup] = useState(false)
    const { id } = useParams()
    const [fields, setFields] = useState([
        {
            name: "project_id",
            type: "stored",
            value: id
        },
        {
            name: "descp",
            type: "textarea",
            optional: true
        },
        {
            name: "status",
            type: "select",
            fields: [
                { name: "active", value: "active" },
                { name: "inactive", value: "inactive" },
                { name: "completed", value: "completed" }
            ],
            multi: false,
            optional: true
        },
        {
            name: "deadline",
            type: "date",
            allowPastDate: false,
            optional: true
        },
    ])
    const editclientdetails = () => {
        setShowPopup(true);
    }
    return (
        <>
            <div className="w-full h-fit rounded-lg bg-gray-50 drop-shadow-xl">
                <div className="flex h-fit items-center justify-between">
                    <div className="flex items-center mx-6 my-3 space-x-5">
                        <h1 className=" text-xl font-semibold">{clientDetails?.name}</h1>
                        {/* {clientDetails.logo !== null ? (
                            <img src={clientDetails.logo} alt="client logo" />
                        ) : ( */}
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-xl font-bold">
                            {clientDetails?.name[0]}
                        </div>
                        {/* )} */}
                    </div>
                    <div className="flex mx-4">
                        <button className={` ${status === "inactive" ? "text-gray-500 bg-gray-200" : (status === "delayed" || status === "uncomplete") ? "text-red-500 bg-red-200" : "text-green-600 bg-green-200"} mx-4 my-3 px-10 py-2 flex items-center rounded-3xl text-nowrap h-8 w-34 group group-hover:scale-95 hover:bg-btncol/80 transition-all font-normal`}>
                            <h1 className="font-semibold group-hover:text-white transition-colors">{status}</h1>
                        </button>

                        <SquarePen onClick={() => editclientdetails()} color="#6347FF" className="h-7 w-7 mt-4 mr-1 hover:scale-95 transition-transform" />
                    </div>
                </div>
                <div className="w-4/5 mt-3 mb-6 mr-20 ml-6 font-medium text-gray-400">
                    <h1>{project_name}</h1>
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
            <PopupForm
                isVisible={showPopup}
                onClose={() => setShowPopup(false)}
                formTitle="Edit Project brief"
                endpoint="http://127.0.0.1:8000/edit-project-brief"
                fields={fields}
            />
        </>
    )
}
export default Brief