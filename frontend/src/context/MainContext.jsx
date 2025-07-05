import React, { createContext, useContext, useState, useEffect } from "react"

const MainContext = createContext()

export const useMainContext = () => useContext(MainContext)

export const MainProvider = ({ children }) => {
    // Employee state
    const [emp, setEmpState] = useState(() => {
        const stored = localStorage.getItem("emp")
        return stored ? JSON.parse(stored) : null
    })

    // Selected Department
    const [selectedDepartment, setDepart] = useState(() => {
        const stored = sessionStorage.getItem("selectedDepartment")
        return stored ? stored : ""
    })

    // Loading state
    const [loading, setLoading] = useState(false)

    // Sync emp to localStorage
    const setEmp = (empObj) => {
        setEmpState(empObj)
        if (empObj) {
            localStorage.setItem("emp", JSON.stringify(empObj))
        } else {
            localStorage.removeItem("emp")
        }
    }

    // Logout function
    const logout = () => {
        setEmp(null)
        localStorage.removeItem("emp")
        window.location.href = "/"
    }

    const setDepartment = (dept) => {
        setDepart(dept)
        if (dept) {
            sessionStorage.setItem("selectedDepartment", dept)
        }
    }


    return (
        <MainContext.Provider
            value={{
                emp,
                setEmp,
                logout,
                loading,
                setLoading,
                selectedDepartment,
                setDepartment
            }}
        >
            {children}
        </MainContext.Provider>
    )
}