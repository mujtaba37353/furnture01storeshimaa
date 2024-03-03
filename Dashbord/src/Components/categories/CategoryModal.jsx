import { useTheme } from "@emotion/react";
import { Box, FormControl, Stack, TextField, Typography } from "@mui/material";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import { useFormik } from "formik";
import * as React from "react";
import { useTranslation } from "react-i18next";
import * as Yup from "yup";
import MetaAccordions from "../metaAccordion/MetaAccordions";
import { toast } from "react-toastify";
import {
  useCreateCategoryMutation,
  useUpdateCategoryByIdMutation,
} from "../../api/category.api";
import UploadFile from "../globals/UploadFile";
import { useUploadImageMutation } from "../../api/upload.api";
function CategoryModal({ open, setOpen, data }) {
  const [createCategory, { isLoading: addLoading }] =
    useCreateCategoryMutation();
  const [updateCategory, { isLoading: updateCategriesLoading }] =
    useUpdateCategoryByIdMutation();
  const [uploadImage] = useUploadImageMutation();
  const { colors, customColors } = useTheme();
  const {
    i18n: { language },
  } = useTranslation();

  const handleClose = () => {
    setOpen(false);
    resetForm();
    setFile();
  };

  const {
    handleSubmit,
    errors,
    setFieldValue,
    values,
    touched,
    handleChange,
    resetForm,
    handleBlur,
  } = useFormik({
    initialValues: {
      name_ar: "",
      name_en: "",
      title_meta: "",
      desc_meta: "",
      image: "",
    },
    validationSchema: Yup.object({
      name_ar: Yup.string().required(language === "en" ? "Required" : "مطلوب"),
      name_en: Yup.string().required(language === "en" ? "Required" : "مطلوب"),
      title_meta: Yup.string(),
      desc_meta: Yup.string(),
      image: Yup.string(),
    }),
    onSubmit: (values) => {
      if (data) {
        if (file) {
          const imageFormData = new FormData();
          imageFormData.append("image", file);
          uploadImage(imageFormData)
            .unwrap()
            .then((res) => {
              handleUpdateTempCategory({ ...values, image: res.image });
            });
        } else handleUpdateTempCategory(values);
      } else {
        if (file) {
          const imageFormData = new FormData();
          imageFormData.append("image", file);
          uploadImage(imageFormData)
            .unwrap()
            .then((res) => {
              handleAddTempCategory({ ...values, image: res.image });
            });
        } else handleAddTempCategory(values);
      }
    },
  });
  const [file, setFile] = React.useState();
  const handleUploadFile = (e) => {
    const uploadedFile = e.target.files[0];
    if (uploadedFile) {
      setFile(uploadedFile);
      setFieldValue("image", uploadedFile.name);
    }
  };
  React.useEffect(() => {
    if (data && open) {
      setFieldValue("name_ar", data.name_ar);
      setFieldValue("name_en", data.name_en);
      setFieldValue("image", data?.image);
      setFieldValue("title_meta", data?.metaDataId?.title_meta || "");
      setFieldValue("desc_meta", data?.metaDataId?.desc_meta || "");
    }
  }, [data, open]);
  const handleAddTempCategory = (values) => {
    !values.title_meta ? delete values.title_meta : undefined;
    !values.desc_meta ? delete values.desc_meta : undefined;
    !values.image ? delete values.image : undefined;
    createCategory(values)
      .unwrap()
      .then(() => {
        handleClose();
        resetForm();
        toast.success(
          language === "en" ? "Created Successfully" : "تم الاضافة بنجاح"
        );
      })
      .catch((error) => {
        const message =
          language === "en" ? error?.data?.error_en : error?.data?.error_ar;
        toast.error(message);
      });
  };
  const handleUpdateTempCategory = (values) => {
    !values.title_meta ? delete values.title_meta : undefined;
    !values.desc_meta ? delete values.desc_meta : undefined;
    !values.image ? delete values.image : undefined;
    updateCategory({ body: values, id: data._id })
      .unwrap()
      .then(() => {
        handleClose();
        resetForm();
        toast.success(
          language === "en" ? "Updated Successfully" : "تم التعديل بنجاح"
        );
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
          px: {
            lg: "30px",
            md: "15px",
            xs: 0,
          },
          borderRadius: "15px",
          direction: language === "en" ? "ltr" : "rtl",
          height: "800px",
        },
      }}
    >
      <form onSubmit={handleSubmit}>
        <FormControl sx={{ width: "100%", gap: 3 }}>
          <Box sx={{ width: "90%", mx: "auto" }}>
            <UploadFile
              error={errors.image}
              touched={touched.image}
              value={values.image}
              file={file}
              handleUploadFile={handleUploadFile}
              extraStyle={{
                height: 400,
                mx: "auto",
              }}
            />
          </Box>
          <Stack>
            <Typography sx={{ color: customColors.label, mb: "4px" }}>
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
            <Typography sx={{ color: customColors.label, mb: "4px" }}>
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
            isEdit={data && open ? true : false}
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
              bgcolor: colors.main,
              textTransform: "capitalize",
              "&:hover": { bgcolor: customColors.main },
            }}
            disabled={addLoading || updateCategriesLoading}
          >
            {}
            {language === "en" ? "Save" : "حفظ"}
          </Button>
          <Button
            onClick={handleClose}
            variant="outlined"
            sx={{
              borderColor: colors.main,
              color: colors.main,
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

export default CategoryModal;
