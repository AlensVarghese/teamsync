import React, { useContext, useState } from "react";
import { Container, Box } from "@mui/material";
import { FaGithub, FaGooglePlus, FaLinkedin } from "react-icons/fa";
import {
  MdOutlineEmail,
  MdOutlineVisibility,
  MdOutlineVisibilityOff,
} from "react-icons/md";
import { RiLockPasswordLine } from "react-icons/ri";
import sideImg from "../../src/assets/auth img.png";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import { UserContext } from "../utils/UserContext";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate();

  const { setUser } = useContext(UserContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");
    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/login",
        {
          email,
          password,
        }
      );
      //console.log("Response from API:", response);
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("userEmail", response.data.email);

      // Set global user state
      setUser({ email: response.data.email });
      
      setSuccessMessage(response.data.message);
      navigate("/home");
      // console.log(response.data);
      // console.log("console user", response.data.user);
    } catch (error) {
      setErrorMessage(error.response?.data?.message || "Login failed");
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
        {/* Left Side: Sign In Form */}
        <div className="w-[65%] flex justify-center items-center">
          <div className="px-20 py-4 border shadow rounded-xl flex flex-col items-center justify-center">
            <h2 className="text-customHeadingColor font-semibold text-4xl mb-2">
              Sign in to TeamSync
            </h2>
            <div className="flex text-3xl gap-2 mb-2">
              <FaGithub className="text-violet-900" />
              <FaGooglePlus className="text-red-600" />
              <FaLinkedin className="text-blue-500" />
            </div>
            <p className="text-customBlack text-sm mb-3">
              or use your email account
            </p>
            <form onSubmit={handleSubmit} className="w-full max-w-xl">
              {/* Email Row */}
              <div className="flex items-center px-5 py-4 bg-customButtonLightBg rounded-lg shadow border border-gray-200 focus-within:ring-1 focus-within:ring-customBgBlue">
                <MdOutlineEmail className="text-gray-500 mr-3" size={20} />
                <input
                  type="email"
                  placeholder="Email"
                  className="flex-1 bg-transparent outline-none text-customBlack placeholder-gray-500"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              {/* Password Row */}
              <div className="mt-6 flex items-center px-5 py-4 bg-customButtonLightBg rounded-lg shadow border border-gray-200 focus-within:ring-1 focus-within:ring-customBgBlue">
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
              {/* Error Message */}
              {errorMessage && (
                <p className="mt-4 text-center text-red-500 text-sm">
                  {errorMessage}
                </p>
              )}
              {/* Success Message */}
              {successMessage && (
                <p className="mt-4 text-center text-green-500 text-sm">
                  {successMessage}
                </p>
              )}
              {/* Forgot Your Password Link */}
              <p className="mt-6 text-center text-gray-600 text-sm">
                <a
                  href="/forgot-password"
                  className="text-blue-500 hover:underline"
                >
                  Forgot your password?
                </a>
              </p>
              {/* Sign In Button */}
              <div className="mt-2 flex justify-center">
                <button
                  type="submit"
                  className="w-1/2 py-3 bg-customBgBlue text-customWhite font-semibold rounded-3xl hover:bg-activeBg transition-colors"
                >
                  Sign In
                </button>
              </div>
              {/* don't have an account */}
              <p className="mt-2 text-center text-gray-600 text-sm">
                Don't have an account?{" "}
                <a href="/sign-up" className="text-blue-500 hover:underline">
                  Sign up
                </a>
              </p>
            </form>
          </div>
        </div>
        {/* Right Side: Image */}
        <img
          src={sideImg}
          alt="Sign In"
          className="h-screen w-[35%] object-cover"
        />
      </Box>
    </Container>
  );
};

export default Login;
