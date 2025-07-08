import { useState } from "react"
import Navigation from "../components/Navigation/Navigation"
import Header from "../components/header"
import UpdateBar from "../components/Home/UpdatesBar"
import MyTask from "../components/Home/MyTask"
import Activeproject from "../components/Home/Activeprojects"
import Message from "../components/Home/Message"
import { Menu, X } from "lucide-react"

export default function Dashboard() {
    const [navOpen, setNavOpen] = useState(false)

    return (
        <div className="relative h-screen w-full flex flex-col bg-gray-100 min-w-[800px]">
            <button
                className="fixed top-4 left-4 z-50 md:hidden bg-white p-2 rounded shadow"
                onClick={() => setNavOpen(!navOpen)}
                aria-label="Toggle navigation"
            >
                {navOpen ? (
                    <X size={32} />
                ) : (
                    <Menu size={32} />
                )}
            </button>
            <div
                className={`
                        fixed top-0 left-0 h-full w-[30%]s z-40 transition-transform duration-300
                        ${navOpen ? "translate-x-0" : "-translate-x-full"}
                        md:fixed md:top-0 md:left-0 md:h-full md:w-[13%] md:z-40 md:translate-x-0 md:block
                    `}
            >
                <Navigation />
            </div>
            {navOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-30 z-30 md:hidden"
                    onClick={() => setNavOpen(false)}
                />
            )}

            <div className="w-full md:w-[87%] h-full pt-20 flex place-self-end justify-center transition-all duration-300">
                <Header />
                <div className="pl-10 pr-7 w-full h-full">
                    <Message />
                    <div className="md:flex h-fit md:h-[40%] w-full space-x-3 md:space-x-10">
                        <MyTask />
                        <UpdateBar />
                    </div>
                    <div className="h-[52%] w-full ">
                        <Activeproject />
                    </div>
                </div>
            </div>
        </div>
    )
}