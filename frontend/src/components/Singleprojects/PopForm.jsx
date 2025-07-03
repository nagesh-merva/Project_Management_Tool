import { Scissors } from "lucide-react"
import { Play } from "lucide-react";
import MyCalendar from "./Calender";
import { useState } from "react";
const PopForm = ({ fields, title, subtitle }) => {

    const [enabled, setEnabled] = useState(false);
    return (

        <div className="h-fit w-1/4 shadow-2xl rounded-lg bg-white">
            <div className="border-2 h-auto w-auto border-gray-500 m-2 rounded-lg">
                <header>
                    <h1 className="text-2xl font-semibold pt-3 pl-4">{title}</h1>
                </header>
                <p className="text-base font-medium text-gray-400 pb-4 pl-5">{subtitle}</p>


                <div >

                    <form>
                        {fields.map((field, index) => (
                            <div key={index} className="flex flex-col w-full px-5">
                                {
                                    field.title && (
                                        <h1 className="pt-2">{field.title}</h1>
                                    )
                                }

                                {
                                    field.type === "checkbox" && (
                                        <div classname="flex flex-col w-full ">
                                            <label for="one" class=" text-base font-medium text-gray-900 ">
                                                <input id="one" type="checkbox" value={field.value} onChange="" className="w-5 h-5 m-2 mr-5 dark:ring-offset-gray-800 focus:ring-2 " />

                                                {field.label}</label>
                                        </div>
                                    )
                                }
                                {
                                    field.type === "select" && (
                                        <div className="relative w-auto my-2">
                                            {/* Scissors Icon (Left) */}

                                            {/* Select Dropdown */}
                                            <select className="appearance-none w-full p-4 text-xl font-medium border-2 border-gray-300 rounded-lg bg-white pl-4">
                                                <option value="" disabled selected className="">{field.title}</option>


                                                {field.options.map((option, index) => (
                                                    <option key={index} value={option.value}>{option.label}</option>
                                                ))}
                                            </select>

                                            {/* Play Icon (Right) */}
                                            <Play className="absolute right-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-black" />
                                        </div>
                                    )
                                }

                                {
                                    field.type === "text" && (
                                        <div className="">
                                            <input type="text" placeholder={field.label} className="h-12 w-full p-3 my-2 rounded-md border-2 border-gray-300 text-gray-300 text-lg"></input>
                                        </div>
                                    )
                                }
                                {
                                    field.type === "textarea" && (
                                        <div className="">
                                            <textarea type="text" rows="3" cols="50" className="w-full p-3 my-2 border-2 rounded-md text-lg text-gray-300 border-gray-300" placeholder={field.label}></textarea>
                                        </div>
                                    )
                                }
                                {
                                    field.type === "date" && (
                                        <MyCalendar />
                                    )
                                }
                                {
                                    field.type === "switch" && (
                                        <div className="flex w-full justify-between px-2">
                                            <h1>{field.label}</h1>
                                            <button
                                                onClick={(e) => {
                                                    e.preventDefault(); // Prevent page reload
                                                    setEnabled(!enabled); // Toggle switch state
                                                }}
                                                className={` w-10 h-6 flex items-center rounded-full p-1 mb-6 transition-colors ${enabled ? "bg-green-500" : "bg-gray-400"
                                                    }`}
                                            >
                                                <span
                                                    className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-transform ${enabled ? "translate-x-4" : "translate-x-0"
                                                        }`}
                                                />
                                            </button>
                                        </div>
                                    )
                                }
                                {
                                    field.type === "button" && (
                                        < div className="mx-4 mb-6 mt-3 flex justify-center items-center" >
                                            <button type="submit" className="flex flex-col items-center justify-center bg-gray-800 rounded-lg text-sm text-nowrap h-10 w-[97%] text-white hover:scale-95 hover:bg-btncol/80 transition-all shadow-xl font-normal">
                                                <h1 className="ml-4 font-semibold text-lg tracking-wider">{field.do}</h1>
                                            </button>
                                        </div>
                                    )
                                }
                            </div>
                        ))}

                    </form>
                </div>

            </div >
        </div >
    )
}
export default PopForm