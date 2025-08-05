
import { Menu, Search, User } from "lucide-react"
import { useMainContext } from "../context/MainContext"

function Header() {
  const { logout } = useMainContext()

  const handleLogout = () => {
    if (window.confirm("DO YOU WANT TO LOGOUT?")) {
      logout()
      window.location.href = "/"
    }
  }
  const user = JSON.parse(localStorage.getItem("emp"))
  return (
    <header
      className="absolute top-2 place-self-center flex items-center justify-between bg-white px-5 py-1 shadow-md rounded-full w-3/5 h-fit mx-auto "
    >
      <div className="flex items-center space-x-5 w-full">
        <button className="p-2 rounded-full hover:bg-gray-100">
          <Menu className="h-5 w-5 text-gray-600 hover:text-purple-600" />
        </button>
        <div
          className="flex items-center bg-purple-50 rounded-full px-3 py-1 w-full max-w-md hover:shadow-md transition"
        >
          <input
            type="text"
            placeholder="Hinted search text"
            className="bg-transparent outline-none w-full text-gray-600 placeholder-gray-500"
          />
          <button className="ml-3 text-gray-600 hover:text-purple-600">
            <Search className="h-6 w-6" />
          </button>
        </div>
      </div>
      <div className="flex items-center space-x-5">
        <button onClick={handleLogout} className="p-3 rounded-full hover:bg-gray-100 transition">
          <User
            className="h-5 w-5 text-gray-600 hover:text-purple-600"
          />
        </button>
        <span
          className="font-montserrat font-normal text-lg text-gray-600 hover:text-purple-600 transition whitespace-nowrap"
        >
          {user.emp_name}
        </span>
      </div>
    </header>
  );
};


export default Header;
