import { useTheme } from "@emotion/react";
import {
  Autocomplete,
  FormControl,
  FormControlLabel,
  IconButton,
  Radio,
  RadioGroup,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { useFormik } from "formik";
// import moment from "moment";
// import * as React from "react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import * as Yup from "yup";
import { useGetAllCategoriesQuery } from "../../api/category.api";
import { useUpdateMarketerByIdMutation } from "../../api/marketer.api";
import { useGetAllProductsQuery } from "../../api/product.api";
import { useGetAllSubCategoriesQuery } from "../../api/subcategories.api";
import { useCreateMarketerMutation } from "../../api/marketer.api";
import { baseUrlClient } from "../../api/baseUrl";
function MarketerModal({ open, setOpen, dataMarketer, setDataMarketer }) {
  const { colors, customColors } = useTheme();
  const [createMarketer, { isLoading: createMarketerLoading }] =
    useCreateMarketerMutation();
  const [updateMarketer, { isLoading: updateMarketerLoading }] =
    useUpdateMarketerByIdMutation();
  const [options, setOptions] = useState({
    allProducts: [],
    products: [],
    categories: [],
    subcategories: [],
  });
  const {
    i18n: { language },
  } = useTranslation();
  const [copied, setCopied] = useState(false);
  const [marketUrl, setMarketUrl] = useState("");
  const generateUrl = () => {
    let text = "";
    if (values.discountDepartment.key === "allProducts") {
      text = `${baseUrlClient}products`;
    } else if (values.discountDepartment.key === "products") {
      const product = options.products.find(
        (product) => product?._id === values?.discountDepartment?.value[0]
      );
      text = `${baseUrlClient}products/${
        product?._id
      }/${product?.title_en?.replace(/ /g, "-")}`;
    } else if (values.discountDepartment.key === "categories") {
      const cat = options.categories.find(
        (category) => category?._id === values?.discountDepartment?.value[0]
      );
      text = `${baseUrlClient}departments/${cat?._id}/${cat?.name_en?.replace(
        / /g,
        "-"
      )}`;
    } else if (values.discountDepartment.key === "subcategories") {
      const sub = options.subcategories.find(
        (subcategory) =>
          subcategory?._id === values?.discountDepartment?.value[0]
      );
      text = `${baseUrlClient}departments/${sub?.categoryId}/${
        sub?._id
      }/${sub?.name_en?.replace(/ /g, "-")}`;
    }
    return text.includes("undefined") ? "" : text;
  };
  const handleCopy = (text) => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        setCopied(true);
      })
      .catch((error) => {
        setCopied(false);
      });
  };
  const handleClose = () => {
    setOpen(false);
    resetForm();
    if (dataMarketer) {
      return setDataMarketer();
    }
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
  } = useFormik({
    initialValues: {
      name: "",
      email: "",
      phone: "",
      password: "",
      code: "",
      discount: "",
      commissionMarketer: "",
      discountDepartment: {
        key: "",
        value: [],
      },
      url: "",
    },
    validationSchema: Yup.object({
      name: Yup.string().required(language === "en" ? "Required" : "مطلوب"),
      email: Yup.string().required(language === "en" ? "Required" : "مطلوب"),
      phone: Yup.string().required(language === "en" ? "Required" : "مطلوب"),
      password: Yup.string().required(language === "en" ? "Required" : "مطلوب"),
      code: Yup.string().required(language === "en" ? "Required" : "مطلوب"),
      discount: Yup.string().required(language === "en" ? "Required" : "مطلوب"),
      commissionMarketer: Yup.string()
        .required(language === "en" ? "Required" : "مطلوب")
        .test(
          "sum-of-discount-commission",
          language === "en"
            ? "Sum of discount and commissionMarketer should be less than 100"
            : "مجموع الخصم والعمولة يجب ان يكون اقل من 100",
          function (discount) {
            return parseInt(discount) + parseInt(this.parent.discount) < 100;
          }
        ),
      discountDepartment: Yup.object().shape({
        key: Yup.string().required(language === "en" ? "Required" : "مطلوب"),
      }),
      url: Yup.string().required(language === "en" ? "Required" : "مطلوب"),
    }),
    onSubmit: (values) => {
      if (!dataMarketer) {
        console.log("aaaaaa");
        createMarketer(values)
          .unwrap()
          .then((res) => {
            handleClose();
            resetForm();
            toast.success(
              language === "en" ? "Created Successfully" : "تم الاضافة بنجاح"
            );
          })
          .catch((error) => {
            let message =
              language === "en" ? error?.data?.error_en : error?.data?.error_ar;
            if (
              message ===
                '"discountDepartment.value" does not contain 1 required value(s)' &&
              language !== "en"
            )
              message = `الخصم علي) يجب ان يحتوي على 1 قيمة علي الاقل)`;

            toast.error(message);
          });
      } else {
        delete values.password,
        console.log("test 1");
          updateMarketer({ body: values, id: dataMarketer._id })
            .unwrap()
            .then((res) => {
              handleClose();
              resetForm();
              toast.success(
                language === "en" ? "Updated Successfully" : "تم التعديل بنجاح"
              );
            })
            .catch((error) => {
              let message =
                language === "en"
                  ? error?.data?.error_en
                  : error?.data?.error_ar;
              if (message === '"discountDepartment.value" does not contain 1 required value(s)' && language !== "en")
                message = `الخصم علي) يجب ان يحتوي على 1 قيمة علي الاقل)`;
              toast.error(message);
            });
            console.log("test 2");

      }
    },
  });

  const { data: productsData, error: productsError } = useGetAllProductsQuery(
    "?limit=1000",
    {
      skip: values.discountDepartment.key !== "products",
    }
  );
  const { data: categoriesData, error: categoriesError } =
    useGetAllCategoriesQuery("?limit=1000", {
      skip: values.discountDepartment.key !== "categories",
    });
  const { data: subsData, error: subsError } = useGetAllSubCategoriesQuery(
    "?limit=1000",
    {
      skip: values.discountDepartment.key !== "subcategories",
    }
  );
  useEffect(() => {
    if (productsData && !productsError) {
      setOptions({
        ...options,
        products: productsData.data,
      });
    }
    if (categoriesData && !categoriesError) {
      setOptions({
        ...options,
        categories: categoriesData.data,
      });
    }
    if (subsData && !subsError) {
      setOptions({
        ...options,
        subcategories: subsData.data,
      });
    }
  }, [productsData, categoriesData, subsData]);

  useEffect(() => {
    if (dataMarketer && open) {
      setFieldValue("name", dataMarketer.name);
      setFieldValue("email", dataMarketer.email);
      setFieldValue("phone", dataMarketer.phone);
      setFieldValue("password", dataMarketer.password);
      setFieldValue("code", dataMarketer.couponMarketer.code);
      setFieldValue("discount", dataMarketer.couponMarketer.discount);
      setFieldValue(
        "commissionMarketer",
        dataMarketer.couponMarketer.commissionMarketer
      );
      setFieldValue(
        "discountDepartment.key",
        dataMarketer.couponMarketer.discountDepartment.key
      );
      setFieldValue(
        "discountDepartment.value",
        dataMarketer.couponMarketer.discountDepartment.value
      );
    }
  }, [dataMarketer, open]);

  useEffect(() => {
    if (values.discountDepartment.key && values.discountDepartment.value) {
      setMarketUrl(generateUrl());
      setFieldValue("url", generateUrl());
    }
  }, [values.discountDepartment.key, values.discountDepartment.value]);

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
      <form onSubmit={handleSubmit}>
        <FormControl sx={{ width: "100%", gap: 3 }}>
          <Stack
            sx={{
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              gap: 2,
            }}
          >
            <Stack>
              <Typography sx={{ color: customColors.label, mb: "4px" }}>
                {language === "en" ? "Name" : "الاسم"}
              </Typography>
              <TextField
                name="name"
                type="text"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.name}
                helperText={touched.name && errors.name ? errors.name : ""}
                error={touched.name && errors.name}
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
                {language === "en" ? "email" : "البريد الالكتروني"}
              </Typography>
              <TextField
                name="email"
                type="email"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.email}
                helperText={touched.email && errors.email ? errors.email : ""}
                error={touched.email && errors.email}
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

          <Stack
            sx={{
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              gap: 2,
            }}
          >
            <Stack
              sx={{
                width: dataMarketer ? 1 : "auto",
              }}
            >
              <Typography sx={{ color: customColors.label, mb: "4px" }}>
                {language === "en" ? "phone" : "رقم الهاتف"}
              </Typography>
              <TextField
                name="phone"
                type="phone"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.phone}
                helperText={touched.phone && errors.phone ? errors.phone : ""}
                error={touched.phone && errors.phone}
                variant="outlined"
                InputProps={{
                  inputProps: {
                    min: 1,
                    max: 100,
                  },
                }}
                sx={{
                  "&:hover": {
                    fieldset: { borderColor: customColors.inputField },
                  },
                  fieldset: { borderColor: customColors.inputField },
                }}
              />
            </Stack>
            {!dataMarketer && (
              <Stack>
                <Typography sx={{ color: customColors.label, mb: "4px" }}>
                  {language === "en" ? "password" : "كلمة المرور"}
                </Typography>
                <TextField
                  name="password"
                  type="password"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.password}
                  helperText={
                    touched.password && errors.password ? errors.password : ""
                  }
                  error={touched.password && errors.password}
                  variant="outlined"
                  InputProps={{
                    inputProps: {
                      min: 1,
                      max: 100,
                    },
                  }}
                  sx={{
                    "&:hover": {
                      fieldset: { borderColor: customColors.inputField },
                    },
                    fieldset: { borderColor: customColors.inputField },
                  }}
                />
              </Stack>
            )}
          </Stack>

          <Stack>
            <Typography sx={{ color: customColors.label, mb: "4px" }}>
              {language === "en" ? "code" : "الكود"}
            </Typography>
            <TextField
              name="code"
              type="text"
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.code}
              helperText={touched.code && errors.code ? errors.code : ""}
              error={touched.code && errors.code}
              variant="outlined"
              InputProps={{
                inputProps: {
                  min: 1,
                  max: 100,
                },
              }}
              sx={{
                "&:hover": {
                  fieldset: { borderColor: customColors.inputField },
                },
                fieldset: { borderColor: customColors.inputField },
              }}
            />
          </Stack>

          <Stack
            sx={{
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              gap: 2,
            }}
          >
            <Stack sx={{ width: "100%" }}>
              <Typography sx={{ color: customColors.label, mb: "4px" }}>
                {language === "en"
                  ? "Value of Discount (in percentage)"
                  : "(بالنسبة المئوية) قيمة الخصم"}
              </Typography>
              <TextField
                name="discount"
                type="number"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.discount}
                helperText={
                  touched.discount && errors.discount ? errors.discount : ""
                }
                error={touched.discount && errors.discount}
                variant="outlined"
                InputProps={{
                  inputProps: {
                    min: 1,
                    max: 100,
                  },
                }}
                sx={{
                  "&:hover": {
                    fieldset: { borderColor: customColors.inputField },
                  },
                  fieldset: { borderColor: customColors.inputField },
                }}
              />
            </Stack>
            <Stack sx={{ width: "100%" }}>
              <Typography sx={{ color: customColors.label, mb: "4px" }}>
                {language === "en"
                  ? "commission (in percentage)"
                  : "(بالنسبة المئوية) العمولة"}
              </Typography>
              <TextField
                name="commissionMarketer"
                type="number"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.commissionMarketer}
                helperText={
                  touched.commissionMarketer && errors.commissionMarketer
                    ? errors.commissionMarketer
                    : ""
                }
                error={touched.commissionMarketer && errors.commissionMarketer}
                variant="outlined"
                InputProps={{
                  inputProps: {
                    min: 1,
                    max: 100,
                  },
                }}
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
              {language === "en" ? "Type Of Discount" : "نوع الخصم"}
            </Typography>
            <RadioGroup
              row
              aria-labelledby="demo-row-radio-buttons-group-label"
              name="discountDepartment.key"
              type="radio"
              onChange={(e) => {
                handleChange(e);
                setFieldValue("discountDepartment.value", []);
              }}
              onBlur={handleBlur}
              value={values?.discountDepartment?.key}
              helperText={
                touched?.discountDepartment?.key &&
                errors?.discountDepartment?.key
                  ? errors?.discountDepartment?.key
                  : ""
              }
              error={
                touched?.discountDepartment?.key &&
                errors?.discountDepartment?.key
              }
            >
              <FormControlLabel
                value="allProducts"
                control={<Radio />}
                label={language === "en" ? "All Products" : "كل المنتجات"}
              />
              <FormControlLabel
                value="products"
                control={<Radio />}
                label={language === "en" ? "Products" : "المنتجات"}
              />
              <FormControlLabel
                value="categories"
                control={<Radio />}
                label={language === "en" ? "Categories" : "الأقسام"}
              />
              <FormControlLabel
                value="subcategories"
                control={<Radio />}
                label={language === "en" ? "Subcategories" : "الأقسام الفرعية"}
              />
            </RadioGroup>
            {touched?.discountDepartment?.key &&
              errors?.discountDepartment?.key && (
                //
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
          </Stack>
          <Stack>
            <Typography sx={{ color: customColors.label, mb: "4px" }}>
              {language === "en" ? "Discount On" : "خصم على"}
            </Typography>
            <Autocomplete
              id="tags-standard"
              options={
                values.discountDepartment.key
                  ? options[values.discountDepartment.key]
                  : []
              }
              getOptionLabel={(option) =>
                values.discountDepartment.key === "products"
                  ? language === "en"
                    ? option.title_en
                    : option.title_ar
                  : language === "en"
                  ? option.name_en
                  : option.name_ar
              }
              disabled={
                !values.discountDepartment.key ||
                values.discountDepartment.key === "allProducts"
              }
              onChange={(_, value) =>
                setFieldValue("discountDepartment.value", [value._id])
              }
              renderInput={(params) => {
                return <TextField {...params} />;
              }}
            />
          </Stack>

          <Stack>
            <Typography sx={{ color: customColors.label, mb: "4px" }}>
              {language === "en" ? "Url" : "الرابط"}
            </Typography>
            <Stack sx={{ display: "flex", flexDirection: "row", gap: 2 }}>
              <Stack sx={{ width: "90%" }}>
                <TextField
                  disabled
                  type="url"
                  value={values.url}
                  variant="outlined"
                  InputProps={{
                    inputProps: {
                      min: 1,
                      max: 100,
                    },
                  }}
                  sx={{
                    borderColor: customColors.inputField,
                    "&:hover": {
                      fieldset: { borderColor: customColors.inputField },
                    },
                    fieldset: { borderColor: customColors.inputField },
                  }}
                />
              </Stack>

              <Stack sx={{ width: "55px", height: "55px" }}>
                <Tooltip
                  title={
                    language === "en"
                      ? copied
                        ? "Product link has been copied"
                        : "Product Link"
                      : copied
                      ? "تم نسخ الرابط"
                      : " نسخ رابط المنتج"
                  }
                  sx={{
                    color: "#000",
                    border: "1px solid",
                    borderColor: customColors.inputField,
                    borderRadius: "10%",
                    height: "55px",
                  }}
                >
                  <IconButton onClick={() => handleCopy(generateUrl())}>
                    <ContentCopyIcon />
                  </IconButton>
                </Tooltip>
              </Stack>
            </Stack>
          </Stack>
        </FormControl>
        {/* Button save and cancel  */}
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
            disabled={
              dataMarketer ? updateMarketerLoading : createMarketerLoading
            }
          >
            {language === "en" ? "Save" : "حفظ التعديلات"}
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

export default MarketerModal;
