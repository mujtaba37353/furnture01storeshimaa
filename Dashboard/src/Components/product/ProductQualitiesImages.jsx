import { useTheme } from "@emotion/react";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  CardMedia,
  FormControl,
  MenuItem,
  Select,
  Stack,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import UploadFile from "../../Components/globals/UploadFile";
import { useFormik } from "formik";
import * as yup from "yup";
import CloseIcon from "@mui/icons-material/Close";
import { useUploadImageMutation } from "../../api/upload.api";
import { imageBaseUrl } from "../../api/baseUrl";
const ProductQualitiesImages = ({
  language,
  productQualities,
  productQualitiesImages,
  produuctSetFieldValue,
}) => {
  const [open, setOpen] = useState(false);
  const [errorUpload, setErrorUpload] = useState("");
  const { btnStyle, colors } = useTheme();
  const [picture, setPicture] = useState();
  const [uploadImage, { isLoading: UploadImageLoading }] =
    useUploadImageMutation();

  const formik = useFormik({
    initialValues: {
      image: "",
      qualities: [],
    },
    validationSchema: yup.object({
      image: yup.string().required(language === "en" ? "Required!" : "مطلوب!"),
      qualities: yup
        .array()
        .min(1, language === "en" ? "Add quality" : "أضف معيار")
        .required(language === "en" ? "Required!" : "مطلوب!"),
    }),
    onSubmit: (values, { resetForm }) => {
      const imageData = new FormData();
      imageData.append("image", picture);
      uploadImage(imageData)
        .unwrap()
        .then((res) => {
          produuctSetFieldValue("qualitiesImages", [
            ...productQualitiesImages,
            { ...values, image: res.image },
          ]);
          setQualitySelected("");
          setPicture();
          resetForm();
        });
    },
  });
  const handleUploadFile = (e) => {
    const file = e.target.files[0];
    productQualities?.length < 1
      ? setErrorUpload(
          language === "en" ? "Add quality first" : "أضف معيار أولاً"
        )
      : setPicture(file),
      formik.setFieldValue("image", file.name);
  };
  useEffect(() => {
    if (productQualities?.length > 0) {
      setErrorUpload("");
    }
  }, [productQualities]);
  const [qualitySelected, setQualitySelected] = useState("");
  const findQualitySelected = productQualities?.find(
    (proQual) => proQual.key_en === qualitySelected
  );
  const handleChangeCheckInputs = (item) => {
    const existed = formik.values.qualities.find(
      ({ key_en }) => key_en === qualitySelected
    );
    console.log("qualitySelected add", qualitySelected);
    if (!existed) {
      if (qualitySelected === "colors") {
        formik.setFieldValue("qualities", [
          ...formik.values.qualities,
          {
            key_en: findQualitySelected.key_en,
            key_ar: findQualitySelected.key_ar,
            value_en: item.value_en,
            value_ar: item.value_ar,
            color: item.color,
          },
        ]);
      } else {
        formik.setFieldValue("qualities", [
          ...formik.values.qualities,
          {
            key_en: findQualitySelected.key_en,
            key_ar: findQualitySelected.key_ar,
            value_en: item.value_en,
            value_ar: item.value_ar,
          },
        ]);
      }
    } else {
      formik.setFieldValue(
        "qualities",
        formik.values.qualities.map((qual) =>
          qualitySelected !== "colors"
            ? qual.key_en === qualitySelected
              ? {
                  ...qual,
                  value_en: item.value_en,
                  value_ar: item.value_ar,
                }
              : qual
            : qual.key_en === qualitySelected
            ? {
                ...qual,
                value_en: item.value_en,
                value_ar: item.value_ar,
                color: item.color,
              }
            : qual
        )
      );
    }
  };
  const handleDeleteQualityImage = (item) => {
    produuctSetFieldValue(
      "qualitiesImages",
      productQualitiesImages.filter(({ image }) => image !== item.image)
    );
  };
  return (
    <Box>
      <Accordion
        expanded={open}
        sx={{
          mt: open ? 6 : 3,
          bgcolor: colors.bg_main,
        }}
      >
        <AccordionSummary
          sx={{
            cursor: "auto !important",
          }}
          aria-controls="panel1bh-content"
          id="panel1bh-header"
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
              {language === "en" ? "Qualities Images" : "صور المعايير"}
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
          <Box>
            <UploadFile
              file={picture}
              handleUploadFile={handleUploadFile}
              error={formik.errors.image}
              touched={formik.touched.image}
              extraStyle={{
                mx: "auto",
                height: 400,
              }}
            />
            {errorUpload ? (
              <Typography
                sx={{
                  color: colors.dangerous,
                  fontWeight: "bold",
                  textAlign: "center",
                  mt: 4,
                }}
              >
                {errorUpload}
              </Typography>
            ) : undefined}
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
                {language === "en" ? "Select a quality" : "أختار معيار"}
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
                  value={qualitySelected}
                  onChange={(e) => setQualitySelected(e.target.value)}
                  displayEmpty
                  disabled={!picture}
                  sx={{
                    width: 1,
                    border: 1,
                    height: 45,
                    bgcolor: colors.bg,
                    borderColor:
                      formik.errors.qualities &&
                      formik.touched.qualities?.length < 1
                        ? colors.dangerous
                        : "divider",
                  }}
                >
                  {productQualities?.map((item) => (
                    <MenuItem value={item.key_en} key={item.key_en}>
                      {item[`key_${language}`]}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              {formik.errors.qualities &&
              formik.touched.qualities?.length < 1 ? (
                <Typography
                  sx={{
                    color: colors.dangerous,
                  }}
                >
                  {formik.errors.qualities}
                </Typography>
              ) : undefined}

              {qualitySelected ? (
                <Box my={3}>
                  {findQualitySelected?.values.map((item, idx) => (
                    <Stack
                      key={idx}
                      direction={"row"}
                      alignItems={"center"}
                      gap={"15px"}
                      mb={"10px"}
                    >
                      <input
                        type="radio"
                        value={item.value_en}
                        id={item.value_en}
                        name={"quality-value"}
                        checked={formik.values.qualities?.find(
                          ({ key_en, value_en }) =>
                            key_en === qualitySelected &&
                            value_en === item.value_en
                        )}
                        onChange={() => handleChangeCheckInputs(item)}
                      />
                      {findQualitySelected?.key_en === "colors" ? (
                        <Box
                          component={"label"}
                          htmlFor={item.value_en}
                          sx={{
                            height: "30px",
                            bgcolor: `${item.color}`,
                            cursor: "pointer",
                            display: "flex",
                            justifyContent: "center",
                            px: "20px",
                            borderRadius: "7.5px",
                          }}
                        >
                          <span style={{ color: "#fff" }}>
                            {item[`value_${language}`]}
                          </span>
                        </Box>
                      ) : (
                        <Typography
                          component="label"
                          htmlFor={item.value_en}
                          sx={{
                            fontWeight: "bold",
                            cursor: "pointer",
                          }}
                        >
                          {item[`value_${language}`]}
                        </Typography>
                      )}
                    </Stack>
                  ))}
                </Box>
              ) : undefined}
            </Box>
          </Box>
          <Button
            sx={{ ...btnStyle, color: "#fff", mt: 2, width: 1 }}
            type="button"
            onClick={formik.handleSubmit}
            disabled={UploadImageLoading}
          >
            {language === "en" ? "Add qualitiy images" : "إضافة صور المعيار"}
          </Button>
        </AccordionDetails>
      </Accordion>

      {productQualitiesImages?.length > 0 ? (
        <Stack direction={"row"} flexWrap={"wrap"} gap={"15px"}>
          {productQualitiesImages.map((item, idx) => (
            <Box
              key={idx}
              sx={{
                border: 1,
                borderColor: "divider",
                mt: "15px",
                p: 2,
                bgcolor: colors.bg_main,
                position: "relative",
                // width: 200,
              }}
            >
              <CardMedia
                component="img"
                sx={{
                  height: 100,
                  width: 1,
                  my: 2,
                }}
                src={`${imageBaseUrl}${item.image}`}
              />
              {item.qualities.map((qual) => (
                <>
                  <Typography fontWeight={"bold"}>
                    {qual[`key_${language}`]}
                  </Typography>
                  {qual.color !== undefined ? (
                    <Box
                      sx={{
                        height: "30px",
                        widKth: "100px",
                        bgcolor: `${qual.color}`,
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        px: "5px",
                      }}
                    >
                      <span style={{ color: "#fff" }}>
                        {qual[`value_${language}`]}
                      </span>
                    </Box>
                  ) : (
                    <Typography>{qual[`value_${language}`]}</Typography>
                  )}
                </>
              ))}
              <CloseIcon
                onClick={() => handleDeleteQualityImage(item)}
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
  );
};

export default ProductQualitiesImages;
