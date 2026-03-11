import React from "react";

// Helper function to generate a deterministic color from a string
const stringToColor = (str) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  let color = "#";
  for (let i = 0; i < 3; i++) {
    const value = (hash >> (i * 8)) & 0xff;
    color += ("00" + value.toString(16)).slice(-2);
  }
  return color;
};

// Helper function to darken a hex color by a given factor
const darkenColor = (hex, factor = 0.7) => {
  // Remove '#' if it exists
  let color = hex.startsWith("#") ? hex.slice(1) : hex;
  const num = parseInt(color, 16);
  let r = (num >> 16) & 0xff;
  let g = (num >> 8) & 0xff;
  let b = num & 0xff;

  // Darken each channel
  r = Math.floor(r * factor);
  g = Math.floor(g * factor);
  b = Math.floor(b * factor);

  // Convert back to hex string and return with a leading '#'
  return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
};

const UserAvatar = ({ email, size = 40 }) => {
  const firstLetter = email ? email[0].toUpperCase() : "";
  // Generate the original color and then darken it
  const originalColor = email ? stringToColor(email) : "#ccc";
  const bgColor = darkenColor(originalColor, 0.7); // Adjust factor as needed

  return (
    <div
      style={{
        backgroundColor: bgColor,
        width: size,
        height: size,
        borderRadius: "50%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "#fff",
        fontWeight: "bold",
        fontSize: size / 2,
      }}
    >
      {firstLetter}
    </div>
  );
};

export default UserAvatar;
