const A = [
    {
        head: "Total Budget",
        amount: "₹198,000",
        ap: "calculated Cost +20% Buffer ",
        color: "bg-color2",
        textColor: "text-color21"
    },
    {
        head: "Excpected Revenue",
        amount: "₹298,000",
        ap: "First Year Projection ",
        color: "bg-color3",
        textColor: "text-color31"



    },
    {
        head: "Profit Margin",
        amount: "29.3%",
        ap: "Above Industry Average",
        color: "bg-color4",
        textColor: "text-color41"

    }
]





import Newfin from "./NewFin"


function Financial() {
    return (


        <div className="w-[1065px] h-fit bg-white ml-10 mt-5 rounded-lg shadow-xl  rounded-b-none">
            <div className="w-[1065px] h-[50px] flex items-center justify-between px-4 " >
                <h className="font-bold flex gap-1 text-lg "><img src="/fin.png  " className="w-[24px] h-[24px]"></img>Financial Statements</h>
                <button className="w-[242.3px] h-fit bg-quickbtn flex justify-center gap-2 rounded-lg p-1  hover:bg-btncol/80 transition-all hover:scale-95 text-white"><img src="/fin2.png" className="w-[24px] h-[24px]"></img> Manage</button>
            </div>

            <div className="h-[124.5px] w-[1028.7px] flex p-3 justify-around mx-5 gap-6 ">
                {A.map((a, index) => (
                    <Newfin key={index} head={a.head} amount={a.amount} ap={a.ap} color={a.color} textColor={a.textColor} />
                ))}
            </div>
            <div className="w-full h-fit mt-7 flex items-center ml-5 gap-1">
                <img src="/time.png" className="w-[19.2px] h-[17px]"></img>
                <h1 className="font-bold text-lg" >Cost Breakdowns</h1>
            </div>


        </div>
    )
}
export default Financial