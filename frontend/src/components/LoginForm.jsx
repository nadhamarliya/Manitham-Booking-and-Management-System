const LoginForm = () => {
  return (
    <div className="w-full max-w-md space-y-6 px-4">
      <div className="space-y-2">
        <h2 className="text-3xl font-bold text-slate-800 tracking-tight">Welcome Back</h2>
        <p className="text-sm text-slate-500">Please enter your credentials to access the portal.</p>
      </div>

      <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
          <input 
            type="email" 
            placeholder="name@company.com" 
            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-md outline-none focus:border-indigo-500 transition-colors"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
          <input 
            type="password" 
            placeholder="••••••••" 
            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-md outline-none focus:border-indigo-500 transition-colors"
          />
        </div>

        <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2.5 px-4 rounded-md transition-colors shadow-sm mt-4">
          Sign In to Portal
        </button>
      </form>
    </div>
  );
};

export default LoginForm; // <-- Make sure there is nothing typed below this line!
