import { useTheme } from "@emotion/react";
import { Button, Paper, Stack, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
// import AdminModal from "./AdminModal";
import { useDeleteUserByIdMutation } from "../../api/user.api";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { allowed } from "../../helper/roles";

function AdminCard(admin) {
  const { role } = useSelector((state) => state.user);

  const Roles = {
    rootAdmin: "مدير تنفيذي",
    adminA: "مدير عام",
    adminB: "مدير",
    adminC: "محاسب",
    subAdmin: "مسؤول خدمة العملاء",
  };

  const [deleteAdmin, { isLoading: AdminLoading }] =
    useDeleteUserByIdMutation();

  const { colors, customColors } = useTheme();
  const {
    i18n: { language },
  } = useTranslation();

  const handleDeleteAdmin = () => {
    deleteAdmin(admin.data._id)
      .unwrap()
      .then(() => {
        toast.success(
          language === "en" ? "Deleted Successfully" : "تم الحذف بنجاح"
        );
      })
      .catch((error) => {
        const message =
          language === "en" ? error?.data?.error_en : error?.data?.error_ar;
        toast.error(message);
      });
  };
  return (
    <>
      <Paper
        elevation={1}
        sx={{
          bgcolor: customColors.card,
          p: 2,
          borderRadius: 5,
          gap: 5,
          display: "flex",
          flexDirection: "row",
          width: "100%",
          minHeight: "236px",
          justifyContent: "space-between",
          alignItems: "center",
          height: "100%",
        }}
      >
        <Stack sx={{ width: "100%", gap: 1 }}>
          <Typography variant="h5" sx={{ fontWeight: "bold" }}>
            {admin.data.name}
          </Typography>

          {/* email */}
          <Stack sx={{ flexDirection: "row" }}>
            <Typography sx={{ color: colors.grey }}>
              {language === "en" ? "Email" : "البريد"} :{" "}
            </Typography>
            <Typography sx={{ fontWeight: "bold", fontSize: "14px" }}>
              {admin.data.email}
            </Typography>
          </Stack>

          {/* phone */}
          <Stack sx={{ flexDirection: "row" }}>
            <Typography sx={{ color: colors.grey }}>
              {language === "en" ? "Phone" : "رقم"} :{" "}
            </Typography>
            <Typography sx={{ fontWeight: "bold", fontSize: "14px" }}>
              {admin.data.phone ? admin.data.phone : "+96000000000"}
            </Typography>
          </Stack>

          {/* date of join */}
          <Stack sx={{ flexDirection: "row" }}>
            <Typography sx={{ color: colors.grey }}>
              {language === "en" ? "Date of Join" : "تاريخ الانضمام"} :{" "}
            </Typography>
            <Typography sx={{ fontWeight: "bold", fontSize: "14px" }}>
              {admin.data.createdAt.substring(0, 10)}
            </Typography>
          </Stack>

          {/* role */}
          <Stack sx={{ flexDirection: "row" }}>
            <Typography sx={{ color: colors.grey }}>
              {language === "en" ? "Role" : "نوع المدير"} :{" "}
            </Typography>
            <Typography sx={{ fontWeight: "bold", fontSize: "14px" }}>
              {language === "en" ? admin.data.role : Roles[admin.data.role]}
            </Typography>
          </Stack>

          {/* delet button */}
          <Stack
            sx={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {allowed({ page: "admins", role }) ? (
              <Button
                variant="contained"
                sx={{
                  bgcolor: "#e35959 !important",
                  textTransform: "capitalize",
                  color: "white",
                }}
                disabled={AdminLoading}
                onClick={handleDeleteAdmin}
              >
                {language === "en" ? "delete" : "حذف"}
              </Button>
            ) : (
              <></>
            )}
          </Stack>
        </Stack>
      </Paper>
    </>
  );
}

export default AdminCard;
