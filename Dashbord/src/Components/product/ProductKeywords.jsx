import { useTheme } from "@emotion/react";
import { Box, Button, InputBase, Stack, Typography } from "@mui/material";
import React, { useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
const ProductKeywords = ({
  keywordsValues,
  keywordsErrors,
  keywordsTouched,
  setFieldValue,
  language,
}) => {
  const { colors, customColors } = useTheme();
  const [text, setText] = useState("");
  const handleAddkeyword = () => {
    if (text) {
      setFieldValue("keywords", [...keywordsValues, text]);
      setText("");
    }
  };
  const handleDeleteKeyword = (item) => {
    const filteredItems = keywordsValues.filter((keyword) => keyword !== item);
    setFieldValue("keywords", filteredItems);
  };
  return (
    <Box>
      <Typography
        sx={{
          color: customColors.text,
          fontWeight: "bold",
          fontSize: "15px",
        }}
      >
        {language === "en" ? "keywords" : "الكلمات المفتاحية"}
      </Typography>
      <Stack direction={"row"}>
        <InputBase
          sx={{
            width: 1,
            border: 1,
            borderColor:
              colors[
                keywordsErrors && keywordsTouched
                  ? "dangerous"
                  : "inputBorderColor"
              ],
            px: 2,
            py: 0.4,
            bgcolor: customColors.bg,
          }}
          value={text}
          onChange={(event) => setText(event.target.value)}
        />
        <Button
          type="button"
          onClick={handleAddkeyword}
          sx={{
            minWidth: 0,
            width: 70,
            bgcolor: `${colors.main} !important`,
            color: "#fff",
            borderRadius: 0,
            border :1,
            borderColor : colors.inputBorderColor
          }}
        >
          +
        </Button>
      </Stack>
      {keywordsValues?.length > 0 ? (
        <Stack
          sx={{
            flexDirection: "row",
            flexWrap: "wrap",
            gap: "20px",
            mt: 2,
            border: 1,
            borderColor: "divider",
            p: 2,
            borderRadius: "3px",
          }}
        >
          {keywordsValues.map((keyword) => (
            <Box
              border={1}
              borderColor={"divider"}
              pt={2.5}
              px={2}
              borderRaius={"3px"}
              position={"relative"}
            >
              <Typography py={1.5}>{keyword}</Typography>
              <CloseIcon
                onClick={() => handleDeleteKeyword(keyword)}
                sx={{
                  position: "absolute",
                  top: 0,
                  left: language === "ar" ? 0 : undefined,
                  right: language === "en" ? 0 : undefined,
                  cursor: "pointer",
                  color: colors.dangerous,
                }}
              />
            </Box>
          ))}
        </Stack>
      ) : undefined}
      {keywordsErrors && keywordsTouched ? (
        <Typography
          sx={{
            color: colors.dangerous,
          }}
        >
          {keywordsErrors}
        </Typography>
      ) : undefined}
    </Box>
  );
};

export default ProductKeywords;
