import React from "react";

const Login: React.FC = () => {
  return (
    <div
      className="h-screen w-screen flex items-center justify-center relative bg-cover bg-center"
      style={{ backgroundImage: "url('/login_bg.png')" }}
    >

      {/* Login Card */}
      <div className="h-screen bg-[#F5F5F5]/100 shadow-xl p-8 w-140 ml-auto">
        <div className="bg-white rounded-lg shadow-lg p-15 w-full max-w-sm mx-auto">
        <h2 className="text-3xl font-bold text-center mb-6">Login</h2>
        <form className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              className="mt-1 w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="Enter your email"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              className="mt-1 w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="Enter your password"
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 bg-[#21804A] hover:bg-blue-700 text-white rounded-lg font-medium"
          >
            Log In
          </button>
        </form>
      </div>
      </div>
    </div>
  );
};

export default Login;
