import React, { useState } from "react";
import { Container, Box } from "@mui/material";
import { RiLockPasswordLine } from "react-icons/ri";
import {
  MdOutlineEmail,
  MdOutlineVisibility,
  MdOutlineVisibilityOff,
} from "react-icons/md";
import { FaGithub, FaGooglePlus, FaLinkedin } from "react-icons/fa";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import sideImg from "../../src/assets/auth img.png";

const Signup = () => {
  // Separate states for each password field
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [agree, setAgree] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match");
      return;
    }

    try {
      console.log({ email, password });
      const response = await axios.post(
        "http://localhost:5000/api/auth/register",
        {
          email,
          password,
          // userType, // Uncomment if defined elsewhere
          firstName,
          lastName,
        }
      );

      setSuccessMessage(response.data.message);
      navigate("/login"); // Redirect to login after successful registration
    } catch (error) {
      setErrorMessage(error.response?.data?.message || "Signup failed");
    }
  };

  return (
    <Container
      maxWidth={false}
      disableGutters
      sx={{ width: "100vw", p: 0, m: 0 }}
      className="bg-white"
    >
      <Box
        sx={{
          display: "flex",
          minHeight: "100vh",
          width: "100%",
          justifyContent: "space-between",
        }}
      >
        {/* Left Side: Signup Form */}
        <div className=" w-[65%] flex justify-center items-center">
          <div className="px-20 py-4 border shadow rounded-xl flex flex-col items-center justify-center">
            <h2 className="text-customHeadingColor font-semibold text-4xl mb-2">
              Create Account
            </h2>
            <div className="flex text-3xl gap-2 mb-2">
              <FaGithub className="text-violet-900" />
              <FaGooglePlus className="text-red-600" />
              <FaLinkedin className="text-blue-500" />
            </div>
            <p className="text-customBlack text-sm mb-3">
              Or use your email for registration
            </p>
            <form onSubmit={handleSubmit} className="w-full max-w-lg">
              {/* Row 1: First Name & Last Name */}
              <div className="flex w-full space-x-4">
                <input
                  type="text"
                  placeholder="First Name"
                  className="w-1/2 px-5 py-4 bg-customButtonLightBg text-customBlack placeholder-gray-500 rounded-lg shadow border border-gray-200 focus:outline-none focus:ring-1 focus:ring-customBgBlue"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                />
                <input
                  type="text"
                  placeholder="Last Name"
                  className="w-1/2 px-5 py-4 bg-customButtonLightBg text-customBlack placeholder-gray-500 rounded-lg shadow border border-gray-200 focus:outline-none focus:ring-1 focus:ring-customBgBlue"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required
                />
              </div>
              {/* Row 2: Email */}
              <div className="mt-6 flex items-center px-5 py-4 bg-customButtonLightBg rounded-lg shadow border border-gray-200 focus-within:ring-1 focus-within:ring-customBgBlue">
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
              {/* Row 3: Password */}
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
              {/* Row 4: Confirm Password */}
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
              {/* Row 5: Terms & Conditions */}
              <div className="mt-4 flex items-center justify-center">
                <input
                  type="checkbox"
                  id="agree"
                  className="mr-2"
                  checked={agree}
                  onChange={(e) => setAgree(e.target.checked)}
                  required
                />
                <label htmlFor="agree" className="text-customBlack text-sm">
                  I agree to all the terms and conditions
                </label>
              </div>
              {/* Signup Button */}
              <div className="mt-2 flex justify-center">
                <button
                  type="submit"
                  className="w-1/2 py-3 bg-customBgBlue text-customWhite font-semibold rounded-3xl hover:bg-activeBg transition-colors"
                >
                  Sign Up
                </button>
              </div>
              {/* Already have an account */}
              <p className="mt-2 text-center text-gray-600 text-sm">
                Already have an account?{" "}
                <a href="/login" className="text-blue-500 hover:underline">
                  Sign in
                </a>
              </p>
            </form>
          </div>
        </div>
        {/* Right Side: Image */}
        <img src={sideImg} alt="" className="h-screen w-[35%]" />
      </Box>
    </Container>
  );
};

export default Signup;

{
  /* <Box
          sx={{
            width: { xs: "100%", md: "60%" },
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Paper
            elevation={3}
            sx={{
              paddingX: 4,
              width: "100%",
              maxWidth: "60%",
              textAlign: "center",
              my: 2,
              height: "88vh",
            }}
          >
            <Box
              sx={{
                py: 2,
                width: "100%",
                textAlign: "center",
                height: "100%",
                overflowY: "auto",
              }}
            >
              {errorMessage && (
                <Typography color="error">{errorMessage}</Typography>
              )}
              {successMessage && (
                <Typography color="success">{successMessage}</Typography>
              )}
              <Typography variant="h4" gutterBottom>
                <span style={{ color: "#4A90E2" }}>Create Account</span>
              </Typography>

              <form onSubmit={handleSubmit}>
                <Box sx={{ display: "flex", gap: 2, my: 2 }}>
                  <TextField
                    label="First Name"
                    variant="outlined"
                    fullWidth
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                  />
                  <TextField
                    label="Last Name"
                    variant="outlined"
                    fullWidth
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                  />
                </Box>

                <TextField
                  fullWidth
                  variant="outlined"
                  label="Email"
                  margin="normal"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">📧</InputAdornment>
                    ),
                  }}
                />

                <TextField
                  fullWidth
                  variant="outlined"
                  label="Password"
                  type={showPassword ? "text" : "password"}
                  margin="normal"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">🔒</InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? <Visibility /> : <VisibilityOff />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />

                <TextField
                  fullWidth
                  variant="outlined"
                  label="Confirm Password"
                  type={showPassword ? "text" : "password"}
                  margin="normal"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">🔒</InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? <Visibility /> : <VisibilityOff />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />

                <Button
                  fullWidth
                  variant="contained"
                  color="primary"
                  sx={{ mt: 2 }}
                  type="submit"
                >
                  SIGN UP
                </Button>
              </form>

              <Typography variant="body2" sx={{ mt: 2 }}>
                Already have an account? click{" "}
                <Typography
                  component="span"
                  sx={{ cursor: "pointer", color: "#4A90E2" }}
                  onClick={() => navigate("/login")}
                >
                  login
                </Typography>
              </Typography>
              <Typography
                variant="body2"
                sx={{ my: 2, display: "flex", alignItems: "center" }}
              >
                <Box flexGrow={1} sx={{ borderBottom: "1px solid #ccc" }} />
                <Box sx={{ mx: 2, color: "#666" }}>or</Box>
                <Box flexGrow={1} sx={{ borderBottom: "1px solid #ccc" }} />
              </Typography>
              <Box
                display="flex"
                justifyContent="center"
                gap={2}
                sx={{ mt: 3 }}
              >
                <IconButton color="primary">
                  <Facebook />
                </IconButton>
                <IconButton color="error">
                  <Google />
                </IconButton>
                <IconButton color="primary">
                  <LinkedIn />
                </IconButton>
              </Box>
            </Box>
          </Paper>
        </Box> */
}
