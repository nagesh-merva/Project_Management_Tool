
import Navigation from "../components/Navigation/Navigation"
import Header from "../components/header"
import UpdateBar from "../components/Home/UpdatesBar"
import MyTask from "../components/Home/MyTask"
import Activeproject from "../components/Home/Activeprojects"
import Message from "../components/message"
export default function Dashboard() {
    return (
        <div className="relative h-screen w-full flex flex-col bg-gray-100">
            <Navigation />
            <div className="w-[87%] h-full pt-20 flex place-self-end justify-center">
                <Header />
                <div className="pl-10 w-full h-full">
                    <Message />
                    <div className="flex h-[40%] w-full space-x-10">
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