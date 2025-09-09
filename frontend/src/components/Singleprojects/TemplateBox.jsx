import { ClipboardList, Download } from "lucide-react"

const TemplateBox = ({ head, par, phase, download, fillTemplate }) => {
    return (

        <div className=" w-full h-fit bg-maintenance rounded-lg flex justify-between items-center">
            <div className=" p-3 ">
                <h1 className="font-semibold text-base">{head}</h1>
                <p className="text-paracolor text-sm">{par}</p>
            </div>
            <p className="text-paracolor text-sm text-center">{phase}</p>
            <div className="flex   justify-center gap-1 mr-2  items-center p-2">
                <ClipboardList className="w-[27.17px] h-[24px] text-download" />
                <button onClick={fillTemplate} className="text-download  hover:underline mr-3 "> Fill Template </button>
                <Download className="w-[27.17px] h-[24px] text-download" />
                <button onClick={download} className="text-download hover:underline "> Download </button>
            </div>
        </div>

    )
}
export default TemplateBox
