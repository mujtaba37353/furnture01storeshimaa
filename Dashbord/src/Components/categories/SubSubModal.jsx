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

import { toast } from "react-toastify";
import MetaAccordions from "../metaAccordion/MetaAccordions";
import {
  useCreateNewbRrandMutation,
  useEditBrandMutation,
} from "../../api/subSubCategories.api";

function SubSubModal({ open, setOpen, subcategory, brand }) {
  const [createNewbRrand, { isLoading: addingBrandLoading }] =
    useCreateNewbRrandMutation();
  const [editBrand] = useEditBrandMutation();

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
      if (!brand) {
        handleCreateTempBrand({ ...values, subCategory: subcategory._id });
      } else {
        handleUpdateTempSub(values);
      }
    },
  });
  React.useEffect(() => {
    if (open && brand) {
      setFieldValue("name_ar", brand.name_ar);
      setFieldValue("name_en", brand.name_en);
      setFieldValue("title_meta", brand?.metaDataId?.title_meta || "");
      setFieldValue("desc_meta", brand?.metaDataId?.desc_meta || "");
    }
  }, [open, brand]);
  const handleCreateTempBrand = (values) => {
    !values.title_meta ? delete values.title_meta : undefined;
    !values.desc_meta ? delete values.desc_meta : undefined;
    createNewbRrand(values)
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
    editBrand({ brandId: brand._id, payload: values })
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
          {language === "en"
            ? "Sub sub category for sub category"
            : "القسم الفرعي الفرعى للقسم الفرعي"}
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
              {language === "en" ? "Name Arabic" : "الأسم بالعربي"}
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
              {language === "en" ? "Name English" : "الأسم بالانجليزي"}
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
            disabled={addingBrandLoading}
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

export default SubSubModal;
