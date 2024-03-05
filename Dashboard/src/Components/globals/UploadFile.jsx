import { useTheme } from "@emotion/react";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { Box, CardMedia, InputBase, Typography } from "@mui/material";
import Button from "@mui/material/Button";
import * as React from "react";
import { imageBaseUrl } from "../../api/baseUrl";

const UploadFile = ({
  error,
  touched,
  value,
  file,
  handleUploadFile,
  extraStyle,
  offerModal,
}) => {
  const { colors } = useTheme();
  return (
    <Box
      sx={{
        ...extraStyle,
        width: {
          lg: offerModal ? 0.98 : "calc(100% - 100px)",
          xs: 1,
        },
        objectFit: "cover",
        borderRadius: "10px",
        position: "relative",
        border: 1,
        borderColor: error && touched ? colors.dangerous : "divider",
        mb: "30px",
      }}
    >
      <CardMedia
        component="img"
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          height: "100%",
        }}
        src={file ? URL.createObjectURL(file) : value ? imageBaseUrl + value : undefined}
      />
      <Button
        component="label"
        variant="contained"
        sx={{
          position: "absolute",
          bottom: "-30px",
          left: "50%",
          minWidth: 0,
          transform: "translateX(-50%)",
          borderRadius: "50%",
          py: "15px",
          height: 60,
          width: 60,
          bgcolor: `${colors.main} !important`,
        }}
        onChange={(e) => handleUploadFile(e)}
      >
        <CloudUploadIcon
          sx={{
            fontSize: "25px",
            color: "#fff !important",
          }}
        />
        <InputBase
          type="file"
          sx={{
            clip: "rect(0 0 0 0)",
            clipPath: "inset(50%)",
            height: 1,
            overflow: "hidden",
            position: "absolute",
            bottom: 0,
            left: 0,
            whiteSpace: "nowrap",
            width: 1,
          }}
        />
      </Button>
      {error && touched ? (
        <Typography
          sx={{
            color: colors.dangerous,
            position: "absolute",
            bottom: "-30px",
            left: "10px",
            fontSize: "12px",
          }}
        >
          {error}
        </Typography>
      ) : undefined}
    </Box>
  );
};

export default UploadFile;
