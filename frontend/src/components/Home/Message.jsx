import AddTaskButton from "./AddTaskBtn"
import AddUpdateButton from "./AddUpdateBtn"

function getGreeting() {
   const hour = new Date().getHours()
   if (hour < 12) return "Good Morning"
   if (hour < 18) return "Good Afternoon"
   return "Good Evening"
}

function Message() {
   return (
      <div className="px-2 flex flex-col md:flex-row justify-between items-start md:items-center w-full md:w-1/2 h-fit mb-2 gap-2">
         <div>
            <h1 className="text-lg font-bold">{getGreeting()} Team</h1>
            <p className="opacity-40 text-sm">Dashboard For Managing Projects And Tasks</p>
         </div>
         <div className="space-x-2 flex">
            <AddTaskButton />
            <AddUpdateButton />
         </div>
      </div>
   )
}
export default Message