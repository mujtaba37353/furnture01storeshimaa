import {
  Box,
  CircularProgress,
  Paper,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import {
  useDeleteSectionByIdMutation,
  useGetAllSectionsQuery,
} from "../../api/section.api";
import EditIcon from "@mui/icons-material/Edit";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import DeleteIcon from "@mui/icons-material/Delete";
import { imageBaseUrl } from "../../api/baseUrl";
import { useNavigate } from "react-router-dom";
import { SITE_CONTENTS } from "./SiteContents";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { allowed } from "../../helper/roles";
const Layout = ({ children }) => {
  const { customColors } = useTheme();
  return (
    <Box
      sx={{
        aspectRatio: "1/1",
        bg: customColors.bg,
        borderRadius: "10px", 
        overflow: "hidden",
      }}
    >
      {children}
    </Box>
  );
};

const Operations = ({ id, type, hided }) => {
  const { customColors } = useTheme();
  const [deleteSectionById,{isLoading:deleteCategoryByIdLoading}] = useDeleteSectionByIdMutation();
  const { role } = useSelector((state) => state.user);

  const {
    i18n: { language },
  } = useTranslation();
  const navigate = useNavigate();
  const handleDelete = () => {
    if (hided) {
      return;
    }
    if (id) {
      deleteSectionById(id)
        .unwrap()
        .then((res) => {
           
          toast.success(
            language === "en" ? res.success_en : res.success_ar
          );
        })
        .catch((error) => {
          toast.error(
            language === "en" ? error.data.error_en : error.data.error_ar
          );
        });
    }
  };
  const handleEdit = () => {
    if (hided) {
      return;
    }
    navigate(`/siteContent/operation/${type}?id=${id}`);
  };
  const handleShow = () => {
    if (hided) {
      return;
    }
    navigate(`/siteContent/${id}`);
  };
  if (hided) {
    return;
  }

  const direction = language === "en" ? { left: "1rem" } : { right: "1rem" };
  return (
    <Paper
      elevation={1}
      sx={{
        position: "absolute",
        top: "0px",
        ...direction,
        zIndex: "1",
        p: 1,
        borderRadius: "0",
        bgcolor: customColors.bg,
      }}
    >
      <Stack direction={"column"}>
        { allowed({ page: "siteContent",role }) && <EditIcon
          onClick={handleEdit}
          sx={{ color: customColors.main, cursor: "pointer", width: 15 }}
        />}
        <RemoveRedEyeIcon
          onClick={handleShow}
          sx={{ color: customColors.main, cursor: "pointer", width: 15 }}
        />
       {allowed({ page: "siteContent",role }) && <DeleteIcon
          onClick={handleDelete}
          sx={{ color: customColors.main, cursor: "pointer", width: 15 }}
        />}
      </Stack>
    </Paper>
  );
};

function SiteContentCard({ type, image, _id }) {
  const {
    i18n: { language },
  } = useTranslation();

  const typeObj = SITE_CONTENTS.find((item) => item.type === type);

  return (
    <Layout>
      <Typography variant="h5" sx={{ pb: 1 }}>
        {language === "en" ? typeObj.title_en : typeObj.title_ar}
      </Typography>
      <Paper elevation={1} sx={{ aspectRatio: "1/1",borderRadius: "10px", overflow: "hidden" }}>
         <div style={{ position: "absolute" }}>
          <Operations id={_id} type={type} />
        </div>
        <Box
          component={"img"}
          src={image ? `${imageBaseUrl}${image}` : "/placeholder.png"}
          sx={{
            width: "100%",
            height: "100%",
            aspectRatio: "1/1",
            objectFit: "cover",
          }}
        />
      </Paper>
    </Layout>
  );
}

export default SiteContentCard;
