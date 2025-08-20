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
        const stored = sessionStorage.getItem("all-emps")
        return stored ? JSON.parse(stored) : null
    })

    // Selected Department
    const [selectedDepartment, setDepart] = useState(() => {
        const stored = localStorage.getItem("selectedDepartment")
        return stored ? stored : ""
    })

    // Loading state
    const [loading, setLoading] = useState(false)

    // Analytics tab 
    const [activeTab, setActiveTab] = useState(() => {
        const stored = sessionStorage.getItem("analytics-tabs")
        return stored ? stored : "overview"
    });

    useEffect(() => {
        sessionStorage.setItem("analytics-tabs", activeTab)
    }, [activeTab])

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
    const LogIn = (emp, token) => {
        setEmp(emp)
        const data = { logged: true, token: token }
        setLoggedIn(data)
        localStorage.setItem("logged", JSON.stringify(data))
    }

    // Sync all-emps to localStorage
    const setAllEmployees = (empObj) => {
        setEmps(empObj)
        if (empObj) {
            sessionStorage.setItem("all-emps", JSON.stringify(empObj))
        } else {
            sessionStorage.removeItem("all-emps")
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
            localStorage.setItem("selectedDepartment", dept)
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

    // console.log(loggedIn.logged)

    useEffect(() => {
        if(loggedIn.logged){
            const cached = sessionStorage.getItem("all-emps")
            if (cached || cached !== null) {
                setAllEmployees(JSON.parse(cached))
            } else {
                fetchEmployees()
            }
        }
    }, [loggedIn])

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
                LogIn,
                activeTab,
                setActiveTab
            }}
        >
            {children}
        </MainContext.Provider>
    )
}