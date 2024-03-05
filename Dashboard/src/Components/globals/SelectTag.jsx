import { useTheme } from "@emotion/react";
import { Box, Typography, FormControl, MenuItem, Select } from "@mui/material";
import React from "react";
import { useTranslation } from "react-i18next";

const SelectTag = ({
  label,
  error,
  touched,
  value,
  name,
  handleChange,
  itemField,
  optionsData,
  disabled,
  link,
}) => {
  const { colors, customColors } = useTheme();
  const [_, { language: lang }] = useTranslation();

  return (
    <Box
      sx={{
        mt: "15px",
        position: "relative",
      }}
    >
      <Typography
        sx={{
          color: colors.text,
          fontWeight: "bold",
          fontSize: "15px",
        }}
      >
        {label}
      </Typography>
      <FormControl
        sx={{
          width: 1,
          svg: {
            color: `${colors.main} !important`,
          },
        }}
      >
        <Select
          value={link ? "online" : value}
          name={name}
          onChange={handleChange}
          displayEmpty
          disabled={disabled || link ? true : false}
          sx={{
            width: 1,
            border: 1,
            height: 45,
            borderColor:
              customColors[error && touched ? "dangerous" : "inputBorderColor"],
            bgcolor: customColors.bg,
          }}
        >
          {optionsData.map((item, idx) => (
            <MenuItem key={idx} value={itemField ? item._id : item}>
              {itemField ? item[itemField] : item}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      {error && touched ? (
        <Typography
          sx={{
            color: colors.dangerous,
          }}
        >
          {error}
        </Typography>
      ) : undefined}
    </Box>
  );
};

export default SelectTag;
