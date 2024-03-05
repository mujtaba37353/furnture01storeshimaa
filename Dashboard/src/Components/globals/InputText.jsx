import { useTheme } from "@emotion/react";
import { Box, InputBase, Typography } from "@mui/material";
import React from "react";
const InputText = ({
  label,
  nestedLabel,
  error,
  touched,
  value,
  name,
  type,
  handleChange,
  handleBlur,
  isDisabled,
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
      <InputBase
        sx={{
          width: 1,
          border: 1,
          borderColor:
            customColors[error && touched ? "dangerous" : "inputBorderColor"],
          borderRadius: "4px",
          p: "2px 4px",
          bgcolor: customColors.bg,
        }}
        name={name}
        type={type}
        value={value}
        onChange={handleChange}
        onBlur={handleBlur}
        disabled={isDisabled}
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

export default InputText;
