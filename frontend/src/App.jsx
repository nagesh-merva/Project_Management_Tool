import React from "react"
import { Routes, Route, useParams } from "react-router-dom"
import Homepage from "./pages/Index"
import Dashboard from "./pages/Dashboard"
import ProjectsPage from "./pages/Projects"
import Singleproject from "./pages/Singleproject"
import Department from "./pages/Department"
import SingleEmployee from "./pages/SingleEmployee"
import { MainProvider } from "./context/MainContext"

function SingleEmployeeWithId() {
  const { id } = useParams()
  return <SingleEmployee id={id} />
}

function App() {
  return (
    <div className="md:flex justify-center items-center h-full w-full ">
      <MainProvider>
        <Routes>
          <Route index path="/" element={<Homepage />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/projects" element={<ProjectsPage />} />
          <Route path="/singleproject" element={<Singleproject />} />
          <Route path="/departments" element={<Department />} />
          <Route path="/departments/:id" element={<SingleEmployeeWithId />} />
        </Routes>
      </MainProvider>
    </div>
  )
}

export default App