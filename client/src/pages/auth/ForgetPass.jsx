import { useState } from "react";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { 
  ArrowLeftIcon,
  LockClosedIcon,
  MailIcon,
  ShieldCheckIcon,
  KeyIcon 
} from "@heroicons/react/outline";

function ForgetPass() {
  const BaseUrl = "http://localhost:4000";
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSendOtp = async () => {
    if (!email) return toast.warn("Please enter your registered email");
    
    setIsLoading(true);
    try {
      const res = await fetch(`${BaseUrl}/auth/forgot-password/send-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success("OTP sent to your email!");
        setStep(2);
      } else {
        toast.error(data.message || "Error sending OTP");
      }
    } catch (err) {
      toast.error("Server error while sending OTP");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp) return toast.warn("Please enter the OTP you received");
    
    setIsLoading(true);
    try {
      const res = await fetch(`${BaseUrl}/auth/forgot-password/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success("OTP verified. Now reset your password.");
        setStep(3);
      } else {
        toast.error(data.message || "Invalid OTP");
      }
    } catch (err) {
      toast.error("Server error while verifying OTP");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (!password) return toast.warn("Password cannot be empty");
    
    setIsLoading(true);
    try {
      const res = await fetch(`${BaseUrl}/auth/forgot-password/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, newPassword: password }),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success("Password reset successfully! Please login.");
        setStep(1);
        setEmail("");
        setOtp("");
        setPassword("");
        navigate("/login");
      } else {
        toast.error(data.message || "Reset failed");
      }
    } catch (err) {
      toast.error("Server error during password reset");
    } finally {
      setIsLoading(false);
    }
  };

  const goBack = () => step > 1 ? setStep(step - 1) : navigate("/login");

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-cyan-100 p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="bg-white rounded-xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-cyan-500 p-6 text-center relative">
            <button 
              onClick={goBack}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white hover:text-blue-100 transition"
            >
              <ArrowLeftIcon className="h-5 w-5" />
            </button>
            <div className="flex justify-center">
              <LockClosedIcon className="h-10 w-10 text-white" />
            </div>
            <h2 className="mt-3 text-xl font-bold text-white">Password Recovery</h2>
            <p className="mt-1 text-blue-100 text-sm">
              {step === 1 && "Enter your email to receive OTP"}
              {step === 2 && "Enter the OTP sent to your email"}
              {step === 3 && "Create a new password"}
            </p>
          </div>

          <div className="p-8">
            {/* Step indicator */}
            <div className="flex justify-center mb-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center 
                      ${i <= step ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-600"}
                      ${i === step ? "ring-2 ring-blue-400" : ""}`}
                  >
                    {i}
                  </div>
                  {i < 3 && (
                    <div className={`w-8 h-1 ${i < step ? "bg-blue-600" : "bg-gray-200"}`}></div>
                  )}
                </div>
              ))}
            </div>

            {/* Step 1: Email Input */}
            {step === 1 && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
                className="space-y-4"
              >
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Registered Email
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <MailIcon className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="email"
                      type="email"
                      placeholder="your@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                      required
                    />
                  </div>
                </div>

                <button
                  onClick={handleSendOtp}
                  disabled={isLoading}
                  className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition ${isLoading ? 'opacity-75 cursor-not-allowed' : ''}`}
                >
                  {isLoading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Sending OTP...
                    </>
                  ) : 'Send OTP'}
                </button>
              </motion.div>
            )}

            {/* Step 2: OTP Verification */}
            {step === 2 && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
                className="space-y-4"
              >
                <div>
                  <label htmlFor="otp" className="block text-sm font-medium text-gray-700 mb-1">
                    Verification Code
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <ShieldCheckIcon className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="otp"
                      type="text"
                      placeholder="Enter 6-digit OTP"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                      required
                    />
                  </div>
                  <p className="mt-1 text-xs text-gray-500">
                    Check your email for the OTP. Didn't receive it?{' '}
                    <button 
                      onClick={handleSendOtp}
                      className="text-blue-600 hover:text-blue-500 font-medium"
                    >
                      Resend OTP
                    </button>
                  </p>
                </div>

                <button
                  onClick={handleVerifyOtp}
                  disabled={isLoading}
                  className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition ${isLoading ? 'opacity-75 cursor-not-allowed' : ''}`}
                >
                  {isLoading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Verifying...
                    </>
                  ) : 'Verify OTP'}
                </button>
              </motion.div>
            )}

            {/* Step 3: Password Reset */}
            {step === 3 && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
                className="space-y-4"
              >
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                    New Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <KeyIcon className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="password"
                      type="password"
                      placeholder="Enter new password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                      required
                    />
                  </div>
                  <p className="mt-1 text-xs text-gray-500">
                    Use 8 or more characters with a mix of letters, numbers & symbols
                  </p>
                </div>

                <button
                  onClick={handleResetPassword}
                  disabled={isLoading}
                  className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition ${isLoading ? 'opacity-75 cursor-not-allowed' : ''}`}
                >
                  {isLoading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Resetting...
                    </>
                  ) : 'Reset Password'}
                </button>
              </motion.div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default ForgetPass;