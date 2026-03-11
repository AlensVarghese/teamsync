import { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Button,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const toggleDrawer = (open) => (event) => {
    // Prevent toggling on key presses that might interfere with focus management
    if (
      event &&
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }
    setDrawerOpen(open);
  };

  // Define navigation items with labels and target section IDs
  const navItems = [
    { label: "Home", target: "hero" },
    { label: "Services", target: "feature" },
    { label: "Contact", target: "contact" },
  ];

  // Smooth scroll to the section with the given id
  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const drawerList = (
    <Box sx={{ width: 250 }} role="presentation">
      {/* Close icon at the top of the Drawer */}
      <Box sx={{ display: "flex", justifyContent: "flex-end", p: 1 }}>
        <IconButton onClick={toggleDrawer(false)}>
          <CloseIcon />
        </IconButton>
      </Box>
      <List>
        {navItems.map((item) => (
          <ListItem key={item.label} disablePadding>
            <ListItemButton
              onClick={() => {
                scrollToSection(item.target);
                setDrawerOpen(false);
              }}
            >
              <ListItemText primary={item.label} />
            </ListItemButton>
          </ListItem>
        ))}
        <ListItem disablePadding>
          <ListItemButton
            onClick={() => {
              navigate("/sign-up");
              setDrawerOpen(false);
            }}
          >
            <ListItemText primary="Sign Up" />
          </ListItemButton>
        </ListItem>
      </List>
    </Box>
  );

  return (
    <AppBar
      position="static"
      sx={{
        backgroundColor: "transparent",
        boxShadow: "none",
        p: "10px",
        "@media (min-width:800px)": { px: "64px" },
      }}
    >
      <Toolbar
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography variant="h4" sx={{ fontWeight: "bold", color: "var(--customBlack)" }}>
          Team Sync
        </Typography>

        {/* Navigation links and Sign Up button for screens >= 800px */}
        <Box
          sx={{
            display: "none",
            "@media (min-width:800px)": { display: "flex" },
            gap: "20px",
            mt: "2rem",
            pt: "2rem",
          }}
        >
          {navItems.map((item) => (
            <Button
              key={item.label}
              color="inherit"
              onClick={() => scrollToSection(item.target)}
              sx={{
                color: "var(--customBlack)",
                fontWeight: "600",
                letterSpacing: "2px",
                ":hover": { color: "#213547" },
              }}
            >
              {item.label}
            </Button>
          ))}
        </Box>
        <Box
          sx={{
            display: "none",
            "@media (min-width:800px)": { display: "flex" },
          }}
        >
          <Link to="/sign-up" style={{ textDecoration: "none" }}>
            <Button
              variant="contained"
              sx={{
                backgroundColor: "var(--customBgBlue)",
                px: "3rem",
                borderRadius: "20px",
                textTransform: "none",
              }}
            >
              Sign Up
            </Button>
          </Link>
        </Box>

        {/* Hamburger menu for screens < 800px */}
        <Box
          sx={{
            display: "flex",
            "@media (min-width:800px)": { display: "none" },
          }}
        >
          <IconButton
            size="large"
            edge="start"
            aria-label="menu"
            onClick={toggleDrawer(true)}
          >
            <MenuIcon sx={{ fontWeight: "bolder", color: "black" }} />
          </IconButton>
          <Drawer anchor="right" open={drawerOpen} onClose={toggleDrawer(false)}>
            {drawerList}
          </Drawer>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
