
const SetsDiv = ({ ...props }) => {
    return (
        <div className="bg-white shadow-xl rounded-lg w-60 h-32 flex flex-col justify-between p-3">
            <div className="flex justify-between">
                <h2 className="text-sm font-semibold ">{props.title}</h2>
                <div >
                    {props.icon}
                </div>
            </div>
            <h2 className="text-2xl my-2 font-bold ml-2">{props.value}</h2>
            <h2 className="text-sm text-green-500 font-bold flex  ">+{props.percentage}%
                <h1 className="ml-1 text-sm text-black">vs last month</h1>
            </h2>
        </div>
    )
}
export default SetsDiv;