import React, { useState } from "react";
import { Container, Box } from "@mui/material";
import { MdOutlineEmail } from "react-icons/md";
import sideImg from "../../src/assets/auth img.png";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateEmail(email)) {
      setErrorMessage("Please enter a valid email address.");
      return;
    }
    setErrorMessage("");
    setSuccessMessage("");
    setIsLoading(true);
    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/forgot-password",
        { email }
      );
      setSuccessMessage(response.data.message);
      setTimeout(() => {
        navigate("/login");
      }, 3000);
    } catch (error) {
      setErrorMessage(error.response?.data?.message || "Reset password failed");
    } finally {
      setIsLoading(false);
    }
  };

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   setErrorMessage("");
  //   setSuccessMessage("");

  //   // Validate that email is entered
  //   if (!email) {
  //     setErrorMessage("Email is required.");
  //     return;
  //   }

  //   // Validate email format using a regex
  //   const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  //   if (!emailRegex.test(email)) {
  //     setErrorMessage("Please enter a valid email address.");
  //     return;
  //   }

  //   // Simulate API call and error condition (replace with your actual API logic)
  //   try {
  //     // For demonstration, we simulate an error if the email is "error@example.com"
  //     if (email === "error@example.com") {
  //       throw new Error(
  //         "Simulated API error: Unable to send reset instructions."
  //       );
  //     }
  //     // Otherwise, simulate success
  //     setSuccessMessage("Reset instructions have been sent to your email.");
  //   } catch (error) {
  //     setErrorMessage(
  //       error.message ||
  //         "There was an error sending reset instructions. Please try again."
  //     );
  //   }
  // };

  return (
    <Container
      maxWidth={false}
      disableGutters
      sx={{ width: "100vw", p: 0, m: 0 }}
      className="bg-white"
    >
      <Box className="flex min-h-screen w-full justify-between">
        {/* Left Side: Forgot Password Form */}
        <div className="w-[65%] flex justify-center items-center">
          <div className="px-20 py-4 border shadow rounded-xl flex flex-col items-center justify-center">
            <h2 className="text-customHeadingColor font-semibold text-4xl mb-2">
              Forgot Password
            </h2>
            <p className="text-customBlack text-sm mb-6">
              No worries, we’ll send you reset instructions.
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
              {/* Reset Password Button */}
              <div className="mt-6 flex justify-center">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="py-3 px-10 bg-customBgBlue text-customWhite font-semibold outline-none rounded-3xl hover:bg-activeBg transition-colors"
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
          alt="Forgot Password"
          className="h-screen w-[35%] object-cover"
        />
      </Box>
    </Container>
  );
};

export default ForgotPassword;

// import React, { useState } from "react";
// import {
//   Container,
//   TextField,
//   Button,
//   Typography,
//   Box,
//   Paper,
// } from "@mui/material";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";
// import resetImg from "../../src/assets/image-reset.png";

// const ForgotPassword = () => {
//   const [email, setEmail] = useState("");
//   const [errorMessage, setErrorMessage] = useState("");
//   const [successMessage, setSuccessMessage] = useState("");
//   const [isLoading, setIsLoading] = useState(false);
//   const navigate = useNavigate();

//   const validateEmail = (email) => {
//     const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     return re.test(String(email).toLowerCase());
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!validateEmail(email)) {
//       setErrorMessage("Please enter a valid email address.");
//       return;
//     }
//     setErrorMessage("");
//     setSuccessMessage("");
//     setIsLoading(true);
//     try {
//       const response = await axios.post(
//         "http://localhost:5000/api/auth/forgot-password",
//         { email }
//       );
//       setSuccessMessage(response.data.message);
//       setTimeout(() => {
//         navigate('/login');
//       }, 3000);
//     } catch (error) {
//       setErrorMessage(error.response?.data?.message || "Reset password failed");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <Container
//       maxWidth={false}
//       disableGutters
//       sx={{ width: "100vw", p: 0, m: 0 }}
//     >
//       <Box sx={{ display: "flex", minHeight: "100vh", width: "100%" }}>
//         {/* Form Section */}
//         <Box
//           sx={{
//             width: { xs: "100%", md: "60%" },
//             display: "flex",
//             justifyContent: "center",
//             alignItems: "center",
//           }}
//         >
//           <Paper
//             elevation={3}
//             sx={{
//               padding: 4,
//               width: "100%",
//               maxWidth: "60%",
//               textAlign: "center",
//             }}
//           >
//             <Typography variant="h4" gutterBottom>
//               <span style={{ color: "#4A90E2" }}>Forgot Password?</span>
//             </Typography>
//             <Typography variant="body2" gutterBottom>
//               <p className="text-gray-400">
//                 No worries, we’ll send you reset instructions.
//               </p>
//             </Typography>
//             {errorMessage && (
//               <Typography color="error" sx={{ my: 1 }}>
//                 {errorMessage}
//               </Typography>
//             )}
//             {successMessage && (
//               <Typography color="success" sx={{ my: 1 }}>
//                 {successMessage}
//               </Typography>
//             )}
//             <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
//               <TextField
//                 fullWidth
//                 variant="outlined"
//                 label="Email"
//                 margin="normal"
//                 value={email}
//                 onChange={(e) => setEmail(e.target.value)}
//               />
//               <Button
//                 fullWidth
//                 variant="contained"
//                 color="primary"
//                 sx={{ mt: 3 }}
//                 type="submit"
//                 disabled={isLoading}
//               >
//                 {isLoading ? "Submitting..." : "Reset Password"}
//               </Button>
//             </Box>
//             <Typography
//               component="span"
//               sx={{
//                 cursor: "pointer",
//                 color: "#4A90E2",
//                 mt: 3,
//                 display: "block",
//               }}
//               onClick={() => navigate("/login")}
//             >
//               ← Back to login
//             </Typography>
//           </Paper>
//         </Box>

//         {/* Decorative Section */}
//         <Box
//           sx={{
//             display: { xs: "none", md: "flex" },
//             width: "40%",
//             height: "100vh",
//             background: "linear-gradient(to bottom, #64B0C1, #0F58B9)",
//             p: "20px",
//             flexDirection: "column",
//           }}
//         >
//           <Box
//             sx={{
//               display: "flex",
//               flexDirection: "column",
//               alignItems: "center",
//               textAlign: "center",
//               mb: 2,
//             }}
//           >
//             <Typography variant="h4" color="white">
//               TeamSync
//             </Typography>
//           </Box>

//           {/* Image Section */}
//           <Box
//             sx={{
//               flexGrow: 1,
//               display: "flex",
//               justifyContent: "center",
//               alignItems: "center",
//               overflow: "hidden",
//             }}
//           >
//             <Box
//               component="img"
//               src={resetImg}
//               alt="Reset"
//               sx={{
//                 maxHeight: "100%",
//                 maxWidth: "100%",
//                 objectFit: "contain",
//               }}
//             />
//           </Box>
//         </Box>
//       </Box>
//     </Container>
//   );
// };

// export default ForgotPassword;
