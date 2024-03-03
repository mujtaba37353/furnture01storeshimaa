import { Button, InputBase, Typography } from "@mui/material";
import React from "react";
import { useTranslation } from "react-i18next";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";

const UploadCoverPhoto = ({ handleUploadMainPicture }) => {
  const [_, { language }] = useTranslation();
  return (
    <Button
      component="label"
      role={undefined}
      variant="contained"
      tabIndex={-1}
      startIcon={
        <CloudUploadIcon
          sx={{
            color: "#fff",
          }}
        />
      }
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "flex-start",
        gap: "10px",
        width: "220px",
        py: "10px",
        bgcolor: "#10E5D5 !important",
        position: "absolute",
        top: "15px",
        right: "15px",
      }}
    >
      <InputBase
        type="file"
        sx={{
          clip: "rect(0 0 0 0)",
          clipPath: "inset(50%)",
          height: 1,
          overflow: "hidden",
          position: "absolute",
          left: 0,
          whiteSpace: "nowrap",
          width: 1,
        }}
        onChange={handleUploadMainPicture}
      />
      <Typography
        sx={{
          color: "#fff",
        }}
      >
        {language === "en" ? "Add main image" : "أضف الصورة الرئسية"}
      </Typography>
    </Button>
  );
};

export default UploadCoverPhoto;
