import { Box, Button, useTheme } from "@mui/material";
import SiteContents from "../../Components/SiteContent/SiteContents";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { allowed } from "../../helper/roles";

function SiteContentPage() {
  const {
    i18n: { language },
  } = useTranslation();
  const { role } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const { customColors } = useTheme();
  return (
    <Box>
      <Box
        sx={{
          width: "100%",
          display: "flex",
          justifyContent: "flex-end",
          gap: "1rem",
          mb: "1rem",
        }}
      >
        {allowed({ page: "siteContent",role }) && (
          <Button
            variant="contained"
            sx={{
              bgcolor: customColors.main,
              color: "#fff",
              width: "fit-content",
              alignSelf: "flex-end",
              p: "0.5rem 2rem",
              fontSize: "1rem",
              fontWeight: "bold",
              "&:hover": { bgcolor: customColors.main },
            }}
            onClick={() => navigate("/siteContent/operation")}
          >
            {language === "en" ? "Add Content" : "اضافة محتوي"}
          </Button>
        )}
      </Box>
      <SiteContents />
    </Box>
  );
}

export default SiteContentPage;
