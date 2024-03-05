import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import {
  Divider,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Box,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import { useTheme } from "@emotion/react";
import DeleteIcon from "@mui/icons-material/Delete";
import BorderColorIcon from "@mui/icons-material/BorderColor";
import {
  useGetAllSubCategoriesForSpecificCategoryQuery,
  useDeleteSubCategoryByIdMutation,
} from "../../api/subcategories.api.js";
import { toast } from "react-toastify";
import { allowed } from "../../helper/roles.js";
import { useSelector } from "react-redux";
import CategoryAddSubModal from "./CategoryAddSubModal.jsx";
import Tooltip, { tooltipClasses } from "@mui/material/Tooltip";
import { styled } from "@mui/material/styles";
// import { imageBaseUrl } from "../../api/baseUrl.js";
import VisibilityIcon from "@mui/icons-material/Visibility";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { useState } from "react";
import SubCategoryShowSubSubCategoryModal from "./SubCategoryShowSubSubCategoryModal.jsx";
import SubSubModal from "./SubSubModal.jsx";

function CategoryShowSubModal({ open, setOpen, category }) {
  const { role } = useSelector((state) => state.user);
  const [deleteSubCategory, { isLoading: DeleteSubLaoding }] =
    useDeleteSubCategoryByIdMutation();
  const { data, isSuccess } = useGetAllSubCategoriesForSpecificCategoryQuery({
    id: category?._id,
    query: `populate=metaDataId`,
  });
  const { colors, customColors } = useTheme();
  const [openUpdateSub, setOpenUpdateSub] = useState(false);
  const [selectSub, setSelectSub] = useState({});
  const [subSubCategoryModel, setOpenSubSubCategoriesModel] = useState(false);

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
  const {
    i18n: { language },
  } = useTranslation();

  const handleClose = () => {
    setOpen(false);
  };

  const handleClickOpenUpdateSub = (subcategory) => {
    setSelectSub(subcategory);
    setOpenUpdateSub(true);
  };
  const handleShowBrandsForSub = (item) => {
    setOpenSubSubCategoriesModel(true);
    setSelectSub(item);
  };

  const handleDeleteSubCategory = (id) => {
    deleteSubCategory(id)
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
  const [openSubSubCategoryModal, setOpenSubSubCategoryModal] = useState(false);
  const openSubSubCategoryModalForSub = (item) => {
    setSelectSub(item);
    setOpenSubSubCategoryModal(true);
  };
  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      PaperProps={{
        sx: {
          width: "100%",
          maxWidth: "720px!important",
          py: "40px",
          px: "30px",
          borderRadius: "10px",
        },
      }}
    >
      <CategoryAddSubModal
        open={openUpdateSub}
        setOpen={setOpenUpdateSub}
        category={category.data}
        subcategory={selectSub}
      />

      <SubSubModal
        open={openSubSubCategoryModal}
        setOpen={setOpenSubSubCategoryModal}
        subcategory={selectSub}
      />
      <SubCategoryShowSubSubCategoryModal
        open={subSubCategoryModel}
        setOpen={setOpenSubSubCategoriesModel}
        subcategory={selectSub}
      />
      <Stack>
        <Typography sx={{ color: colors.main }}>
          {language === "en" ? "Sub Categories" : "الاقسام الفرعية"}
        </Typography>
      </Stack>
      <Divider
        orientation="horizontal"
        flexItem
        sx={{
          width: "100%",
          backgroundColor: "#b2f6f1",
          my: "20px",
          color: "grey",
        }}
      />
      <div>
        <TableContainer component={Paper}>
          <Table>
            <TableHead
              sx={{ bgcolor: customColors.secondary, borderRadius: "5px" }}
            >
              <TableRow>
                <TableCell align="center">
                  <Typography
                    variant="subtitle1"
                    sx={{
                      fontWeight: "bold",
                    }}
                  >
                    #
                  </Typography>
                </TableCell>

                <TableCell align="center">
                  <Typography
                    variant="subtitle1"
                    sx={{
                      fontWeight: "bold",
                    }}
                  >
                    {language === "en" ? "category" : "الفئة"}
                  </Typography>
                </TableCell>

                <TableCell align="center">
                  <Typography
                    variant="subtitle1"
                    sx={{
                      fontWeight: "bold",
                    }}
                  >
                    {language === "en" ? "Products" : "المنتجات"}
                  </Typography>
                </TableCell>

                <TableCell align="center"></TableCell>
              </TableRow>
            </TableHead>

            {data === undefined ? (
              <TableBody>
                <TableRow>
                  <TableCell colspan="3" sx={{ width: "100%" }}>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        height: "100px",
                        width: "100%",
                        fontSize: "20px",
                        fontWeight: "bold",
                      }}
                    >
                      <Typography
                        variant="h5"
                        sx={{ textAlign: "center", width: "100%" }}
                      >
                        {language === "en"
                          ? "No Sub Categories"
                          : "لا يوجد اقسام فرعية"}
                      </Typography>
                    </Box>
                  </TableCell>
                </TableRow>
              </TableBody>
            ) : (
              <TableBody>
                {isSuccess &&
                  data.data.map((subcategory, index) => (
                    <TableRow key={index}>
                      <TableCell align="center">
                        <Typography
                          variant="subtitle1"
                          sx={{
                            fontWeight: "bold",
                          }}
                        >
                          {index + 1}
                        </Typography>
                      </TableCell>

                      <TableCell align="center">
                        {language === "en"
                          ? subcategory.name_en
                          : subcategory.name_ar}
                      </TableCell>

                      <TableCell align="center">
                        {subcategory.productsCount}
                      </TableCell>

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
                          {/* Delete and Edit SubCategory */}
                          {allowed({ page: "subcategories", role }) ? (
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
                                    language === "en"
                                      ? "Add sub sub category"
                                      : "أضافة قسم فرعى فرعى"
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
                                    onClick={() =>
                                      openSubSubCategoryModalForSub(subcategory)
                                    }
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
                                    ? "View all sub sub categories"
                                    : "عرض كل الأقسام الفرعية الفرعية"
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
                                  onClick={() =>
                                    handleShowBrandsForSub(subcategory)
                                  }
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

                              {/* Edit SubCategory */}
                              <BootstrapTooltip
                                title={
                                  language === "en"
                                    ? "Edit Subcategory"
                                    : "تعديل تصنيف فرعي"
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
                                  // onClick={handleClickOpen}
                                  onClick={() =>
                                    handleClickOpenUpdateSub(subcategory)
                                  }
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

                              {/* Delete SubCategory */}
                              <BootstrapTooltip
                                title={
                                  language === "en"
                                    ? "Delete SubCategory"
                                    : "حذف تصنيف فرعي"
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
                                  onClick={() =>
                                    handleDeleteSubCategory(subcategory._id)
                                  }
                                  disabled={DeleteSubLaoding}
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
                            </Box>
                          ) : (
                            <> </>
                          )}
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            )}
          </Table>
        </TableContainer>
      </div>

      <Stack
        sx={{
          width: "100%",
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          mt: "20px",
          gap: 2,
        }}
      >
        <Button
          onClick={handleClose}
          variant="contained"
          sx={{
            bgcolor: colors.main,
            color: "white",
            textTransform: "capitalize",
            "&:hover": { bgcolor: customColors.main },
          }}
        >
          {language === "en" ? "Close" : "أغلاق"}
        </Button>
      </Stack>
    </Dialog>
  );
}

export default CategoryShowSubModal;
