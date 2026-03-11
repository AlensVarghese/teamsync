import React, { useState, useEffect } from "react";
import axios from "axios";
import { Container, Box } from "@mui/material";
import { RiLockPasswordLine } from "react-icons/ri";
import { MdOutlineVisibility, MdOutlineVisibilityOff } from "react-icons/md";
import sideImg from "../../src/assets/auth img.png";
import { useNavigate, useParams } from "react-router-dom";

const SetNewPassword = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { token } = useParams(); // Get the token from the URL params

  // Optional: You can verify the token when the component mounts (to check validity)
  useEffect(() => {
    if (!token) {
      setErrorMessage("Invalid or missing token.");
    }
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    // Basic Password Validation
    if (password.length < 8) {
      setErrorMessage("Password must be at least 8 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match");
      return;
    }

    setIsLoading(true); // Start loading state

    try {
      // Include the token when sending the request
      const response = await axios.post(
        "http://localhost:5000/api/auth/reset-password", // Your backend endpoint
        { token, newPassword: password }
      );
      setSuccessMessage(response.data.message);

      // Optionally, navigate to the login page after successful password reset
      setTimeout(() => {
        navigate("/login");
      }, 3000);
    } catch (error) {
      // Add better error handling
      setErrorMessage(
        error.response?.data?.message || error.message || "Setting new password failed"
      );
    } finally {
      setIsLoading(false); // End loading state
    }
  };

  return (
    <Container
      maxWidth={false}
      disableGutters
      sx={{ width: "100vw", p: 0, m: 0 }}
      className="bg-white"
    >
      <Box className="flex min-h-screen w-full justify-between">
        {/* Left Side: Set New Password Form */}
        <div className="w-[65%] flex justify-center items-center">
          <div className="px-20 py-4 border shadow rounded-xl flex flex-col items-center justify-center">
            <h2 className="text-customHeadingColor font-semibold text-4xl mb-2">
              Set new password
            </h2>
            <p className="text-customBlack text-sm mb-6">
              Must be at least 8 characters.
            </p>
            <form onSubmit={handleSubmit} className="w-full max-w-xl">
              {/* Password Row */}
              <div className="flex items-center px-5 py-4 bg-customButtonLightBg rounded-lg shadow border border-gray-200 focus-within:ring-1 focus-within:ring-customBgBlue">
                <RiLockPasswordLine className="text-gray-500 mr-3" size={20} />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  className="flex-1 bg-transparent outline-none text-customBlack placeholder-gray-500"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <span
                  onClick={() => setShowPassword(!showPassword)}
                  className="ml-3 text-gray-500 cursor-pointer"
                >
                  {showPassword ? (
                    <MdOutlineVisibilityOff size={20} />
                  ) : (
                    <MdOutlineVisibility size={20} />
                  )}
                </span>
              </div>
              {/* Confirm Password Row */}
              <div className="mt-6 flex items-center px-5 py-4 bg-customButtonLightBg rounded-lg shadow border border-gray-200 focus-within:ring-1 focus-within:ring-customBgBlue">
                <RiLockPasswordLine className="text-gray-500 mr-3" size={20} />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm Password"
                  className="flex-1 bg-transparent outline-none text-customBlack placeholder-gray-500"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
                <span
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="ml-3 text-gray-500 cursor-pointer"
                >
                  {showConfirmPassword ? (
                    <MdOutlineVisibilityOff size={20} />
                  ) : (
                    <MdOutlineVisibility size={20} />
                  )}
                </span>
              </div>
              {/* Display error message if present */}
              {errorMessage && (
                <p className="mt-4 text-center text-red-500 text-sm">
                  {errorMessage}
                </p>
              )}
              {/* Display success message if present */}
              {successMessage && (
                <p className="mt-4 text-center text-green-500 text-sm">
                  {successMessage}
                </p>
              )}

              {/* Reset Password Button */}
              <div className="mt-6 flex justify-center">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="py-3 px-10 bg-customBgBlue text-customWhite font-semibold rounded-3xl hover:bg-activeBg transition-colors"
                >
                  {isLoading ? "Submitting..." : "Reset Password"}
                </button>
              </div>
              {/* Back to Login Link */}
              <p className="mt-4 text-center text-gray-600 text-sm">
                <a href="/login" className="text-blue-500 hover:underline">
                  &larr; Back to login
                </a>
              </p>
            </form>
          </div>
        </div>
        {/* Right Side: Image */}
        <img
          src={sideImg}
          alt="Set New Password"
          className="h-screen w-[35%] object-cover"
        />
      </Box>
    </Container>
  );
};

export default SetNewPassword;
