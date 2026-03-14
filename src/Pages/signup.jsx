import { Link } from "react-router-dom";
import logo from "../assets/Student_without_bg_logo.png";

export default function SignUp() {
  const loading = false;

  return (
    <div className="h-screen flex flex-col lg:flex-row bg-gray-100 text-gray-800 antialiased overflow-hidden">
      <section
        className="w-full lg:w-1/2 flex items-center justify-center px-6 py-4 lg:py-0"
        style={{ backgroundColor: "#e5eff5" }}
      >
        <div className="flex flex-col items-center">
          <img
            src={logo}
            alt="CreditSnap Logo"
            // className="w-48 h-48 lg:w-64 lg:h-64 object-contain mix-blend-multiply"
            className="w-60 h-60 lg:w-72 lg:h-72 object-contain mix-blend-multiply"
          />
        </div>
      </section>

      <section className="w-full lg:w-1/2 bg-gray-100 flex items-center justify-center px-6 py-3 lg:py-0 h-full">
        <div className="w-full max-w-[430px] h-full flex flex-col py-5">
          <h2
            className="text-3xl md:text-4xl leading-tight text-center font-medium"
            style={{ color: "#153f71" }}
          >
            Create your<br />Account
          </h2>
          
          <form className="mt-4 flex-1 flex flex-col justify-between" onSubmit={(e) => e.preventDefault()}>
            <input type="text" placeholder="Enter your name" required className="w-full h-11 border border-gray-300 rounded-md px-4 text-sm text-gray-700 focus:outline-none bg-white" />
            <input type="email" placeholder="Enter your email: eg:iitk.ac.in" required className="w-full h-11 border border-gray-300 rounded-md px-4 text-sm text-gray-700 focus:outline-none bg-white" />

            <div className="grid grid-cols-2 gap-3">
              <input type="text" placeholder="Enter your Hall no:" required className="w-full h-11 border border-gray-300 rounded-md px-4 text-sm text-gray-700 focus:outline-none bg-white" />
              <input type="text" placeholder="Enter your Roll no:" required className="w-full h-11 border border-gray-300 rounded-md px-4 text-sm text-gray-700 focus:outline-none bg-white" />
            </div>

            <input type="tel" placeholder="Enter your phone no:" required className="w-full h-11 border border-gray-300 rounded-md px-4 text-sm text-gray-700 focus:outline-none bg-white" />
            <input type="password" placeholder="Password:" required className="w-full h-11 border border-gray-300 rounded-md px-4 text-sm text-gray-700 focus:outline-none bg-white" />
            <input type="password" placeholder="Confirm Password:" required className="w-full h-11 border border-gray-300 rounded-md px-4 text-sm text-gray-700 focus:outline-none bg-white" />

             <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-800 text-white py-3 rounded-lg hover:bg-blue-900 transition disabled:opacity-50 font-semibold mt-4"
          >
            {loading ? 'SIGNING UP...' : 'SIGN UP'}
          </button>

          <p className="mt-2 text-center text-lg" style={{ color: "#486e99" }}>
            Already a User?{" "}
            <Link to="/login" className="font-semibold hover:underline" style={{ color: "#153f71" }}>
              Login
            </Link>
          </p>

            
          </form>
        </div>
      </section>
    </div>
  );
}