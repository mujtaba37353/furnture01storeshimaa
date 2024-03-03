import { useEffect, useState } from "react";
import { Modal, Typography, Button, Box, Stack } from "@mui/material";
import { useTheme } from "@emotion/react";
import { useFormik } from "formik";
import { useTranslation } from "react-i18next";
import { attribute_errors, attribute_values } from "./attrs.formik";
import InputText from "../globals/InputText";
import InputText2 from "../globals/InputText2";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import CloseIcon from "@mui/icons-material/Close";
import { toast } from "react-toastify";
import {
  useCreateAttributeMutation,
  useUpdateAttributeMutation,
} from "../../api/attribute.api";
import { productQualityValues } from "../../formik/initValues";
import { productQualityError } from "../../formik/errors";
import { SketchPicker } from "react-color";
import {
  useCreateQualityMutation,
  useUpdateQualityMutation,
} from "../../api/qualities.api";
const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: {
    lg: 750,
    md: 0.8,
    xs: 0.9,
  },
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
  borderRadius: 2,
  maxHeight: "85vh",
  overflowY: "scroll",
};

export default function QualityModal({
  open,
  setOpen,
  editedItem,
  setEditedItem,
  generalQualities,
}) {
  const [_, { language }] = useTranslation();
  const { btnStyle, colors } = useTheme();

  const [qualityValue, setQualityValue] = useState({
    value_en: "",
    value_ar: "",
  });
  const [colorSwitch, setColorSwitch] = useState(false);
  const [editedQual, setEditedQual] = useState();
  const [createQuality] = useCreateQualityMutation();
  const [updateQuality] = useUpdateQualityMutation();
  const qualityFormik = useFormik({
    initialValues: productQualityValues,
    validationSchema: productQualityError(language),
    onSubmit: (values, { resetForm }) => {
      if (!editedItem) {
        createQuality(values)
          .unwrap()
          .then((res) => {
            toast.success(
              language === "en"
                ? `Quality has been created successfully`
                : `تم إضافة المعيار بنجاح`
            );

            handleClose();
          })
          .catch((err) => {
            toast.error(err.data[`error_${language}`]);
          });
      } else {
        updateQuality({
          id: editedItem._id,
          payload: values,
        })
          .unwrap()
          .then((res) => {
            toast.success(res[`success_${language}`]);
            handleClose();
          })
          .catch((err) => {
            toast.error(err.data[`error_${language}`]);
          });
      }
    },
  });
  const {
    values,
    setValues,
    setFieldValue,
    errors,
    touched,
    handleChange,
    handleBlur,
    handleSubmit,
    resetForm,
  } = qualityFormik;
  const handleAddValueToQuality = () => {
    const { value_en, value_ar } = qualityValue;
    if (!value_en) {
      if (colorSwitch) {
        toast.error(language === "en" ? "Select color" : "أختار لون");
      } else {
        toast.error(
          language === "en"
            ? "Enter the english value for quality"
            : "أدخل القيمة الانجليزية للمعيار"
        );
      }
    } else if (!value_ar) {
      toast.error(
        language === "en"
          ? "Enter the arabic value for quality"
          : "أدخل القيمة العربية للمعيارقيمة المعيار"
      );
    } else {
      setValues({
        ...values,
        values: [...values.values, qualityValue],
      });
      setQualityValue({
        value_en: "",
        value_ar: "",
      });
    }
  };
  useEffect(() => {
    if (editedItem && open) {
      if (editedItem.key_en === "colors" && editedItem.key_ar === "الألوان") {
        setColorSwitch(true);
        setFieldValue("key_en", editedItem.key_en);
        setFieldValue("key_ar", editedItem.key_ar);
        setFieldValue(
          "values",
          editedItem.values.map((el) => ({
            value_en: el.value_en,
            value_ar: el.value_ar,
            color: el.color,
          }))
        );
      } else {
        setFieldValue("key_en", editedItem.key_en);
        setFieldValue("key_ar", editedItem.key_ar);
        setFieldValue(
          "values",
          editedItem.values.map((el) => ({
            value_en: el.value_en,
            value_ar: el.value_ar,
          }))
        );
      }
    }
  }, [editedItem, open]);
  const handleChangeColor = (e) => {
    setQualityValue((prev) => ({
      ...prev,
      color: e.hex,
    }));
  };
  useEffect(() => {
    if (colorSwitch) {
      setFieldValue("key_en", "colors");
      setFieldValue("key_ar", "الألوان");
      setFieldValue(
        "values",
        !editedItem
          ? []
          : editedItem.values.map((el) => ({
              value_en: el.value_en,
              value_ar: el.value_ar,
              color: el.color,
            }))
      );
      setQualityValue({
        value_en: "",
        value_ar: "",
        color: "",
      });
    } else {
      setFieldValue("key_en", "");
      setFieldValue("key_ar", "");
      setFieldValue("values", []);
      setQualityValue({
        value_en: "",
        value_ar: "",
      });
    }
  }, [colorSwitch]);
  const handleClose = () => {
    setOpen(false);
    resetForm();
    setEditedItem();
    setColorSwitch(false);
    setQualityValue({
      value_en: "",
      value_ar: "",
    });
  };
  const deleteQualValue = (item) => {
    const filteredQuality = values.values.filter(
      (element) => element.value_en !== item.value_en
    );
    setFieldValue("values", filteredQuality);
  };
  return (
    <Box>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box
          sx={{ ...style, bgcolor: colors.bg_main }}
          component="form"
          onSubmit={handleSubmit}
        >
          <Stack direction={"row"} justifyContent={"flex-end"}>
            <HighlightOffIcon
              sx={{
                fontSize: "35px",
                cursor: "pointer",
                color: "#C75050",
              }}
              onClick={handleClose}
            />
          </Stack>
          <Typography variant="h5" align="center" my="30px">
            {editedItem
              ? language === "en"
                ? "Update Quality"
                : "تحديث الصفة"
              : language === "en"
              ? "Add Quality"
              : "إضافة صفة"}
          </Typography>
          {editedItem ? undefined : (
            <Stack
              direction="row"
              alignItems={"center"}
              justifyContent={"flex-start"}
              mb={"20px"}
            >
              <input
                id="colorize"
                type="checkbox"
                value={colorSwitch}
                checked={colorSwitch}
                onChange={(e) => {
                  setColorSwitch(!colorSwitch);
                }}
                style={{
                  width: "30px",
                  height: "15px",
                  accentColor: "#00D5C5",
                }}
              />
              <Typography
                htmlFor={"colorize"}
                component={"label"}
                disabled={editedQual}
              >
                {language === "en" ? "Add quality color" : "أضف معيار لون"}
              </Typography>
            </Stack>
          )}
          <Box>
            <InputText
              label={language === "en" ? "engligh key" : "الحقل الإنجليزي"}
              name="key_en"
              type={"text"}
              error={errors.key_en}
              value={values.key_en}
              touched={touched.key_en}
              handleChange={handleChange}
              handleBlur={handleBlur}
              isDisabled={colorSwitch}
            />
            <InputText
              label={language === "en" ? "arabic key" : "الحقل العربي"}
              name="key_ar"
              type={"text"}
              error={errors.key_ar}
              value={values.key_ar}
              touched={touched.key_ar}
              handleChange={handleChange}
              handleBlur={handleBlur}
              isDisabled={colorSwitch}
            />
            <Box
              sx={{
                border: 1,
                borderColor:
                  errors.values && touched.values?.length < 1
                    ? colors.dangerous
                    : "divider",
                mt: 3,
                p: 2,
                borderRadius: "3px",
              }}
            >
              <Typography
                variant="h6"
                mb={1}
                sx={{
                  color: colors.text,
                  mb: 2,
                }}
              >
                {language === "en" ? "quality value" : "قيمة المعيار"}
              </Typography>
              {colorSwitch && (
                <Box mb="30px">
                  <SketchPicker
                    color={qualityValue.color}
                    onChange={handleChangeColor}
                  />
                </Box>
              )}

              <InputText2
                name="value_en"
                type="text"
                state={qualityValue}
                setState={setQualityValue}
                label={
                  language === "en" ? "english value" : "القيمة الانجليزية"
                }
              />
              <InputText2
                name="value_ar"
                type="text"
                label={language === "en" ? "arabic value" : "القيمة العربية"}
                state={qualityValue}
                setState={setQualityValue}
              />
              <Button
                sx={{ ...btnStyle, color: "#fff", mt: 2, width: 1 }}
                type="button"
                onClick={handleAddValueToQuality}
              >
                {language === "en"
                  ? "Add value to quality"
                  : "إضافة قيمة للمعيار"}
              </Button>
              {values.values?.length > 0 ? (
                <Stack
                  direction={"row"}
                  gap={"15px"}
                  flexWrap={"wrap"}
                  pt={"4px"}
                  mt={"10px"}
                >
                  {values.values.map((item) => (
                    <Box
                      border={1}
                      borderColor={"divider"}
                      py={3}
                      px={2}
                      position={"relative"}
                    >
                      {values.key_en === "colors" ? (
                        <Box
                          sx={{
                            height: "35px",
                            px: "20px",
                            bgcolor: `${item.color}`,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <span style={{ color: "#fff" }}>
                            {item[`value_${language}`]}
                          </span>
                        </Box>
                      ) : (
                        <Typography>{item[`value_${language}`]}</Typography>
                      )}
                      <Typography>{item.price}</Typography>
                      <CloseIcon
                        onClick={() => deleteQualValue(item)}
                        sx={{
                          position: "absolute",
                          top: 0,
                          left: language === "ar" ? 0 : undefined,
                          right: language === "en" ? 0 : undefined,
                          cursor: "pointer",
                          color: colors.dangerous,
                        }}
                      />
                    </Box>
                  ))}
                </Stack>
              ) : undefined}
            </Box>
            {errors.values && touched.values?.length < 1 ? (
              <Typography
                sx={{
                  color: colors.dangerous,
                }}
              >
                {errors.values}
              </Typography>
            ) : undefined}
            <Stack direction={"row"} gap={"10px"}>
              <Button
                sx={{ ...btnStyle, color: "#fff", mt: 2, width: 1 }}
                type="button"
                onClick={handleSubmit}
              >
                {editedItem
                  ? language === "en"
                    ? "Update quality"
                    : "تحديث معيار"
                  : language === "en"
                  ? "Add quality"
                  : "إضافة معيار"}
              </Button>
            </Stack>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
}
