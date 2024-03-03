import { useTheme } from "@emotion/react";
import {
  Box,
  Button,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import UploadFile from "../../Components/globals/UploadFile";
import { useFormik } from "formik";
import { string, object } from "yup";
import QuillInput from "../../Components/globals/QuillInput";
import { useGetBlogByIdQuery, useUpdateBlogMutation } from "../../api/blogsApi";
import { useUploadImageMutation } from "../../api/upload.api";
import { toast } from "react-toastify";
import DraftEditor from "../../Components/globals/draftEditor/DraftEditor";

const EditBlogPage = () => {
  const { customColors, colors } = useTheme();
  const { blogId } = useParams();
  const [_, { language }] = useTranslation();
  const [file, setFile] = useState();
  const { data: blogData, error: blogError } = useGetBlogByIdQuery(blogId);
  const [uploadImage] = useUploadImageMutation();
  const [updateBlog] = useUpdateBlogMutation();
  const navigate = useNavigate();
  const formik = useFormik({
    initialValues: {
      image: "",
      title: "",
      description: "",
    },
    validationSchema: object({
      image: string().required(),
      title: string().required(),
      description: string().required(),
    }),
    onSubmit: (values) => {
      if (file) {
        const imageFormData = new FormData();
        imageFormData.append("image", file);
        uploadImage(imageFormData)
          .unwrap()
          .then((res) => {
            handleUpdateDate({ ...values, image: res.image });
          });
      }
      handleUpdateDate(values);
    },
  });
  const handleUpdateDate = (payload) => {
    updateBlog({ id: blogId, payload })
      .unwrap()
      .then((res) => {
        toast.success(res[`success_${language}`]);
        navigate("/blogs");
      })
      .catch((err) => {
        toast.error(err.data[`error_${language}`]);
      });
  };
  useEffect(() => {
    if (blogData && !blogError) {
      setDescriptionValues({
        ...descriptionValues,
        description: blogData?.data?.description,
      });
      formik.setValues({
        image: blogData.data.image,
        title: blogData.data.title,
        description: blogData.data.description,
      });
    }
  }, [blogData]);

  const {
    values,
    errors,
    touched,
    handleChange,
    setFieldValue,
    handleBlur,
    handleSubmit,
  } = formik;
  const handleUploadFile = (e) => {
    const uploadedFile = e.target.files[0];
    if (uploadedFile) {
      setFile(uploadedFile);
      setFieldValue("image", uploadedFile.name);
    }
  };
  const [descriptionValues, setDescriptionValues] = useState({
    description: "",
  });
  return (
    <Box
      sx={{
        // bgcolor: customColors.bg,
        py: "30px",
        px: "20px",
        borderRadius: "1%",
        // width: 0.96,
        direction: language === "en" ? "ltr" : "rtl",
      }}
    >
      <Typography variant="h4" mb={"10px"}>
        {language === "en" ? "Blogs" : "المدونات"}
      </Typography>
      <Stack
        direction={"row"}
        justifyContent={"space-between"}
        alignItems={"center"}
        mb={"50px"}
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
            {language === "en" ? "blogs" : "المدونات"}
          </Typography>
        </Stack>
      </Stack>
      <Paper
        component={"form"}
        onSubmit={handleSubmit}
        sx={{
          width: 0.99,
          mx: "auto",
          borderRadius: 3,
          p: 6,
        }}
      >
        <UploadFile
          error={errors.image}
          touched={touched.image}
          value={values.image}
          file={file}
          handleUploadFile={handleUploadFile}
          extraStyle={{
            height: 400,
            width: 600,
            mx: "auto",
          }}
        />
        <Box>
          <Typography sx={{ color: customColors.label, mb: "4px" }}>
            {language === "en" ? "Title" : "العنوان"}
          </Typography>
          <TextField
            name="title"
            type="text"
            onChange={handleChange}
            onBlur={handleBlur}
            value={values.title}
            helperText={touched.title && errors.title ? errors.title : ""}
            error={touched.title && errors.title}
            variant="outlined"
            sx={{
              width: 1,
              "&:hover": {
                fieldset: { borderColor: customColors.inputField },
              },
              fieldset: {
                borderColor: customColors.inputField,
                direction: "rtl",
              },
            }}
          />
        </Box>
        <Box mt={"15px"}>
          {/* <QuillInput
            label={language === 'en' ? 'Description' : 'الوصف'}
            field='description'
            error={errors.description}
            value={values.description}
            touched={touched.description}
            handleChange={value => {
              setFieldValue('description', value)
            }}
          /> */}
          <Stack
            sx={{
              margin: "10px 0px",
              "line-height": "1.5",
              "letter-spacing": "0.00938em",
              "font-weight": "700",
              "font-size": "15px",
            }}
          >
            {language === "en" ? "Description" : "الوصف"}
          </Stack>

          <DraftEditor
            field="description"
            error={errors.description}
            value={descriptionValues?.description}
            touched={touched.description}
            handleChange={(value) => {
              setFieldValue("description", value);
            }}
            edit
          />
          {errors.description && touched.description ? (
            <Typography
              sx={{
                color: customColors.dangerous,
              }}
            >
              {language === "en" ? "required" : "مطلوب"}
            </Typography>
          ) : undefined}
        </Box>
        <Stack
          direction={"row"}
          justifyContent={"center"}
          alignItems={"center"}
          gap="10px"
          mt={"20px"}
        >
          <Button
            type="submit"
            sx={{
              bgcolor: "#00D5C5 !important",
              color: "#fff",
            }}
          >
            {language === "en" ? "Update" : "تحديث"}
          </Button>
          <Button
            onClick={() => navigate("/blogs")}
            type="button"
            variant="outlined"
            sx={{
              borderColor: "#00D5C5 !important",
              color: "#00D5C5",
            }}
          >
            {language === "en" ? "Cancel" : "إلغاء"}
          </Button>
        </Stack>
      </Paper>
    </Box>
  );
};

export default EditBlogPage;
