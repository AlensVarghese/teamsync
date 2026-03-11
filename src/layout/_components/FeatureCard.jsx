// FeatureCard.jsx
import React from "react";
import { Box, Typography } from "@mui/material";

const FeatureCard = ({ title, description }) => {
  return (
    <Box
      sx={{
        px: 6,
        py: 3,
        // Use an RGBA value for translucent background instead of opacity
        backgroundColor: "var(--customBgLightBlueOpacity)", 
        borderRadius: "1rem",
      }}
    >
      <Typography
        variant="h5"
        sx={{
          fontSize: {
            xs: "1.5rem",
            sm: "1.5rem",
            md: "1.5rem",
            lg: "1.5rem",
          },
          color: "var(--customBlack)", // Ensures the text is black
          mb: 1,
        }}
      >
        {title}
      </Typography>
      <Typography variant="body1" sx={{ color: "var(--customBlack)" }} className="text-base">
        {description}
      </Typography>
    </Box>
  );
};

export default FeatureCard;
