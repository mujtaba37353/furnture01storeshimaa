import { useTheme } from "@emotion/react";
import {
  Autocomplete,
  Box,
  FormControl,
  Grid,
  InputBase,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import { useFormik } from "formik";
import moment from "moment";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import * as Yup from "yup";
import UploadFile from "../../Components/globals/UploadFile";
import { useGetAllCategoriesQuery } from "../../api/category.api";
import {
  useCreateOfferMutation,
  useUpdateOfferMutation,
} from "../../api/offers.api";
import { useGetAllProductsQuery } from "../../api/product.api";
import { useGetAllSubCategoriesQuery } from "../../api/subcategories.api";
import { useUploadImageMutation } from "../../api/upload.api";
import { optionsTypes } from "./optionsTypes";
function OfferModal({ open, setOpen, selectedOffer, setSelectedOffer }) {
  const { colors, customColors } = useTheme();
  const [options2, setOptions2] = useState({
    allProducts: [],
    products: [],
    categories: [],
    subcategories: [],
  });
  const [createOffer] = useCreateOfferMutation();
  const [updateOffer] = useUpdateOfferMutation();
  const [uploadImage] = useUploadImageMutation();
  const [file, setFile] = useState();
  const selectorRef = useRef();
  const {
    i18n: { language },
  } = useTranslation();
  const handleClose = () => {
    setOpen(false);
    setFile();
    resetForm();
    if (open && selectedOffer) {
      setSelectedOffer();
    }
  };
  const handleCreateOffer = (payload) => {
    let temp = {
      ...payload,
      startDate: moment(payload.startDate).format("YYYY-MM-DD"),
      endDate: moment(payload.endDate).format("YYYY-MM-DD"),
    };
    createOffer(temp)
      .unwrap()
      .then((res) => {
        handleClose();
        toast.success(res[`success_${language}`]);
      })
      .catch((err) => {
        let message = err.data[`error_${language}`];
        if (
          message ===
            '"discountDepartment.value" does not contain 1 required value(s)' &&
          language !== "en"
        )
          message = `الخصم علي) يجب ان يحتوي على 1 قيمة علي الاقل)`;
        toast.error(message);
      });
  };
  const handleUpdateOffer = (payload) => {
    let temp = {
      ...payload,
      startDate: moment(payload.startDate).format("YYYY-MM-DD"),
      endDate: moment(payload.endDate).format("YYYY-MM-DD"),
    };
    updateOffer({ id: selectedOffer._id, body: temp })
      .unwrap()
      .then((res) => {
        handleClose();
        toast.success(res[`success_${language}`]);
      })
      .catch((err) => {
        let message = err.data[`error_${language}`];
        if (
          message ===
            '"discountDepartment.value" does not contain 1 required value(s)' &&
          language !== "en"
        )
          message = `الخصم علي) يجب ان يحتوي على 1 قيمة علي الاقل)`;
        toast.error(message);
      });
  };
  const {
    handleSubmit,
    errors,
    values,
    touched,
    handleChange,
    resetForm,
    handleBlur,
    setFieldValue,
    setValues,
  } = useFormik({
    initialValues: {
      title: "",
      percentage: 0,
      startDate: "",
      endDate: "",
      typeOfBanner: "",
      imageOfBanner: "",
      discountDepartment: {
        key: "",
        value: [],
      },
    },
    validationSchema: Yup.object({
      title: Yup.string().required(language === "en" ? "Required" : "مطلوب"),
      startDate: Yup.string().required(
        language === "en" ? "Required" : "مطلوب"
      ),
      endDate: Yup.string()
        .required(language === "en" ? "Required" : "مطلوب")
        .test(
          "is-greater-than-start",
          language === "en"
            ? "End date must be greater than start date by at least one day"
            : "يجب أن تكون تاريخ الانتهاء أكبر من تاريخ البدء بما لا يقل عن يوم واحد",
          function (endDate) {
            const startDate = this.resolve(Yup.ref("startDate")); // Get the value of startDate
            if (startDate && endDate) {
              const startDateTime = new Date(startDate);
              const endDateTime = new Date(endDate);
              // Calculate the difference in milliseconds
              const timeDifference = endDateTime - startDateTime;
              const oneDayInMilliseconds = 24 * 60 * 60 * 1000; // One day in milliseconds
              return timeDifference >= oneDayInMilliseconds;
            }
            return true; // If either date is missing, don't perform the validation
          }
        ),
      typeOfBanner: Yup.string()
        .oneOf(["horizontal", "vertical"])
        .required(language === "en" ? "Required" : "مطلوب"),
      percentage: Yup.number()
        .min(
          1,
          language === "en"
            ? "the percentage must be creater then 0"
            : "النسبة يجب ان تكون أكبر من 0"
        )
        .max(
          100,
          language === "en"
            ? "the percentage must be less then or equal 100"
            : "النسبة يجب ان تكون أكبر من أو تساوي 100"
        ),
      imageOfBanner: Yup.string().required(
        language === "en" ? "Required" : "مطلوب"
      ),
      discountDepartment: Yup.object().shape({
        key: Yup.string().required(language === "en" ? "Required" : "مطلوب"),
      }),
    }),
    onSubmit: (values) => {
      if (open && selectedOffer) {
        if (file) {
          const formData = new FormData();
          formData.append("image", file);
          uploadImage(formData)
            .unwrap()
            .then((res) => {
              handleUpdateOffer({ ...values, imageOfBanner: res.image });
            });
        } else {
          handleUpdateOffer(values);
        }
      } else {
        if (file) {
          const formData = new FormData();
          formData.append("image", file);
          uploadImage(formData)
            .unwrap()
            .then((res) => {
              handleCreateOffer({ ...values, imageOfBanner: res.image });
            });
        } else {
          handleCreateOffer(values);
        }
      }
    },
  });
  useEffect(() => {
    if (open && selectedOffer) {
      setValues({
        ...values,
        title: selectedOffer.title,
        typeOfBanner: selectedOffer.typeOfBanner,
        percentage: selectedOffer.percentage,
        startDate: moment(selectedOffer.startDate).format("YYYY-MM-DD"),
        endDate: moment(selectedOffer.endDate).format("YYYY-MM-DD"),
        imageOfBanner: selectedOffer.imageOfBanner,
        discountDepartment: {
          key: selectedOffer.discountDepartment.key,
          value: selectedOffer.discountDepartment.value,
        },
      });
    }
  }, [open, selectedOffer]);
  const { data: productsData, error: productsError } = useGetAllProductsQuery(
    `?limit=100000`,
    {
      skip: values.discountDepartment.key !== "products",
    }
  );
  const { data: categoriesData, error: categoriesError } =
    useGetAllCategoriesQuery(`?limit=100000`, {
      skip: values.discountDepartment.key !== "categories",
    });
  const { data: subsData, error: subsError } = useGetAllSubCategoriesQuery(
    `?limit=100000`,
    {
      skip: values.discountDepartment.key !== "subcategories",
    }
  );
  console.log("sojhdfuasdygddusyafgtsdgf", values);
  useEffect(() => {
    if (productsData && !productsError) {
      setOptions2({
        ...options2,
        allProducts: [],
        products: productsData.data,
        categories: [],
        subcategories: [],
      });
    }
    if (categoriesData && !categoriesError) {
      setOptions2({
        ...options2,
        categories: categoriesData.data,
        allProducts: [],
        products: [],
        subcategories: [],
      });
    }
    if (subsData && !subsError) {
      setOptions2({
        ...options2,
        subcategories: subsData.data,
        categories: [],
        allProducts: [],
        products: [],
      });
    }
  }, [productsData, categoriesData, subsData]);
  const handleUploadFile = (e) => {
    const uploadedFile = e.target.files[0];
    if (uploadedFile) {
      setFile(uploadedFile);
      setFieldValue("imageOfBanner", uploadedFile.name);
    }
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
          maxWidth: "900px!important",
          py: "40px",
          px: "30px",
          borderRadius: "10px",
        },
      }}
    >
      <form onSubmit={handleSubmit}>
        <FormControl sx={{ width: "100%", gap: 3 }}>
          <Grid container sapcing={3}>
            <Grid item xs={12}>
              <UploadFile
                error={errors.imageOfBanner}
                touched={touched.imageOfBanner}
                value={values.imageOfBanner}
                file={file}
                handleUploadFile={handleUploadFile}
                extraStyle={{
                  height: 250,
                  width: 0.5,
                  mx: "auto",
                  mb: "30px",
                }}
              />
            </Grid>
            <Grid item lg={12} xs={12} mb={"15px"}>
              <Box width={0.97} mx={"auto"}>
                <Typography sx={{ color: customColors.label, mb: "4px" }}>
                  {language === "en" ? "Banner type" : "نوع البانر"}
                </Typography>
                <Select
                  id="demo-simple-select"
                  value={values.typeOfBanner}
                  name="typeOfBanner"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.typeOfBanner && errors.typeOfBanner}
                  helperText={
                    touched.typeOfBanner && errors.typeOfBanner
                      ? errors.typeOfBanner
                      : ""
                  }
                  sx={{
                    width: 1,
                    "&:hover": {
                      fieldset: { borderColor: customColors.inputField },
                    },
                    fieldset: { borderColor: customColors.inputField },
                  }}
                >
                  <MenuItem value={"vertical"}>
                    {language === "en" ? "Vertical" : "رأسي"}
                  </MenuItem>
                  <MenuItem value={"horizontal"}>
                    {language === "en" ? "horizontal" : "أفقى"}
                  </MenuItem>
                </Select>
                {errors.typeOfBanner && touched.typeOfBanner && (
                  <Typography
                    sx={{
                      color: "red",
                      fontSize: "13px",
                    }}
                  >
                    {errors.typeOfBanner}
                  </Typography>
                )}
              </Box>
            </Grid>
            <Grid item lg={6} xs={12} mb={"20px"}>
              <Box width={0.95} mx={"auto"}>
                <Typography sx={{ color: customColors.label, mb: "4px" }}>
                  {language === "en" ? "Title" : "اللقب"}
                </Typography>
                <TextField
                  name="title"
                  type="text"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.title}
                  helperText={touched.title && errors.title ? errors.title : ""}
                  error={touched.title && errors.title}
                  variant="outlined"
                  sx={{
                    width: 1,
                    direction: language === "en" ? "ltr" : "rtl",
                    textAlign: "initial",
                    "&:hover": {
                      fieldset: { borderColor: customColors.inputField },
                    },
                    fieldset: { borderColor: customColors.inputField },
                  }}
                />
              </Box>
            </Grid>
            <Grid item lg={6} xs={12} mb={"20px"}>
              <Box width={0.95} mx={"auto"}>
                <Typography sx={{ color: customColors.label, mb: "4px" }}>
                  {language === "en" ? "Discount percentage" : "نسبة الخصم"}
                </Typography>
                <TextField
                  name="percentage"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  type="number"
                  helperText={
                    touched.percentage && errors.percentage
                      ? errors.percentage
                      : ""
                  }
                  error={touched.percentage && errors.percentage}
                  value={values.percentage}
                  variant="outlined"
                  sx={{
                    width: 1,
                    direction: language === "en" ? "ltr" : "rtl",
                    textAlign: "initial",
                    "&:hover": {
                      fieldset: { borderColor: customColors.inputField },
                    },
                    fieldset: { borderColor: customColors.inputField },
                  }}
                />
              </Box>
            </Grid>
            <Grid item lg={6} xs={12} mb={"15px"}>
              <Box width={0.95} mx={"auto"}>
                <Typography sx={{ color: customColors.label, mb: "4px" }}>
                  {language === "en" ? "Start Date" : "تاريخ الإنشاء"}
                </Typography>
                <TextField
                  name="startDate"
                  type="date"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.startDate}
                  helperText={
                    touched.startDate && errors.startDate
                      ? errors.startDate
                      : ""
                  }
                  error={touched.startDate && errors.startDate}
                  variant="outlined"
                  sx={{
                    width: 1,
                    direction: language === "en" ? "ltr" : "rtl",
                    textAlign: "initial",
                    "&:hover": {
                      fieldset: { borderColor: customColors.inputField },
                    },
                    fieldset: { borderColor: customColors.inputField },
                  }}
                />
              </Box>
            </Grid>
            <Grid item lg={6} xs={12} mb={"15px"}>
              <Box width={0.95} mx={"auto"}>
                <Typography sx={{ color: customColors.label, mb: "4px" }}>
                  {language === "en" ? "End Date" : "تاريخ الإنتهاء"}
                </Typography>
                <TextField
                  name="endDate"
                  type="date"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.endDate}
                  helperText={
                    touched.endDate && errors.endDate ? errors.endDate : ""
                  }
                  error={touched.endDate && errors.endDate}
                  variant="outlined"
                  sx={{
                    width: 1,
                    direction: language === "en" ? "ltr" : "rtl",
                    textAlign: "initial",
                    "&:hover": {
                      fieldset: { borderColor: customColors.inputField },
                    },
                    fieldset: { borderColor: customColors.inputField },
                  }}
                />
              </Box>
            </Grid>

            {open && !selectedOffer ? (
              <>
                <Grid item lg={12} xs={12} mt={"10px"} mb={"15px"}>
                  <Box width={0.97} mx={"auto"}>
                    <Typography sx={{ color: customColors.label, mb: "4px" }}>
                      {language === "en" ? "Discount Department" : "نوع الخصم"}
                    </Typography>
                    <Stack
                      mt="10px"
                      direction={{
                        md: "row",
                        xs: "column",
                      }}
                      alignItems={{
                        md: "center",
                        xs: "flex-start",
                      }}
                      flexWrap={"wrap"}
                      gap={{
                        md: "20px",
                        xs: "5px",
                      }}
                    >
                      {optionsTypes.map((option) => (
                        <Stack
                          key={option.type}
                          direction={"row"}
                          alignItems={"center"}
                          gap={"5px"}
                        >
                          <InputBase
                            type="radio"
                            id={option.type}
                            name={"discountDepartment.key"}
                            value={option.type}
                            onChange={(e) => {
                              setFieldValue("discountDepartment", {
                                key: "",
                                value: [],
                              });
                              handleChange(e);
                            }}
                          />
                          <Typography
                            component={"label"}
                            htmlFor={option.type}
                            sx={{
                              cursor: "pointer",
                            }}
                          >
                            {option[`title_${language}`]}
                          </Typography>
                        </Stack>
                      ))}
                    </Stack>
                    {touched?.discountDepartment?.key &&
                      errors?.discountDepartment?.key && (
                        <Typography
                          sx={{
                            color: "#f14236",
                            textAlign: "left",
                            ml: "15px",
                            fontSize: "12px",
                          }}
                        >
                          {errors?.discountDepartment?.key}
                        </Typography>
                      )}
                  </Box>
                </Grid>
                <Grid item xs={12}>
                  <Box width={0.98} mx={"auto"}>
                    <Typography sx={{ color: customColors.label, mb: "4px" }}>
                      {language === "en" ? "Discount for" : "خصم علي"}
                    </Typography>
                    <Autocomplete
                      multiple
                      id="tags-standard"
                      options={
                        values.discountDepartment.key
                          ? options2[values.discountDepartment.key]
                          : []
                      }
                      ref={selectorRef}
                      getOptionLabel={(option) =>
                        option[
                          values.discountDepartment.key === "products"
                            ? `title_${language}`
                            : `name_${language}`
                        ]
                      }
                      disabled={
                        !values.discountDepartment.key ||
                        values.discountDepartment.key === "allProducts"
                      }
                      onChange={(_, values) =>
                        setFieldValue(
                          "discountDepartment.value",
                          values.map((val) => val._id)
                        )
                      }
                      renderInput={(params) => {
                        return <TextField {...params} />;
                      }}
                    />
                  </Box>
                </Grid>
              </>
            ) : undefined}
          </Grid>
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
            // disabled={isLoading}
          >
            {open && selectedOffer
              ? language === "en"
                ? "Save"
                : "حفظ التعديلات"
              : language === "en"
              ? "Adding"
              : "إضافة"}
          </Button>
          <Button
            type="button"
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

export default OfferModal;
