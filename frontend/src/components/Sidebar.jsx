function Sidebar() {
    return (
        <div className="md:absolute left-0 top-0 h-full md:w-1/2 w-full bg-black flex justify-center items-center">
            <div className="absolute bg-white h-2/3 w-3/4 flex justify-center items-center rounded-3xl">
                <img className="h-5/6 w-5/6 " src="/manage.png" alt="" />
            </div>

            <img className="absolute sm:h-5 md:h-8 h-10 w-auto bottom-5 right-5" src="/logo.png" alt="" />
        </div>

    )
}
export default Sidebar