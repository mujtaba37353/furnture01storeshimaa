import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Grid,
  Stack,
  Switch,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import { productQualityValues } from "../../formik/initValues";
import { productQualityError } from "../../formik/errors";
import InputText from "../../Components/globals/InputText";
import { useTheme } from "@emotion/react";
import InputText2 from "../../Components/globals/InputText2";
import CloseIcon from "@mui/icons-material/Close";
import { toast } from "react-toastify";
import EditIcon from "@mui/icons-material/Edit";
import { SketchPicker } from "react-color";
const ProductQualities = ({
  language,
  productQualities,
  produuctSetFieldValue,
}) => {
  const [open, setOpen] = useState(false);
  const { btnStyle, colors } = useTheme();
  const [editedQual, setEditedQual] = useState();
  const [qualityValue, setQualityValue] = useState({
    value_en: "",
    value_ar: "",
    price: 0,
  });
  const qualityFormik = useFormik({
    initialValues: productQualityValues,
    validationSchema: productQualityError(language),
    onSubmit: (values, { resetForm }) => {
      const existed = productQualities?.find(
        (qual) => qual.key_en === values.key_en || qual.key_ar === values.key_ar
      );
      setColorSwitch(false);
      if (!editedQual) {
        if (existed) {
          produuctSetFieldValue(
            "qualities",
            productQualities?.map((prodQual) =>
              prodQual.key_en === existed.key_en ||
              prodQual.key_ar === existed.key_ar
                ? {
                    ...prodQual,
                    values: prodQual.values.concat(values.values),
                  }
                : prodQual
            )
          );
        } else {
          produuctSetFieldValue("qualities", [
            ...productQualities,
            { ...values },
          ]);
        }
      } else {
        produuctSetFieldValue(
          "qualities",
          productQualities?.map((item) =>
            item.key_en === editedQual.key_en ? values : item
          )
        );
        setEditedQual();
      }

      resetForm();
      setQualityValue({
        value_en: "",
        value_ar: "",
        price: 0,
      });
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
        price: 0,
      });
    }
  };
  const handleDeleteQuality = (item) => {
    const filteredQualities = productQualities.filter(
      (quality) => quality.key_en !== item.key_en
    );
    produuctSetFieldValue("qualities", filteredQualities);
  };
  const deleteQualValue = (item) => {
    setValues({
      ...values,
      values: values.values.filter(
        (element) => element.value_en !== item.value_en
      ),
    });
  };
  useEffect(() => {
    if (!open) {
      resetForm();
      setQualityValue({
        value_en: "",
        value_ar: "",
        price: 0,
      });
    }
  }, [open]);

  useEffect(() => {
    if (editedQual) {
      qualityFormik.setValues(editedQual);
      setOpen(true);
      editedQual.key_en === "colors" && editedQual.key_ar === "الألوان"
        ? setColorSwitch(true)
        : setColorSwitch(false);
    } else {
      qualityFormik.setValues(productQualityValues);
    }
  }, [editedQual]);
  const [colorSwitch, setColorSwitch] = useState(false);
  useEffect(() => {
    if (colorSwitch) {
      setFieldValue("key_en", "colors");
      setFieldValue("key_ar", "الألوان");
      setFieldValue("values", []);
      setQualityValue({
        value_en: "",
        value_ar: "",
        color: "",
        price: 0,
      });
    } else {
      setFieldValue("key_en", "");
      setFieldValue("key_ar", "");
      setFieldValue("values", []);
      setQualityValue({
        value_en: "",
        value_ar: "",
        price: 0,
      });
    }
  }, [colorSwitch]);

  const handleChangeColor = (e) => {
    setQualityValue((prev) => ({
      ...prev,
      color: e.hex,
    }));
  };

  return (
    <Grid item lg={12} xs={12}>
      <Accordion
        expanded={open}
        sx={{
          bgcolor: colors.bg_main,
        }}
      >
        <AccordionSummary
          aria-controls="panel1bh-content"
          id="panel1bh-header"
          sx={{
            cursor: "auto !important",
          }}
        >
          <Stack direction={"row"} justifyContent={"space-between"} width={1}>
            <Typography
              variant="h6"
              sx={{
                textTransform: "capitalize",
                color: colors.text,
                fontWeight: "bold",
                fontSize: "17px",
              }}
            >
              {language === "en" ? "Qualities" : "المعاير"}
            </Typography>
            <Button
              sx={{ ...btnStyle, color: "#fff" }}
              onClick={() => setOpen(!open)}
            >
              {language === "en" ? "Add" : "أضف"}
            </Button>
          </Stack>
        </AccordionSummary>
        <AccordionDetails>
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
              sx={{ cursor: "pointer" }}
            >
              {language === "en" ? "Add quality color" : "أضف معيار لون"}
            </Typography>
          </Stack>

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
              <InputText2
                label={language === "en" ? "price" : "السعر"}
                name="price"
                type="number"
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
                {editedQual
                  ? language === "en"
                    ? "Update quality"
                    : "تحديث معيار"
                  : language === "en"
                  ? "Add quality"
                  : "إضافة معيار"}
              </Button>
              {editedQual ? (
                <Button
                  sx={{
                    ...btnStyle,
                    bgcolor: "transparent !important",
                    border: `1px solid ${colors.dangerous}`,
                    color: colors.dangerous,
                    mt: 2,
                    width: 0.2,
                  }}
                  type="button"
                  onClick={() => setEditedQual()}
                >
                  {language === "en" ? "Close" : "إلغاء"}
                </Button>
              ) : undefined}
            </Stack>
          </Box>
        </AccordionDetails>
      </Accordion>
      {/* {productQualities?.length > 0 ? (
        <Box>
          {productQualities.map((productQuality) => (
            <Box
              sx={{
                border: 1,
                borderColor: "divider",
                mt: "15px",
                p: 2,
                bgcolor: colors.bg_main,
                position: "relative",
              }}
            >
              <Typography>{productQuality[`key_${language}`]}</Typography>
              <CloseIcon
                onClick={() => handleDeleteQuality(productQuality)}
                sx={{
                  position: "absolute",
                  top: 0,
                  left: language === "ar" ? 0 : undefined,
                  right: language === "en" ? 0 : undefined,
                  cursor: "pointer",
                  color: colors.dangerous,
                }}
              />
              {editedQual?.key_en !== productQuality.key_en ? (
                <EditIcon
                  onClick={() => setEditedQual(productQuality)}
                  sx={{
                    position: "absolute",
                    top: 0,
                    left: language === "ar" ? "30px" : undefined,
                    right: language === "en" ? "30px" : undefined,
                    cursor: "pointer",
                    color: colors.main,
                    fontSize: "20px",
                    transform:
                      language === "en" ? "rotateY(0)" : "rotateY(180deg)",
                  }}
                />
              ) : undefined}
              <Stack
                direction={"row"}
                gap={"20px"}
                flexWrap={"wrap"}
                mt={"5px"}
              >
                {productQuality.values.map((item) => (
                  <Box
                    position={"relative"}
                    border={1}
                    p={2}
                    pt={3}
                    borderColor={"divider"}
                  >
                    {productQuality.key_en === "colors" ? (
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          height: "35px",
                          bgcolor: `${item.color} !important`,
                          px: "20px",
                          borderRadius: "7.4px",
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
                  </Box>
                ))}
              </Stack>
            </Box>
          ))}
        </Box>
      ) : undefined} */}
    </Grid>
  );
};

export default ProductQualities;
