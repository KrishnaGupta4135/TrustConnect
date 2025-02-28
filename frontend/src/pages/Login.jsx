import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../services/account";
import GoogleLoginButton from "../components/GoogleLoginButton";
import signIn from "../assets/Images/signIn.jpg"; // Ensure this path is correct
import {
  Button,
  Input,
  Alert,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../UI/Components"; // Ensure these components are correctly implemented

const Login = () => {
  const API_URL = import.meta.env.VITE_API_URL_USER;
  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
  });
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otp, setOtp] = useState("");
  const [otpError, setOtpError] = useState("");
  const [otpLoading, setOtpLoading] = useState(false);
  const { handleLogin, loading, error } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await handleLogin(credentials);
    if (response?.success && response?.data?.requires_otp) {
      setShowOtpModal(true);
    }
  };

  const handleChange = (e) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value,
    });
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setOtpLoading(true);
    setOtpError("");

    try {
      const response = await fetch(`${API_URL}/api/users/verify-otp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: credentials.email,
          otp_code: otp,
        }),
      });

      const data = await response.json();

      if (data.success) {
        localStorage.setItem("accessToken", data.data.access_token);
        localStorage.setItem("refreshToken", data.data.refresh_token);
        setShowOtpModal(false);
        navigate("/dashboard");
      } else {
        setOtpError(data.message || "Invalid OTP. Please try again.");
      }
    } catch (err) {
      setOtpError("Failed to verify OTP. Please try again.");
    } finally {
      setOtpLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-blue-500 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl w-full bg-white shadow-xl rounded-lg overflow-hidden">
        <div className="md:flex">
          {/* Left Column - Image */}
          <div className="md:w-1/2 relative">
            <img
              src={signIn}
              alt="Login"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Right Column - Login Form */}
          <div className="md:w-1/2 p-8">
            {/* Logo and Title */}
            <div className="flex items-center mb-8">
              <svg
                className="w-10 h-10 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                />
              </svg>
              <span className="text-3xl font-bold ml-2 text-gray-800">Logo</span>
            </div>

            {/* Login Form */}
            <div className="flex-grow flex flex-col justify-center max-w-md mx-auto w-full">
              <h2 className="text-3xl font-semibold mb-8 text-gray-700">
                Log in
              </h2>

              {/* Error Message */}
              {error && (
                <Alert variant="destructive" className="mb-4">
                  <Alert.Description>{error}</Alert.Description>
                </Alert>
              )}

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <Input
                    type="email"
                    id="email"
                    name="email"
                    value={credentials.email}
                    onChange={handleChange}
                    placeholder="Email address"
                    required
                    className="h-12 text-lg rounded-md"
                  />
                </div>
                <div>
                  <Input
                    type="password"
                    id="password"
                    name="password"
                    value={credentials.password}
                    onChange={handleChange}
                    placeholder="Password"
                    required
                    className="h-12 text-lg rounded-md"
                  />
                </div>
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full h-12 text-lg bg-blue-600 hover:bg-blue-700 rounded-md"
                >
                  {loading ? "Signing In..." : "Sign In"}
                </Button>
              </form>

              {/* Forgot Password */}
              <Link
                to="/forgot-password"
                className="text-sm text-gray-600 hover:text-gray-800 mt-4 block text-center"
              >
                Forgot password?
              </Link>

              {/* Divider */}
              <div className="my-6 relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">Or</span>
                </div>
              </div>

              {/* Google Login Button */}
              <GoogleLoginButton />

              {/* Register Link */}
              <p className="text-center mt-6 text-gray-600">
                Don't have an account?{" "}
                <Link
                  to="/create"
                  className="text-blue-600 hover:text-blue-700 font-semibold"
                >
                  Register here
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* OTP Verification Modal */}
      <Dialog open={showOtpModal} onOpenChange={setShowOtpModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Enter OTP Verification Code</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleVerifyOTP} className="mt-4">
            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-2">
                Please enter the verification code sent to {credentials.email}
              </p>
              <Input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="Enter OTP"
                maxLength={6}
                className="mt-1"
              />
            </div>
            {otpError && (
              <Alert variant="destructive">
                <Alert.Description>{otpError}</Alert.Description>
              </Alert>
            )}
            <div className="flex justify-end space-x-2">
              <Button
                variant="secondary"
                onClick={() => setShowOtpModal(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={otpLoading || otp.length !== 6}
              >
                {otpLoading ? "Verifying..." : "Verify OTP"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Login;
