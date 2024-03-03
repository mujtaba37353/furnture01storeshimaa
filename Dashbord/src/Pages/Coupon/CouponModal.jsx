import { useTheme } from "@emotion/react";
import {
  Autocomplete,
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import { useFormik } from "formik";
import moment from "moment";
// import moment from "moment-timezone";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import * as Yup from "yup";
import { useGetAllCategoriesQuery } from "../../api/category.api";
import {
  useCreateCouponMutation,
  useUpdateCouponByIdMutation,
} from "../../api/coupon.api";
import { useGetAllProductsQuery } from "../../api/product.api";
import { useGetAllSubCategoriesQuery } from "../../api/subcategories.api";

function CouponModal({ open, setOpen, dataCoupon, setDataCoupon }) {
  const { colors, customColors } = useTheme();
  const [createCoupon, { isLoading: createCouponLoading }] =
    useCreateCouponMutation();
  const [updateCoupon, { isLoading: updateCouponLoading }] =
    useUpdateCouponByIdMutation();

  const selectorRef = useRef();
  const [options, setOptions] = useState({
    allProducts: [],
    products: [],
    categories: [],
    subcategories: [],
  });
  const {
    i18n: { language },
  } = useTranslation();

  const handleClose = () => {
    setOpen(false);
    resetForm();
    if (dataCoupon) {
      return setDataCoupon();
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
      title: "",
      code: "",
      limit: "",
      discount: "",
      startDate: "",
      endDate: "",
      discountDepartment: {
        key: "",
        value: [],
      },
    },
    validationSchema: Yup.object({
      title: Yup.string().required(language === "en" ? "Required" : "مطلوب"),
      code: Yup.string().required(language === "en" ? "Required" : "مطلوب"),
      limit: Yup.string().required(language === "en" ? "Required" : "مطلوب"),
      discount: Yup.number()
        .max(
          99,
          language === "en"
            ? "Discount should be less than 100"
            : "الخصم يجب ان يكون اقل من 100"
        )
        .required(language === "en" ? "Required" : "مطلوب"),
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
      discountDepartment: Yup.object().shape({
        key: Yup.string().required(language === "en" ? "Required" : "مطلوب"),
      }),
    }),
    onSubmit: (values) => {
      if (!dataCoupon) {
        createCoupon(values)
          .unwrap()
          .then((res) => {
            handleClose();
            resetForm();
            toast.success(
              language === "en" ? res?.success_en : res?.success_ar
            );
          })
          .catch((error) => {
            let message =
              language === "en" ? error?.data?.error_en : error?.data?.error_ar;
            if (
              message ===
              '"discountDepartment.value" does not contain 1 required value(s)' &&
              language !== "en"
            ){
              message = `الخصم علي) يجب ان يحتوي على 1 قيمة علي الاقل)`;
            }

            toast.error(message);
          });
      } else {
        console.log("test 1");
        updateCoupon({ body: values, id: dataCoupon._id })
          .unwrap()
          .then((res) => {
            handleClose();
            resetForm();
            console.log(res);
            toast.success(
              language === "en" ? "Updated Successfully" : "تم التعديل بنجاح"
            );
          })
          .catch((error) => {
            let message =
              language === "en" ? error?.data?.error_en : error?.data?.error_ar;
            if (message === '"discountDepartment.value" does not contain 1 required value(s)' && language !== "en"){
              message = `الخصم علي) يجب ان يحتوي على 1 قيمة علي الاقل)`;
            }
            toast.error(message);
          });
          console.log(
    "test 2"
          );
      }
    },
  });

  const { data: productsData, error: productsError } = useGetAllProductsQuery(
    "?limit=1000",
  );
  const { data: categoriesData, error: categoriesError } =
    useGetAllCategoriesQuery("?limit=1000");
  const { data: subsData, error: subsError } = useGetAllSubCategoriesQuery(
    "?limit=1000",
  );
  useEffect(() => {
    if (productsData && !productsError) {
  
      setOptions((prev)=>({
        ...prev,
        products: productsData.data,
      }));
    }
    if (categoriesData && !categoriesError) {
      console.log("fetch in categoriesData", categoriesData)
      console.log(categoriesData, 'categoriesData')
      setOptions((prev)=>({
        ...prev,
        categories: categoriesData.data,
      }));
    }
    if (subsData && !subsError) {
   setOptions((prev)=>({
        ...prev,
        subcategories: subsData.data,
      }));
    }
  }, [productsData, categoriesData, subsData,open]);
  console.log("sdsds", options)
  useEffect(() => {
    if (dataCoupon && open) {
      setFieldValue("title", dataCoupon.title);
      setFieldValue("code", dataCoupon.code);
      setFieldValue("limit", dataCoupon.limit);
      setFieldValue("discount", dataCoupon.discount);
      setFieldValue(
        "startDate",
        moment(dataCoupon.startDate).format("YYYY-MM-DDTHH:MM")
      );
      setFieldValue(
        "endDate",
        moment(dataCoupon.endDate).format("YYYY-MM-DDTHH:MM")
      );
      setFieldValue(
        "discountDepartment.key",
        dataCoupon.discountDepartment.key
      );
      setFieldValue(
        "discountDepartment.value",
        dataCoupon.discountDepartment.value
      );
    }
  }, [dataCoupon, open]);
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
          <Stack>
            <Typography sx={{ color: customColors.label, mb: "4px" }}>
              {language === "en" ? "Name of Coupon" : "اسم الكوبون"}
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
                "&:hover": {
                  fieldset: { borderColor: customColors.inputField },
                },
                fieldset: { borderColor: customColors.inputField },
              }}
            />
          </Stack>
          <Stack>
            <Typography sx={{ color: customColors.label, mb: "4px" }}>
              {language === "en" ? "Code" : "الكود"}
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
              {language === "en"
                ? "number of times used (per user)"
                : "(للمستخدم الواحد) عدد مرات الاستخدام"}
            </Typography>
            <TextField
              name="limit"
              type="number"
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.limit}
              helperText={touched.limit && errors.limit ? errors.limit : ""}
              error={touched.limit && errors.limit}
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
          <Stack>
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
          <Stack>
            <Typography sx={{ color: customColors.label, mb: "4px" }}>
              {language === "en" ? "Start Date" : "تاريخ البدء"}
            </Typography>
            <TextField
              name="startDate"
              type="datetime-local"
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.startDate}
              helperText={
                touched.startDate && errors.startDate ? errors.startDate : ""
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
          </Stack>
          <Stack>
            <Typography sx={{ color: customColors.label, mb: "4px" }}>
              {language === "en" ? "End Date" : "تاريخ الإنتهاء"}
            </Typography>
            <TextField
              name="endDate"
              type="datetime-local"
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
              onChange={handleChange}
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
              multiple
              id="tags-standard"
              options={
                values.discountDepartment.key
                  ? options[values.discountDepartment.key]
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
            disabled={dataCoupon ? updateCouponLoading : createCouponLoading}
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

export default CouponModal;
