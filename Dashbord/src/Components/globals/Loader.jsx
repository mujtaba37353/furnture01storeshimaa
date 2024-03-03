import { useTheme } from "@emotion/react";
import { CircularProgress, Stack } from "@mui/material";
import React from "react";

const Loader = ({ extraStyle }) => {
  const { colors } = useTheme();
  return (
    <Stack
      sx={{
        ...extraStyle,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <CircularProgress
        sx={{
          color: colors.main,
          fontSize: "45px",
        }}
      />
    </Stack>
  );
};

export default Loader;
