import { useFormik } from "formik";
import * as Yup from "yup";
import QuillInput from "../../globals/QuillInput";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import {
  Box,
  Button,
  CircularProgress,
  Grid,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import InputText from "../../globals/InputText";
import { useTranslation } from "react-i18next";
import {
  useCreateSectionMutation,
  useGetSectionByIdQuery,
  useUpdateSectionByIdMutation,
} from "../../../api/section.api";
import { useUploadFileMutation } from "../../../api/upload.api";
import { useEffect, useRef, useState } from "react";
import { imageBaseUrl } from "../../../api/baseUrl";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { allowed } from "../../../helper/roles";
import MetaAccordions from "../../metaAccordion/MetaAccordions";
import DraftEditor from "../../globals/draftEditor/DraftEditor";
const UploadImage = ({ onChange, image }) => {
  const imageRef = useRef(null);
  const [uploadFile, { isLoading: isLoadingUpload }] = useUploadFileMutation();
  const {
    i18n: { language },
  } = useTranslation();
  const HandleUpload = (e) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append("file", file);
    uploadFile(formData)
      .unwrap()
      .then((res) => {
        onChange(res.file);
      })
      .catch((error) => {
        toast.error(
          language === "en" ? error.data.error_en : error.data.error_ar
        );
      });
  };

  return (
    <Button
      onClick={() => {
        imageRef.current?.click();
      }}
      disabled={isLoadingUpload}
      variant="outlined"
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        color: "#fff",
        bgcolor: "#fff",
        border: "1px solid #7f7f7f",
        width: "100%",
        "&:hover": {
          bgcolor: "#fff",
          color: "#fff",
          border: "1px solid #7f7f7f",
        },
      }}
    >
      <Box
        component={"input"}
        sx={{
          display: "none",
        }}
        type="file"
        ref={imageRef}
        onChange={HandleUpload}
      />
      <Box
        component={"img"}
        src={image || "/placeholder.png"}
        sx={{
          width: "100%",
          height: "100%",
          objectFit: "contain",
        }}
      />
    </Button>
  );
};
function PoliciesOperations() {
  const { customColors } = useTheme();
  const { type } = useParams();
  const {
    i18n: { language },
  } = useTranslation();
  const [createSection, { isLoading }] = useCreateSectionMutation();
  const [updateSectionById, { isLoading: updateIsLoading }] =
    useUpdateSectionByIdMutation();
  const id = useLocation().search.split("=")[1];
  const { role } = useSelector((state) => state.user);
  const [descriptionValues, setDescriptionValues] = useState({
    description_ar: "",
    description_en: "",
  });
  const {
    data,
    isLoading: categoryLoading,
    isSuccess,
  } = useGetSectionByIdQuery(id);
  const navigate = useNavigate();
  const {
    handleSubmit,
    errors,
    values,
    touched,
    setFieldValue,
    setFieldTouched,
    handleChange,
    handleBlur,
  } = useFormik({
    initialValues: {
      title_en: "",
      title_ar: "",
      description_en: "",
      description_ar: "",
      type: type,
      image: "",
      title_meta: "",
      desc_meta: "",
    },
    validationSchema: Yup.object({
      type: Yup.string().required(language === "en" ? "Required" : "مطلوب"),
      image: Yup.string().when("type", {
        is: "aboutus",
        then: (schema) =>
          schema.required(language === "en" ? "Required" : "مطلوب"),
        otherwise: (schema) => schema.notRequired(),
      }),
      title_en: Yup.string().required(language === "en" ? "Required" : "مطلوب"),
      title_ar: Yup.string().required(language === "en" ? "Required" : "مطلوب"),
      description_en: Yup.string().required(
        language === "en" ? "Required" : "مطلوب"
      ),
      description_ar: Yup.string().required(
        language === "en" ? "Required" : "مطلوب"
      ),
    }),
    onSubmit: (values) => {
      if (type !== "aboutus") {
        delete values.image;
      }
      if (id) {
        !values.title_meta ? delete values.title_meta : undefined;
        !values.desc_meta ? delete values.desc_meta : undefined;
        updateSectionById({ id, body: values })
          .unwrap()
          .then(() => {
            toast.success(
              language === "en" ? "Updated Successfully" : "تم التعديل بنجاح"
            );
            navigate("/siteContent");
          })
          .catch((error) => {
            const message =
              language === "en" ? error?.data?.error_en : error?.data?.error_ar;
            toast.error(message);
          });
        return;
      }
      !values.title_meta ? delete values.title_meta : undefined;
      !values.desc_meta ? delete values.desc_meta : undefined;
      createSection(values)
        .unwrap()
        .then(() => {
          toast.success(
            language === "en" ? "Created Successfully" : "تم الاضافة بنجاح"
          );
          navigate("/siteContent");
        })
        .catch((error) => {
          const message =
            language === "en" ? error?.data?.error_en : error?.data?.error_ar;
          toast.error(message);
        });
    },
  });

  useEffect(() => {
    if (isSuccess) {
      setDescriptionValues({
        ...descriptionValues,
        description_ar: data?.data?.description_ar,
        description_en: data?.data?.description_en,
      });
      setFieldValue("title_en", data?.data?.title_en);
      setFieldValue("title_ar", data?.data?.title_ar);
      setFieldValue("description_en", data?.data?.description_en);
      setFieldValue("description_ar", data?.data?.description_ar);
      setFieldValue("image", data?.data?.image);
      setFieldValue("title_meta", data?.data?.metaDataId?.title_meta || "");
      setFieldValue("desc_meta", data?.data?.metaDataId?.desc_meta || "");
    }
  }, [isSuccess]);
  if (categoryLoading) {
    return (
      <Box
        sx={{
          width: "100%",
          height: "100%",
          display: "grid",
          placeItems: "center",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (!allowed({ page: "siteContent", role })) return <h1>Not Allowed</h1>;

  return (
    <div
      style={{
        backgroundColor: customColors.bg,
        padding: "1rem",
        borderRadius: "10px",
      }}
    >
      <form onSubmit={handleSubmit}>
        <Grid container spacing={4}>
          <Grid item xs={12} lg={type === "aboutus" ? 6 : 12}>
            <Box mt={"25px"}>
              <InputText
                label={
                  language === "en" ? "english name" : "الاسم باللغة الانجليزية"
                }
                name="title_en"
                error={errors.title_en}
                value={values.title_en}
                touched={touched.title_en}
                handleChange={handleChange}
                handleBlur={handleBlur}
              />
            </Box>
            <Box mt={"25px"}>
              <InputText
                label={
                  language === "en" ? "arabic name" : "الاسم باللغة العربية"
                }
                name="title_ar"
                error={errors.title_ar}
                value={values.title_ar}
                touched={touched.title_ar}
                handleChange={handleChange}
                handleBlur={handleBlur}
              />
            </Box>
            <Box mt={"25px"}>
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
                value={descriptionValues.description_en}
                touched={touched.description_en}
                handleChange={(value) => {
                  setFieldValue("description_en", value);
                }}
                handleBlur={(v) => {
                  setFieldTouched("description_en", true);
                }}
                edit={id ? true : false}
              />
            </Box>
            <Box mt={"25px"}>
              <Stack
                sx={{
                  margin: "10px 0px",
                  "line-height": "1.5",
                  "letter-spacing": "0.00938em",
                  "font-weight": "700",
                  "font-size": "15px",
                }}
              >
                {language === "en" ? "arabic description" : "الوصف بالعربي"}
              </Stack>
              <DraftEditor
                field="description_ar"
                error={errors.description_ar}
                value={descriptionValues.description_ar}
                touched={touched.description_ar}
                handleChange={(value) => {
                  setFieldValue("description_ar", value);
                }}
                handleBlur={(v) => {
                  setFieldTouched("description_ar", true);
                }}
                edit={id ? true : false}
              />
              {errors.description_ar && touched.description_ar ? (
                <Typography
                  sx={{
                    color: customColors.dangerous,
                  }}
                >
                  {language === "en" ? "Required" : "مطلوب"}
                </Typography>
              ) : undefined}
            </Box>
            <Box mt={"25px"}>
              <MetaAccordions
                metaTitle={values.title_meta}
                metaDesc={values.desc_meta}
                setFieldValue={setFieldValue}
                isEdit={id ? true : false}
              />
            </Box>
          </Grid>
          {type === "aboutus" && (
            <Grid
              item
              xs={12}
              lg={6}
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                flexDirection: "column",
                aspectRatio: "1/1",
              }}
            >
              {touched.image && errors.image && (
                <Typography variant="h4" sx={{ color: "#C75050" }}>
                  {errors.image}
                </Typography>
              )}
              <UploadImage
                image={
                  values.image ? `${imageBaseUrl}${values.image}` : values.image
                }
                onChange={(image) => {
                  setFieldValue("image", image);
                }}
              />
            </Grid>
          )}
        </Grid>

        <Button
          type="submit"
          variant="contained"
          sx={{
            width: "60%",
            display: "block",
            bgcolor: "#00D5C5",
            color: "#fff",
            alignSelf: "center",
            p: "0.5rem 2rem",
            mt: "2rem",
            mx: "auto",
            fontSize: "1rem",
            fontWeight: "bold",
            "&:hover": { bgcolor: "#00D5C5" },
          }}
          disabled={isLoading || updateIsLoading}
        >
          {id
            ? language === "en"
              ? "Edit"
              : "تعديل"
            : language === "en"
            ? "Add"
            : "اضافة"}
        </Button>
      </form>
    </div>
  );
}

export default PoliciesOperations;
