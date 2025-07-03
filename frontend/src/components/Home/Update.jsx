const UpdateDiv = ({ update, onView, isViewed }) => {
    const { title, brief, update_by, link, created_on } = update

    const handleClick = () => {
        onView()
        if (link) window.open(link, "_blank")
    }

    console.log(update_by)

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
                className="aspect-square h-4/5 rounded-full bg-btncol/50 border-2 border-gray-400 text-xl font-bold flex justify-center items-center"
            >
                {update_by[0]}
            </div>
        </div>
    )
}

export default UpdateDiv
