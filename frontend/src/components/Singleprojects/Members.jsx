const Members = ({ name, profile, role, dept }) => {
    return (
        <div className="h-auto w-full place-self-center flex p-4 ">
            <img src={profile} alt="" className="h-10 w-10 place-self-end mx-4 bg-blue-300 p-3 rounded-full" />
            <div className="ml-2">
                <p className="text-base font-sans font-semibold">{name}</p>
                <p className="text-base font-sans font-thin ">{role}</p>
            </div>
            <div>
                <p className="text-base font-sans font-semibold ml-64">{dept}</p>
            </div>
        </div>
    )
}

export default Members