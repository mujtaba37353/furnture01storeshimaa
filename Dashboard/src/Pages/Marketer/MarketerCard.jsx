import { useTheme } from "@emotion/react";
import { Button, Paper, Stack, Typography, Box } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { allowed } from "../../helper/roles";
import { useDeleteMarketerByIdMutation } from "../../api/marketer.api";

function MarketerCard({ marketer, handleOpenEdit }) {
  const { role } = useSelector((state) => state.user);

  let arabicKeys = {
    allProducts: "كل المنتجات",
    products: "المنتجات",
    categories: "الأقسام",
    subcategories: "الأقسام الفرعية",
  };

  const [deleteMarketer, { isLoading: MarketerLoading }] =
  useDeleteMarketerByIdMutation();

  const { colors, customColors } = useTheme();
  const {
    i18n: { language },
  } = useTranslation();

  const handleDeleteMarketer = () => {
    deleteMarketer(marketer._id)
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
          {/* Name */}
          <Typography variant="h5" sx={{ fontWeight: "bold" }}>
            {marketer?.name}
          </Typography>

          {/* email of marketer */}
          <Stack sx={{ flexDirection: "row", alignItems: "center", gap: "5px" }}>
            <Typography sx={{ color: colors.grey }}>
              {language === "en" ? "email : " : "البريد الالكتروني : "}
            </Typography>
            <Typography sx={{ fontWeight: "bold", fontSize: "14px" }}>
              {marketer?.email}
            </Typography>
          </Stack>

          {/* Phone Of Marketer */}
          <Stack sx={{ flexDirection: "row", alignItems: "center", gap: "5px" }}>
            <Typography sx={{ color: colors.grey }}>
              {language === "en" ? "Phone : " : "رقم الجوال : "}
            </Typography>
            <Typography sx={{ fontWeight: "bold", fontSize: "14px" }}>
            {`${marketer?.phone}`}
            </Typography>
          </Stack>

          {/* Coupon */}
          <Stack sx={{ flexDirection: "row",alignItems: "center", gap: "5px" }}>
            <Typography sx={{ color: colors.grey }}>
              {language === "en"
                ? "Coupon : "
                : "الكوبون : "}
            </Typography>
            <Typography sx={{ fontWeight: "bold", fontSize: "14px" }}>
              {marketer?.couponMarketer?.code}
            </Typography>
          </Stack>

          {/* Discount On Coupon */}
          <Stack sx={{ flexDirection: "row", alignItems: "center", gap: "5px" }}>
            <Typography sx={{ color: colors.grey }}>
              {language === "en" ? "Discount On Coupon  : " : "الخصم على الكوبون : "}
            </Typography>
            <Typography sx={{ fontWeight: "bold", fontSize: "14px" }}>
              {`${marketer?.couponMarketer?.discount}%`}
            </Typography>
          </Stack>

          {/* Commission for Marketers */}
          <Stack sx={{ flexDirection: "row", alignItems: "center", gap: "5px" }}>
            <Typography sx={{ color: colors.grey }}>
              {language === "en" ? "Commission : " : "العمولة : "}
            </Typography>
            <Typography sx={{ fontWeight: "bold", fontSize: "14px" }}>
              {`${marketer?.couponMarketer?.commissionMarketer}%`}
            </Typography>
          </Stack>

          {/* Discount on */}
          <Stack sx={{ flexDirection: "row", alignItems: "center", gap: "5px" }}>
            <Typography sx={{ color: colors.grey }}>
              {language === "en" ? "Discount On : " : "الخصم على : "}
            </Typography>
            <Typography sx={{ fontWeight: "bold", fontSize: "14px" }}>
              {language === "en"? marketer?.couponMarketer?.discountDepartment?.key:arabicKeys[marketer?.couponMarketer?.discountDepartment.key]}
            </Typography>
          </Stack>

          {/* Points for Marketer */}
          <Stack sx={{ flexDirection: "row", alignItems: "center", gap: "5px" }}>
            <Typography sx={{ color: colors.grey }}>
              {language === "en" ? "Points for Marketer : " : "النقاط للمسوق : "}
            </Typography>
            <Typography sx={{ fontWeight: "bold", fontSize: "14px" }}>
              {marketer?.totalCommission }
            </Typography>
          </Stack>

          {/* Delete and Update button  */}
          <Stack
            sx={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {allowed({ page: "coupons", role }) ? (
              <Box
                sx={{
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "6px",
                }}
              >
                <Button
                  variant="contained"
                  sx={{
                    bgcolor: "#e35959 !important",
                    textTransform: "capitalize",
                    color: "white",
                    width: 0.2,
                  }}
                  disabled={MarketerLoading}
                  onClick={handleDeleteMarketer}
                >
                  {language === "en" ? "delete" : "حذف"}
                </Button>
                <Button
                  variant="contained"
                  sx={{
                    bgcolor: "transparent !important",
                    textTransform: "capitalize",
                    color: "#00E3D2",
                    border: 1,
                    borderColor: "#00E3D2",
                    width: 0.2,
                  }}
                  disabled={MarketerLoading}
                  onClick={() => handleOpenEdit(marketer)}
                >
                  {language === "en" ? "edit" : "تعديل"}
                </Button>
              </Box>
            ) : (
              <></>
            )}
          </Stack>
        </Stack>
      </Paper>
    </>
  );
}

export default MarketerCard;
