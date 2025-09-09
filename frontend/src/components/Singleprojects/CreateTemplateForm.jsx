import { useState, useEffect } from "react"
import { X } from "lucide-react"

const CreateTemplateForm = ({ project_id, close }) => {
  const [templateName, setTemplateName] = useState("")
  const [phase, setPhase] = useState("")
  const [department, setDepartment] = useState("")
  const [checklistItems, setChecklistItems] = useState([])
  const [newItem, setNewItem] = useState({ title: "", desc: "" })
  const [departments, setDepartments] = useState([])
  const [phases, setPhases] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        const deptPromise = fetch("https://project-management-tool-uh55.onrender.com/all-dept-brief").then(res => res.json())
        const phasePromise = project_id
          ? fetch(`https://project-management-tool-uh55.onrender.com/all-phases?project_id=${project_id}`).then(res => res.json())
          : Promise.resolve([])

        const [deptData, phaseData] = await Promise.all([deptPromise, phasePromise])
        setDepartments(deptData)
        setPhases(phaseData)
      } catch (err) {
        console.error("Failed to fetch data", err)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [project_id])

  const addChecklistItem = () => {
    if (newItem.title.trim()) {
      setChecklistItems([...checklistItems, newItem])
      setNewItem({ title: "", desc: "" })
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    const payload = {
      project_id: project_id,
      template_name: templateName,
      department: department,
      phase: phase,
      fields: checklistItems,
    }


    if (payload.fields.length === 0) {
      alert("Please add atleast 1 field.")
      return
    }

    try {
      const res = await fetch("https://project-management-tool-uh55.onrender.com/add-new-template", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
      if (res.ok) {
        alert("Template Saved Successfully")
        setTemplateName("")
        setDepartment("")
        setPhase("")
        setChecklistItems([])
        window.location.reload()
      } else {
        alert("Failed to save template");
      }
    } catch (err) {
      console.error(err);
      alert("Error while saving template");
    } finally {
      setLoading(false)
      close()
    }
  }

  return (
    <div className="fixed -top-12 inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="p-6 w-full max-w-3xl mx-auto bg-white rounded-xl shadow-lg">
        <div className="flex w-full justify-between items-center mb-4">
          <h2 className="text-2xl font-bold mb-4">Create Template</h2>
          <X onClick={() => close()} className="text-black cursor-pointer " />
        </div>
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <span className="text-lg font-semibold">Loading...</span>
          </div>
        ) : (
          <>
            <table className="w-full text-sm mb-4 border-separate border-spacing-y-2">
              <thead>
                <tr className="bg-violet-200">
                  <th className="p-2 text-left">Sr</th>
                  <th className="p-2 text-left">Check List Item</th>
                  <th className="p-2 text-left">Description</th>
                </tr>
              </thead>
              <tbody>
                {checklistItems.map((item, index) => (
                  <tr key={index} className="bg-violet-100">
                    <td className="p-2">{index + 1}</td>
                    <td className="p-2">{item.title}</td>
                    <td className="p-2">
                      {item.desc || "No description provided"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="flex items-center gap-2 mb-6">
              <input
                type="text"
                placeholder="Checklist Item Title"
                value={newItem.title}
                onChange={(e) => setNewItem({ ...newItem, title: e.target.value })}
                className="flex-1 p-2 border rounded"
              />
              <input
                type="text"
                placeholder="Description"
                value={newItem.desc}
                onChange={(e) => setNewItem({ ...newItem, desc: e.target.value })}
                className="flex-1 p-2 border rounded"
              />
              <button
                onClick={addChecklistItem}
                className="px-4 py-2 bg-blue-800 text-white font-bold rounded-full"
              >
                + ADD
              </button>
            </div>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block font-medium mb-1">Template Name</label>
                <input
                  type="text"
                  value={templateName}
                  onChange={(e) => setTemplateName(e.target.value)}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>

              <div>
                <label className="block font-medium mb-1">Select Phase</label>
                <select
                  value={phase}
                  onChange={(e) => setPhase(e.target.value)}
                  className="w-full p-2 border rounded"
                  required
                >
                  <option value="">Select</option>
                  {phases.map((ph, idx) => (
                    <option key={idx} value={ph}>
                      {ph}
                    </option>
                  ))}
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block font-medium mb-1">Select Department</label>
                <select
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full p-2 border rounded"
                  required
                >
                  <option value="">Select</option>
                  {departments.map((dept, idx) => (
                    <option key={idx} value={dept.depy_id}>
                      {dept.dept_name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="md:col-span-2 flex justify-center mt-4">
                <button
                  type="submit"
                  className="bg-blue-800 text-white px-6 py-2 rounded-full font-semibold"
                >
                  Save
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  )
}

export default CreateTemplateForm
