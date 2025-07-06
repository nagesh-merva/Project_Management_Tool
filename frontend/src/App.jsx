import React, { useState } from "react"
import { Routes, Route, useParams, Navigate } from "react-router-dom"
import Homepage from "./pages/Index"
import Dashboard from "./pages/Dashboard"
import ProjectsPage from "./pages/Projects"
import Singleproject from "./pages/Singleproject"
import Department from "./pages/Department"
import SingleEmployee from "./pages/SingleEmployee"
import { useMainContext } from "./context/MainContext"

function ProtectedRoute({ children }) {
  const { loggedIn } = useMainContext()
  if (!loggedIn.logged) {
    return <Navigate to="/" replace />
  }

  return children
}

function App() {

  return (
    <div className="md:flex justify-center items-center h-full w-full ">
      <Routes>
        <Route index path="/" element={<Homepage />} />
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/projects" element={<ProtectedRoute><ProjectsPage /></ProtectedRoute>} />
        <Route path="/singleproject" element={<ProtectedRoute><Singleproject /></ProtectedRoute>} />
        <Route path="/departments" element={<ProtectedRoute><Department /></ProtectedRoute>} />
        <Route path="/departments/:id" element={<ProtectedRoute><SingleEmployee /></ProtectedRoute>} />
      </Routes>
    </div>
  )
}

export default App