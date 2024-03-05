import { useTheme } from "@emotion/react";
import { useState } from "react";
import {
  Box,
  FormControl,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import { useFormik } from "formik";
import * as React from "react";
import { useTranslation } from "react-i18next";
import * as Yup from "yup";
import { toast } from "react-toastify";
import { useCreateNewRepoMutation } from "../../api/repos.api";
import SelectTag from "../globals/SelectTag";
import path from "path";
import { countriesAssets } from "./countriesAssets";
function RepoOperationsModal({ open, setOpen }) {
  const { btnStyle, colors, customColors } = useTheme();
  const [countryAssets, setCountriesAssets] = useState([]);
  const {
    i18n: { language },
  } = useTranslation();
  const handleClose = () => {
    setOpen(false);
    resetForm();
  };
  const [createNewRepo] = useCreateNewRepoMutation();
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
      type: "",
      name_ar: "",
      name_en: "",
      address: "",
      city: "",
      mobile: "",
      contactEmail: "",
      contactName: "",
    },
    validationSchema: Yup.object({
      name_ar: Yup.string().required(language === "en" ? "Required" : "مطلوب"),
      name_en: Yup.string().required(language === "en" ? "Required" : "مطلوب"),
      address: Yup.string().required(language === "en" ? "Required" : "مطلوب"),
      type: Yup.string().required(language === "en" ? "Required" : "مطلوب"),
      mobile: Yup.string()
        .matches(
          /^[0-9]/,
          language === "en"
            ? "Phone must start with country code and only numbers"
            : "يجب أن يبدأ الهاتف برمز البلد وأرقام فقط"
        )
        .max(
          9,
          language === "en"
            ? "max 9 numbers after country key"
            : "الحد الأقصى 9 أرقام بعد مفتاح الدولة"
        )
        .min(
          9,
          language === "en"
            ? "min 9 numbers after country key"
            : "الحد الادني 9 أرقام بعد مفتاح الدولة"
        )
        // .matches(
        //   /^(009665|9665|\+9665|05|5)(5|0|3|6|4|9|1|8|7)([0-9]{7})$/,
        //   language === "en"
        //     ? "Phone must start with +966"
        //     : "رقم الجوال يجب ان يبدأ ب +966"
        // )
        // .max(
        //   9,
        //   language === "en"
        //     ? "max 9 numbers after country key"
        //     : "الحد الأقصى 9 أرقام بعد مفتاح الدولة"
        // )
        // .min(
        //   9,
        //   language === "en"
        //     ? "min 9 numbers after country key"
        //     : "الحد الادني 9 أرقام بعد مفتاح الدولة"
        // )
        .required(language === "en" ? "Required" : "مطلوب"),
      contactEmail: Yup.string()
        .email(() =>
          language === "en" ? `Invalid email` : `بريد إلكتروني خاطئ`
        )
        .required(language === "en" ? "Required" : "مطلوب"),
      contactName: Yup.string().required(
        language === "en" ? "Required" : "مطلوب"
      ),
    }),
    onSubmit: (values) => {
      console.log(JSON.stringify(values));
      createNewRepo({ ...values, country: "SA" })
        .unwrap()
        .then((res) => {
          toast.success(res[`success_${language}`]);
          handleClose();
        })
        .catch((err) => {
          toast.error(err.data[`error_${language}`]);
        });
    },
  });
  const optionsData = [
    { en: "warehouse", ar: "مستودع" },
    { en: "branch", ar: "فرع" },
  ];
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
          direction: language === "en" ? "ltr" : "rtl",
        },
      }}
    >
      <form onSubmit={handleSubmit}>
        <FormControl sx={{ width: "100%", gap: 3 }}>
          <Box
            sx={{
              mt: "15px",
              position: "relative",
            }}
          >
            <Typography
              sx={{
                color: colors.text,
                fontWeight: "bold",
                fontSize: "15px",
              }}
            >
              {language === "en" ? "Repository type" : "نوع المستودع"}
            </Typography>
            <FormControl
              sx={{
                width: 1,
                svg: {
                  color: `${colors.main} !important`,
                },
              }}
            >
              <Select
                value={values.type}
                name={"type"}
                onChange={handleChange}
                sx={{
                  width: 1,
                  border: 1,
                  overflow: "hidden",
                  ".css-6hp17o-MuiList-root-MuiMenu-list": {
                    height: "200px !important",
                    // maxHeight: "200px !important",
                  },
                  borderColor:
                    customColors[
                      errors.type && touched.type
                        ? "dangerous"
                        : "inputBorderColor"
                    ],
                  bgcolor: customColors.bg,
                }}
              >
                {optionsData.map((item, index) => (
                  <MenuItem key={index} value={item.en}>
                    {item[language]}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            {errors.type && touched.type ? (
              <Typography
                sx={{
                  color: colors.dangerous,
                }}
              >
                {errors.type}
              </Typography>
            ) : undefined}
          </Box>
          <Stack>
            <Typography sx={{ color: customColors.label, mb: "4px" }}>
              {language === "en" ? "Name Arabic" : "الأسم  بالعربي"}
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
              {language === "en" ? "Name English" : "الأسم  بالانجليزي"}
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
          <Stack>
            <Typography sx={{ color: customColors.label, mb: "4px" }}>
              {language === "en" ? "Address" : "العنوان"}
            </Typography>
            <TextField
              name="address"
              type="text"
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.address}
              helperText={
                touched.address && errors.address ? errors.address : ""
              }
              error={touched.address && errors.address}
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
            {" "}
            {/* <Stack width={0.48}>
              <Box
                sx={{
                  mt: "15px",
                  position: "relative",
                }}
              >
                <Typography
                  sx={{
                    color: colors.text,
                    fontWeight: "bold",
                    fontSize: "15px",
                  }}
                >
                  {language === "en" ? "Country" : "الدولة"}
                </Typography>
                <FormControl
                  sx={{
                    width: 1,
                    svg: {
                      color: `${colors.main} !important`,
                    },
                  }}
                >
                  <Select
                    value={values.country}
                    name={"country"}
                    onChange={handleChange}
                    sx={{
                      width: 1,
                      border: 1,
                      overflow: "hidden",
                      ".css-6hp17o-MuiList-root-MuiMenu-list": {
                        height: "200px !important",
                        // maxHeight: "200px !important",
                      },
                      borderColor:
                        customColors[
                          errors.country && touched.country
                            ? "dangerous"
                            : "inputBorderColor"
                        ],
                      bgcolor: customColors.bg,
                    }}
                  >
                    {countriesAssets.map((item, index) => (
                      <MenuItem key={index} value={item.alpha2_code}>
                        {language === "en"
                          ? item.english_name
                          : item.arabic_name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                {errors.country && touched.country ? (
                  <Typography
                    sx={{
                      color: colors.dangerous,
                    }}
                  >
                    {errors.country}
                  </Typography>
                ) : undefined}
              </Box>
            </Stack> */}
            <Stack>
              <Typography sx={{ color: customColors.label, mb: "4px" }}>
                {language === "en" ? "City" : "المدينة"}
              </Typography>
              <TextField
                name="city"
                type="text"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.city}
                helperText={touched.city && errors.city ? errors.city : ""}
                error={touched.city && errors.city}
                variant="outlined"
                sx={{
                  "&:hover": {
                    fieldset: { borderColor: customColors.inputField },
                  },
                  fieldset: { borderColor: customColors.inputField },
                }}
              />
            </Stack>
          </Stack>
          <Stack>
            <Typography sx={{ color: customColors.label, mb: "4px" }}>
              {language === "en" ? "Contact name" : "اسم جهة الإتصال"}
            </Typography>
            <TextField
              name="contactName"
              type="text"
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.contactName}
              helperText={
                touched.contactName && errors.contactName
                  ? errors.contactName
                  : ""
              }
              error={touched.contactName && errors.contactName}
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
              {language === "en" ? "Email" : "البريد الإلكترونى"}
            </Typography>
            <TextField
              name="contactEmail"
              type="text"
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.contactEmail}
              helperText={
                touched.contactEmail && errors.contactEmail
                  ? errors.contactEmail
                  : ""
              }
              error={touched.contactEmail && errors.contactEmail}
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
              {language === "en" ? "Phone" : "رقم الجوال"}
            </Typography>
            <TextField
              name="mobile"
              type="text"
              onChange={(event) => {
                const { value } = event.target;
                // Check if the value starts with "+966" and only allow editing the part after it
                if (value.startsWith("966")) {
                  const userInput = value.substring(3); // Remove "+966" from the input
                  handleChange("mobile")(userInput); // Update the user's input
                } else {
                  // If the input does not start with "+966," keep the previous value
                  handleChange("mobile")(values.mobile);
                }
              }}
              onBlur={handleBlur}
              helperText={touched.mobile && errors.mobile ? errors.mobile : ""}
              error={touched.mobile && errors.mobile}
              variant="outlined"
              value={`966${values.mobile}`}
              sx={{
                "&:hover": {
                  fieldset: { borderColor: customColors.inputField },
                },
                fieldset: { borderColor: customColors.inputField },
              }}
            />
          </Stack>
        </FormControl>

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
          >
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

export default RepoOperationsModal;
