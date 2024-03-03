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
};

export default function AttributeModal({
  open,
  setOpen,
  editedItem,
  setEditedItem,
}) {
  const [attributeValue, setAttributeValue] = useState({
    value_en: "",
    value_ar: "",
  });
  const [_, { language }] = useTranslation();
  const { btnStyle, colors } = useTheme();
  const [errorSubmit, setErrorSubmit] = useState("");
  const [createAttribute] = useCreateAttributeMutation();
  const [updateAttribute] = useUpdateAttributeMutation();
  const formik = useFormik({
    initialValues: attribute_values,
    validationSchema: attribute_errors(language),
    onSubmit: (values) => {
      if (!editedItem) {
        createAttribute(values)
          .unwrap()
          .then((res) => {
            toast.success(res[`success_${language}`]);
            handleClose();
          })
          .catch((err) => {
            toast.error(err.data[`error_${language}`]);
          });
      } else {
        updateAttribute({
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
    errors,
    touched,
    handleChange,
    handleSubmit,
    setFieldValue,
    handleBlur,
    resetForm,
  } = formik;
  const handleClose = () => {
    setOpen(false);
    resetForm();
    setEditedItem();
  };
  const handleAddValueToAttribute = () => {
    const { value_en, value_ar } = attributeValue;
    if (!value_en) {
      setErrorSubmit(
        language === "en" ? "Enter the english value" : "أدخل القيمة الانجليزية"
      );
    } else if (!value_ar) {
      setErrorSubmit(
        language === "en" ? "Enter the arabic value" : "أدخل القيمة العربية"
      );
    } else {
      setFieldValue("values", [...values.values, attributeValue]);
      setAttributeValue({
        value_en: "",
        value_ar: "",
      });
    }
  };
  const deleteAttributeValue = (item) => {
    const filteredAttribute = values.values.filter(
      (element) => element.value_en !== item.value_en
    );
    setFieldValue("values", filteredAttribute);
  };
  useEffect(() => {
    let checking = Object.values(attributeValue).some((item) => item.length);
    checking ? setErrorSubmit("") : undefined;
  }, [attributeValue]);
  useEffect(() => {
    if (editedItem && open) {
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
  }, [editedItem, open]);
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
                ? "Update Attribute"
                : "تحديث عامل التصفية"
              : language === "en"
              ? "Add Attribute"
              : "إضافة عامل تصفية"}
          </Typography>
          <InputText
            label={language === "en" ? "engligh name" : "الأسم الإنجليزي"}
            name="key_en"
            type={"text"}
            error={errors.key_en}
            value={values.key_en}
            touched={touched.key_en}
            handleChange={handleChange}
            handleBlur={handleBlur}
          />
          <Box my={"15px"}>
            <InputText
              label={language === "en" ? "arabic name" : "الأسم العربي"}
              name="key_ar"
              type={"text"}
              error={errors.key_ar}
              value={values.key_ar}
              touched={touched.key_ar}
              handleChange={handleChange}
              handleBlur={handleBlur}
            />
          </Box>
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
            <InputText2
              name="value_en"
              type="text"
              state={attributeValue}
              setState={setAttributeValue}
              label={language === "en" ? "english value" : "القيمة الانجليزية"}
            />
            <InputText2
              name="value_ar"
              type="text"
              label={language === "en" ? "arabic value" : "القيمة العربية"}
              state={attributeValue}
              setState={setAttributeValue}
            />
            {errorSubmit && (
              <Typography color={colors.dangerous}>{errorSubmit}</Typography>
            )}
            <Button
              sx={{ ...btnStyle, color: "#fff", mt: 2, width: 1 }}
              type="button"
              onClick={handleAddValueToAttribute}
            >
              {language === "en" ? "Add value" : "إضافة قيمة"}
            </Button>
            {values.values?.length > 0 ? (
              <Stack
                direction={"row"}
                gap={"15px"}
                flexWrap={"wrap"}
                pt={"4px"}
                mt={"10px"}
                sx={{
                  wordBreak: "break-word",
                }}
              >
                {values.values.map((item) => (
                  <Box
                    border={1}
                    borderColor={"divider"}
                    py={3}
                    px={2}
                    position={"relative"}
                    width={{
                      md: "auto",
                      xs: 1,
                    }}
                  >
                    <Typography>{item[`value_${language}`]}</Typography>
                    <CloseIcon
                      onClick={() => deleteAttributeValue(item)}
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
          {errors.values && touched.values?.length < 1 && (
            <Typography color={colors.dangerous}>{errors.values}</Typography>
          )}
          <Stack direction={"row"} gap={"10px"}>
            <Button
              sx={{ ...btnStyle, color: "#fff", mt: 2, width: 1 }}
              type="button"
              onClick={handleSubmit}
            >
              {editedItem
                ? language === "en"
                  ? "Update Attribute"
                  : "تحديث عامل التصفية"
                : language === "en"
                ? "Add Attribute"
                : "إضافة عامل تصفية"}
            </Button>
          </Stack>
        </Box>
      </Modal>
    </Box>
  );
}
