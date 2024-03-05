import { useTheme } from "@emotion/react";
import {
  Box,
  Button,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import UploadFile from "../../Components/globals/UploadFile";
import { useFormik } from "formik";
import { string, object } from "yup";
import QuillInput from "../../Components/globals/QuillInput";
import { useUploadImageMutation } from "../../api/upload.api";
import { useCreateBlogMutation } from "../../api/blogsApi";
import { toast } from "react-toastify";
import DraftEditor from "../../Components/globals/draftEditor/DraftEditor";

const AddBlogPage = () => {
  const { customColors, colors } = useTheme();
  const [, { language }] = useTranslation();
  const [file, setFile] = useState();
  const navigate = useNavigate();
  const [uploadImage] = useUploadImageMutation();
  const [createBlog] = useCreateBlogMutation();
  const formik = useFormik({
    initialValues: {
      image: "",
      title: "",
      description: "",
    },
    validationSchema: object({
      image: string().required(
        language === "en" ? "Image is required" : "الصورة مطلوبة"
      ),
      title: string().required(
        language === "en" ? "Title is required" : "العنوان مطلوب"
      ),
      description: string().required(
        language === "en" ? "Description is required" : "الوصف مطلوب"
      ),
    }),
    onSubmit: (values) => {
      const imageFormData = new FormData();
      imageFormData.append("image", file);
      uploadImage(imageFormData)
        .unwrap()
        .then((res) => {
          createBlog({ ...values, image: res.image })
            .unwrap()
            .then((res) => {
              toast.success(res[`success_${language}`]);
              navigate("/blogs");
            })
            .catch((err) => {
              toast.error(err.data[`error_${language}`]);
            });
        });
    },
  });
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
  return (
    <Box
      sx={{
        py: "30px",
        px: "20px",
        borderRadius: "1%",
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
          mx: "auto",
          borderRadius: 3,
          py: 6,
          bgcolor: customColors.card,
        }}
      >
        <Box sx={{ width: "90%", mx: "auto" }}>
          <UploadFile
            error={errors.image}
            touched={touched.image}
            value={values.image}
            file={file}
            handleUploadFile={handleUploadFile}
            extraStyle={{
              height: 400,
              mx: "auto",
            }}
          />
        </Box>

        <Box
          sx={{
            width: { xs: "90%", sm: "90%", md: "90%", lg: "82%", xl: "83%" },
            mx: "auto",
          }}
        >
          <Typography sx={{ mb: "4px" }}>
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
        <Box
          sx={{
            width: { xs: "90%", sm: "90%", md: "90%", lg: "82%", xl: "83%" },
            mx: "auto",
            mt: "25px",
          }}
        >
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
            value={values.description}
            touched={touched.description}
            handleChange={(value) => {
              setFieldValue("description", value);
            }}
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
            {language === "en" ? "Add" : "إضافة"}
          </Button>
          <Button
            type="button"
            variant="outlined"
            sx={{
              borderColor: "#00D5C5 !important",
              color: "#00D5C5",
            }}
            onClick={() => navigate(-1)}
          >
            {language === "en" ? "Cancel" : "إلغاء"}
          </Button>
        </Stack>
      </Paper>
    </Box>
  );
};

export default AddBlogPage;
