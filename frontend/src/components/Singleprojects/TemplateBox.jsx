const TemplateBox = ({ head, par, download, fillTemplate }) => {
    return (

        <div className=" w-full h-fit bg-maintenance rounded-lg flex justify-between ">
            <div className=" p-3 ">
                <h1 className="font-semibold text-base">{head}</h1>
                <p className="text-paracolor text-sm">{par}</p>
            </div>
            <div className="flex   justify-center gap-1 mr-2  items-center p-2">
                <img src="/Fill.png" className="w-[27.17px] h-[24px]" ></img>
                <button onClick={fillTemplate} className="text-download  hover:underline mr-3 "> Fill Template </button>
                <img src="/download.png" className="w-[27.17px] h-[24px]" ></img>
                <button onClick={download} className="text-download hover:underline "> Download </button>
            </div>
        </div>

    )
}
export default TemplateBox
