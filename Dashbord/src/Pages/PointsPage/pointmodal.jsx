import { useTheme } from "@emotion/react";
import {
  FormControl,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
  Box,
} from "@mui/material";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import { Formik, useFormik } from "formik";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import * as Yup from "yup";
import { useCreateAdminMutation } from "../../api/user.api";
import { useAddOrUpdatePointMutation } from "../../api/pointsMangement";
import { useEffect } from "react";
import SelectTag from "../../Components/globals/SelectTag";
export default function PointModal({ open, setOpen, point = {} }) {
  const [addPoint, { isLoading, isSuccess, isError }] =
    useAddOrUpdatePointMutation();
  const { colors, customColors } = useTheme();
  const {
    i18n: { language },
  } = useTranslation();

  const {
    handleSubmit,
    errors,
    values,
    setValues,
    touched,
    handleChange,
    resetForm,
    handleBlur,
  } = useFormik({
    initialValues: {
      points: 0,
      pointsToRas: 0,
      PointsLow: 0,
      PointsHigh: 0,
      status: "",
    },
    validationSchema: Yup.object({
      points: Yup.number()
        .min(
          1,
          language === "en" ? "it must start with 1" : "يجب ان يبدا برقم 1"
        )
        .required(language === "en" ? "Required" : "مطلوب"),

      pointsToRas: Yup.number()
        .min(
          1,
          language === "en" ? "it must start with 1" : "يجب ان يبدا برقم 1"
        )
        .required(language === "en" ? "Required" : "مطلوب")
        .test(
          "is-higher",
          `
        ${
          language === "en"
            ? "Points conversion Must Be Lower Than Min And Max Usage "
            : "ما يعادل القيمه بالريال يجب ان يكون اقل من او يساوي الحد الادني والحد الاعلي للاستخدام "
        }
        `,
          function (value) {
            const { PointsLow } = this.parent;
            return (
              parseInt(value) >= 1 && parseInt(value) <= parseInt(PointsLow)
            );
          }
        ),
      PointsLow: Yup.number()
        .min(
          1,
          language === "en" ? "it must start with 1" : "يجب ان يبدا برقم 1"
        )
        .required(language === "en" ? "Required" : "مطلوب")
        .test(
          "is-higher",
          language === "en"
            ? "Points High must be greater than Points Low"
            : `
          الحد الادني للاستخدام يجب ان يكون اقل من الحد الاعلي للاستخدام واكثر من مايعادل قيمه النقط بالريال
`,
          function (value) {
            const { PointsHigh } = this.parent;
            return parseInt(value) < parseInt(PointsHigh);
          }
        ),
      PointsHigh: Yup.number()
        .min(
          1,
          language === "en" ? "it must start with 1" : "يجب ان يبدا برقم 1"
        )
        .required(language === "en" ? "Required" : "مطلوب")
        .test(
          "is-higher",
          language === "en"
            ? "PointsHigh must be greater than PointsLow"
            : `
            الحد الاعلي للاستخدام يجب ان يكون اكثر من الحد الادني للاستخدام و واكثر من مايعادل قيمه النقط بالريال
  `,
          function (value) {
            const { PointsLow, pointsToRas } = this.parent;
            return (
              parseInt(value) > parseInt(PointsLow) &&
              parseInt(value) > parseInt(pointsToRas)
            );
          }
        ),
      status: Yup.string().required(language === "en" ? "Required" : "مطلوب"),
    }),
    onSubmit: (values) => {
      const formatedData = {
        noOfPointsInOneUnit: values.points,
        totalPointConversionForOneUnit: values.pointsToRas,
        min: values.PointsLow,
        max: values.PointsHigh,
        status: values.status,
      };

      addPoint(formatedData)
        .unwrap()
        .then((res) => {
          toast.success(
            language === "en"
              ? "succfully add Your Point "
              : "تم اضافه النقاط بنجاح"
          );
          resetForm();
          setOpen(!open);
        })
        .catch((err) => {
          toast.error(
            language === "en"
              ? "there is an error while adding point "
              : "هناك مشكله في ادخال النقاط"
          );
        });
    },
  });
  const handleClose = () => {
    if (Object.keys(point).length) {
      const {
        noOfPointsInOneUnit,
        totalPointConversionForOneUnit,
        min,
        max,
        status,
      } = point.pointsMangement;
      setValues({
        points: noOfPointsInOneUnit,
        pointsToRas: totalPointConversionForOneUnit,
        PointsLow: min,
        PointsHigh: max,
        status,
      });
    } else {
      resetForm();
    }
    setOpen(false);
  };
  useEffect(() => {
    if (Object.keys(point).length) {
      const {
        noOfPointsInOneUnit,
        totalPointConversionForOneUnit,
        min,
        max,
        status,
      } = point.data;
      setValues({
        points: noOfPointsInOneUnit,
        pointsToRas: totalPointConversionForOneUnit,
        PointsLow: min,
        PointsHigh: max,
        status,
      });
    }
  }, [point]);
  const statusData = [
    {
      en: "static",
      ar: "يدوى",
    },
    {
      en: "dynamic",
      ar: "ديناميك",
    },
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
          borderRadius: "10px",
        },
      }}
    >
      <form onSubmit={handleSubmit}>
        <FormControl sx={{ width: "100%", gap: 3 }}>
          <Stack>
            <Typography sx={{ color: customColors.label, mb: "4px" }}>
              {language === "en"
                ? "The Count Of Points To Every Ras"
                : "عدد النقاط مقابل كل ريال"}
            </Typography>
            <TextField
              name="points"
              type="number"
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.points}
              helperText={touched.points && errors.points ? errors.points : ""}
              error={touched.points && errors.points}
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
              {language === "en" ? "Points To Ras" : "ما يعادل قيمتها بالريال "}
            </Typography>
            <TextField
              name="pointsToRas"
              onChange={handleChange}
              onBlur={handleBlur}
              type="number"
              helperText={
                touched.pointsToRas && errors.pointsToRas
                  ? errors.pointsToRas
                  : ""
              }
              error={touched.pointsToRas && errors.pointsToRas}
              value={values.pointsToRas}
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
                ? "Min points To Use"
                : " الحد الادني للاستخدام"}
            </Typography>
            <TextField
              name="PointsLow"
              type="number"
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.PointsLow}
              helperText={
                touched.PointsLow && errors.PointsLow ? errors.PointsLow : ""
              }
              error={touched.PointsLow && errors.PointsLow}
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
                ? "Max points To use"
                : " الحد الاعلي  للاستخدام"}
            </Typography>
            <TextField
              name="PointsHigh"
              type="number"
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.PointsHigh}
              helperText={
                touched.PointsHigh && errors.PointsHigh ? errors.PointsHigh : ""
              }
              error={touched.PointsHigh && errors.PointsHigh}
              variant="outlined"
              sx={{
                "&:hover": {
                  fieldset: { borderColor: customColors.inputField },
                },
                fieldset: { borderColor: customColors.inputField },
              }}
            />
          </Stack>
          <Box
            sx={{
              position: "relative",
            }}
          >
            <Typography
              sx={{
                color: colors.text,
                fontSize: "1rem",
                letterSpacing: "0.00938em",
              }}
            >
              {language === "en" ? "Status" : "الحالة"}
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
                value={values.status}
                name={"status"}
                onChange={handleChange}
                displayEmpty
                sx={{
                  width: 1,
                  border: 1,
                  height: 45,
                  borderColor:
                    customColors[
                      errors.status && touched.status
                        ? "dangerous"
                        : "inputBorderColor"
                    ],
                  bgcolor: customColors.bg,
                }}
              >
                {statusData.map((item) => (
                  <MenuItem value={item.en}>{item[language]}</MenuItem>
                ))}
              </Select>
            </FormControl>
            {errors.status && touched.status ? (
              <Typography
                sx={{
                  color: colors.dangerous,
                }}
              >
                {errors.status}
              </Typography>
            ) : undefined}
          </Box>
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
            disabled={isLoading}
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
