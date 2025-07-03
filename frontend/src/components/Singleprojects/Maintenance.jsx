function Maintenance() {

    return (
        <div className="h-[565px] w-[429px]  ml-10  mt-5 rounded-xl border-1 border-gray-300 bg-white shadow-2xl">
            <h1 className="  font-semibold text-2xl flex pl-10 gap-2"> <img src="/issues.png " className="h-[24px] w-[24px] mt-2"></img>Issues And Maintenance</h1>
            <h1 className="text-xl ml-6 mt-3 font-semibold">Maintenance</h1>
            <div className="grid grid-rows-3 gap-4 ml-6 mt-2  ">
                <div className="w-[375.5px] h-[51px] bg-maintenance  rounded-lg flex  items-center justify-between pl-2">
                    <h1 className="text-md"> Maintenence Report  <p className="text-sm text-paracolor">Weekly Maintenance Report</p></h1>
                    <button className=" mr-3  hover:opacity-70 text-download flex underline"> <img src="/download.png"></img>Download</button>
                </div>
                <div className="w-[375.5px] h-[51px] bg-maintenance  rounded-lg flex  items-center justify-between pl-2">
                    <h1 className="text-md"> Maintenence Report  <p className="text-sm text-paracolor">Weekly Maintenance Report</p></h1>
                    <button className=" mr-3  hover:opacity-70 text-download flex underline"> <img src="/download.png"></img>Download</button>
                </div>
                <div className="w-[375.5px] h-[51px] bg-maintenance  rounded-lg flex  items-center justify-between pl-2">
                    <h1 className="text-md"> Maintenence Report  <p className="text-sm text-paracolor">Weekly Maintenance Report</p></h1>
                    <button className=" mr-3  hover:opacity-70 text-download flex underline"> <img src="/download.png"></img>Download</button>
                </div>


            </div>
            <button className="w-[370.75px] h-[42px] bg-quickbtn rounded-xl text-white flex  gap-4 text-lg pl-20  font-semibold mb-4 ml-6 mt-3  hover:scale-95 hover:bg-btncol/80 transition-all pt-2"><img src="/addupdate.png" className="w-[24px] h-[24px] ml-7 " /> Add New</button>
            <h1 className="text-xl font-semibold ml-6">Hosting Details</h1>
            <div className="w-[375.5px] h-[165px] bg-maintenance ml-6 rounded-lg mt-3 pl-3 ">
                <h1 className="font-semibold text-lg  pt-2">Render</h1>
                <p className="text-paracolor text-sm ">Backend hosting</p>
                <div className="grid grid-rows-3 gap-3 mt-2">

                    <a className="flex items-center gap-1 text-download hover:underline"> <img src="/production.png" className="h-[16px] w-[16px]"></img>Production Environment</a>
                    <a className="flex items-center gap-1 text-download  hover:underline"> <img src="/staging.png" className="h-[16px] w-[16px]" ></img>Staging Environment</a>
                    <a className="flex items-center gap-1 text-download  hover:underline"><img src="/database.png" className="h-[16px] w-[16px]"></img>Database</a>
                </div>

            </div>
        </div >
    )
}
export default Maintenance