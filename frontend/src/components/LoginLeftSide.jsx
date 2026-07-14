const LoginLeftSide = () => {
  return (
    // Added: flex-col, justify-center, and px-12 to push everything to the center
    <div className="hidden md:flex flex-col justify-center w-1/2 bg-indigo-950 relative overflow-hidden border-r border-slate-200 px-12 lg:px-20 h-screen">
      <div className="absolute -top-30 -left-30 w-72 h-72 bg-indigo-500/20 rounded-full blur-3xl"></div>
      <div className="relative z-10"> {/* Kept it clean and layered */}
        <h1 className="text-4xl lg:text-5xl font-medium text-white mb-6 leading-tight tracking-tight">
          Information <br/> Management System
        </h1>
        <p className="text-slate-400 text-lg max-w-md leading-relaxed">
          Welcome to the Information Management System. Please log in to access your account.
        </p>
      </div>
    </div>
  )
}

export default LoginLeftSide;
