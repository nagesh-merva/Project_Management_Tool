const temp = [
    {
        head: "Development Checklist",
        par: "Development",
    },
    {
        head: "Design Checklist",
        par: "Design",
    },
    {
        head: "Client requirement checklist",
        par: "Admin",
    },
    {
        head: "Quotation Checklist",
        par: "Sales",
    },
];

import Newtemp from "./Newtemp";
function Template() {
    return (
        <div className="  ml-10  mt-5 w-[1065px] h-fit rounded-lg  bg-white  shadow-xl">
            <div className="font-bold text-xl flex p-5 mt-3 gap-1 ">
                <img src="/temd.png" className="w-[24px] h-[24px]"></img>
                Templates
            </div>
            <div className="w-full grid grid-cols-2 grid-rows-2 gap-3 pl-5 mt-4 mr-4">
                {temp.map((t, index) => (
                    <Newtemp key={index} head={t.head} par={t.par} />
                ))}
            </div>

            <div className="w-full flex justify-center mt-6">
                <div className=" w-[374.78px] h-[37.51px] bg-quickbtn flex items-center justify-center gap-1 rounded-xl hover:bg-btncol/80 transition-all hover:scale-95 mb-3">
                    <img src="/Create.png" className="w-[18px] h-[18px]"></img>
                    <button className="text-white  "> Create Template</button>
                </div>

            </div>

        </div>
    )

}
export default Template