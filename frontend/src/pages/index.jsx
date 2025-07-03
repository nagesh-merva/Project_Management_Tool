import Sidebar from "../components/Sidebar"
import Login from "../components/Login"
function Homepage() {
    return (
        <div className="h-full w-full md:flex  md:justify-end md:items-end  ">
            <Sidebar />
            <Login />
        </div>
    )
}
export default Homepage