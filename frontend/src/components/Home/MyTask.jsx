import Loading from "../Loading"
import Task from "./Task"
import { useState, useEffect } from "react"

function MyTask() {
    const [tasks, setTask] = useState([])
    const [showPopup, setShowPopup] = useState(false)
    const [selectedTask, setSelectedTask] = useState(null)
    const [loading, setLoading] = useState(false)
    const emp = JSON.parse(localStorage.getItem("emp"))
    const emp_id = emp?.emp_id

    useEffect(() => {
        GetTasks()
    }, [])

    const GetTasks = async () => {
        setLoading(true)
        const emp = JSON.parse(localStorage.getItem("emp"))
        try {
            const response = await fetch(`https://project-management-tool-uh55.onrender.com/get-tasks?emp_id=${emp.emp_id}`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
            })

            const data = await response.json()
            if (response.status === 200 || response.status === 201) {
                setTask(data)
            }
            // console.log(data)
        }
        catch (err) {
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    const handleTaskClick = (task) => {
        setSelectedTask(task)
        setShowPopup(true)
    }

    const handleCommentSubmit = async (e) => {
        setLoading(false)
        e.preventDefault()
        const comment_text = e.target.elements.comment.value
        const task_id = selectedTask?.task_id

        if (comment_text) {
            try {
                const response = await fetch("https://project-management-tool-uh55.onrender.com/add-comment", {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        emp_name: emp.emp_name,
                        task_id: task_id,
                        comment_text: comment_text
                    }),
                })

                if (response.ok) {
                    const newComment = {
                        emp_name: emp.emp_name,
                        comment: comment_text,
                        commented_on: new Date().toISOString(),
                    }
                    setSelectedTask(prev => ({
                        ...prev,
                        comments: [...prev.comments, newComment],
                    }))
                    e.target.reset();
                    alert("Comment updated successfully")
                } else {
                    alert("Failed to Add comment")
                }
            } catch (error) {
                alert("Error Adding Comment: " + error.message)
            } finally {
                setLoading(false)
            }
        }
    }

    const sortedTasks = tasks.sort((a, b) => new Date(b.deadline) - new Date(a.deadline))

    const handleMarkDone = async (task_id) => {
        if (!emp_id) return alert("Employee not found")
        setLoading(true)
        try {
            const response = await fetch("https://project-management-tool-uh55.onrender.com/update-task-status", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    emp_id: emp_id,
                    task_id: task_id,
                    status: "done",
                }),
            })

            if (response.ok) {
                setSelectedTask(prev => ({
                    ...prev,
                    members_assigned: prev.members_assigned.map(m =>
                        m.emp_id === emp_id ? { ...m, status: "done" } : m
                    ),
                }))
                alert("Status updated successfully")
            } else {
                alert("Failed to update status")
            }
        } catch (error) {
            alert("Error updating status: " + error.message)
        } finally {
            setLoading(false)
        }
    }

    const getDeadlineColor = (deadline) => {
        const now = new Date();
        const dl = new Date(deadline);
        const diffMs = dl - now;
        const diffHours = diffMs / (1000 * 60 * 60);

        if (diffMs < 0) {
            return "bg-red-200";
        } else if (diffHours <= 6) {
            return "bg-red-200"
        } else if (diffHours <= 48) {
            return "bg-yellow-100"
        }
        return ""
    }

    return (
        <>
            <div className="relative w-full md:w-1/2 pb-4">
                <h1 className="absolute -left-12 top-1/2 -translate-y-1/2 w-fit font-bold -rotate-90">My Tasks</h1>
                <div className="bg-white w-full h-full rounded-2xl drop-shadow-xl overflow-y-scroll custom-scrollbar">
                    {loading ? (
                        <Loading />
                    ) : (
                        <>
                            <h1 className="w-full pl-10 pt-2">{tasks.length} ongoing task</h1>
                            {sortedTasks && sortedTasks.map((task, index) => (
                                <div
                                    key={index}
                                    className={`rounded mb-2 mx-4 ${getDeadlineColor(task.deadline)}`}
                                >
                                    <Task taskData={task} OnclickTask={handleTaskClick} />
                                </div>
                            ))}
                        </>
                    )}
                </div>
            </div>
            {showPopup && selectedTask && (
                <div className="fixed inset-0 z-50  h-auto bg-black bg-opacity-40 flex items-center justify-center">
                    <div className="fixed max-w-1/2 min-w-[600px] max-h-[600px] bg-white p-6 overflow-y-auto">
                        {loading ? (
                            <Loading />
                        ) : (
                            <>
                                <button
                                    onClick={() => setShowPopup(false)}
                                    className="absolute top-4 right-4 text-gray-600 hover:text-red-500 text-2xl"
                                >
                                    &times;
                                </button>

                                <h2 className="text-2xl font-bold mb-4">{selectedTask.title}</h2>
                                <p className="text-gray-700 mb-2">{selectedTask.brief}</p>
                                <p className="text-sm text-gray-600 mb-1">
                                    Deadline: {new Date(selectedTask.deadline).toLocaleString("en-IN", {
                                        dateStyle: "medium",
                                        timeStyle: "short",
                                    })}
                                </p>
                                <p className="text-sm text-gray-600 mb-4">Assigned By: {selectedTask.created_by.emp_name}</p>
                                <p className="text-sm text-gray-600 mb-4">Project ID: {selectedTask.proj_id}</p>

                                <h3 className="font-semibold mb-2">Assigned Members:</h3>
                                <ul className="list-disc pl-5 mb-4">
                                    {selectedTask.members_assigned.map((member, idx) => (
                                        <li key={idx} className="flex justify-between items-center mb-2">
                                            <span className="font-medium">{member.emp_name}</span>

                                            {emp_id === member.emp_id && member.status === "assigned" ? (
                                                <button
                                                    onClick={() => handleMarkDone(selectedTask.task_id)}
                                                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-1 rounded"
                                                >
                                                    Mark as Done
                                                </button>
                                            ) : (
                                                <span className="text-blue-600">{member.status}</span>
                                            )}
                                        </li>
                                    ))}
                                </ul>

                                <h3 className="font-semibold mb-2">Comments:</h3>
                                <div className="max-h-60 overflow-y-auto border p-3 rounded mb-4 bg-gray-50 text-sm">
                                    {selectedTask.comments.map((c, idx) => (
                                        <div key={idx} className="mb-3">
                                            <p className="font-medium">{c.emp_name}</p>
                                            <p>{c.comment}</p>
                                            <p className="text-xs text-gray-500">
                                                {new Date(c.commented_on).toLocaleString()}
                                            </p>
                                            <hr className="mt-1" />
                                        </div>
                                    ))}
                                </div>

                                <form onSubmit={handleCommentSubmit} className="flex flex-col gap-3">
                                    <textarea
                                        name="comment"
                                        required
                                        placeholder="Add a comment..."
                                        className="p-3 border rounded resize-none"
                                    />
                                    <button
                                        type="submit"
                                        className="self-end bg-blue-600 text-white py-2 px-5 rounded hover:bg-blue-700"
                                    >
                                        Post Comment
                                    </button>
                                </form>
                            </>
                        )}
                    </div>
                </div>
            )}
        </>
    )
}
export default MyTask