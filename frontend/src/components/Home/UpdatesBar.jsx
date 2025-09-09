import { useEffect, useState } from "react"
import UpdateDiv from "./Update"
import Loading from "../Loading"

function UpdateBar() {
    const [allUpdates, setAllUpdates] = useState([])
    const [showViewed, setShowViewed] = useState(false)
    const [viewedUpdates, setViewedUpdates] = useState(() => JSON.parse(localStorage.getItem("viewedUpdates")) || [])
    const [loading, setLoading] = useState(false)

    const emp = JSON.parse(localStorage.getItem("emp"))
    const emp_id = emp?.emp_id

    useEffect(() => {
        GetUpdates()

    }, [])

    const GetUpdates = async () => {
        setLoading(true)
        try {
            const response = await fetch(`https://project-management-tool-uh55.onrender.com/get-updates?emp_id=${emp_id}`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
            });

            const data = await response.json();
            if (response.ok) {
                setAllUpdates(data);
            } else {
                console.error("Failed to fetch updates.");
            }
        } catch (err) {
            console.error(err.message);
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        const storedViewed = JSON.parse(localStorage.getItem("viewedUpdates")) || []
        setViewedUpdates(storedViewed)
    }, [])

    const handleMarkAsViewed = (updateId) => {
        if (!viewedUpdates.includes(updateId)) {
            const updatedViewed = [...viewedUpdates, updateId]
            setViewedUpdates(updatedViewed)
            localStorage.setItem("viewedUpdates", JSON.stringify(updatedViewed))
        }
    }

    const unviewedUpdates = allUpdates
        .filter(update => !viewedUpdates.includes(update.id))
        .sort((a, b) => new Date(b.created_on) - new Date(a.created_on));

    const viewedOnly = allUpdates
        .filter(update => viewedUpdates.includes(update.id))
        .sort((a, b) => new Date(b.created_on) - new Date(a.created_on));

    return (
        <div className="relative pb-4 flex flex-col items-center h-full w-full md:w-1/2 min-w-[290px]">
            <h1 className="absolute -left-20 top-1/2 -translate-y-1/2 w-fit font-bold -rotate-90">Recent Updates</h1>
            <div className="p-4 mr-5 rounded-xl w-full h-full flex flex-col items-center overflow-y-scroll custom-scrollbar bg-white drop-shadow-xl">
                {loading ? (
                    <Loading />
                ) : (
                    <div className="w-full px-3 flex flex-col items-center space-y-1">
                        {unviewedUpdates.length > 0 ? (
                            unviewedUpdates.map((update, index) => (
                                <UpdateDiv
                                    key={index}
                                    update={update}
                                    onView={() => handleMarkAsViewed(update.id)}
                                    isViewed={false}
                                />
                            ))
                        ) : (
                            <p className="text-gray-500 text-center">No new updates.</p>
                        )}

                        {showViewed && viewedOnly.map((update, index) => (
                            <UpdateDiv
                                key={index}
                                update={update}
                                onView={() => { }}
                                isViewed={true}
                            />
                        ))}

                        {viewedOnly.length > 0 && (
                            <button
                                className="mt-4 w-fit bg-btncol hover:bg-btncol/90 text-white py-2 px-4 rounded"
                                onClick={() => setShowViewed(!showViewed)}
                            >
                                {showViewed ? "Hide Viewed Updates" : "View old Updates"}
                            </button>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

export default UpdateBar
