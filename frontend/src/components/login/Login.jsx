import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useMainContext } from "../../context/MainContext"
import { Eye, EyeOff, User, Lock, ArrowRight, Shield } from "lucide-react"

function Login() {
    const { LogIn, loggedIn } = useMainContext()
    const navigate = useNavigate()
    const [name, setname] = useState("")
    const [password, setpassword] = useState("")
    const [showPassword, setShowPassword] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [errors, setErrors] = useState({})

    useEffect(() => {
        if (loggedIn.logged) {
            navigate("/dashboard", { replace: true })
        }
    }, [loggedIn.logged])

    const validateForm = () => {
        const newErrors = {}
        if (!name.trim()) {
            newErrors.name = "Employee ID is required"
        }
        if (!password.trim()) {
            newErrors.password = "Password is required"
        }
        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const SubmitLogin = async (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        setIsLoading(true);
        setErrors({});

        const formData = new FormData();
        formData.append("username", name);
        formData.append("password", password);

        try {
            const response = await fetch("http://127.0.0.1:8000/login", {
                method: "POST",
                body: formData,
            });

            const data = await response.json();

            if (response.status === 201 || response.status === 200) {
                LogIn(data.emp, data.token)
                navigate("/dashboard");
            } else if (response.status === 401) {
                setErrors({ general: "Invalid credentials. Please try again." });
            } else if (response.status === 400) {
                setErrors({ general: "Please enter both username and password." });
            }
        } catch (err) {
            setErrors({ general: "Connection error. Please try again later." });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center w-full md:w-1/2 h-full px-6 py-8 relative">
            <div className="absolute top-20 right-20 w-20 h-20 bg-blue-100 rounded-full opacity-20 animate-pulse"></div>
            <div className="absolute bottom-32 left-16 w-16 h-16 bg-purple-100 rounded-full opacity-20 animate-pulse" style={{ animationDelay: '1s' }}></div>

            <div className="w-full max-w-md relative z-10">
                <div className="text-center mb-3">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl mb-3 shadow-lg">
                        <img src="/logo_icon.png" alt="logo_icon.png" className="w-10 h-10" />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent mb-2">
                        CROB
                    </h1>
                    <p className="text-lg md:text-xl text-gray-600 font-medium">
                        Management Tool
                    </p>
                    <p className="text-sm text-gray-500 mt-2">
                        Secure access to your dashboard
                    </p>
                </div>
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-2xl border border-white/20 p-8 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-purple-50/50 rounded-2xl"></div>

                    <div className="relative z-10">
                        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Welcome Back</h2>

                        {errors.general && (
                            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                                {errors.general}
                            </div>
                        )}

                        <form onSubmit={SubmitLogin} className="space-y-6">
                            <div className="space-y-2">
                                <label htmlFor="name" className="block text-sm font-semibold text-gray-700">
                                    Employee ID
                                </label>
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                                    <input
                                        type="text"
                                        id="name"
                                        value={name}
                                        onChange={(e) => {
                                            setname(e.target.value)
                                            if (errors.name) setErrors(prev => ({ ...prev, name: '' }))
                                        }}
                                        placeholder="Enter your employee ID"
                                        className={`w-full pl-10 pr-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/70 ${errors.name ? 'border-red-300' : 'border-gray-200 hover:border-gray-300'
                                            }`}
                                    />
                                </div>
                                {errors.name && (
                                    <p className="text-red-500 text-xs mt-1">{errors.name}</p>
                                )}
                            </div>
                            <div className="space-y-2">
                                <label htmlFor="password" className="block text-sm font-semibold text-gray-700">
                                    Password
                                </label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        id="password"
                                        value={password}
                                        onChange={(e) => {
                                            setpassword(e.target.value)
                                            if (errors.password) setErrors(prev => ({ ...prev, password: '' }))
                                        }}
                                        placeholder="Enter your password"
                                        className={`w-full pl-10 pr-12 py-3 border-2 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/70 ${errors.password ? 'border-red-300' : 'border-gray-200 hover:border-gray-300'
                                            }`}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                                    >
                                        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                    </button>
                                </div>
                                {errors.password && (
                                    <p className="text-red-500 text-xs mt-1">{errors.password}</p>
                                )}
                            </div>
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold py-3 px-6 rounded-xl hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98]"
                            >
                                {isLoading ? (
                                    <div className="flex items-center justify-center">
                                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                                        Signing In...
                                    </div>
                                ) : (
                                    <div className="flex items-center justify-center">
                                        Sign In
                                        <ArrowRight className="ml-2 h-5 w-5" />
                                    </div>
                                )}
                            </button>
                            <div className="text-center">
                                <a
                                    href="#"
                                    className="text-sm text-blue-600 hover:text-blue-700 font-medium hover:underline transition-colors"
                                >
                                    Forgot your password?
                                </a>
                            </div>
                        </form>
                    </div>
                </div>
                <div className="text-center mt-6">
                    <p className="text-xs text-gray-500">
                        Secure login powered by CROB Management System
                    </p>
                </div>
            </div>
        </div>
    )
}

export default Login
