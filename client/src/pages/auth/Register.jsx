import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

function Register() {
  const BaseUrl = "http://localhost:4000";
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Step 1: Send OTP
  const handleSendOtp = async () => {
    if (!email) return toast.warn("Please enter your email");
    setLoading(true);
    try {
      const res = await fetch(`${BaseUrl}/auth/send-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success("OTP sent successfully!");
        setStep(2);
      } else {
        toast.error(data.message || "Failed to send OTP");
      }
    } catch (err) {
      toast.error("Server error while sending OTP");
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Verify OTP
  const handleVerifyOtp = async () => {
    if (!otp) return toast.warn("Please enter the OTP");
    setLoading(true);
    try {
      const res = await fetch(`${BaseUrl}/auth/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success(data.message || "OTP verified!");
        setStep(3);
      } else {
        toast.error(data.message || "Invalid OTP");
      }
    } catch (err) {
      toast.error("Server error while verifying OTP");
    } finally {
      setLoading(false);
    }
  };

  // Step 3: Register user
  const handleRegister = async () => {
    if (!name || !password) return toast.warn("All fields required");
    setLoading(true);
    try {
      const res = await fetch(`${BaseUrl}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, name, password }),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success("Account created successfully!");
        navigate("/login");
      } else {
        toast.error(data.message || "Registration failed");
      }
    } catch (err) {
      toast.error("Server error while creating account");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg overflow-hidden">
        {/* Header with hospital-themed color */}
        <div className="bg-teal-600 py-4 px-6">
          <div className="flex items-center justify-center space-x-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
              />
            </svg>
            <h2 className="text-2xl font-bold text-white text-center">
               Hospital X Registration
            </h2>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Progress indicator */}
          <div className="flex justify-between items-center mb-6">
            {[1, 2, 3].map((stepNumber) => (
              <div key={stepNumber} className="flex flex-col items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    step >= stepNumber
                      ? "bg-teal-600 text-white"
                      : "bg-gray-200 text-gray-600"
                  }`}
                >
                  {stepNumber}
                </div>
                <span className="text-xs mt-1 text-gray-600">
                  {stepNumber === 1
                    ? "Email"
                    : stepNumber === 2
                    ? "OTP"
                    : "Details"}
                </span>
              </div>
            ))}
          </div>

          {/* Step 1: Email */}
          {step === 1 && (
            <div className="space-y-4">
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  placeholder="Enter your hospital email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition"
                />
              </div>
              <button
                onClick={handleSendOtp}
                disabled={loading}
                className="w-full bg-teal-600 hover:bg-teal-700 text-white py-3 rounded-lg font-medium flex items-center justify-center transition disabled:opacity-70"
              >
                {loading ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Sending...
                  </>
                ) : (
                  "Send Verification OTP"
                )}
              </button>
            </div>
          )}

          {/* Step 2: OTP */}
          {step === 2 && (
            <div className="space-y-4">
              <div>
                <label
                  htmlFor="otp"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Verification Code
                </label>
                <input
                  id="otp"
                  type="text"
                  placeholder="Enter 6-digit OTP sent to your email"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Didn't receive code?{" "}
                  <button
                    onClick={handleSendOtp}
                    className="text-teal-600 hover:underline"
                  >
                    Resend OTP
                  </button>
                </p>
              </div>
              <button
                onClick={handleVerifyOtp}
                disabled={loading}
                className="w-full bg-teal-600 hover:bg-teal-700 text-white py-3 rounded-lg font-medium flex items-center justify-center transition disabled:opacity-70"
              >
                {loading ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Verifying...
                  </>
                ) : (
                  "Verify OTP"
                )}
              </button>
            </div>
          )}

          {/* Step 3: Registration Details */}
          {step === 3 && (
            <div className="space-y-4">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Full Name
                </label>
                <input
                  id="name"
                  type="text"
                  placeholder="Enter your full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition"
                />
              </div>
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  placeholder="Create a strong password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Minimum 8 characters with at least one number and special
                  character
                </p>
              </div>
              <button
                onClick={handleRegister}
                disabled={loading}
                className="w-full bg-teal-600 hover:bg-teal-700 text-white py-3 rounded-lg font-medium flex items-center justify-center transition disabled:opacity-70"
              >
                {loading ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Creating Account...
                  </>
                ) : (
                  "Complete Registration"
                )}
              </button>
            </div>
          )}

          <div className="text-center text-sm text-gray-600 pt-4 border-t border-gray-200">
            Already have an account?{" "}
            <button
              onClick={() => navigate("/login")}
              className="text-teal-600 hover:underline font-medium"
            >
              Sign In
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;