import { useTheme } from "@emotion/react";
import { Button, Paper, Stack, Typography, Box } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { allowed } from "../../helper/roles";
import { useDeleteCouponByIdMutation } from "../../api/coupon.api";
import moment from "moment";


function CouponCard({ coupon, handleOpenEdit }) {
  const { role } = useSelector((state) => state.user);

  let arabicKeys = {
    allProducts: "كل المنتجات",
    products: "المنتجات",
    categories: "الأقسام",
    subcategories: "الأقسام الفرعية",
  };

  const [deleteCoupon, { isLoading: CouponLoading }] =
    useDeleteCouponByIdMutation();

  const { colors, customColors } = useTheme();
  const {
    i18n: { language },
  } = useTranslation();

  const handleDeleteCoupon = () => {
    deleteCoupon(coupon._id)
      .unwrap()
      .then((res) => {
        toast.success(language === "en" ? res.success_en : res.success_ar);
      })
      .catch((error) => {
        toast.error(
          language === "en" ? error?.data?.error_en : error?.data?.error_ar
        );
      });
  };
  return (
    <>
      <Paper
        elevation={1}
        sx={{
          bgcolor: coupon.active
            ? customColors.card
            : customColors.cardNotActive,
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
            {coupon.title}
          </Typography>

          {/* Code */}
          <Stack
            sx={{ flexDirection: "row", alignItems: "center", gap: "5px" }}
          >
            <Typography sx={{ color: colors.grey }}>
              {language === "en" ? "Code : " : "الكود : "}
            </Typography>
            <Typography sx={{ fontWeight: "bold", fontSize: "14px" }}>
              {coupon.code}
            </Typography>
          </Stack>

          {/* Discount */}
          <Stack
            sx={{ flexDirection: "row", alignItems: "center", gap: "5px" }}
          >
            <Typography sx={{ color: colors.grey }}>
              {language === "en" ? "Discount : " : "الخصم : "}
            </Typography>
            <Typography sx={{ fontWeight: "bold", fontSize: "14px" }}>
              {`${coupon.discount}%`}
            </Typography>
          </Stack>

          {/* Limit */}
          <Stack
            sx={{ flexDirection: "row", alignItems: "center", gap: "5px" }}
          >
            <Typography sx={{ color: colors.grey }}>
              {language === "en"
                ? "Number of uses available : "
                : "عدد مرات الاستخدام المتاحة : "}
            </Typography>
            <Typography sx={{ fontWeight: "bold", fontSize: "14px" }}>
              {coupon.limit}
            </Typography>
          </Stack>

          {/* Start Date */}
          <Stack
            sx={{ flexDirection: "row", alignItems: "center", gap: "5px" }}
          >
            <Typography sx={{ color: colors.grey }}>
              {language === "en" ? "Start Date : " : "تاريخ البدء : "}
            </Typography>
            <Typography sx={{ fontWeight: "bold", fontSize: "14px" }}>
              {moment(coupon?.startDate).format("DD/MM/YYYY hh:mm A")}
            </Typography>
          </Stack>

          {/* End Date */}
          <Stack
            sx={{ flexDirection: "row", alignItems: "center", gap: "5px" }}
          >
            <Typography sx={{ color: colors.grey }}>
              {language === "en" ? "End Date : " : "تاريخ الانتهاء : "}
            </Typography>
            <Typography sx={{ fontWeight: "bold", fontSize: "14px" }}>
              {moment(coupon?.endDate).format("DD/MM/YYYY hh:mm A")}
            </Typography>
          </Stack>

          {/* Discount on */}
          <Stack
            sx={{ flexDirection: "row", alignItems: "center", gap: "5px" }}
          >
            <Typography sx={{ color: colors.grey }}>
              {language === "en" ? "Discount On : " : "الخصم على : "}
            </Typography>
            <Typography sx={{ fontWeight: "bold", fontSize: "14px" }}>
              {language === "en"
                ? coupon.discountDepartment.key
                : arabicKeys[coupon.discountDepartment.key]}
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
                  disabled={CouponLoading}
                  onClick={handleDeleteCoupon}
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
                  disabled={CouponLoading}
                  onClick={() => handleOpenEdit(coupon)}
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

export default CouponCard;
