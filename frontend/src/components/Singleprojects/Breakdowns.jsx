const Breakdowns = [
    {
        head: "Development Team",
        par: "developers 20,000 X 6",

    },
    {
        head: "Infrastrucure",
        par: "cloud services , CI/CD Monitoring",
    },
    {
        head: "Third Party Services",
        par: "APIs ,Analytics, Security Services",
    },
    {
        head: "Quality Assurance",
        par: "Testing Teams and Automation Tools ",
    },

    {
        head: "Infrastrucure",
        par: "cloud services , CI/CD Monitoring",
    },
    {
        head: "Development Team",
        par: "developers 20,000 X 6",
    },
];


import NewBreak from "./NewBreaks"

function Breakdownss() {
    return (
        <div className="w-[1065px] h-[900px] bg-white   ml-10 pl-4 pt-4 rounded-t-none " >
            <div className="w-full  grid grid-cols-2 grid-rows-3 gap-3">
                {Breakdowns.map((B, index) => (
                    <NewBreak key={index} head={B.head} par={B.par} />
                ))}
            </div>

        </div>
    );
}
export default Breakdownss