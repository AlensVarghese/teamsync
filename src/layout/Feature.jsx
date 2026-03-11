// Feature.jsx
import React from "react";
import { Container, Typography, Grid } from "@mui/material";
import FeatureCard from "./_components/FeatureCard";

const cardData = [
  {
    title: "Project & Task Management",
    description:
      "Effortlessly create, assign, and track tasks within projects. Define deadlines, set priorities, and monitor progress with an intuitive dashboard. Stay organized and ensure every task is completed on time.",
  },
  {
    title: "Real-Time Collaboration",
    description:
      "Communicate seamlessly with your team through built-in messaging and commenting features. Keep discussions organized within projects, ensuring clarity and efficiency in teamwork.",
  },
  {
    title: "Secure File Sharing",
    description:
      "Upload, share, and manage important project files in a secure environment. Keep all documents in one place, accessible only to authorized team members, ensuring smooth collaboration without data loss.",
  },
  {
    title: "Role-Based Access Control",
    description:
      "Maintain security and control by assigning different roles to team members. Admins can manage permissions, ensuring that sensitive information and project modifications are handled by the right people.",
  },
  {
    title: "Progress Tracking & Reporting",
    description:
      "Get a clear view of project status with interactive reports and analytics. Track task completion, identify bottlenecks, and optimize team performance for better efficiency and decision-making.",
  },
];

const Feature = () => {
  return (
    <div
      style={{
        backgroundColor: "var(--customBgBlueOpacity)",
        minWidth: "100vw",
        minHeight: "100vh",
        overflowX: "hidden",
      }}
    >
      <Container sx={{ textAlign: "center", mt: 8 }}>
        <Typography
          variant="h4"
          sx={{
            fontWeight: "bold",
            mb: 1,
            color: "var(--customWhite)",
            fontSize: {
              xs: "1.8rem",
              sm: "2.4rem",
              md: "3rem",
            },
          }}
        >
          Efficient and Integrated <br />
          Communication Services
        </Typography>
        <Typography
          variant="subtitle1"
          sx={{
            mb: 3,
            color: "var(--customWhite)",
            fontSize: { xs: "0.9rem", sm: "1.1rem" },
          }}
        >
          Simply operations with our efficient, Quality-focused services
        </Typography>
      </Container>

      <Container sx={{ mt: 10, mb: 4 }}>
        <Grid container spacing={4} justifyContent="center">
          {cardData.map((card, index) => (
            <Grid item xs={12} sm={6} key={index}>
              <FeatureCard title={card.title} description={card.description} />
            </Grid>
          ))}
        </Grid>
      </Container>
    </div>
  );
};

export default Feature;
