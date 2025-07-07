import { useEffect, useState } from "react"

const SpenditureTable = ({ spenditure }) => {
    const [groupedData, setGroupedData] = useState({})
    const departments = ["Sales", "Dev", "Design", "Maintenance"]
    // console.log(spenditure)

    useEffect(() => {
        if (spenditure && spenditure.length > 0) {
            const grouped = spenditure.reduce((acc, item) => {
                if (!acc[item.month]) acc[item.month] = {}
                acc[item.month][item.dept.toUpperCase()] = parseInt(item.cost)
                return acc
            }, {})
            setGroupedData(grouped)
        }
    }, [spenditure])

    const getTotal = (monthData) => {
        return departments.reduce((sum, dept) => sum + (monthData[dept.toUpperCase()] || 0), 0)
    }

    if (!spenditure || spenditure.length === 0 || Object.keys(groupedData).length === 0) {
        return <div className="w-full text-center p-5">Loading or No Spenditure Data</div>
    }

    return (
        <div className="w-full mt-6 px-5 overflow-x-auto">
            <table className="w-full bg-blue-50 text-center border-collapse">
                <thead>
                    <tr className="bg-gray-100 text-black">
                        <th className="py-2 px-4">Month</th>
                        {departments.map((dept, idx) => (
                            <th key={idx} className="py-2 px-4">{dept}</th>
                        ))}
                        <th className="py-2 px-4">Total</th>
                    </tr>
                </thead>
                <tbody>
                    {Object.entries(groupedData).map(([month, monthData], idx) => (
                        <tr key={idx} className="border-t border-gray-300 hover:bg-blue-200">
                            <td className="py-2 px-4 font-semibold">{month}</td>
                            {departments.map((dept, i) => (
                                <td key={i} className="py-2 px-4">{monthData[dept.toUpperCase()] || "-"}</td>
                            ))}
                            <td className="py-2 px-4 font-bold">{getTotal(monthData)}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

export default SpenditureTable
