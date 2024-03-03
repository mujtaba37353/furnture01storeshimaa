import { WhatsApp as WhatsAppIcon } from "@mui/icons-material";
import { Box, Button } from "@mui/material";
import React from "react";

function Whatsapp() {
  return (
    <Button
      component="a"
      sx={{
        position: "fixed",
        bottom: "20px",
        right: "20px",
        width: "60px",
        height: "60px",
        zIndex: 1000,
        backgroundColor: "#727272",
        color: "#fff",
        borderRadius: "50%",
        boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.25)",
        "&:hover": { backgroundColor: "#727272" },
      }}
      variant="contained"
      href="https://wa.me/+966555983449"
      target="_blank"
    >
      <WhatsAppIcon
        sx={{
          width: "30px",
          height: "30px",
        }}
      />
    </Button>
  );
}

export default Whatsapp;
