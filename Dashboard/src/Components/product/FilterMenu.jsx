import { FormControl, MenuItem, Select, Typography } from "@mui/material";
import { useTheme } from "@emotion/react";

const FilterMenu = ({
  item,
  value,
  options,
  label,
  text,
  field,
  handleChange,
}) => {
  const { colors } = useTheme();
  return (
    <FormControl
      sx={{
        width: {
          md: 200,
          xs: 1,
        },
        svg: {
          color: `#fff !important`,
        },
      }}
    >
      {" "}
      <Typography
        sx={{
          color: colors.text,
          fontWeight: "bold",
          fontSize: "13px",
        }}
      >
        {label}
      </Typography>
      <Select
        name={item}
        value={value}
        onChange={(event) => handleChange(event)}
        sx={{
          border: 1,
          height: 45,
          bgcolor: colors.main,
          color: "#fff !important",
          fontWeight: "bold",
        }}
      >
        {options.map((option) => (
          <MenuItem value={option._id}>{option[field]}</MenuItem>
        ))}
        {options.length > 0 ? <MenuItem value={""}>{text}</MenuItem> : null}
      </Select>
    </FormControl>
  );
};

export default FilterMenu;
