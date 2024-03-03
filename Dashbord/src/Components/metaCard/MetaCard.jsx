import React from "react";
import { Paper, Typography } from "@mui/material";
import { useTheme } from "@emotion/react";

const MetaCard = ({ item }) => {
  const { colors, customColors } = useTheme();

  return (
    <Paper
      elevation={1}
      sx={{
        wordBreak: "break-word",
        p: 2,
        borderRadius: 5,
        gap: 5,
        width: "100%",
        minHeight: "236px",
        height: "100%",
        bgcolor: customColors.card,
        direction: "ltr",

      }}
    >
      <Typography variant="h6" sx={{ fontWeight: "bold" }}>
        {item.title_meta}
      </Typography>
      <Typography variant="body1" sx={{ fontWeight: "bold" }} height={120}>
        {item.desc_meta}
      </Typography>
    </Paper>
  );
};

export default MetaCard;
