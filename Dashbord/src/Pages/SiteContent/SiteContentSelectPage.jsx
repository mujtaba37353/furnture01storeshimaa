import {
  Button,
  FormControl,
  FormControlLabel,
  FormLabel,
  Paper,
  Radio,
  RadioGroup,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import { SITE_CONTENTS } from "../../Components/SiteContent/SiteContents";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function SiteContentSelectPage() {
  const [type, setType] = useState("");
  const [error, setError] = useState(false);
  const {customColors} = useTheme();
  const {
    i18n: { language },
  } = useTranslation();
  const navigate = useNavigate();
  const handleChange = (event) => {
    setType(event.target.value);
  };
  const handleNext = () => {
    if (type === "") {
      setError(true);
      return;
    }
    navigate(`/siteContent/operation/${type}`);
  };
  return (
    <Paper
      elevation={1}
      sx={{
        minHeight: "50vh",
        p: 4,
        bgcolor: customColors.bg,
      }}
    >
      <Typography variant="h5" pb={2}>
        {language === "en" ? "Content Type" : "نوع المحتوي"}
      </Typography>
      <Stack>
        <FormControl onChange={handleChange}>
          <RadioGroup
            aria-labelledby="demo-radio-buttons-group-label"
            defaultValue="female"
            name="radio-buttons-group"
          >
            {SITE_CONTENTS.map((content) => (
              <FormControlLabel
                key={content.id}
                value={content.type}
                control={<Radio />}
                label={language === "en" ? content.title_en : content.title_ar}
                sx={{
                  fontSize: "1.2rem",
                  "& .Mui-checked":
                    {
                      color: customColors.main,
                    },
                }}
              />
            ))}
          </RadioGroup>
        </FormControl>
        {error && (
          <Typography
            textAlign={"center"}
            variant="body1"
            sx={{ color: "#C75050" }}
          >
            {language === "en"
              ? "Please select content type"
              : "من فضلك اختر نوع المحتوي"}
          </Typography>
        )}
        <Button
          onClick={handleNext}
          sx={{
            bgcolor: "#00D5C5",
            color: "#fff",
            width: "fit-content",
            alignSelf: "flex-end",
            p: "0.5rem 2rem",
            fontSize: "1rem",
            fontWeight: "bold",
            "&:hover": { bgcolor: "#00D5C5" },
          }}
        >
          {language === "en" ? "Next" : "التالي"}
        </Button>
      </Stack>
    </Paper>
  );
}

export default SiteContentSelectPage;
