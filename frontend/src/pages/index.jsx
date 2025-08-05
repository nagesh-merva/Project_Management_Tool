import Sidebar from "../components/login/Sidebar"
import Login from "../components/login/Login"

function Homepage() {
    return (
        <div className="h-screen w-full bg-gradient-to-br from-gray-50 to-gray-100 relative overflow-hidden">
            <div className="absolute inset-0 opacity-5">
                <div className="absolute inset-0" style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                    backgroundSize: '60px 60px'
                }}></div>
            </div>
            
            <div className="relative z-10 h-full w-full md:flex">
                <Sidebar />
                <Login />
            </div>
        </div>
    )
}

export default Homepage