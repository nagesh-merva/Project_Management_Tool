import Member from "./Member"
import { Users } from "lucide-react"
const Teammember = ({ members }) => {

    const Addmem = () => {
        // navigate("/view", { state: { fields: AddMembers, title: "Add Member", subtitle: "Add All details" } })
    }

    return (
        <div className="w-2/5 h-auto  bg-gray-50 rounded-xl shadow-xl overflow-y-scroll custom-scrollbar p-4">
            <div className="flex justify-between items-center mb-4">
                <div className="px-2 flex space-x-3">
                    <Users color="#FF911B" className="h-5 w-5 " />
                    <h1 className="font-semibold text-base">Team Members</h1>
                </div>
                <button onClick={Addmem} className="flex items-center bg-blue-700 rounded-full text-sm h-8 px-4 text-white hover:scale-95 transition-all shadow-lg">
                    <h1>Add</h1>
                </button>
            </div>
            <div className="space-y-3">
                {members?.length > 0 ? (
                    members.map((member, index) => (
                        <Member
                            key={index}
                            name={member.name}
                            id={member.emp_id}
                            role={member.role}
                            dept={member.dept}
                            profile={member.profile}
                        />
                    ))
                ) : (
                    <p className="text-gray-500 text-center mt-10">No team members assigned yet.</p>
                )}
            </div>
        </div>
    )
}

export default Teammember
