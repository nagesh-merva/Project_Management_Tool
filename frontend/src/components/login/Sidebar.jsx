function Sidebar() {
    return (
        <div className="md:w-1/2 w-full min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black relative overflow-hidden flex justify-center items-center">
            <div className="absolute inset-0">
                <div className="absolute top-20 left-20 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
                <div className="absolute top-1/2 left-1/4 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '4s' }}></div>
                <div className="absolute inset-0 opacity-5">
                    <div className="absolute inset-0" style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M0 0h40v40H0V0zm20 20h20v20H20V20z'/%3E%3C/g%3E%3C/svg%3E")`,
                        backgroundSize: '40px 40px'
                    }}></div>
                </div>
            </div>
            <div className="relative z-10 w-4/5 h-4/5 max-w-lg">
                <div className="relative bg-white/95 backdrop-blur-sm h-full rounded-3xl shadow-2xl border border-white/20 flex justify-center items-center overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-purple-50/50 rounded-3xl"></div>
                    <div className="relative z-10 w-5/6 h-5/6 flex justify-center items-center">
                        <img 
                            className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-105" 
                            src="/Login.png" 
                            alt="Management Dashboard"
                        />
                    </div>
                    <div className="absolute top-6 right-6 w-3 h-3 bg-blue-400 rounded-full animate-ping"></div>
                    <div className="absolute bottom-8 left-8 w-2 h-2 bg-purple-400 rounded-full animate-ping" style={{ animationDelay: '1s' }}></div>
                </div>
                <div className="absolute -bottom-16 left-1/2 transform -translate-x-1/2 text-center">
                    <p className="text-white/60 text-sm font-medium">
                        Streamline Your Workflow
                    </p>
                    <div className="flex justify-center mt-2 space-x-1">
                        <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                        <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
                        <div className="w-2 h-2 bg-indigo-400 rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
                    </div>
                </div>
            </div>
            <div className="absolute bottom-6 right-6 group">
                <img 
                    className="h-8 md:h-10 w-auto opacity-80 hover:opacity-100 transition-all duration-300 group-hover:scale-110" 
                    src="/logo.png" 
                    alt="Company Logo"
                />
                <div className="absolute inset-0 bg-white/10 rounded-lg blur-xl group-hover:bg-white/20 transition-all duration-300"></div>
            </div>
            <div className="absolute top-0 left-0 w-32 h-32 border-l-2 border-t-2 border-white/10 rounded-tl-3xl"></div>
            <div className="absolute bottom-0 right-0 w-32 h-32 border-r-2 border-b-2 border-white/10 rounded-br-3xl"></div>
        </div>
    )
}

export default Sidebar