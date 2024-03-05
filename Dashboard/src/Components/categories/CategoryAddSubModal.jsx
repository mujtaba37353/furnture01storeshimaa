import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import {
  Box,
  Divider,
  FormControl,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import { useTheme } from "@emotion/react";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  useCreateSubCategoryMutation,
  useUpdateSubCategoryByIdMutation,
} from "../../api/subcategories.api";
import { toast } from "react-toastify";
import MetaAccordions from "../metaAccordion/MetaAccordions";

function CategoryAddSubModal({ open, setOpen, category, subcategory }) {
  const [createSubCategory, { isLoading: SubLoading }] =
    useCreateSubCategoryMutation();
  const [updateSubCategory] = useUpdateSubCategoryByIdMutation();

  const { customColors } = useTheme();
  const {
    i18n: { language },
  } = useTranslation();

  const handleClose = () => {
    setOpen(false);
    resetForm();
  };
  const {
    handleSubmit,
    errors,
    values,
    touched,
    handleChange,
    setFieldValue,
    resetForm,
    handleBlur,
  } = useFormik({
    initialValues: {
      name_ar: "",
      name_en: "",
      title_meta: "",
      desc_meta: "",
    },
    validationSchema: Yup.object({
      name_ar: Yup.string().required(language === "en" ? "Required" : "مطلوب"),
      name_en: Yup.string().required(language === "en" ? "Required" : "مطلوب"),
      title_meta: Yup.string(),
      desc_meta: Yup.string(),
    }),
    onSubmit: (values) => {
      if (category) {
        handleCreateTempSub(values);
      } else if (subcategory) {
        handleUpdateTempSub(values);
      }
    },
  });
  React.useEffect(() => {
    if (open && subcategory) {
      setFieldValue("name_ar", subcategory.name_ar);
      setFieldValue("name_en", subcategory.name_en);
      setFieldValue("title_meta", subcategory?.metaDataId?.title_meta || "");
      setFieldValue("desc_meta", subcategory?.metaDataId?.desc_meta || "");
    }
  }, [open, subcategory]);
  const handleCreateTempSub = (values) => {
    values.category = category._id;
    !values.title_meta ? delete values.title_meta : undefined;
    !values.desc_meta ? delete values.desc_meta : undefined;
    createSubCategory(values)
      .unwrap()
      .then((res) => {
        handleClose();
        resetForm();
        toast.success(language === "en" ? res.success_en : res.success_ar);
      })
      .catch((error) => {
        const message =
          language === "en" ? error?.data?.error_en : error?.data?.error_ar;
        toast.error(message);
      });
  };
  const handleUpdateTempSub = (values) => {
    !values.title_meta ? delete values.title_meta : undefined;
    !values.desc_meta ? delete values.desc_meta : undefined;
    !values.image ? delete values.image : undefined;
    updateSubCategory({ id: subcategory._id, body: values })
      .unwrap()
      .then((res) => {
        handleClose();
        resetForm();
        toast.success(language === "en" ? res.success_en : res.success_ar);
      })
      .catch((error) => {
        const message =
          language === "en" ? error?.data?.error_en : error?.data?.error_ar;
        toast.error(message);
      });
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
          borderRadius: "15px",
        },
      }}
    >
      <Stack>
        <Typography sx={{ color: customColors.main }}>
          {language === "en" ? "Name Sub Category" : " أسم قسم فرعي"}
        </Typography>
      </Stack>
      <Divider
        orientation="horizontal"
        flexItem
        sx={{
          width: "100%",
          backgroundColor: customColors.grey,
          my: "20px",
        }}
      />
      <form onSubmit={handleSubmit}>
        <FormControl sx={{ width: "100%", gap: 3 }}>
          <Stack>
            <Typography sx={{ mb: "10px" }}>
              {language === "en" ? "Name Arabic" : "اسم القسم بالعربي"}
            </Typography>
            <TextField
              name="name_ar"
              type="text"
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.name_ar}
              helperText={
                touched.name_ar && errors.name_ar ? errors.name_ar : ""
              }
              error={touched.name_ar && errors.name_ar}
              variant="outlined"
              sx={{
                "&:hover": {
                  fieldset: { borderColor: customColors.inputField },
                },
                fieldset: { borderColor: customColors.inputField },
              }}
            />
          </Stack>
          <Stack>
            <Typography sx={{ mb: "10px" }}>
              {language === "en" ? "Name English" : "اسم القسم بالانجليزي"}
            </Typography>
            <TextField
              name="name_en"
              type="text"
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.name_en}
              helperText={
                touched.name_en && errors.name_en ? errors.name_en : ""
              }
              error={touched.name_en && errors.name_en}
              variant="outlined"
              sx={{
                "&:hover": {
                  fieldset: { borderColor: customColors.inputField },
                },
                fieldset: { borderColor: customColors.inputField },
              }}
            />
          </Stack>
        </FormControl>
        <Box mt={"15px"}>
          <MetaAccordions
            metaTitle={values.title_meta}
            metaDesc={values.desc_meta}
            setFieldValue={setFieldValue}
          />
        </Box>

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
            variant="contained"
            type="submit"
            sx={{
              bgcolor: customColors.main,
              textTransform: "capitalize",
              "&:hover": { bgcolor: customColors.main },
            }}
            disabled={SubLoading}
          >
            {language === "en" ? "Save" : "حفظ"}
          </Button>
          <Button
            onClick={handleClose}
            variant="outlined"
            sx={{
              borderColor: customColors.main,
              color: customColors.main,
              textTransform: "capitalize",
              "&:hover": { borderColor: customColors.main },
            }}
          >
            {language === "en" ? "cancel" : "الغاء"}
          </Button>
        </Stack>
      </form>
    </Dialog>
  );
}

export default CategoryAddSubModal;
