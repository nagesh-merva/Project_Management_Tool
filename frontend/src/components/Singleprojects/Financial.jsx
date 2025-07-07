import { useState } from "react"
import Newfin from "./FinanceDataBox"
import { Calculator, LucideLandmark, TableRowsSplit, TrendingUp, TrendingDown, ChartColumn } from "lucide-react"
import CostBreakdowns from "./CostBreakdowns"
import SpenditureTable from "./SpenditureTable"

const Financial = ({ FinancialData }) => {
    const [data, setData] = useState([
        {
            head: "Total Budget",
            amount: "₹" + FinancialData?.total_budget,
            ap: "Calculated Cost +20% Buffer",
            color: "bg-color2",
            textColor: "text-color21"
        },
        {
            head: "Expected Revenue",
            amount: "₹" + FinancialData?.expected_revenue,
            ap: "First Year Projection",
            color: "bg-color3",
            textColor: "text-color31"
        },
        {
            head: "Profit Margin",
            amount: FinancialData?.profit_margin + "%",
            ap: "Above Industry Average",
            color: "bg-color4",
            textColor: "text-color41"
        }
    ])

    const spenditure = FinancialData?.spenditure_analysis || []
    const totalSpent = spenditure.reduce((sum, item) => sum + parseInt(item.cost), 0)
    const variance = FinancialData?.total_budget - totalSpent
    const isOverBudget = variance < 0

    return (
        <div className="w-full h-fit bg-white rounded-lg shadow-lg p-5 ">
            <div className="w-full h-fit flex items-center justify-between">
                <h1 className="font-semibold flex items-center gap-1 text-md">
                    <Calculator color="#0C098C" fill="#FF7972" className="w-5 h-5" /> Financial Statements
                </h1>
                <button className="w-auto h-fit px-5 py-1 bg-quickbtn flex items-center justify-center gap-2 rounded-lg hover:bg-btncol/80 transition-all hover:scale-95 text-white">
                    <LucideLandmark className="w-5 h-5" /> Manage
                </button>
            </div>

            <div className="h-[124.5px] w-auto flex p-3 justify-around mx-5 gap-6 ">
                {data.map((item, index) => (
                    <Newfin key={index} head={item.head} amount={item.amount} ap={item.ap} color={item.color} textColor={item.textColor} />
                ))}
            </div>

            <div className="w-full h-fit flex items-center mt-10 gap-1">
                <TableRowsSplit color="#0E02EB" className="w-5 h-5" />
                <h1 className="font-semibold text-base">Cost Breakdowns</h1>
            </div>

            <CostBreakdowns Breakdowns={FinancialData?.cost_breakdown} />

            <div className="w-full h-fit flex items-center mt-10 gap-1">
                <ChartColumn color="#0E02EB" className="w-5 h-5" />
                <h1 className="font-semibold text-base">Spenditure Analysis</h1>
            </div>

            <SpenditureTable spenditure={FinancialData?.spenditure_analysis} />
            <div className="w-full h-auto px-5">
                <div className={`w-full mt-6 p-6 rounded-2xl  ${isOverBudget ? 'bg-red-50' : 'bg-green-50'} flex flex-col items-center text-center border ${isOverBudget ? 'border-red-300' : 'border-green-300'}`}>
                    <h2 className="text-2xl font-bold mb-4 text-gray-800">Project Spenditure Summary</h2>

                    <div className="text-lg text-gray-700 mb-3">
                        Total Amount Spent: <span className="font-extrabold text-black">₹{totalSpent}</span>
                    </div>

                    <div className={`flex items-center gap-2 px-4 py-2 rounded-full ${isOverBudget ? 'bg-red-200 text-red-800' : 'bg-green-200 text-green-800'} font-semibold text-md`}>
                        {isOverBudget ? (
                            <>
                                <TrendingUp className="w-5 h-5" />
                                Over Budget by ₹{Math.abs(variance)}
                            </>
                        ) : (
                            <>
                                <TrendingDown className="w-5 h-5" />
                                Under Budget by ₹{variance}
                            </>
                        )}
                    </div>

                    <p className="mt-4 text-sm text-gray-500 italic">
                        {isOverBudget ? 'Consider optimizing resources to align with budget goals.' : 'Project is progressing within the allocated budget.'}
                    </p>
                </div>
            </div>
        </div>
    )
}

export default Financial
