import { useFormik } from "formik";
import * as Yup from "yup";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import {
  Box,
  Button,
  CircularProgress,
  Grid,
  MenuItem,
  Select,
  Typography,
} from "@mui/material";
import InputText from "../../globals/InputText";
import { useTranslation } from "react-i18next";
import {
  useCreateSectionMutation,
  useGetSectionByIdQuery,
  useUpdateSectionByIdMutation,
} from "../../../api/section.api";
import { useUploadFileMutation } from "../../../api/upload.api";
import { useEffect, useRef } from "react";
import { imageBaseUrl } from "../../../api/baseUrl";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { allowed } from "../../../helper/roles";

const UploadImage = ({ onChange, image }) => {
  const imageRef = useRef(null);
  const [uploadFile, { isLoading: isLoadingUpload }] = useUploadFileMutation();
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
        color: "#7f7f7f",
        border: "1px solid #7f7f7f",
        width: "100%",
        height: "100%",
        "&:hover": {
          bgcolor: "transparent",
          color: "#7f7f7f",
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
          aspectRatio: "1/1",
          objectFit: "contain",
        }}
      />
    </Button>
  );
};

function ContentOperation() {
  const { type } = useParams();
  const {
    i18n: { language },
  } = useTranslation();
  const [createSection, { isLoading }] = useCreateSectionMutation();
  const [updateSectionById, { isLoading: updateIsLoading }] =
    useUpdateSectionByIdMutation();
  const id = useLocation().search.split("=")[1];
  const { role } = useSelector((state) => state.user);

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
      alignment: "",
    },
    validationSchema: Yup.object({
      type: Yup.string().required(language === "en" ? "Required" : "مطلوب"),
      image: Yup.string().required(language === "en" ? "Required" : "مطلوب"),
      // horizontal or vertical
      alignment: Yup.string().when("type", {
        is: "banner",
        then: () =>
          Yup.string().required(language === "en" ? "Required" : "مطلوب"),
      }),

      title_en: Yup.string().notRequired(),
      title_ar: Yup.string().notRequired(),
      description_ar: Yup.string().notRequired(),
      description_en: Yup.string().notRequired(),
    }),
    onSubmit: (values) => {
      if (type === "slider") {
        !values.title_ar && delete values.title_ar;
        !values.title_en && delete values.title_en;
        !values.description_ar && delete values.description_ar;
        !values.description_en && delete values.description_en;
        delete values.alignment;
      }
      if (type === "banner") {
        delete values.title_ar;
        delete values.title_en;
        delete values.description_ar;
        delete values.description_en;
      }
      if (id) {
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
      setFieldValue("title_en", data?.data?.title_en);
      setFieldValue("title_ar", data?.data?.title_ar);
      setFieldValue("description_en", data?.data?.description_en);
      setFieldValue("description_ar", data?.data?.description_ar);
      setFieldValue("image", data?.data?.image);
      setFieldValue("alignment", data?.data?.alignment);
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

  if (!allowed({ page: "siteContent", role })) return null;

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={4}>
          <Grid item xs={12} lg={6}>
            {type === "slider" && (
              <>
                <Box mt={"25px"}>
                  <InputText
                    label={
                      language === "en"
                        ? "english name"
                        : "الاسم باللغة الانجليزية"
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
                  <InputText
                    label={
                      language === "en"
                        ? "english description"
                        : "الوصف بالانجليزية"
                    }
                    name="description_en"
                    error={errors.description_en}
                    value={values.description_en}
                    touched={touched.description_en}
                    handleChange={handleChange}
                    handleBlur={handleBlur}
                  />
                </Box>
                <Box mt={"25px"}>
                  <InputText
                    label={
                      language === "en"
                        ? "arabic description"
                        : "الوصف بالعربية"
                    }
                    name="description_ar"
                    error={errors.description_ar}
                    value={values.description_ar}
                    touched={touched.description_ar}
                    handleChange={handleChange}
                    handleBlur={handleBlur}
                  />
                </Box>
              </>
            )}
            {type === "banner" && (
              <>
                <Box mt={"25px"}>
                  <Select
                    id="demo-simple-select"
                    value={values.alignment}
                    // label="alignment"
                    name="alignment"
                    onChange={handleChange}
                    sx={{
                      width: "100%",
                    }}
                    onBlur={handleBlur}
                    error={touched.alignment && errors.alignment}
                    helperText={
                      touched.alignment && errors.alignment
                        ? errors.alignment
                        : ""
                    }
                  >
                    <MenuItem value={"horizontal"}> horizontal</MenuItem>
                    <MenuItem value={"vertical"}> vertical</MenuItem>
                  </Select>
                </Box>
              </>
            )}
          </Grid>
          <Grid
            item
            xs={12}
            lg={6}
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
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

export default ContentOperation;
