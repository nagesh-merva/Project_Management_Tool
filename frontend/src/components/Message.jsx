import AddTaskButton from "./Home/AddTaskBtn"
import AddUpdateButton from "./Home/AddUpdateBtn"

function Message() {
   return (
      <div className="px-2 flex justify-between w-1/2 h-fit mb-2">
         <div className="">
            <h1 className="text-lg font-bold"> Good Morning Team </h1>
            <p className="opacity-40 text-sm">Dashboard For Managing  Projects And Tasks</p>
         </div>
         <div className="space-x-4">
            <AddTaskButton />
            <AddUpdateButton />
         </div>
      </div>
   )
}
export default Message