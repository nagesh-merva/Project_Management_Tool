import { useState } from 'react'
import { CheckCircle, Circle, Calendar, Target, Plus, Save } from 'lucide-react'

const ManageProjectForm = ({ projectId, projectPhases, isInitialized, setInitialized, overallProgress }) => {
  const [formData, setFormData] = useState([
    { parent_phase: '', subphases: [{ subphase: '', remarks: '' }] },
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
      { parent_phase: '', subphases: [{ subphase: '', template_id: '', remarks: '' }] },
    ])
  }

  const addSubphase = (index) => {
    const updated = [...formData]
    updated[index].subphases.push({ subphase: '', template_id: '', remarks: '' })
    setFormData(updated)
  }

  const submitInitialPhases = async () => {
    setIsSaving(true)
    console.log(formData)
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
      if (response.ok) {
        setInitialized(true)
        setEditablePhases(formData)
      }
    } catch (err) {
      console.error('Phase Initialization Error:', err)
    } finally {
      setIsSaving(false)
    }
  }

  const calculateSubphaseProgress = (checklist) => {
    if (!checklist || checklist.length === 0) return 0
    const completed = checklist.filter(item => item.completed).length
    return Math.round((completed / checklist.length) * 100)
  }

  const handleChecklistToggle = (phaseIndex, subIndex, checklistIndex) => {
    const updated = [...editablePhases]
    updated[phaseIndex].subphases[subIndex].checklist[checklistIndex].completed =
      !updated[phaseIndex].subphases[subIndex].checklist[checklistIndex].completed

    const progress = calculateSubphaseProgress(updated[phaseIndex].subphases[subIndex].checklist)
    updated[phaseIndex].subphases[subIndex].progress = progress

    if (progress === 0) {
      updated[phaseIndex].subphases[subIndex].status = 'not_started'
    } else if (progress === 100) {
      updated[phaseIndex].subphases[subIndex].status = 'completed'
    } else {
      updated[phaseIndex].subphases[subIndex].status = 'in_progress'
    }

    setEditablePhases(updated)
  }

  const startSubphase = (phaseIndex, subIndex) => {
    const updated = [...editablePhases]
    updated[phaseIndex].subphases[subIndex].start_date = new Date().toISOString().split('T')[0]
    updated[phaseIndex].subphases[subIndex].status = 'in_progress'
    setEditablePhases(updated)
  }

  const saveUpdatedPhases = async () => {
    setIsSaving(true)

    console.log("project_id : ", projectId, "\nphases : ", editablePhases)
    try {
      const response = await fetch('http://127.0.0.1:8000/update_project_phases', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          project_id: projectId,
          phases: editablePhases,
        }),
      })

      if (response.status === 404 | response.status === 400) {
        alert(response.message)
      }

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`)
      if (response.ok) {
        alert('Project phases updated successfully!')
        window.location.reload()
      }

    } catch (err) {
      console.error('Save Error:', err)
      alert('Failed to save updates. Try again.')
    }
    setIsSaving(false)
  }

  if (!isInitialized) {
    return (
      <div className="space-y-6 w-full h-full overflow-auto scrollbar-thin">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h2 className="text-lg font-semibold text-blue-900 mb-2">Define Initial Project Phases</h2>
          <p className="text-blue-700 text-sm">Create phases and assign templates for automatic progress tracking</p>
        </div>

        {formData.map((phase, i) => (
          <div key={i} className="border-2 border-gray-200 p-4 rounded-lg space-y-3 bg-white shadow-sm">
            <input
              type="text"
              placeholder="Parent Phase (e.g., Planning, Design, Development)"
              value={phase.parent_phase}
              onChange={(e) => handleParentPhaseChange(i, e.target.value)}
              className="border-2 border-gray-300 px-3 py-2 w-full rounded-lg focus:border-blue-500 focus:outline-none"
            />

            {phase.subphases.map((sub, j) => (
              <div key={j} className="grid grid-cols-1 md:grid-cols-3 gap-3 p-3 bg-gray-50 rounded-lg">
                <input
                  type="text"
                  placeholder="Subphase Name"
                  value={sub.subphase}
                  onChange={(e) => handleSubphaseChange(i, j, 'subphase', e.target.value)}
                  className="border border-gray-300 px-3 py-2 rounded-md focus:border-blue-500 focus:outline-none"
                />
                <input
                  type="text"
                  placeholder="Remarks (optional)"
                  value={sub.remarks}
                  onChange={(e) => handleSubphaseChange(i, j, 'remarks', e.target.value)}
                  className="border border-gray-300 px-3 py-2 rounded-md focus:border-blue-500 focus:outline-none"
                />
              </div>
            ))}

            <button
              onClick={() => addSubphase(i)}
              className="text-sm text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1"
            >
              <Plus size={16} /> Add Subphase
            </button>
          </div>
        ))}

        <div className="flex gap-3">
          <button
            onClick={addParentPhase}
            className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg flex items-center gap-2 transition-colors"
          >
            <Plus size={16} /> Add Phase
          </button>
          <button
            onClick={submitInitialPhases}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
          >
            Initialize Project Phases
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 w-full h-full overflow-auto scrollbar-thin">
      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-green-900">Manage Project Phases</h2>
            <p className="text-green-700 text-sm">Track progress through template-based checklists</p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-green-600">{Math.round(overallProgress, 2)}%</div>
            <div className="text-sm text-green-700">Overall Progress</div>
          </div>
        </div>

        <div className="mt-3">
          <div className="w-full bg-green-200 rounded-full h-3">
            <div
              className="bg-green-600 h-3 rounded-full transition-all duration-500"
              style={{ width: `${overallProgress}%` }}
            />
          </div>
        </div>
      </div>

      {editablePhases.map((phase, i) => (
        <div key={i} className="border border-gray-300 rounded-lg overflow-hidden shadow-sm">
          <div className="bg-gray-800 text-white px-4 py-3">
            <h3 className="font-semibold text-lg">{phase.parent_phase}</h3>
          </div>

          {phase.subphases.map((sub, j) => (
            <div key={j} className="border-b border-gray-200 last:border-b-0">
              <div className="p-4 bg-white">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <h4 className="font-medium text-lg text-gray-900">{sub.subphase}</h4>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${sub.status === 'completed' ? 'bg-green-100 text-green-800' :
                      sub.status === 'in_progress' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                      {sub.status === 'not_started' ? 'Not Started' :
                        sub.status === 'in_progress' ? 'In Progress' : 'Completed'}
                    </span>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="text-xl font-bold text-blue-600">{sub.progress || 0}%</div>
                      <div className="text-xs text-gray-500">Complete</div>
                    </div>

                    {!sub.start_date && sub.status === 'not_started' && (
                      <button
                        onClick={() => startSubphase(i, j)}
                        className="px-3 py-1 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700 flex items-center gap-1"
                      >
                        <Calendar size={14} /> Start Phase
                      </button>
                    )}
                  </div>
                </div>

                {sub.start_date && (
                  <div className="mb-3 text-sm text-gray-600">
                    <span className="font-medium">Started:</span> {new Date(sub.start_date).toLocaleDateString()}
                  </div>
                )}

                <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${sub.progress || 0}%` }}
                  />
                </div>

                {sub.checklist && sub.checklist.length > 0 && (
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h5 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                      <Target size={16} />
                      Template Checklist ({sub.checklist.filter(item => item.completed).length}/{sub.checklist.length})
                    </h5>

                    <div className="space-y-2">
                      {sub.checklist.map((item, k) => (
                        <div key={k} className="flex items-center gap-3 p-2 rounded hover:bg-white transition-colors">
                          <button
                            onClick={() => handleChecklistToggle(i, j, k)}
                            className="flex-shrink-0"
                          >
                            {item.completed ? (
                              <CheckCircle className="text-green-600" size={20} />
                            ) : (
                              <Circle className="text-gray-400 hover:text-gray-600" size={20} />
                            )}
                          </button>
                          <span className={`flex-1 ${item.completed ? 'text-gray-500 line-through' : 'text-gray-900'}`}>
                            {item.title}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {sub.remarks && (
                  <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                    <span className="text-sm text-blue-800"><strong>Remarks:</strong> {sub.remarks}</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      ))}

      <div className="flex justify-end">
        <button
          onClick={saveUpdatedPhases}
          disabled={isSaving}
          className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg shadow font-medium flex items-center gap-2 transition-colors disabled:opacity-50"
        >
          <Save size={16} />
          {isSaving ? 'Saving...' : 'Save Progress'}
        </button>
      </div>
    </div>
  )
}

export default ManageProjectForm