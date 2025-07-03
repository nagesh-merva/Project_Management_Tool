import React from "react"
import { Routes, Route } from "react-router-dom"
import Homepage from "./pages/index"
import Dashboard from "./pages/dashboard"
import ProjectsPage from "./pages/projects"
import Singleproject from "./pages/Singleproject"
import View from "./pages/view"
function App() {

  return (
    <div className="md:flex justify-center items-center h-full w-full ">
      <Routes>
        <Route index path="/" element={<Homepage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/projects" element={<ProjectsPage />} />
        <Route path="/singleproject" element={<Singleproject />} />
        <Route path="/view" element={<View />} />

      </Routes>
    </div>
  )
}

export default App