import { saveAs } from "file-saver"
import { useState } from "react"
import { useParams } from "react-router-dom"
import * as XLSX from "xlsx"
import TemplateBox from "./TemplateBox"
import CreateTemplateForm from "./CreateTemplateForm"
import FillTemplateForm from "./FillTemplateForm"

const Templates = ({ templates }) => {
    const { id } = useParams()
    const [showForm, setShowForm] = useState(false)
    const [templateData, setTemplateData] = useState(null)
    const [isFillTmpOpen, setIsTmpOpen] = useState(false)

    const downloadTemplate = (template) => {
        const { template_name, department, phase, fields } = template

        const workbook = XLSX.utils.book_new()

        const sheetData = [
            [template_name],
            [],
            ["Department", department],
            ["Phase", phase],
            [],
            ["ID", "Title", "Description", "Remark"]
        ]

        const fieldRows = Object.entries(fields).map(([key, value], index) => [
            index + 1,
            key,
            typeof value === "boolean" ? (value ? "This is completed" : "Pending") : value,
            typeof value === "boolean" ? (value ? "✔️" : "⬜") : ""
        ])

        sheetData.push(...fieldRows)

        const worksheet = XLSX.utils.aoa_to_sheet(sheetData)

        const range = XLSX.utils.decode_range(worksheet["!ref"])

        const titleCell = worksheet["A1"];
        titleCell.s = {
            font: { bold: true, sz: 14 },
            alignment: { horizontal: "center", vertical: "center" }
        }

        worksheet["!merges"] = [{ s: { r: 0, c: 0 }, e: { r: 0, c: 3 } }]

        ["A6", "B6", "C6", "D6"]?.forEach((cell) => {
            if (worksheet[cell]) {
                worksheet[cell].s = {
                    font: { bold: true },
                    alignment: { horizontal: "center" }
                };
            }
        })

        for (let R = 6; R <= range.e.r; ++R) {
            for (let C = 0; C <= 3; ++C) {
                const cellAddress = XLSX.utils.encode_cell({ r: R, c: C })
                if (worksheet[cellAddress]) {
                    worksheet[cellAddress].s = {
                        alignment: { horizontal: "center", vertical: "center" }
                    }
                }
            }
        }

        XLSX.utils.book_append_sheet(workbook, worksheet, "Template")

        const buffer = XLSX.write(workbook, { type: "array", bookType: "xlsx", cellStyles: true })
        const blob = new Blob([buffer], { type: "application/octet-stream" })
        saveAs(blob, `${template_name}.xlsx`)
    }

    const openTemplate = (template) => {
        setTemplateData(template)
        setIsTmpOpen(true)
    }

    return (
        <>
            <div className="w-full h-auto rounded-lg p-5 bg-white shadow-lg">
                <div className="font-bold text-xl flex gap-1">
                    <img src="/temd.png" className="w-[24px] h-[24px]" />
                    Templates
                </div>

                <div className="w-full mt-5 grid grid-cols-2 grid-rows-auto gap-4">
                    {templates?.map((temp, idx) => (
                        <div key={idx} className="flex flex-col bg-gray-50 rounded-lg p-3 shadow border border-gray-200">
                            <TemplateBox head={temp.template_name} par={temp.department} download={() => downloadTemplate(temp)} fillTemplate={() => openTemplate(temp)} />
                        </div>
                    ))}
                </div>

                <div className="w-full flex justify-center mt-6">
                    <button onClick={() => setShowForm(true)} className="w-[374.78px] h-[37.51px] bg-quickbtn flex items-center justify-center gap-1 rounded-xl hover:bg-btncol/80 transition-all hover:scale-95 mb-3">
                        <img src="/Create.png" className="w-[18px] h-[18px]" />
                        <div className="text-white">Create Template</div>
                    </button>
                </div>
            </div>
            {showForm && <CreateTemplateForm project_id={id} close={() => setShowForm(false)} />}
            {isFillTmpOpen && (<FillTemplateForm template={templateData} close={() => setIsTmpOpen(false)} />)}
        </>
    )
}

export default Templates