const NewBreak = ({ head, par }) => {
    return (

        <div className=" w-[499px] h-[70px] bg-maintenance rounded-xl flex justify-between gap-2">
            <div className=" flex justify-center gap-1  p-2">
                <img src="/breaks.png" className="w-[36px] h-[36px] mt-2" ></img>
                <h1 className="font-bold text-base  ">{head}
                    <p className="text-paracolor text-sm">{par}</p>
                </h1>
            </div>

            <h1 className="font-bold text-xl p-4">₹ 1200,000 </h1>

        </div>

    )
}
export default NewBreak

