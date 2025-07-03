import { useNavigate } from "react-router-dom"
const Feature = [
    {
        feature: "User Authentication",
        desc: "A complete redesign of the existing e-commerce platform ...",
    },
    {
        feature: "User Authentication",
        desc: "Enhancing the payment system with new providers and improved UI.",
    },
    {
        feature: "User Authentication",
        desc: "Optimizing load times and database queries for better performance.",
    },
];

const AddFeatures = [
    {
        type: "text",
        label: "Feature",
        title: "Feature Name",
        value: "featureName",
    },
    {
        type: "textarea",
        label: "Brief / TODO",
        title: "Brief / TODO",
        value: "featureDescription",
    },
    {
        type: "date",
        label: "Due Date",
        title: "Due Date",
        value: "dueDate",
    },
    {
        type: "select",
        label: "Members",
        title: "Add Members",
        value: "members",
        options: [
            { value: "member1", label: "Member 1" },
            { value: "member2", label: "Member 2" },
            { value: "member3", label: "Member 3" },
        ],
    },
    {
        type: "button",
        do: "Save Feature Information"
    }
]
import Newfeatures from "./Newfeatures";
function Features() {
    const navigate = useNavigate();
    const Addfeat = () => {
        navigate("/view", { state: { fields: AddFeatures, title: "Feature Information", subtitle: "Enter All details" } })
    }
    return (
        <div className="w-2/5 ml-8 aspect-3/4 bg-gray-50 rounded-xl drop-shadow-xl overflow-y-scroll custom-scrollbar">
            <div className=" flex justify-between">
                <div className="mt-4 ml-7 flex">
                    <img src="./icons/files.png" alt="" className="h-4 w-5 mt-1 " />
                    <p className="ml-3 font-semibold text-base">Features to Develop</p>
                </div>
                <button onClick={Addfeat} className=" mx-6 mt-4 mb-1 flex items-center bg-blue-700 rounded-3xl text-sm text-nowrap h-6 w-16 text-white hover:scale-95 hover:bg-btncol/80 transition-all shadow-xl font-normal ">
                    <h1 className="ml-4 font-semibold">ADD</h1>
                </button>
            </div>
            {Feature.map((feat, index) => (
                <Newfeatures key={index} feature={feat.feature} dsc={feat.desc} />
            ))}
        </div>
    )
}
export default Features