import { useState } from "react"

const UpdateDiv = ({ update, onView, isViewed }) => {
    const { title, brief, update_by, link, created_on } = update

    const handleClick = () => {
        onView()
        if (link) window.open(link, "_blank")
    }

    const [hovered, setHovered] = useState(false)

    return (
        <div
            onClick={handleClick}
            className={`px-4 py-2 h-auto w-full flex items-center justify-between border-b pb-2 border-gray-400 rounded-lg cursor-pointer ${!isViewed ? "bg-indigo-200/20" : "bg-white"}`}
        >
            <div className="place-self-start">
                <h1 className="text-md font-semibold font-sans">{title}</h1>
                <p className="text-sm font-sans font-thin text-gray-400">{brief}</p>
                <p className="text-xs text-gray-500 mt-1">{new Date(created_on).toLocaleString()}</p>
            </div>
            <div
                className={`flex items-center justify-center relative transition-all duration-200 ease-in-out
                    ${hovered ? "w-32 px-3 py-2 bg-btncol/80" : "w-10 h-10 bg-btncol/50"}
                    rounded-full border-2 border-gray-400 cursor-pointer`}
                onMouseEnter={() => setHovered(true)}
                onMouseLeave={() => setHovered(false)}
            >
                {hovered ? (
                    <span className="text-sm font-bold text-gray-800 truncate">{update_by.emp_name}</span>
                ) : (
                    <span className="text-xl font-bold text-gray-800">{update_by.emp_name[0]}</span>
                )}
            </div>
        </div>
    )
}

export default UpdateDiv
