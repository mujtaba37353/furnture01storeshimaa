import { useGetMeQuery, useUpdateLoggedUserMutation } from "../../api/user.api";
import {
  Avatar,
  Box,
  Button,
  CircularProgress,
  Container,
  Grid,
  IconButton,
  Paper,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import * as Yup from "yup";
import { useTranslation } from "react-i18next";
import { imageBaseUrl } from "../../api/baseUrl";
import Breadcrumbs from "../../Components/Breadcrumbs";
import { useFormik } from "formik";
import { useUploadFileMutation } from "../../api/upload.api";
import { toast } from "react-toastify";
import CameraAltOutlinedIcon from "@mui/icons-material/CameraAltOutlined";
import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import MarketerInformation from "./MarketerInformation";
const GRID_SPACING = 4;
const ProfileImage = ({ image, onChange }) => {
  const [uploadFile, { isLoading }] = useUploadFileMutation();
  const { customColors } = useTheme();
  const imageRef = useRef();
  const {
    i18n: { language },
  } = useTranslation();
  const handleUpload = (e) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append("file", file);
    uploadFile(formData)
      .unwrap()
      .then((res) => {
        onChange(res.file);
      })
      .catch((err) => {
        const message =
          language === "en" ? err.data.error_en : err.data.error_ar;
        toast.error(message);
      });
  };
  return (
    <Box width={"fit-content"} position={"relative"}>
      {isLoading && (
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            zIndex: 1,
            borderRadius: "50%",
            display: "grid",
            placeItems: "center",
          }}
        >
          <CircularProgress
            sx={{
              color: customColors.main,
            }}
          />
        </Box>
      )}
      <input
        type="file"
        onChange={handleUpload}
        ref={imageRef}
        style={{ display: "none" }}
      />
      <Avatar
        src={`${imageBaseUrl}${image}`}
        sx={{ width: 200, height: 200 }}
      />
      <IconButton
        sx={{
          position: "absolute",
          bottom: 0,
          backgroundColor: "gray",
          color: "white",
          minWidth: 0,
          width: 40,
          height: 40,
          transform:
            language === "en"
              ? "translate(200%, 20px)"
              : "translate(-200%, 20px)",
        }}
        onClick={() => imageRef.current.click()}
      >
        <CameraAltOutlinedIcon />
      </IconButton>
    </Box>
  );
};

const ProfileInput = ({ label, type, formik, name, disabled }) => {
  const { colors, customColors } = useTheme();
  return (
    <Stack>
      <Box component={"label"} htmlFor={label} sx={{ pb: 1 }}>
        {label}
      </Box>
      <Box
        component={"input"}
        sx={{
          p: "0.5rem 1rem",
          border: `1px solid ${customColors.main}`,
          color: customColors.text,
          bgcolor: "transparent",
          outline: "none",
          borderRadius: 1.5,
          "&:focus": { borderColor: customColors.main },
        }}
        id={label}
        name={name}
        type={type}
        placeholder={label}
        value={formik.values[name]}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        disabled={disabled}
      />
      {formik.touched[name] && formik.errors[name] ? (
        <Typography color={colors.dangerous}>{formik.errors[name]}</Typography>
      ) : null}
    </Stack>
  );
};

const ProfileLoading = () => {
  const { customColors } = useTheme();
  return (
    <Box height={"60vh"} display={"grid"} sx={{ placeItems: "center" }}>
      <CircularProgress sx={{ color: customColors.main }} />
    </Box>
  );
};

const ProfileError = ({ error }) => {
  const { colors } = useTheme();
  const {
    i18n: { language },
  } = useTranslation();
  return (
    <Box height={"60vh"} display={"grid"} sx={{ placeItems: "center" }}>
      {error && error?.data ? (
        <Typography variant={"h5"} color={colors.dangerous}>
          {language === "en" ? error?.data[`error_en`] : error?.data[`error_ar`]}
        </Typography>
      ) : (
        <Typography variant={"h5"} color={colors.dangerous}>
          {language == "en"
            ? "Some Thing Went Wrong, we Are Working on It And Will Fix it Shotly"
            : "من دواعي الأسف، حدث خطأ ما. نحن نعمل على إصلاحه وسيكون جاهزًا خلال وقت قصير."}
        </Typography>
      )}
    </Box>
  );
};

function ProfilePage() {
  const { customColors } = useTheme();
  const navigate = useNavigate();
  const [updateMe, { isLoading: updateLoading }] =
    useUpdateLoggedUserMutation();
  const {
    i18n: { language },
  } = useTranslation();
  const {
    data: profile,
    isSuccess,
    isLoading,
    isError,
    error,
  } = useGetMeQuery("");
  const handleSubmit = (values) => {
    updateMe(values)
      .unwrap()
      .then((res) => {
        const message = language === "en" ? res.success_en : res.success_ar;
        toast.success(message);
      })
      .catch((err) => {
        const message =
          language === "en" ? err.data.error_en : err.data.error_ar;
        toast.error(message);
      });
  };

  const required = language === "en" ? "Required" : "مطلوب";

  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      phone: "",
      image: "",
      password: "",
    },
    validationSchema: Yup.object({
      name: Yup.string().required(required),
      email: Yup.string().email().notRequired(),
      phone: Yup.number(),
      image: Yup.string().notRequired(),
      password: Yup.string().min(6).notRequired(),
    }),
    onSubmit: handleSubmit,
  });

  useEffect(() => {
    if (isSuccess) {
      const { name, email, phone, image } = profile?.data;
      formik.setValues({ name, email, phone, image });
    }
  }, [isSuccess]);

  if (isLoading) {
    return <ProfileLoading />;
  }
  if (isError) {
    return <ProfileError error={error} />;
  }
  return (
    <Box
      p={{
        xs: 0,
        md: GRID_SPACING,
      }}
    >
      <Breadcrumbs page_ar={"الملف الشخصي"} page_en={"Profile"} />
      <Paper
        sx={{
          py: {
            xs: 2,
            md: GRID_SPACING,
          },
          px: {
            xs: 0,
            md: GRID_SPACING,
          },
          my: GRID_SPACING,
          bgcolor: customColors.container,
        }}
      >
        <Container component={"form"} onSubmit={formik.handleSubmit}>
          <Grid
            container
            spacing={{
              xs: 0,
              md: GRID_SPACING,
            }}
          >
            <Grid item xs={12} display={"grid"} sx={{ placeItems: "center" }}>
              <ProfileImage
                image={formik.values.image}
                onChange={(value) => formik.setFieldValue("image", value)}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <ProfileInput
                label={language === "en" ? "User Name" : "اسم المستخدم"}
                type={"text"}
                formik={formik}
                name={"name"}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <ProfileInput
                label={language === "en" ? "Phone Number" : "رقم الجوال"}
                type={"text"}
                formik={formik}
                // disabled
                name={"phone"}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <ProfileInput
                label={
                  language === "en" ? "Email Address" : "البريد الالكتروني"
                }
                type={"email"}
                formik={formik}
                name={"email"}
                disabled
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <ProfileInput
                label={language === "en" ? "Password" : "كلمة المرور"}
                type={"password"}
                formik={formik}
                name={"password"}
              />
            </Grid>
            <Grid
              item
              xs={12}
              sx={{
                display: "flex",
                justifyContent: "center",
                gap: GRID_SPACING,
                mt: GRID_SPACING * 2,
              }}
            >
              <Button
                variant={"contained"}
                type="submit"
                color={"primary"}
                disabled={updateLoading}
                sx={{
                  backgroundColor: customColors.main,
                  "&:hover": { backgroundColor: customColors.main },
                  minWidth: 150,
                  color: "#fff",
                  p: `${2 / 4}rem ${2 / 3}rem`,
                }}
              >
                {language === "en" ? "Save Changes" : "حفظ التغييرات"}
              </Button>
              <Button
                variant="outlined"
                onClick={() => navigate(-1)}
                sx={{
                  bgcolor: "transparent",
                  color: customColors.main,
                  borderColor: customColors.main,
                  minWidth: 150,
                  p: `${2 / 4}rem ${2 / 3}rem`,
                  "&:hover": {
                    backgroundColor: "transparent",
                    color: customColors.main,
                    borderColor: customColors.main,
                  },
                }}
              >
                {language === "en" ? "Cancel" : "الغاء"}
              </Button>
            </Grid>
          </Grid>
        </Container>
      </Paper>
      {profile?.data?.role === "marketer" && (
        <MarketerInformation
          lang={language}
          points={profile?.data?.pointsMarketer}
          totalCommission={profile?.data?.totalCommission}
          customColors={customColors}
        />
      )}
    </Box>
  );
}

export default ProfilePage;
