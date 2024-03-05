import { useTheme } from "@emotion/react";
import {
  Box,
  Button,
  CardMedia,
  Stack,
  TableCell,
  TableRow,
  Typography,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import DeleteIcon from "@mui/icons-material/Delete";
import BorderColorIcon from "@mui/icons-material/BorderColor";
import VisibilityIcon from "@mui/icons-material/Visibility";
import PublicIcon from "@mui/icons-material/Public";
import { useState } from "react";
import CategoryModal from "./CategoryModal";
import { useDeleteCategoryByIdMutation } from "../../api/category.api";
import CategoryShowSubModal from "./CategoryShowSubModal";
import CategoryAddSubModal from "./CategoryAddSubModal";
import { toast } from "react-toastify";
import { allowed } from "../../helper/roles";
import { useSelector } from "react-redux";
import Tooltip, { tooltipClasses } from "@mui/material/Tooltip";
import { styled } from "@mui/material/styles";
import { imageBaseUrl } from "../../api/baseUrl";

function CategoryCard(category) {
  const { role } = useSelector((state) => state.user);
  const [deleteCategory, { isLoading: deleteSubLoading }] =
    useDeleteCategoryByIdMutation();
  const { colors, customColors } = useTheme();
  const {
    i18n: { language },
  } = useTranslation();
  const [open, setOpen] = useState(false);
  const [openSub, setOpenSub] = useState(false);
  const [openCreateSub, setOpenCreateSub] = useState(false);

  const BootstrapTooltip = styled(({ className, ...props }) => (
    <Tooltip {...props} arrow classes={{ popper: className }} />
  ))(({ theme }) => ({
    [`& .${tooltipClasses.arrow}`]: {
      color: theme.palette.common.black,
    },
    [`& .${tooltipClasses.tooltip}`]: {
      backgroundColor: theme.palette.common.black,
    },
  }));

  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClickOpenSub = () => {
    setOpenSub(true);
  };
  const handleClickOpenCreateSub = () => {
    setOpenCreateSub(true);
  };

  const handleDeleteCategory = () => {
    deleteCategory(category.data._id)
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
      <CategoryModal open={open} setOpen={setOpen} data={category.data} />
      <CategoryShowSubModal
        open={openSub}
        setOpen={setOpenSub}
        category={category.data}
      />
      <CategoryAddSubModal
        open={openCreateSub}
        setOpen={setOpenCreateSub}
        category={category.data}
      />

      <TableRow
        sx={{
          bgcolor: customColors.bg,
        }}
      >
        <TableCell align="center">
          <Typography
            variant="subtitle1"
            sx={{
              fontWeight: "bold",
            }}
          >
            {category.index + 1}
          </Typography>
        </TableCell>
        <TableCell align="center">
          {/* <PublicIcon /> */}
          {category?.data?.image ? (
            <Stack direction={"row"} justifyContent={"center"}>
              <CardMedia
                component="img"
                sx={{
                  height: 30,
                  width: 30,
                }}
                src={imageBaseUrl + category?.data?.image}
              />
            </Stack>
          ) : (
            <PublicIcon />
          )}
        </TableCell>
        <TableCell align="center">
          {language === "en" ? category.data.name_en : category.data.name_ar}
        </TableCell>
        <TableCell align="center">{category.data.productsCount}</TableCell>
        <TableCell align="center">{Math.floor(category.data.revinue)}</TableCell>
        <TableCell align="center">
          <Box
            sx={{
              display: "flex",
              direction: "row",
              justifyContent: "center",
              alignItems: "center",
              gap: 2,
            }}
          >
            {/* Add SubCategory */}
            {allowed({ page: "categories", role }) ? (
              <BootstrapTooltip
                title={
                  language === "en" ? "Add Subcategory" : "أضافة تصنيف فرعي"
                }
              >
                <Button
                  variant="raised"
                  sx={{
                    ":hover": {
                      backgroundColor: "transparent", // Remove the hover effect by setting a transparent background
                    },
                    p: "2px",
                    minWidth: "0px",
                  }}
                  onClick={handleClickOpenCreateSub}
                >
                  <AddCircleOutlineIcon
                    sx={{
                      color: "green",
                      p: "4px",
                      width: "30px",
                      height: "30px",
                    }}
                  />
                </Button>
              </BootstrapTooltip>
            ) : (
              <></>
            )}

            {/* View SubCategory */}
            <BootstrapTooltip
              title={
                language === "en"
                  ? "View all subcategories in this category"
                  : "عرض كل التصنيفات الفرعية الموجودة في هذا التصنيف"
              }
            >
              <Button
                variant="raised"
                sx={{
                  ":hover": {
                    backgroundColor: "transparent", // Remove the hover effect by setting a transparent background
                  },
                  p: "2px",
                  minWidth: "0px",
                }}
                onClick={handleClickOpenSub}
              >
                <VisibilityIcon
                  sx={{
                    color: colors.main,
                    p: "2px",
                    width: "30px",
                    height: "30px",
                  }}
                />
              </Button>
            </BootstrapTooltip>

            {/* Edit Category */}
            {allowed({ page: "categories", role }) ? (
              <BootstrapTooltip
                title={language === "en" ? "Edit Category" : "تعديل تصنيف"}
              >
                <Button
                  variant="raised"
                  sx={{
                    ":hover": {
                      backgroundColor: "transparent", // Remove the hover effect by setting a transparent background
                    },
                    p: "2px",
                    minWidth: "0px",
                  }}
                  onClick={handleClickOpen}
                >
                  <BorderColorIcon
                    sx={{
                      color: "#f7ff00",
                      p: "2px",
                      width: "30px",
                      height: "30px",
                    }}
                  />
                </Button>
              </BootstrapTooltip>
            ) : (
              <></>
            )}

            {/* Delete Category */}
            {allowed({ page: "categories", role }) ? (
              <BootstrapTooltip
                title={language === "en" ? "Delete Category" : "مسح تصنيف"}
              >
                <Button
                  variant="raised"
                  sx={{
                    ":hover": {
                      backgroundColor: "transparent", // Remove the hover effect by setting a transparent background
                    },
                    p: "2px",
                    minWidth: "0px",
                  }}
                  disabled={deleteSubLoading}
                  onClick={handleDeleteCategory}
                >
                  <DeleteIcon
                    sx={{
                      color: colors.dangerous,
                      p: "2px",
                      width: "30px",
                      height: "30px",
                    }}
                  />
                </Button>
              </BootstrapTooltip>
            ) : (
              <></>
            )}
          </Box>
        </TableCell>
      </TableRow>
    </>
  );
}

export default CategoryCard;
