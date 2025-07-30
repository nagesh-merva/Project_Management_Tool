import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Task = ({ taskData, OnclickTask }) => {
    const navigate = useNavigate();

    const {
        title,
        brief,
        created_by,
        deadline,
        members_assigned,
        proj_id,
        task_id,
        comments,
        status
    } = taskData;

    const formattedDeadline = new Date(deadline).toLocaleString("en-IN", {
        dateStyle: "medium",
        timeStyle: "short",
    })

    // console.log("Task data:", title, created_by.emp_name, created_by.profile)

    return (
        <div
            onClick={() => OnclickTask(taskData)}
            className="cursor-pointer h-auto w-full place-self-center flex p-4 hover:bg-gray-100 transition"
        >
            <div className="h-10 w-11 place-self-center mx-4 bg-blue-300 rounded-full flex items-center justify-center text-white font-bold">
                {created_by.profile ? (
                    <img src={created_by.profile} alt="Task creator" className="w-full aspect-sqaure rounded-full" />
                ) : (
                    <p>{created_by.emp_name[0]}</p>
                )}
            </div>
            <div className="place-self-start w-full">
                <h1 className="text-md font-semibold">{title}</h1>
                <p className="text-sm text-gray-600">{brief}</p>
                <p className="text-xs text-gray-500 mt-1">Deadline: {formattedDeadline}</p>
            </div>
        </div>
    );
};

export default Task;