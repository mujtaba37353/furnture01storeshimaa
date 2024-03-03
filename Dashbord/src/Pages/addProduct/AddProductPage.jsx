import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import {
  Box,
  Button,
  CardMedia,
  Grid,
  Input,
  InputBase,
  Stack,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { useFormik } from "formik";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import ProductAttributes from "../../Components/product/ProductAttributes";
import { useUploadFilesMutation } from "../../api/upload.api";
import { productErrors } from "../../formik/errors";
import { useAddProduct } from "../../hooks/products.hooks";
import MetaAccordions from "../../Components/metaAccordion/MetaAccordions";
import ProductNotifications from "../../Components/product/ProductNotifications";
import { toast } from "react-toastify";
import QuillInput from "../../Components/globals/QuillInput";
import SelectTag from "../../Components/globals/SelectTag";
import ProductKeywords from "../../Components/product/ProductKeywords";
import { useFetchAllCategories } from "../../hooks/categories.hooks";
import { useFetchSubCategoriesByCategoryId } from "../../hooks/subCategories.hooks";
import CloseIcon from "@mui/icons-material/Close";
import { paymentTypes } from "../../Components/product/productAssets";
import { useFetchSubSubCategoryBySubId } from "../../hooks/subSubCategories.hooks";
import DraftEditor from "../../Components/globals/draftEditor/DraftEditor";
import { useGetAllReposQuery } from "../../api/repos.api";
import ProductGeneralQualities from "../../Components/product/ProductGeneralQualities";
import UploadFiles from "../../Components/globals/UploadFiles";

const AddProductPage = () => {
  const staticUploadedImageName = "my-upload-file";
  const { colors, btnStyle, breakpoints } = useTheme();
  const [_, { language }] = useTranslation();
  const [productImages, setProductImages] = useState([]);
  const [coverPhoto, setCoverPhoto] = useState();
  const [uploadFiles, { isLoading: uploadFilesLoading }] =
    useUploadFilesMutation();
  const [addProduct, { isLoading }] = useAddProduct();
  const formik = useFormik({
    initialValues: {
      title_en: "",
      title_ar: "",
      description_en: "",
      description_ar: "",
      priceBeforeDiscount: 1,
      shippingPrice: 0,
      quantity: 0,
      images: [],
      paymentType: "",
      keywords: [],
      category: "",
      subCategory: "",
      weight: 1,
      qualities: [],
      attributes: [],
      generalQualities: [],
      title_meta: "",
      desc_meta: "",
      link: "",
      title: "",
      message: "",
      subSubCategory: "",
      repositoryId: "",
    },
    validationSchema: productErrors(language),
    onSubmit: (values) => {
      let notificationsKeys = ["title", "message"];
      let filterdNotificationValues = notificationsKeys
        .map((key) => ({
          key: values[key],
        }))
        .filter((el) => el.key);
      if (
        filterdNotificationValues[0] &&
        filterdNotificationValues.length < 2
      ) {
        toast.error(
          language === "en"
            ? "You must complate all notification or delete all"
            : "يجب أن تكمل بيانات الإشعار أو تحذفها بالكامل"
        );
      } else {
        const checkEmptyQualityValues = values.qualities.find((item) =>
          item.values.some(
            ({ value_en, value_ar }) => value_en === "" && value_ar === ""
          )
        );

        const totalQualityQty = values?.qualities?.reduce(
          (acc, qual) => acc + qual.quantity,
          0
        );
        if (values.quantity < totalQualityQty) {
          toast.error(
            language === "en"
              ? "The values of this quality are similar to another quality values"
              : "قيم هذا المعيار متشابهة بقيم لمعيار اخر"
          );
        } else if (checkEmptyQualityValues) {
          const emptyValueObject = checkEmptyQualityValues?.values?.find(
            ({ value_en, value_ar }) => value_en === "" && value_ar === ""
          );
          return toast.error(
            language === "en"
              ? `There are empty values of ${
                  emptyValueObject[`key_${language}`]
                }  quality`
              : `هناك قيم فارغة لمعيار ${emptyValueObject[`key_${language}`]}`
          );
        } else {
          const formData = new FormData();
          if (coverPhoto) {
            [coverPhoto, ...productImages].forEach((file, index) => {
              return formData.append(`files`, file);
            });
          } else {
            productImages.forEach((file, index) => {
              return formData.append(`files`, file);
            });
          }
          uploadFiles(formData)
            .unwrap()
            .then((res) => {
              const temp = JSON.parse(JSON.stringify(values));
              !temp.title_meta ? delete temp.title_meta : undefined;
              !temp.desc_meta ? delete temp.desc_meta : undefined;
              !temp.link ? delete temp.link : (temp.paymentType = "online");
              !temp.extention ? delete temp.extention : undefined;
              !temp.attributes[0] ? delete temp.attributes : undefined;
              !temp.title ? delete temp.title : undefined;
              !temp.message ? delete temp.message : undefined;
              !temp.subSubCategory ? delete temp.subSubCategory : undefined;
              !temp.repositoryId ? delete temp.repositoryId : undefined;
              !temp.qualities[0] ? delete temp.qualities : undefined;
              addProduct({
                ...temp,
                images: temp.images
                  .filter((img) => img !== staticUploadedImageName)
                  .concat(res.files),
              });
            });
        }
      }
    },
  });

  const navigate = useNavigate();
  const {
    values,
    errors,
    touched,
    handleSubmit,
    handleChange,
    handleBlur,
    setFieldValue,
    setFieldTouched,
  } = formik;
  const [file, setFile] = useState();
  const handleUploadFile = (e) => {
    setFieldValue("images", [...values.images, staticUploadedImageName]);
    const files = e.target.files;
    const uploadedFiles = Object.values(files);
    setProductImages((prev) => [...prev, ...uploadedFiles]);
  };
  const deleteImage = (file) => {
    if (
      productImages.length === 1 &&
      values.images.includes(staticUploadedImageName)
    ) {
      formik.setValues({
        ...values,
        images: values.images.filter(
          (item) => item !== staticUploadedImageName
        ),
      });
    }
    setProductImages(productImages.filter((img) => img.name !== file.name));
    if (file) setFile();
  };
  const { categories } = useFetchAllCategories();
  const { subCategories } = useFetchSubCategoriesByCategoryId(values.category);
  const { customColors } = useTheme();
  const phoneScreen = useMediaQuery(breakpoints.down("lg"));
  const { subSubCategories } = useFetchSubSubCategoryBySubId(
    values.subCategory
  );
  const {
    data: reposData,
    error: reposError,
    isLoading: reposIsLoading,
  } = useGetAllReposQuery();
  useEffect(() => {
    if (values.category) {
      setFieldValue("subCategory", "");
      setFieldValue("subSubCategory", "");
    }
  }, [values.category]);
  useEffect(() => {
    if (values.subCategory) {
      setFieldValue("subSubCategory", "");
    }
  }, [values.subCategory]);
  const handleUploadMainPicture = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCoverPhoto(file);
      setFieldValue("images", [...values.images, staticUploadedImageName]);
    }
  };
  return (
    <Box
      sx={{
        p: {
          lg: 3,
          md: 2.5,
          xs: 1.5,
        },
        bgcolor: colors.bg_main,
      }}
      component="form"
      onSubmit={handleSubmit}
    >
      <Box py={5}>
        <Typography variant="h4" mb={"10px"}>
          {language === "en" ? "products" : "المنتجات"}
        </Typography>
        <Stack
          direction={"row"}
          justifyContent={"space-between"}
          alignItems={"center"}
        >
          <Stack direction={"row"} alignItems={"center"} gap={"10px"}>
            <Typography
              variant="h6"
              onClick={() => navigate("/")}
              sx={{
                cursor: "pointer",
                fontSize: "16px",
              }}
            >
              {language === "en" ? "Home" : "الصفحة الرئيسية"}
            </Typography>
            <ArrowForwardIosIcon
              sx={{
                transform: language === "ar" ? "rotateY(180deg)" : 0,
              }}
            />
            <Typography
              variant="h6"
              sx={{
                color: colors.main,
                fontSize: "16px",
              }}
            >
              {language === "en" ? "products" : "المنتجات"}
            </Typography>
          </Stack>
          <ArrowForwardIosIcon
            onClick={() => navigate(-1)}
            sx={{
              cursor: "pointer",
              transform: language === "ar" ? "rotateY(180deg)" : 0,
            }}
          />
        </Stack>
      </Box>
      <Grid container>
        <Grid item lg={6} xs={12}>
          <Stack
            sx={{
              flexDirection: {
                lg: "row",
                xs: "column-reverse",
              },
              gap: "15px",
            }}
          >
            {/*  FORM IMAGES   */}
            <Stack
              sx={{
                flexDirection: {
                  lg: "column",
                  xs: "row",
                },
                width: {
                  lg: 100,
                  xs: 1,
                },
                maxHeight: {
                  lg: 480,
                  xs: "auto",
                },
                overflowY: {
                  lg: productImages.length > 3 ? "scroll" : "auto",
                  xs: "auto",
                },
                px: "5px",
                gap: {
                  lg: 0,
                  xs: "10px",
                },
                display:
                  productImages.length > 0 || coverPhoto ? "block" : "none",
                flexWrap: {
                  lg: "nowrap",
                  xs: "wrap",
                },
                "::-webkit-scrollbar": {
                  width: "7.5px",
                },
              }}
            >
              {coverPhoto && (
                <Box position={"relative"} mt={"10px"}>
                  <Button
                    sx={{
                      bgcolor: `${colors.dangerous} !important`,
                      minWidth: 0,
                      position: "absolute",
                      top: 0,
                      right: language === "ar" ? 0 : undefined,
                      left: language === "en" ? 0 : undefined,
                      height: 20,
                      width: 20,
                    }}
                    onClick={() => setCoverPhoto()}
                  >
                    <CloseIcon
                      sx={{
                        color: "#fff",
                        fontSize: "15px",
                      }}
                    />
                  </Button>
                  <CardMedia
                    src={
                      coverPhoto ? URL.createObjectURL(coverPhoto) : undefined
                    }
                    component="img"
                    sx={{
                      height: 100,
                      width: 80,
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
              )}
              {productImages.map((image, idx) => (
                <Box position={"relative"} key={idx} mt={"10px"}>
                  <Button
                    sx={{
                      bgcolor: `${colors.dangerous} !important`,
                      minWidth: 0,
                      position: "absolute",
                      top: 0,
                      right: language === "ar" ? 0 : undefined,
                      left: language === "en" ? 0 : undefined,
                      height: 20,
                      width: 20,
                    }}
                    onClick={() => deleteImage(image)}
                  >
                    <CloseIcon
                      sx={{
                        color: "#fff",
                        fontSize: "15px",
                      }}
                    />
                  </Button>
                  <CardMedia
                    src={image ? URL.createObjectURL(image) : undefined}
                    component="img"
                    sx={{
                      height: 100,
                      width: 80,
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
            <UploadFiles
              error={errors.images}
              touched={touched.images?.length < 1}
              handleUploadFile={handleUploadFile}
              handleUploadMainPicture={handleUploadMainPicture}
              coverPhoto={true}
              file={file}
              extraStyle={{
                height: 500,
                width: {
                  lg:
                    productImages?.length > 0 || coverPhoto
                      ? `calc(100% - 100px)`
                      : 1,
                  xs: 1,
                },
              }}
            />
          </Stack>
          {/* FORM Qualities LARGE */}
          {!phoneScreen && (
            <Box>
              {/* FORM GENERAL QUALITIES */}
              <Box mt={"15px"}>
                <ProductGeneralQualities
                  productQuantity={values?.quantity}
                  productQualities={values?.qualities || []}
                  produuctSetFieldValue={setFieldValue}
                />
              </Box>
              <Box mt={"15px"}>
                <ProductAttributes
                  language={language}
                  productAttributes={values.attributes}
                  setProductFieldValue={setFieldValue}
                />
              </Box>
              <Box mt={"15px"}>
                <MetaAccordions
                  metaTitle={values.title_meta}
                  metaDesc={values.desc_meta}
                  setFieldValue={setFieldValue}
                  isEdit={false}
                />
              </Box>
              <Box mt="20px">
                <ProductNotifications
                  setProductFieldValue={setFieldValue}
                  productNotificationValues={{
                    title: values.title,
                    message: values.message,
                  }}
                />
              </Box>
            </Box>
          )}
        </Grid>
        <Grid
          item
          lg={6}
          xs={12}
          sx={{
            px: {
              md: "20px",
              xs: 0,
            },
          }}
        >
          {/* FORM TITLE_EN */}
          <Box mt={"15px"}>
            <Typography
              sx={{
                color: customColors.text,
                fontWeight: "bold",
                fontSize: "15px",
              }}
            >
              {language === "en" ? "English title" : "اللقب الانجليزى"}
            </Typography>
            <InputBase
              sx={{
                width: 1,
                border: 1,
                borderColor:
                  customColors[
                    errors.title_en && touched.title_en
                      ? "dangerous"
                      : "inputBorderColor"
                  ],
                borderRadius: "4px",
                p: "2px 4px",
                bgcolor: customColors.bg,
              }}
              name={"title_en"}
              type={"text"}
              value={values?.title_en}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            {errors.title_en && touched.title_en ? (
              <Typography
                sx={{
                  color: customColors.dangerous,
                }}
              >
                {errors.title_en}
              </Typography>
            ) : undefined}
          </Box>
          {/* FORM TITLE_AR */}
          <Box mt={"15px"}>
            <Typography
              sx={{
                color: customColors.text,
                fontWeight: "bold",
                fontSize: "15px",
              }}
            >
              {language === "en" ? "Arabic title" : "اللقب العربي"}
            </Typography>
            <InputBase
              sx={{
                width: 1,
                border: 1,
                borderColor:
                  customColors[
                    errors.title_ar && touched.title_ar
                      ? "dangerous"
                      : "inputBorderColor"
                  ],
                borderRadius: "4px",
                p: "2px 4px",
                bgcolor: customColors.bg,
              }}
              name={"title_ar"}
              type={"text"}
              value={values?.title_ar}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            {errors.title_ar && touched.title_ar ? (
              <Typography
                sx={{
                  color: customColors.dangerous,
                }}
              >
                {errors.title_ar}
              </Typography>
            ) : undefined}
          </Box>
          {/* FORM DESCRIPTION_EN */}
          <Stack
            sx={{
              margin: "10px 0px",
              "line-height": "1.5",
              "letter-spacing": "0.00938em",
              "font-weight": "700",
              "font-size": "15px",
            }}
          >
            {language === "en" ? "english description" : "الوصف الانجليزي"}
          </Stack>

          <DraftEditor
            field="description_en"
            error={errors.description_en}
            value={values.description_en}
            touched={touched.description_en}
            edit={false}
            handleChange={(value) => {
              setFieldValue("description_en", value);
            }}
            handleBlur={() => {
              setFieldTouched("description_en", true);
            }}
          />
          <Stack
            sx={{
              color: "#C75050",
            }}
          >
            {touched.description_ar && errors.description_ar
              ? language === "en"
                ? "required"
                : "مطلوب"
              : ""}
          </Stack>
          {/* FORM DESCRIPTION_AR */}
          <Stack
            sx={{
              margin: "10px 0px",
              "line-height": "1.5",
              "letter-spacing": "0.00938em",
              "font-weight": "700",
              "font-size": "15px",
            }}
          >
            {language === "en" ? "arabic description" : "الوصف العربي"}
          </Stack>

          <DraftEditor
            edit={false}
            field="description_ar"
            error={errors.description_ar}
            value={values.description_ar}
            touched={touched.description_ar}
            handleChange={(value) => setFieldValue("description_ar", value)}
            handleBlur={() => {
              setFieldTouched("description_ar", true);
            }}
          />
          <Stack
            sx={{
              color: "#C75050",
            }}
          >
            {touched.description_en && errors.description_en
              ? language === "en"
                ? "required"
                : "مطلوب"
              : ""}
          </Stack>
          {/* FORM PRICE BEFORE DISCOUNT */}

          <Box mt={"15px"}>
            <Typography
              sx={{
                color: customColors.text,
                fontWeight: "bold",
                fontSize: "15px",
              }}
            >
              {language === "en" ? "Price" : "السعر"}
              <Typography
                component="span"
                sx={{
                  fontSize: "small",
                }}
              >
                {` (${
                  language === "en" ? "in Saudi riyalss" : "بالريال السعودي"
                }) `}
              </Typography>
            </Typography>
            <InputBase
              sx={{
                width: 1,
                border: 1,
                borderColor:
                  customColors[
                    errors.priceBeforeDiscount && touched.priceBeforeDiscount
                      ? "dangerous"
                      : "inputBorderColor"
                  ],
                borderRadius: "4px",
                p: "2px 4px",
                bgcolor: customColors.bg,
              }}
              name={"priceBeforeDiscount"}
              type={"number"}
              value={values?.priceBeforeDiscount}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            {errors.priceBeforeDiscount && touched.priceBeforeDiscount ? (
              <Typography
                sx={{
                  color: customColors.dangerous,
                }}
              >
                {errors.priceBeforeDiscount}
              </Typography>
            ) : undefined}
          </Box>
          {/* FORM SHIPPING PRICE */}
          <Box mt={"15px"}>
            <Typography
              sx={{
                color: customColors.text,
                fontWeight: "bold",
                fontSize: "15px",
              }}
            >
              {language === "en" ? "Shipping price" : "سعر الشحن"}
              <Typography
                component="span"
                sx={{
                  fontSize: "small",
                }}
              >
                {` (${
                  language === "en" ? "in Saudi riyalss" : "بالريال السعودي"
                }) `}
              </Typography>
            </Typography>
            <InputBase
              sx={{
                width: 1,
                border: 1,
                borderColor:
                  customColors[
                    errors.shippingPrice && touched.shippingPrice
                      ? "dangerous"
                      : "inputBorderColor"
                  ],
                borderRadius: "4px",
                p: "2px 4px",
                bgcolor: customColors.bg,
              }}
              name={"shippingPrice"}
              type={"number"}
              value={values?.shippingPrice}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            {errors.shippingPrice && touched.shippingPrice ? (
              <Typography
                sx={{
                  color: customColors.dangerous,
                }}
              >
                {errors.shippingPrice}
              </Typography>
            ) : undefined}
          </Box>

          {/* FORM QUANTITY */}
          <Box mt={"15px"}>
            <Typography
              sx={{
                color: customColors.text,
                fontWeight: "bold",
                fontSize: "15px",
              }}
            >
              {language === "en" ? "Quantity" : "الكمية"}
            </Typography>
            <InputBase
              sx={{
                width: 1,
                border: 1,
                borderColor:
                  customColors[
                    errors.quantity && touched.quantity
                      ? "dangerous"
                      : "inputBorderColor"
                  ],
                borderRadius: "4px",
                p: "2px 4px",
                bgcolor: customColors.bg,
              }}
              name={"quantity"}
              type={"number"}
              value={values.quantity}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            {errors.quantity && touched.quantity ? (
              <Typography
                sx={{
                  color: customColors.dangerous,
                }}
              >
                {errors.quantity}
              </Typography>
            ) : undefined}
          </Box>
          {/* FORM WEIGHT */}

          <Box mt={"15px"}>
            <Typography
              sx={{
                color: customColors.text,
                fontWeight: "bold",
                fontSize: "15px",
              }}
            >
              {language === "en" ? "Weight" : "الوزن"}
              <Typography
                component="span"
                sx={{
                  fontSize: "small",
                }}
              >
                {` (${
                  language === "en"
                    ? "in grams - 1000 gram equal 1 kg"
                    : "بالجرام - 1000 جرام يساوي كيلو جرام"
                }) `}
              </Typography>
            </Typography>
            <InputBase
              sx={{
                width: 1,
                border: 1,
                borderColor:
                  customColors[
                    errors.weight && touched.weight
                      ? "dangerous"
                      : "inputBorderColor"
                  ],
                borderRadius: "4px",
                p: "2px 4px",
                bgcolor: customColors.bg,
              }}
              name={"weight"}
              type={"number"}
              value={values?.weight}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            {errors.weight && touched.weight ? (
              <Typography
                sx={{
                  color: customColors.dangerous,
                }}
              >
                {errors.weight}
              </Typography>
            ) : undefined}
          </Box>
          {/* FORM CATEGORY */}

          <Box mt={"15px"}>
            <SelectTag
              label={language === "en" ? "category" : "القسم"}
              name="category"
              error={errors.category}
              value={values.category}
              touched={touched.category}
              handleChange={handleChange}
              handleBlur={handleBlur}
              optionsData={categories.data}
              itemField={`name_${language}`}
            />
          </Box>
          {/* FORM SUB CATEGORY */}

          <Box mt={"15px"}>
            <SelectTag
              label={language === "en" ? "sub category" : "القسم الفرعي"}
              name="subCategory"
              error={errors.subCategory}
              value={values.subCategory}
              touched={touched.subCategory}
              handleChange={handleChange}
              handleBlur={handleBlur}
              optionsData={subCategories.data}
              itemField={`name_${language}`}
            />
          </Box>

          {/* FORM subSubCategory */}

          <Box mt={"15px"}>
            <SelectTag
              label={language === "en" ? "Sub Sub category" : "قسم فرعى فرعى"}
              name="subSubCategory"
              error={errors.subSubCategory}
              value={values.subSubCategory}
              touched={touched.subSubCategory}
              handleChange={handleChange}
              handleBlur={handleBlur}
              optionsData={subSubCategories}
              itemField={`name_${language}`}
            />
          </Box>

          {/* FORM REPOSIORY */}

          <Box mt={"15px"}>
            <SelectTag
              label={language === "en" ? "Repository" : "المستودع"}
              name="repositoryId"
              error={errors.repositoryId}
              value={values.repositoryId}
              touched={touched.repositoryId}
              handleChange={handleChange}
              handleBlur={handleBlur}
              optionsData={
                !reposIsLoading
                  ? reposData && !reposError
                    ? reposData.data
                    : []
                  : []
              }
              itemField={`name_${language}`}
            />
          </Box>

          {/* FORM PAYMENT TYPE */}

          <Box mt={"15px"}>
            <SelectTag
              label={language === "en" ? "Payment type" : "نوع الدفع"}
              name="paymentType"
              error={errors.paymentType}
              value={values?.paymentType || ""}
              touched={touched.paymentType}
              handleChange={handleChange}
              handleBlur={handleBlur}
              optionsData={paymentTypes}
              itemField={language}
              link={values.link}
            />
          </Box>

          {/* FORM DELIVERY TYPE */}

          {/* FORM KEYWORDS */}

          <Box mt={"15px"}>
            <ProductKeywords
              language={language}
              keywordsValues={values?.keywords || []}
              keywordsErrors={errors.keywords}
              keywordsTouched={touched.keywords?.length < 1}
              setFieldValue={setFieldValue}
            />
          </Box>

          {/* FORM Link */}

          <Box mt={"15px"}>
            <Typography
              sx={{
                color: customColors.text,
                fontWeight: "bold",
                fontSize: "15px",
              }}
            >
              {language === "en" ? "Link" : "الرابط"}
            </Typography>
            <InputBase
              sx={{
                width: 1,
                border: 1,
                borderColor:
                  customColors[
                    errors.link && touched.link
                      ? "dangerous"
                      : "inputBorderColor"
                  ],
                borderRadius: "4px",
                p: "2px 4px",
                bgcolor: customColors.bg,
              }}
              name={"link"}
              type={"text"}
              value={values?.link}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            {errors.link && touched.link ? (
              <Typography
                sx={{
                  color: customColors.dangerous,
                }}
              >
                {errors.link}
              </Typography>
            ) : undefined}
          </Box>
        </Grid>
      </Grid>
      {phoneScreen && (
        <Box>
          {/* FORM ATTRIBUTES */}

          <Box mt="20px">
            <ProductAttributes
              language={language}
              productAttributes={values.attributes}
              setProductFieldValue={setFieldValue}
            />
          </Box>
          {/* FORM GENERAL QUALITIES */}
          <Box mt={"15px"}>
            <ProductGeneralQualities
              productQuantity={values?.quantity}
              productQualities={values?.qualities || []}
              produuctSetFieldValue={setFieldValue}
            />
          </Box>
          {/* FORM META TITLE */}
          <Box mt="20px">
            <MetaAccordions
              metaTitle={formik.values.title_meta}
              metaDesc={formik.values.desc_meta}
              setFieldValue={formik.setFieldValue}
            />
          </Box>
          {/* FORM META DESCRIPTION */}
          <Box mt="20px">
            <ProductNotifications
              setProductFieldValue={setFieldValue}
              productNotificationValues={{
                title: values.title,
                message: values.message,
              }}
            />
          </Box>
        </Box>
      )}
      <Stack direction={"row"} justifyContent={"center"} mt={"30px"}>
        <Button
          disabled={isLoading || uploadFilesLoading}
          sx={{
            ...btnStyle,
            color: "#fff",
            mt: "30px",
            fontSize: "17px",
          }}
          type="submit"
        >
          {isLoading || uploadFilesLoading
            ? language === "en"
              ? "Adding product...."
              : "جارى الإضافة..."
            : language === "en"
            ? "Add Product"
            : "إضافة منتج"}{" "}
        </Button>
      </Stack>
    </Box>
  );
};
export default AddProductPage;
