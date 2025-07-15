import { useState } from 'react'

const ManageProjectForm = ({ projectId, projectPhases, isInitialized, setInitialized }) => {
  const [formData, setFormData] = useState([
    { parent_phase: '', subphases: [{ subphase: '', start_date: '', remarks: '' }] },
  ])

  const [editablePhases, setEditablePhases] = useState(projectPhases || [])
  const [isSaving, setIsSaving] = useState(false)

  const handleParentPhaseChange = (index, value) => {
    const updated = [...formData]
    updated[index].parent_phase = value
    setFormData(updated)
  }

  const handleSubphaseChange = (phaseIndex, subIndex, field, value) => {
    const updated = [...formData]
    updated[phaseIndex].subphases[subIndex][field] = value
    setFormData(updated)
  }

  const addParentPhase = () => {
    setFormData([
      ...formData,
      { parent_phase: '', subphases: [{ subphase: '', start_date: '', remarks: '' }] },
    ])
  }

  const addSubphase = (index) => {
    const updated = [...formData]
    updated[index].subphases.push({ subphase: '', start_date: '', remarks: '' })
    setFormData(updated)
  }

  const submitInitialPhases = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/add-initial-phases', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          project_id: projectId,
          phases: formData,
        }),
      })

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`)
      setInitialized(true)
    } catch (err) {
      console.error('Phase Initialization Error:', err)
    }
  }

  const handleEditChange = (phaseIndex, subIndex, field, value) => {
    const updated = [...editablePhases]
    updated[phaseIndex].subphases[subIndex][field] = value
    setEditablePhases(updated)
  }

  const saveUpdatedPhases = async () => {
    setIsSaving(true)
    try {
      const response = await fetch('http://127.0.0.1:8000/update_project_phases', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          project_id: projectId,
          phases: editablePhases,
        }),
      })

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`)
      alert('Project phase status updated successfully!')
    } catch (err) {
      console.error('Save Error:', err)
      alert('Failed to save updates. Try again.')
    }
    setIsSaving(false)
  }

  if (!isInitialized) {
    return (
      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Define Initial Project Phases</h2>
        {formData.map((phase, i) => (
          <div key={i} className="border p-3 rounded space-y-2">
            <input
              type="text"
              placeholder="Parent Phase"
              value={phase.parent_phase}
              onChange={(e) => handleParentPhaseChange(i, e.target.value)}
              className="border px-2 py-1 w-full"
            />
            {phase.subphases.map((sub, j) => (
              <div key={j} className="grid grid-cols-3 gap-2">
                <input
                  type="text"
                  placeholder="Subphase Name"
                  value={sub.subphase}
                  onChange={(e) => handleSubphaseChange(i, j, 'subphase', e.target.value)}
                  className="border px-2 py-1"
                />
                <input
                  type="date"
                  value={sub.start_date}
                  onChange={(e) => handleSubphaseChange(i, j, 'start_date', e.target.value)}
                  className="border px-2 py-1"
                />
                <input
                  type="text"
                  placeholder="Remarks"
                  value={sub.remarks}
                  onChange={(e) => handleSubphaseChange(i, j, 'remarks', e.target.value)}
                  className="border px-2 py-1"
                />
              </div>
            ))}
            <button onClick={() => addSubphase(i)} className="text-sm text-blue-600">+ Add Subphase</button>
          </div>
        ))}
        <div className="flex gap-3">
          <button onClick={addParentPhase} className="px-4 py-2 bg-gray-200 rounded">+ Add Phase</button>
          <button onClick={submitInitialPhases} className="px-4 py-2 bg-blue-600 text-white rounded">
            Submit Phases
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold">Manage Project Phases</h2>
      {editablePhases.map((phase, i) => (
        <div key={i} className="border p-4 rounded-md space-y-3 bg-gray-50 shadow-sm">
          <h3 className="font-semibold text-md">{phase.parent_phase}</h3>
          {phase.subphases.map((sub, j) => (
            <div key={j} className="grid grid-cols-5 gap-3 items-center text-sm">
              <span className="truncate font-medium">{sub.subphase}</span>
              <select
                value={sub.status}
                onChange={(e) => handleEditChange(i, j, 'status', e.target.value)}
                className="border px-2 py-1 rounded"
              >
                <option value="not_started">Not Started</option>
                <option value="in_progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
              <input
                type="date"
                value={sub.start_date?.split('T')[0] || ''}
                onChange={(e) => handleEditChange(i, j, 'start_date', e.target.value)}
                className="border px-2 py-1 rounded"
              />
              <input
                type="date"
                value={sub.closed_date?.split('T')[0] || ''}
                onChange={(e) => handleEditChange(i, j, 'closed_date', e.target.value)}
                className="border px-2 py-1 rounded"
              />
              <input
                type="text"
                placeholder="Remarks"
                value={sub.remarks}
                onChange={(e) => handleEditChange(i, j, 'remarks', e.target.value)}
                className="border px-2 py-1 rounded"
              />
            </div>
          ))}
        </div>
      ))}
      <div className="flex justify-end">
        <button
          onClick={saveUpdatedPhases}
          disabled={isSaving}
          className="px-6 py-2 bg-green-600 text-white rounded shadow hover:bg-green-700"
        >
          {isSaving ? 'Saving...' : 'Save Status'}
        </button>
      </div>
    </div>
  )
}

export default ManageProjectForm
