import React, { useState } from "react";
import Calendar from "react-calendar";

const MyCalendar = () => {
    const [date, setDate] = useState(new Date());
    const [showCalendar, setShowCalendar] = useState(false);

    return (
        <div className="relative w-auto my-1">
            <input
                type="text"
                placeholder="Select Date"
                value={date.toDateString()}
                onFocus={() => setShowCalendar(true)}
                readOnly
                className="h-12 w-full p-3 my-2 rounded-md border-2 border-gray-300 text-gray-700 text-lg cursor-pointer"
            />
            {showCalendar && (
                <div className="absolute top-full left-0 bg-white p-4 rounded-lg shadow-lg z-10">
                    <Calendar
                        onChange={setDate}
                        value={date}
                        className="border-none rounded-lg"
                    />
                    <button
                        onClick={() => setShowCalendar(false)}
                        className="mt-2 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-all">
                        Save Date
                    </button>
                </div>
            )}
        </div>
    );
};

export default MyCalendar;
