import { useFormik } from "formik";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { array, number, object } from "yup";
import InputText from "../globals/InputText";
import CloseIcon from "@mui/icons-material/Close";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  CardMedia,
  Chip,
  FormControl,
  Grid,
  MenuItem,
  Paper,
  Select,
  Stack,
  Typography,
} from "@mui/material";
import { useTheme } from "@emotion/react";
import { toast } from "react-toastify";
import UploadFiles from "../globals/UploadFiles";
import { useGetAllQualitiesQuery } from "../../api/qualities.api";
import AddIcon from "@mui/icons-material/Add";
import { useUploadFilesMutation } from "../../api/upload.api";
import ProductQualitiesTable from "./ProductQualitiesTable";
const ProductGeneralQualities = ({
  productQuantity,
  productQualities,
  produuctSetFieldValue,
  editedProduct,
}) => {
  const [_, { language }] = useTranslation();
  const [open, setOpen] = useState(false);
  const { btnStyle, colors } = useTheme();
  const [remainingQuantity, remainingQualities] = useState(0);
  const [sortedQualities, setSortedQualities] = useState([]);
  const [uploadFiles, { isLoading: uploadFilesLoading }] =
    useUploadFilesMutation();
  useEffect(() => {
    const remainingQty =
      productQuantity -
      productQualities.reduce((acc, item) => acc + item.quantity, 0);
    remainingQualities(remainingQty);
  }, [productQuantity, productQualities]);
  const formik = useFormik({
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
          remainingQuantity,
          language === "en"
            ? `you have ${remainingQuantity} available quantity`
            : `لديك ${remainingQuantity} كمية متاحة`
        )
        .required(language === "en" ? "Required!" : "مطلوب!"),
      image: array(),
      values: array()
        .min(
          sortedQualities?.length >= 1 ? sortedQualities?.length : 1,
          language === "en"
            ? sortedQualities?.length >= 1
              ? `Add ${sortedQualities?.length}  values to quality`
              : `add value to quality`
            : sortedQualities?.length >= 1
            ? `أضف ${sortedQualities?.length} قيم للمعيار`
            : `أضف قيمة للمعيار`
        )
        .required(language === "en" ? "Required!" : "مطلوب!"),
    }),
    onSubmit: (values, { resetForm }) => {
      const hasDuplicateQualityValues = () => {
        const stringifyValues = JSON.stringify(values.values);
        return productQualities.some(
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
        if (qualityImages.length > 0) {
          const qualityImagesFormData = new FormData();
          qualityImages.forEach((file) => {
            qualityImagesFormData.append(`files`, file);
          });
          uploadFiles(qualityImagesFormData)
            .unwrap()
            .then((res) => {
              produuctSetFieldValue("qualities", [
                ...productQualities,
                {
                  ...values,
                  image: res.files,
                },
              ]);
              setSortedQualities((prevQual) => {
                return prevQual.map((item) => ({
                  key_en: item.key_en,
                  key_ar: item.key_ar,
                  value_en: "",
                  value_ar: "",
                }));
              });
              resetForm();
              setQualityImages([]);
            });
        } else {
          produuctSetFieldValue("qualities", [
            ...productQualities,
            {
              ...values,
            },
          ]);
        }
        setSortedQualities((prevQual) => {
          return prevQual.map((item) => ({
            key_en: item.key_en,
            key_ar: item.key_ar,
            value_en: "",
            value_ar: "",
          }));
        });
        resetForm();
      }
    },
  });
  const {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    setFieldValue,
    handleSubmit,
  } = formik;
  const [qualityImages, setQualityImages] = useState([]);
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
    setQualityImages(qualityImages.filter((img) => img.name !== file.name));
  };
  const {
    data: dataQualities,
    error: errorQualities,
    isLoading: isLoadingQualities,
  } = useGetAllQualitiesQuery();
  const [usedSelect, setUsedSelect] = useState("");
  const [selectedQuality, setSelectedQuality] = useState();
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
                  _id: selectedQuality._id,
                  key_en: selectedQuality.key_en,
                  key_ar: selectedQuality.key_ar,
                  value_en: findValueObject.value_en,
                  value_ar: findValueObject.value_ar,
                  color: findValueObject?.color,
                }
              : {
                  _id: selectedQuality._id,
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
  useEffect(() => {
    const sortedQualitiesIncludeValue = sortedQualities.filter(
      (el) => el.value_en !== "" && el.value_ar !== ""
    );
    setFieldValue("values", sortedQualitiesIncludeValue);
  }, [sortedQualities]);

  const handleDeleteSelectedSortedQuality = (selectedItem) => {
    setSortedQualities((prevQual) => {
      return prevQual.filter((item) => item.key_en !== selectedItem.key_en);
    });
    produuctSetFieldValue(
      "qualities",
      productQualities.map((quality) => ({
        ...quality,
        values: quality.values.filter(
          ({ key_en }) => key_en !== selectedItem.key_en
        ),
      }))
    );
  };
  const handleDeleteSelectedQ = (selectedItem) => {
    setSortedQualities((prevQual) => {
      return prevQual.map((item) =>
        item.key_en === selectedItem.key_en
          ? {
              key_en: selectedItem.key_en,
              key_ar: selectedItem.key_ar,
              value_en: "",
              value_ar: "",
            }
          : item
      );
    });
  };
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

  const handleAddSortedQuality = () => {
    const findObject = dataQualities?.data?.find(
      ({ _id }) => _id === usedSelect
    );
    if (findObject) {
      const existedQuality = sortedQualities.find(
        (el) => el.key_en === findObject.key_en
      );
      if (!existedQuality) {
        setSortedQualities((prev) => [
          ...prev,
          {
            _id: findObject._id,
            key_en: findObject.key_en,
            key_ar: findObject.key_ar,
            value_en: "",
            value_ar: "",
          },
        ]);
        if (productQualities?.length) {
          produuctSetFieldValue(
            "qualities",
            productQualities.map((quality) => ({
              ...quality,
              values: [
                ...quality.values,
                {
                  key_en: findObject.key_en,
                  key_ar: findObject.key_ar,
                  value_en: "",
                  value_ar: "",
                },
              ],
            }))
          );
        }
      }
    }
    setUsedSelect("");
  };
  const checkUsedQualityInProduct = (item) => {
    let check = productQualities?.some((el) =>
      el?.values
        ?.filter(({ value_en, value_ar }) => value_en !== "" && value_ar !== "")
        ?.find(
          ({ key_en, key_ar }) =>
            key_en === item.key_en && key_ar === item.key_ar
        )
    );
    return check;
  };
  useEffect(() => {
    if (productQualities?.length > 0) {
      const ids = productQualities[0]?.values.map((el) => el._id);
      if (ids[0]) {
        produuctSetFieldValue("generalQualities", ids);
      }
    } else {
      produuctSetFieldValue("generalQualities", []);
    }
  }, [productQualities]);

  useEffect(() => {
    if (editedProduct) {
      const sortedFilters =
        editedProduct.qualities?.length < 1
          ? []
          : editedProduct.qualities[0]?.values.map((el) => ({
              _id:
                errorQualities && !dataQualities
                  ? ""
                  : dataQualities?.data?.find(
                      ({ key_en }) => key_en === el.key_en
                    )?._id,
              key_en: el.key_en,
              key_ar: el.key_ar,
              value_en: "",
              value_ar: "",
            }));
      setSortedQualities(sortedFilters);
    }
  }, [editedProduct]);
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
          <Box component={"form"} onSubmit={handleSubmit}>
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
                  errors.quantity && touched.quantity && remainingQuantity === 0
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
            {errorQualities && !dataQualities ? undefined : (
              <Box
                sx={{
                  border: 1,
                  borderColor: "divider",
                  mt: "20px",
                  p: "10px",
                }}
              >
                <Stack
                  direction={"row"}
                  justifyContent={"space-between"}
                  alignItems={"center"}
                  gap={2}
                >
                  <FormControl
                    sx={{
                      width: 0.9,
                      mt: "15px",
                      svg: {
                        color: `${colors.main} !important`,
                      },
                    }}
                  >
                    <Typography>
                      {language === "en"
                        ? "Select the qualities you want to use"
                        : "حدد المعاير التي تريد استخدامها"}
                    </Typography>
                    <Select
                      value={usedSelect}
                      onChange={(event) => setUsedSelect(event.target.value)}
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
                      {dataQualities?.data?.map((el, idx) => (
                        <MenuItem
                          key={idx}
                          value={el._id}
                          disabled={sortedQualities
                            ?.map((sorted) => sorted?.key_en)
                            .includes(el?.key_en)}
                        >
                          {el[`key_${language}`]}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  <Button
                    sx={{
                      bgcolor: "#00D5C5 !important",
                      alignSelf: "flex-end",
                    }}
                    onClick={handleAddSortedQuality}
                  >
                    <AddIcon
                      sx={{
                        color: "#fff",
                      }}
                    />
                  </Button>
                </Stack>
                <Stack direction={"row"} flexWrap={"wrap"} gap={2} mt={"20px"}>
                  {sortedQualities
                    ?.filter((el) => el?.key_en && el?.key_ar)
                    .map((sortedItem, idx) =>
                      checkUsedQualityInProduct(sortedItem) ? (
                        <Chip
                          key={idx}
                          sx={{
                            borderRadius: "5px",
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
                                {`${idx + 1}- ` + sortedItem[`key_${language}`]}
                              </Typography>
                            </>
                          }
                        />
                      ) : (
                        <Chip
                          key={idx}
                          sx={{
                            borderRadius: "5px",
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
                                {`${idx + 1}- ` + sortedItem[`key_${language}`]}
                              </Typography>
                            </>
                          }
                          onDelete={() =>
                            handleDeleteSelectedSortedQuality(sortedItem)
                          }
                        />
                      )
                    )}
                </Stack>
              </Box>
            )}
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
                          <MenuItem
                            key={idx}
                            value={el.key_en}
                            disabled={
                              sortedQualities.find(
                                (sorted) =>
                                  sorted.key_en === el.key_en &&
                                  sorted.value_en !== ""
                              )
                                ? true
                                : false
                            }
                          >
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
                        {language === "en" ? "quality value" : "قيمة المعيار"}
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
                      bgcolor: `${
                        Object.values(optionQuality).some(
                          (value) => value === ""
                        )
                          ? "#00d5c55e"
                          : "#00D5C5"
                      } !important`,
                      mt: "20px",
                    }}
                    disabled={Object.values(optionQuality).some(
                      (value) => value === ""
                    )}
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
                      onDelete={() => handleDeleteSelectedQ(sortedQuality)}
                    />
                  </Box>
                ))}
            </Stack>
            <Stack direction={"row"} gap={"10px"}>
              <Button
                disabled={
                  uploadFilesLoading || (errorQualities && !dataQualities)
                }
                sx={{ ...btnStyle, color: "#fff", mt: 2, width: 1 }}
                onClick={handleSubmit}
              >
                {/* isEdit */}
                {false
                  ? language === "en"
                    ? "Edit quality"
                    : "تعديل معيار"
                  : language === "en"
                  ? "Add quality"
                  : "إضافة معيار"}
              </Button>
            </Stack>
          </Box>
        </AccordionDetails>
      </Accordion>
      <Box mt={"10px"}>
        {productQualities?.length ? (
          <ProductQualitiesTable
            productQualities={productQualities}
            productQuantity={productQuantity}
            remainingQuantity={remainingQuantity}
            sortedQualities={sortedQualities}
            setSortedQualities={setSortedQualities}
            produuctSetFieldValue={produuctSetFieldValue}
            generalQualitiesData={{
              isLoadingQualities,
              dataQualities,
              errorQualities,
            }}
          />
        ) : null}
      </Box>
    </Box>
  );
};

export default ProductGeneralQualities;
