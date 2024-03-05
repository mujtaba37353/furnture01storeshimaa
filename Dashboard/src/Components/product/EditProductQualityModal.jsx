import { useState, useEffect } from "react";
import { useTheme } from "@emotion/react";
import {
  Box,
  CardMedia,
  Chip,
  FormControl,
  MenuItem,
  Select,
  Stack,
  Typography,
} from "@mui/material";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import { useFormik } from "formik";
import { useTranslation } from "react-i18next";
import { object, string, number, array } from "yup";
import InputText from "../globals/InputText";
import AddIcon from "@mui/icons-material/Add";
import UploadFiles from "../globals/UploadFiles";
import CloseIcon from "@mui/icons-material/Close";
import { imageBaseUrl } from "../../api/baseUrl";
import { useUploadFilesMutation } from "../../api/upload.api";
import { toast } from "react-toastify";

function EditProductQualityModal({
  open,
  setOpen,
  selectedItem,
  setSelectItem,
  productQualities,
  productQuantity,
  generalQualitiesData,
  produuctSetFieldValue,
  sortedQualities,
  setSortedQualities,
}) {
  const { colors, customColors } = useTheme();
  const [qualityImages, setQualityImages] = useState([]);
  const [selectedQuality, setSelectedQuality] = useState();
  const { isLoadingQualities, dataQualities, errorQualities } =
    generalQualitiesData;
  const [uploadFiles, { isLoading: uploadFilesLoading }] =
    useUploadFilesMutation();
  const {
    i18n: { language },
  } = useTranslation();
  const handleClose = () => {
    setOpen(false);
    setSelectItem();
    resetForm();
    setQualityImages([]);
  };
  const [remainingQty, setRemainingQty] = useState(0);
  useEffect(() => {
    if (selectedItem && open) {
      const totalQuantityOfQualities = productQualities.reduce(
        (acc, quality) => acc + quality.quantity,
        0
      );
      setRemainingQty(() => {
        const calucateRemaining =
          productQuantity - (totalQuantityOfQualities - selectedItem?.quantity);
        return calucateRemaining;
      });
    } else {
      setRemainingQty(0);
    }
  }, [productQualities, productQuantity, selectedItem, open]);
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
      price: 0,
      quantity: 0,
      image: [],
      values: [],
    },
    validationSchema: object({
      price: number(),
      quantity: number()
        .integer(
          language === "en"
            ? `Quantity must be integer`
            : `يجب ان تكون الكمية رقم صحيح`
        )
        .min(1, language === "en" ? `Enter quantity` : `أدخل كمية`)
        .max(
          remainingQty,
          language === "en"
            ? `you have ${remainingQty} available quantity`
            : `لديك ${remainingQty} كمية متاحة`
        )
        .required(language === "en" ? "Required!" : "مطلوب!"),
      image: array(),
      values: array()
        .min(
          sortedQualities.length >= 1 ? sortedQualities.length : 1,
          language === "en"
            ? sortedQualities.length >= 1
              ? `Add ${sortedQualities.length}  values to quality`
              : `add value to quality`
            : sortedQualities.length >= 1
            ? `أضف ${sortedQualities.length} قيم للمعيار`
            : `أضف قيمة للمعيار`
        )
        .required(language === "en" ? "Required!" : "مطلوب!"),
    }),
    onSubmit: (values) => {
      const hasDuplicateQualityValues = () => {
        const stringifyValues = JSON.stringify(values.values);
        return productQualities
          .filter((_, index) => index !== selectedItem.qualityIndex)
          .some(
            (proQual) => JSON.stringify(proQual.values) === stringifyValues
          );
      };
      if (hasDuplicateQualityValues()) {
        toast.error(
          language === "en"
            ? "The values of this quality are similar to another quality values"
            : "قيم هذا المعيار متشابهة بقيم لمعيار اخر"
        );
      } else {
        if (qualityImages?.length) {
          const formData = new FormData();
          qualityImages.forEach((image) => {
            formData.append("files", image);
            uploadFiles(formData)
              .unwrap()
              .then((res) => {
                handleUpdateQuality({
                  ...values,
                  image: values.image.concat(res.files),
                });
              });
          });
        } else {
          handleUpdateQuality(values);
        }
      }
    },
  });
  const handleUpdateQuality = (payload) => {
    const updatedQualities = productQualities.map((qual, index) =>
      index === selectedItem.qualityIndex ? { ...payload } : qual
    );
    produuctSetFieldValue("qualities", updatedQualities);
    handleClose();
    resetForm();
  };
  useEffect(() => {
    if (open && selectedItem) {
      setFieldValue("price", selectedItem.price);
      setFieldValue("quantity", selectedItem.quantity);
      setFieldValue("image", selectedItem.image);
      setSortedQualities((prevSortedQuals) =>
        prevSortedQuals.map((sortedQual) => {
          let findQualityValue = selectedItem.values.find(
            (item) => item.key_en === sortedQual.key_en
          );
          if (!findQualityValue) {
            return {
              key_en: sortedQual.key_en,
              key_ar: sortedQual.key_ar,
              value_en: "",
              value_ar: "",
            };
          }
          return findQualityValue?.color
            ? {
                key_en: sortedQual.key_en,
                key_ar: sortedQual.key_ar,
                value_en: findQualityValue.value_en,
                value_ar: findQualityValue.value_ar,
                color: findQualityValue.color,
              }
            : {
                key_en: sortedQual.key_en,
                key_ar: sortedQual.key_ar,
                value_en: findQualityValue.value_en,
                value_ar: findQualityValue.value_ar,
              };
        })
      );
    }
  }, [open, selectedItem]);
  const [optionQuality, setOptionQuality] = useState({
    key: "",
    value: "",
  });
  const handleChangeOptionQuality = (e) => {
    const { name, value } = e.target;
    setOptionQuality({
      ...optionQuality,
      [name]: value,
    });
  };
  const handleSelectValueOfSortedQuality = () => {
    if (selectedQuality) {
      setSortedQualities((prevQual) => {
        const findValueObject = selectedQuality.values.find(
          ({ value_en }) => value_en === optionQuality.value
        );
        const updateQualities = prevQual.map((item) =>
          item.key_en === selectedQuality.key_en
            ? findValueObject?.color
              ? {
                  key_en: selectedQuality.key_en,
                  key_ar: selectedQuality.key_ar,
                  value_en: findValueObject.value_en,
                  value_ar: findValueObject.value_ar,
                  color: findValueObject?.color,
                }
              : {
                  key_en: selectedQuality.key_en,
                  key_ar: selectedQuality.key_ar,
                  value_en: findValueObject.value_en,
                  value_ar: findValueObject.value_ar,
                }
            : item
        );
        return updateQualities;
      });
      setOptionQuality({
        key: "",
        value: "",
      });
      setSelectedQuality();
    }
  };
  const handleSelectQuality = (selectedQualityKey) => {
    setSelectedQuality(() => {
      const finedSelectedQuality = dataQualities?.data?.find(
        ({ key_en }) => key_en === selectedQualityKey
      );
      return finedSelectedQuality;
    });
  };
  useEffect(() => {
    if (optionQuality?.key) {
      handleSelectQuality(optionQuality?.key);
    }
  }, [optionQuality?.key]);
  useEffect(() => {
    const sortedQualitiesIncludeValue = sortedQualities.filter(
      (el) => el.value_en !== "" && el.value_ar !== ""
    );
    setFieldValue("values", sortedQualitiesIncludeValue);
  }, [sortedQualities]);
  const handleDeleteSelectedSortedQuality = (selectedItem) => {
    setSortedQualities((prevQual) => {
      return prevQual.map((item) =>
        item.key_en === selectedItem.key_en
          ? {
              key_en: selectedItem.key_en,
              key_ar: selectedItem.key_ar,
              value_en: "",
              value_en: "",
            }
          : item
      );
    });
  };
  const handleUploadFiles = (e) => {
    const files = e.target.files;
    const uploadedFiles = Object.values(files);
    if (uploadedFiles.length > 1) {
      setQualityImages((prev) => prev.concat(uploadedFiles));
    } else {
      setQualityImages((prev) => [...prev, uploadedFiles[0]]);
    }
  };
  const deleteImage = (file) => {
    if (typeof file === "string") {
      setFieldValue(
        `image`,
        values.image.filter((img) => img !== file)
      );
    } else {
      setQualityImages(qualityImages.filter((img) => img.name !== file.name));
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
          maxWidth: "720px!important",
          maxHeight: "90%",
          py: "40px",
          px: "30px",
          borderRadius: "15px",
          direction: language === "en" ? "ltr" : "rtl",
        },
      }}
    >
      <Stack>
        <UploadFiles
          error={errors.image}
          touched={touched.image?.length < 1}
          handleUploadFile={handleUploadFiles}
          context={
            language === "en" ? "Uplaad product image" : "رفع صورة المنتج"
          }
          extraStyle={{
            height: 300,
            width: 1,
          }}
        />
        <Stack
          direction="row"
          justifyContent={"flex-start"}
          flexWrap={"wrap"}
          gap={"10px"}
          my={"10px"}
        >
          {values.image.map((img, idx) => (
            <Box position={"relative"} key={idx}>
              <Button
                sx={{
                  bgcolor: `${colors.dangerous} !important`,
                  minWidth: 0,
                  position: "absolute",
                  top: 0,
                  left: language === "ar" ? 0 : undefined,
                  right: language === "en" ? 0 : undefined,
                  height: 20,
                  width: 20,
                }}
                onClick={() => deleteImage(img)}
              >
                <CloseIcon
                  sx={{
                    color: "#fff",
                    fontSize: "15px",
                  }}
                />
              </Button>
              <CardMedia
                src={imageBaseUrl + img}
                component="img"
                sx={{
                  height: 80,
                  width: 70,
                  objectFit: "cover",
                  borderRadius: "10px",
                  mt: {
                    lg: "15px",
                    xs: 0,
                  },
                  mb: {
                    lg: 0,
                    xs: "15px",
                  },
                }}
              />
            </Box>
          ))}
          {qualityImages.map((img, idx) => (
            <Box position={"relative"} key={idx}>
              <Button
                sx={{
                  bgcolor: `${colors.dangerous} !important`,
                  minWidth: 0,
                  position: "absolute",
                  top: 0,
                  left: language === "ar" ? 0 : undefined,
                  right: language === "en" ? 0 : undefined,
                  height: 20,
                  width: 20,
                }}
                onClick={() => deleteImage(img)}
              >
                <CloseIcon
                  sx={{
                    color: "#fff",
                    fontSize: "15px",
                  }}
                />
              </Button>
              <CardMedia
                src={URL.createObjectURL(img)}
                component="img"
                sx={{
                  height: 80,
                  width: 70,
                  objectFit: "cover",
                  borderRadius: "10px",
                  mt: {
                    lg: "15px",
                    xs: 0,
                  },
                  mb: {
                    lg: 0,
                    xs: "15px",
                  },
                }}
              />
            </Box>
          ))}
        </Stack>
      </Stack>
      <Box>
        <InputText
          label={language === "en" ? "Price" : "السعر"}
          name="price"
          type={"number"}
          error={errors.price}
          value={values.price}
          touched={touched.price}
          handleChange={handleChange}
          handleBlur={handleBlur}
        />
      </Box>
      <Box mt={"15px"}>
        <InputText
          label={language === "en" ? "Quantity" : "الكمية"}
          name="quantity"
          type={"number"}
          error={
            errors.quantity && touched.quantity && remainingQty === 0
              ? language === "en"
                ? "Increment quantity of the product first"
                : "زود كمية للمنتج أولاً"
              : errors.quantity
          }
          value={values.quantity}
          touched={touched.quantity}
          handleChange={handleChange}
          handleBlur={handleBlur}
        />
      </Box>
      <Box
        sx={{
          border: 1,
          borderColor:
            (errors.values && touched?.values?.length === 0) ||
            (errors.values && touched?.values?.length > 0)
              ? colors.dangerous
              : "divider",
          mt: "20px",
          p: "10px",
        }}
      >
        {isLoadingQualities ? (
          <></>
        ) : !dataQualities && errorQualities ? (
          <Stack
            direction={"row"}
            alignItems={"center"}
            justifyContent={"center"}
            py={"20px"}
          >
            <Typography
              sx={{
                color: colors.dangerous,
              }}
            >
              {errorQualities?.data
                ? language === "en"
                  ? "there are no qualities"
                  : "لا توجد معايير"
                : language === "en"
                ? "failed to fetch qualities"
                : "فشل في جلب المعاير"}
            </Typography>
          </Stack>
        ) : (
          <Box>
            <Box>
              <FormControl
                sx={{
                  width: 1,
                  mt: "15px",
                  svg: {
                    color: `${colors.main} !important`,
                  },
                }}
              >
                <Typography>
                  {language === "en" ? "quality name" : "اسم المعيار"}
                </Typography>
                <Select
                  name={"key"}
                  value={optionQuality.key}
                  onChange={(event) => {
                    handleChangeOptionQuality(event);
                  }}
                  sx={{
                    width: 1,
                    border: 1,
                    height: 35,
                    overflow: "hidden",
                    ".css-6hp17o-MuiList-root-MuiMenu-list": {
                      height: "200px !important",
                    },
                  }}
                >
                  {sortedQualities.map((el, idx) => (
                    <MenuItem key={idx} value={el.key_en}>
                      {el[`key_${language}`]}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl
                sx={{
                  width: 1,
                  mt: "15px",
                  svg: {
                    color: `${colors.main} !important`,
                  },
                }}
              >
                <Typography>
                  {language === "en" ? "quality value" : "قيمة العيار"}
                </Typography>
                <Select
                  name={"value"}
                  value={optionQuality.value}
                  onChange={(event) => {
                    handleChangeOptionQuality(event);
                  }}
                  sx={{
                    width: 1,
                    border: 1,
                    height: 35,
                    overflow: "hidden",
                    ".css-6hp17o-MuiList-root-MuiMenu-list": {
                      height: "200px !important",
                    },
                  }}
                >
                  {selectedQuality?.values.map((el, idx) => (
                    <MenuItem key={idx} value={el.value_en}>
                      {el[`value_${language}`]}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>

            <Button
              sx={{
                bgcolor: "#00D5C5 !important",
                mt: "20px",
              }}
              onClick={handleSelectValueOfSortedQuality}
            >
              <AddIcon
                sx={{
                  color: "#fff",
                }}
              />
            </Button>
          </Box>
        )}
      </Box>
      {(errors.values && touched?.values?.length === 0) ||
      (errors.values && touched?.values?.length > 0) ? (
        <Typography
          sx={{
            color: colors.dangerous,
          }}
        >
          {errors.values}
        </Typography>
      ) : undefined}
      <Stack
        direction={"row"}
        alignItems={"center"}
        gap={"20px"}
        flexWrap={"wrap"}
        mt={"15px"}
      >
        {sortedQualities
          .filter((el) => el?.value_en && el?.value_ar)
          .map((sortedQuality, idx) => (
            <Box
              key={idx}
              sx={{
                display: "flex",
              }}
            >
              <Chip
                sx={{
                  width: 1,
                  borderRadius: "5px",
                  svg: {
                    ml: language === "ar" ? "10px !important" : 0,
                  },
                }}
                label={
                  <>
                    <Typography
                      fontWeight={"bold"}
                      variant={"h6"}
                      sx={{
                        fontSize: "14px",
                      }}
                    >
                      {sortedQuality[`key_${language}`] +
                        `: ` +
                        sortedQuality[`value_${language}`]}
                    </Typography>
                  </>
                }
                onDelete={() =>
                  handleDeleteSelectedSortedQuality(sortedQuality)
                }
              />
            </Box>
          ))}
      </Stack>
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
          onClick={handleSubmit}
          disabled={uploadFilesLoading}
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
    </Dialog>
  );
}

export default EditProductQualityModal;
