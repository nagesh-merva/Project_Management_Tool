import { Files } from "lucide-react"

const Srs = ({ srs }) => {
    console.log(srs)

    return (
        <div className="h-fit rounded-xl bg-gray-50 drop-shadow-xl mb-6 p-6">
            <div className="flex items-center mb-4">
                <Files color="#0C098C" fill="#79EE8D" className="h-7 w-7" />
                <p className="ml-3 text-lg font-bold text-gray-800">SRS & Requirements</p>
            </div>
            <div className="w-[96%] bg-blue-50 mx-auto rounded-xl p-5 mb-4 border border-blue-200">
                <p className="font-semibold text-base text-blue-800 mb-3">Key Requirements</p>
                <ul className="list-disc ml-6 space-y-2 text-gray-700 text-sm">
                    {srs?.key_req && srs.key_req.map((req, index) => (
                        <li key={index}>{req}</li>
                    ))}
                </ul>
            </div>
            <div className="flex justify-center">
                <a href={srs?.srs_doc_link} target="_blank" rel="noopener noreferrer">
                    <button className="flex items-center bg-violet-600 rounded-full text-base h-12 px-8 text-white hover:scale-95 hover:bg-violet-700 transition-all shadow-lg font-medium">
                        View Full SRS
                    </button>
                </a>
            </div>
        </div>
    )
}

export default Srs
