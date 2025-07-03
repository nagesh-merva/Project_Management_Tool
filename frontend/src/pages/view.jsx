import PopForm from "../components/Singleprojects/PopForm"
import { useLocation } from "react-router-dom"
function View() {
    const location = useLocation()
    const { fields } = location.state || []
    const { title, subtitle } = location.state || ""

    return (
        <div className="w-full h-screen flex items-center justify-center bg-black/20 overflow-y-auto">
            <PopForm fields={fields} title={title} subtitle={subtitle} />
        </div>
    )
}
export default View