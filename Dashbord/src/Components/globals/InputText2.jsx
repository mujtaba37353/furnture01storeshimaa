import { useTheme } from "@emotion/react";
import { Box, InputBase, Typography } from "@mui/material";
import React from "react";

const InputText2 = ({ label, state, type, setState, name }) => {
  const { customColors } = useTheme();
  const handleChange = (e) => {
    const { name, value } = e.target;
    setState({
      ...state,
      [name]: value,
    });
  };
  return (
    <Box
      sx={{
        mb: "15px",
      }}
    >
      <Typography
        sx={{
          color: customColors.text,
          fontWeight: "bold",
          fontSize: "15px",
        }}
      >
        {label}
      </Typography>
      <InputBase
        name={name}
        val
        sx={{
          width: 1,
          border: 1,
          borderColor: customColors.inputBorderColor,
          borderRadius: "4px",
          p: "2px 4px",
          bgcolor: customColors.bg,
        }}
        type={type}
        value={state[name]}
        onChange={handleChange}
      />
    </Box>
  );
};

export default InputText2;
