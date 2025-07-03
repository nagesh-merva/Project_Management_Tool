
function Message() {
   return (
      <div className="px-2 flex justify-between w-1/2 h-fit mb-2">
         <div className="">
            <h1 className="text-lg font-bold"> Good Morning Team </h1>
            <p className="opacity-40 text-sm">Dashboard For Managing  Projects And Tasks</p>
         </div>
         <div className="space-x-4">
            <button className=" mt-1 px-6 py-2 text-nowrap bg-btncol rounded-3xl h-10 font-bold text-white hover:scale-95 hover:bg-btncol/80 transition-all shadow-xl"> Add Task</button>
            <button className=" mt-1 px-6 py-2 text-nowrap bg-btncol rounded-3xl h-10 font-bold text-white hover:scale-95 hover:bg-btncol/80 transition-all shadow-xl"> Add Update</button>
         </div>
      </div>
   )
}
export default Message