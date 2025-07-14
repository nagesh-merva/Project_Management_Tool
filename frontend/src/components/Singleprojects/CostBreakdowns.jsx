import { Network } from "lucide-react"

const CostBreakdowns = ({ Breakdowns }) => {
    return (
        <div className="w-full h-auto p-5 bg-white" >
            <div className="w-full grid grid-cols-2 gap-3">
                {Breakdowns?.map((item, index) => (
                    <div key={index} className=" w-full h-16 bg-maintenance  border-2 border-gray-200 rounded-xl flex justify-between gap-2">
                        <div className=" flex justify-center gap-1 p-2">
                            <Network color="#000000" className="p-2 w-11 h-11 bg-btncol/70 rounded-lg border border-black" />
                            <div className="px-2 flex flex-col">
                                <h1 className=" font-bold text-base  ">{item.title}</h1>
                                <p className="text-paracolor text-sm">{item.calc_brief}</p>
                            </div >
                        </div>
                        <h1 className="font-bold text-xl p-4">₹ {item.cost} </h1>
                    </div>
                ))}
            </div>
        </div>
    )
}
export default CostBreakdowns