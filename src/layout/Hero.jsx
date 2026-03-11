import React from "react";
import Typography from "@mui/material/Typography";
import { Button, Container, Grid, Paper } from "@mui/material";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";


const Hero = () => {
  const navigate = useNavigate();
  return (
    <div
      style={{
        backgroundColor: "var(--customBgWhite)",
        minWidth: "100vw",
        minHeight: "100vh",
        paddingBottom: "40px",
      }}
    >
      {/* Navbar */}
      <Navbar />
      {/* Hero Section */}
      <Container sx={{ textAlign: "center", mt: 4 }}>
        <Typography
          variant="h4"
          sx={{
            fontWeight: "bold",
            mb: 1,
            color:"#213547",
            fontSize: {
              xs: "1.8rem", // For extra-small screens (0px and up)
              sm: "2.4rem", // For small screens (600px and up)
              md: "3rem", // For medium screens (900px and up) and beyond
            },
          }}
        >
          The Future Of Managing People <br /> With Latest Technology
        </Typography>
        <Typography
          variant="subtitle1"
          sx={{
            color: "gray",
            mb: 3,
            fontSize: { xs: "0.9rem", sm: "1.1rem" }, // Responsive font sizes for subtitle
          }}
        >
          managing, communication, file sharing
        </Typography>
        <Button
          variant="contained"
          sx={{
            backgroundColor: "var(--customBgBlue)",
            borderRadius: "20px",
            textTransform: "none",
            padding: "10px 30px",
          }}
          onClick={() => navigate("/login")}
        >
          Get Started
        </Button>
      </Container>

      {/* Image Section */}
      <Container sx={{ mt: 3 }}>
        <Grid
          container
          spacing={4}
          justifyContent="center"
          alignItems="flex-end"
        >
          <Grid
            item
            xs={12}
            sm={4}
            sx={{
              display: { xs: "none", sm: "flex" },
              justifyContent: "center",
            }}
          >
            <Paper
              sx={{
                height: "22em",
                maxWidth: "20rem",
                borderRadius: "15px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <img
                src="/assets/images/Landing/Rectangle 32.png"
                alt="Illustration 1"
                style={{
                  width: "100%",
                  height: "100%",
                  borderRadius: "10px",
                }}
              />
            </Paper>
          </Grid>
          <Grid
            item
            xs={12}
            sm={4}
            sx={{ display: "flex", justifyContent: "center" }}
          >
            <Paper
              sx={{
                height: "15rem", // Smaller height for the middle image
                borderRadius: "10px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center", // Ensure image is centered inside
              }}
            >
              <img
                src="./assets/images/Landing/Rectangle 30.png"
                alt="Illustration 2"
                style={{
                  width: "100%",
                  height: "100%",
                  borderRadius: "10px",
                }}
              />
            </Paper>
          </Grid>
          <Grid
            item
            xs={12}
            sm={4}
            sx={{
              display: { xs: "none", sm: "flex" },
              justifyContent: "center",
            }}
          >
            <Paper
              sx={{
                height: "22em",
                maxWidth: "20rem",
                borderRadius: "15px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <img
                src="/assets/images/Landing/Rectangle 32.png"
                alt="Illustration 1"
                style={{
                  width: "100%",
                  height: "100%",
                  borderRadius: "10px",
                }}
              />
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </div>
  );
};

export default Hero;
