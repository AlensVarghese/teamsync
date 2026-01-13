import React from "react";
import { Box, Typography, Grid, Link } from "@mui/material";
import { LinkedIn, Instagram, Facebook } from "@mui/icons-material";

const Footer = () => {
  return (
    <Box
      sx={{
        width: "100%",
        backgroundColor: "var(--customBgBlue)",
        color: "var(--customWhite)",
        padding: { xs: "2rem 20px", sm: "4rem 40px" },
      }}
    >
      <Grid
        container
        spacing={3}
        justifyContent="space-between"
        alignItems="center"
      >
        {/* Left Section */}
        <Grid
          item
          xs={12}
          md={4}
          sx={{ textAlign: { xs: "center", md: "left" } }}
        >
          <Typography variant="h6" fontWeight="bold">
            TeamSync
          </Typography>
          <Typography variant="body2" fontStyle="italic">
            "Manage projects, track tasks, and collaborate seamlessly – all in
            one place. Sign up now and boost your team's productivity!"
          </Typography>
        </Grid>

        {/* Center Links */}
        <Grid item xs={12} md={4}>
          <Grid container spacing={2} justifyContent="center">
            <Grid item>
              <Typography variant="body1">Company</Typography>
            </Grid>
            <Grid item>
              <Typography variant="body1">Industries</Typography>
            </Grid>
            <Grid item>
              <Typography variant="body1">Products</Typography>
            </Grid>
          </Grid>
        </Grid>

        {/* Right Section - Social Media */}
        <Grid
          item
          xs={12}
          md={4}
          sx={{ textAlign: { xs: "center", md: "right" } }}
        >
          <Typography variant="body1">Get In Touch</Typography>
          <Box
            sx={{
              display: "flex",
              gap: "10px",
              justifyContent: { xs: "center", md: "flex-end" },
            }}
          >
            <Link href="#" color="inherit">
              <LinkedIn />
            </Link>
            <Link href="#" color="inherit">
              <Instagram />
            </Link>
            <Link href="#" color="inherit">
              <Facebook />
            </Link>
          </Box>
        </Grid>
      </Grid>

      {/* Bottom Footer Section */}
      <Box
        sx={{
          marginTop: "20px",
          paddingTop: "10px",
          borderTop: "1px solid white",
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          justifyContent: "space-between",
          alignItems: "center",
          gap: { xs: 2, md: 0 },
        }}
      >
        <Typography
          variant="body2"
          sx={{ textAlign: { xs: "center", md: "left" } }}
        >
          @ 2025 TeamSync. All rights reserved
        </Typography>
        <Box sx={{ display: "flex", gap: "15px" }}>
          <Link href="#" color="inherit" underline="none">
            Terms & Conditions
          </Link>
          <Link href="#" color="inherit" underline="none">
            Privacy Policy
          </Link>
        </Box>
      </Box>
    </Box>
  );
};

export default Footer;
