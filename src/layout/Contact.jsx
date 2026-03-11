import {
  Box,
  Button,
  Container,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import emailjs from "emailjs-com";

// Initialize EmailJS with your public key
emailjs.init("ZBAqztodGi3N24aer");

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // EmailJS configuration
    const serviceID = "gorav22";
    const templateID = "Gorav22";

    emailjs.send(serviceID, templateID, formData)
      .then((response) => {
        console.log("Email sent successfully!", response);
        alert("Email sent successfully!");
        setFormData({
          name: "",
          email: "",
          message: "",
        });
      })
      .catch((error) => {
        console.error("Error sending email:", error);
        alert("Error sending email. Please try again.");
      });
  };

  return (
    <Container
      disableGutters
      sx={{
        background: "var(--customBgWhite)",
        minWidth: "100vw",
        display: "flex",
        flexDirection: { xs: "column", md: "row" },
        alignItems: "center",
        justifyContent: "center",
        gap: 4,
        py: 4,
      }}
    >
      {/* Left part */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: { xs: "center", md: "flex-start" },
          textAlign: { xs: "center", md: "left" },
          maxWidth: { xs: "100%", md: "45%" },
          color: "var(--customBlack)",
        }}
      >
        <Typography
          variant="h4"
          sx={{
            fontSize: { xs: "1.8rem", sm: "2rem", md: "2rem" },
            fontWeight: "medium",
            mb: 2,
          }}
        >
          Empowering Project Management <br />
          with Seamless Integration
        </Typography>

        <Typography
          variant="body1"
          sx={{
            fontSize: { xs: "0.9rem", sm: "1rem" },
            mb: 3,
            maxWidth: "80%",
          }}
        >
          "Simplify workflows, enhance collaboration, and stay ahead with an
          all-in-one project management solution."
        </Typography>

        <Button
          variant="contained"
          sx={{
            backgroundColor: "var(--customBgBlue)",
            px: "1rem",
            width: "8rem",
            borderRadius: "20px",
            textTransform: "none",
            color: "var(--customWhite)",
          }}
        >
          Work with Us
        </Button>
      </Box>

      {/* Right Part */}
      <Box
        sx={{
          width: { xs: "100%", sm: "80%", md: "45%" },
          maxWidth: "500px",
          color: "var(--customBlack)",
        }}
      >
        <Paper
          elevation={2}
          sx={{
            display: "flex",
            flexDirection: "column",
            padding: { xs: 3, sm: 4 },
            textAlign: "center",
            background: "var(--customBgLightBlue)",
            borderRadius: "12px",
          }}
        >
          <Typography variant="h4" sx={{ mb: 1 }}>
            Contact Us
          </Typography>
          <Typography variant="body1" sx={{ mb: 3 }}>
            Please fill the information below
          </Typography>

          <TextField
            label="Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            fullWidth
            sx={{ marginBottom: 2 }}
          ></TextField>
          <TextField
            label="Email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            fullWidth
            sx={{ marginBottom: 2 }}
          ></TextField>
          <TextField
            label="Message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            fullWidth
            multiline
            rows={4}
            sx={{ marginBottom: 3 }}
          ></TextField>

          <Button
            variant="contained"
            onClick={handleSubmit}
            sx={{
              backgroundColor: "var(--customBgBlue)",
              px: "1rem",
              width: "8rem",
              borderRadius: "20px",
              textTransform: "none",
              alignSelf: "center",
            }}
          >
            Submit
          </Button>
        </Paper>
      </Box>
    </Container>
  );
};

export default Contact;
