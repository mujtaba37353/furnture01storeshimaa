import Button from "@mui/material/Button";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { Box, CardMedia, Typography } from "@mui/material";
import { useTheme } from "@emotion/react";
import UploadCoverPhoto from "./UploadMainPhoto";

export default function UploadFiles({
  error,
  touched,
  file,
  extraStyle,
  handleUploadFile,
  handleUploadMainPicture,
  coverPhoto,
}) {
  const { colors } = useTheme();
  return (
    <Box
      sx={{
        ...extraStyle,
        objectFit: "cover",
        borderRadius: "10px",
        position: "relative",
        border: 1,
        borderColor: error && touched ? colors.dangerous : "divider",
        mb: "30px",
      }}
    >
      {coverPhoto && (
        <UploadCoverPhoto handleUploadMainPicture={handleUploadMainPicture} />
      )}

      {file ? (
        <CardMedia
          component="img"
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            height: "100%",
          }}
          src={file ? URL.createObjectURL(file) : undefined}
        />
      ) : undefined}
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
          }}
        />
        <input
          type="file"
          multiple={true}
          style={{
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
          }}
        >
          {error}
        </Typography>
      ) : undefined}
    </Box>
  );
}
