import { useTheme } from "@emotion/react";
import { Box, Typography } from "@mui/material";
import React from "react";
const ProductInputBase = ({
  label,
  nestedLabel,
  error,
  touched,
  value,
  name,
  type,
  handleBlur,
  setFieldValue,
}) => {
  const { customColors } = useTheme();
  return (
    <Box>
      <Typography
        sx={{
          color: customColors.text,
          fontWeight: "bold",
          fontSize: "15px",
        }}
      >
        {label}{" "}
        {nestedLabel ? (
          <Typography
            component="span"
            sx={{
              fontSize: "small",
            }}
          >
            {nestedLabel}
          </Typography>
        ) : null}
      </Typography>
      <input
        style={{
          width: "100%",
          border: `1px solid ${
            customColors[error && touched ? "dangerous" : "inputBorderColor"]
          }`,
          borderRadius: "4px",
          padding: "2px 4px",
          backgroundColor: customColors.bg,
        }}
        name={name}
        type={type}
        value={value}
        onChange={(event) => setFieldValue("title_en", event.target.value)}
        onBlur={handleBlur}
      />
      {error && touched ? (
        <Typography
          sx={{
            color: customColors.dangerous,
          }}
        >
          {error}
        </Typography>
      ) : undefined}
    </Box>
  );
};

export default ProductInputBase;
