import React, { createContext, useContext, useState, useEffect } from "react"

const MainContext = createContext()

export const useMainContext = () => useContext(MainContext)

export const MainProvider = ({ children }) => {
    // Employee state
    const [emp, setEmpState] = useState(() => {
        const stored = localStorage.getItem("emp")
        return stored ? JSON.parse(stored) : null
    })

    const [loggedIn, setLoggedIn] = useState(() => {
        const stored = localStorage.getItem("logged")
        return stored ? JSON.parse(stored) : { logged: false, token: null }
    })

    // All Employees
    const [allEmps, setEmps] = useState(() => {
        const stored = localStorage.getItem("all-emps")
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

    // sync loggedin to localStorage
    const LogIn = (token) => {
        const data = { logged: true, token: token }
        setLoggedIn(data)
        localStorage.setItem("logged", JSON.stringify(data))
    }

    // Sync all-emps to localStorage
    const setAllEmployees = (empObj) => {
        setEmps(empObj)
        if (empObj) {
            localStorage.setItem("all-emps", JSON.stringify(empObj))
        } else {
            localStorage.removeItem("all-emps")
        }
    }

    // Logout function
    const logout = () => {
        setEmp(null)
        localStorage.removeItem("emp")
        localStorage.removeItem("logged")
        window.location.href = "/"
    }

    const setDepartment = (dept) => {
        setDepart(dept)
        if (dept) {
            sessionStorage.setItem("selectedDepartment", dept)
        }
    }

    const fetchEmployees = async () => {
        try {
            const response = await fetch('http://127.0.0.1:8000/all-employees')
            const data = await response.json()
            if (response.ok) {
                setAllEmployees(data)
            } else {
                alert("Failed to fetch employees")
            }
        } catch (err) {
            alert(err.message)
        }
    }

    useEffect(() => {
        fetchEmployees()
    }, [])

    return (
        <MainContext.Provider
            value={{
                emp,
                setEmp,
                allEmps,
                logout,
                loading,
                setLoading,
                selectedDepartment,
                setDepartment,
                loggedIn,
                LogIn
            }}
        >
            {children}
        </MainContext.Provider>
    )
}