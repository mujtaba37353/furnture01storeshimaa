import {
  Button,
  Container,
  FormControl,
  Input,
  InputAdornment,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import EmailIcon from "@mui/icons-material/Email";
import HttpsIcon from "@mui/icons-material/Https";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { useState } from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";
import { useSignInMutation } from "../api/auth.api";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import Loader from "../Components/globals/Loader";
const SignIn = () => {
  const [signIn, { isLoading }] = useSignInMutation();
  const [show, setShow] = useState(false);
  const {
    i18n: { language },
  } = useTranslation();
  const nav = useNavigate();
  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: yup.object({
      email: yup.string().email().required(),
      password: yup.string().required(),
    }),
    onSubmit: (values) => {
      const userData = {
        email: values.email,
        password: values.password,
        registrationType: "email",
      };
      signIn(userData)
        .unwrap()
        .then((res) => {
          if (res.data.role !== "user") {
            localStorage.setItem("token", res.token);
            toast.success(res[`success_${language}`]);
            nav("/");
          } else {
            toast.error(
              language === "en"
                ? "please login by admin account ony"
                : "يرجى تسجيل الدخول عن طريق حساب المشرف"
            );
          }
        })
        .catch((err) => {
          if (err?.data) {
            toast.error(err.data[`error_${language}`]);
          } else {
            toast.error(
              language === "en"
                ? "Something went wrong!"
                : "حدث خطأ ما"
            );
          }
        });
    },
  });

  return (
    <Container
      sx={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        direction: "ltr",
      }}
    >
      <Paper
        elevation={7}
        sx={{
          px: { md: 7, xs: 2 },
          py: 5,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          borderRadius: 5,
        }}
      >
        <img src="/logo.png" width={100} height={100} />
        <Stack sx={{ gap: 1, mb: 5, mt: 2, alignItems: "center" }}>
          <Typography sx={{ fontSize: "1.3rem", fontWeight: "bold" }}>
            welcome in store dashboard
          </Typography>
          <Typography>welcome in store dashboard</Typography>
        </Stack>
        {/* FORM */}
        <Stack
          sx={{ gap: 1, minWidth: 330 }}
          onSubmit={formik.handleSubmit}
          component={"form"}
        >
          <FormControl variant="standard">
            <Input
              name="email"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.email}
              disableUnderline
              type="email"
              placeholder="email address"
              sx={{
                border:
                  formik.errors.email && formik.touched.email
                    ? "1px solid red"
                    : "1px solid #48e3d2",
                px: 2,
                py: 1,
                borderRadius: 2,
              }}
              startAdornment={
                <InputAdornment position="start">
                  <EmailIcon sx={{ color: "black", fontSize: "1rem" }} />
                </InputAdornment>
              }
            />
          </FormControl>
          <FormControl variant="standard">
            <Input
              name="password"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.password}
              type={show ? "text" : "password"}
              disableUnderline
              placeholder="password"
              sx={{
                border:
                  formik.errors.email && formik.touched.password
                    ? "1px solid red"
                    : "1px solid #48e3d2",
                px: 2,
                py: 1,
                borderRadius: 2,
              }}
              startAdornment={
                <InputAdornment position="start">
                  <HttpsIcon sx={{ color: "black", fontSize: "1rem" }} />
                </InputAdornment>
              }
              endAdornment={
                <InputAdornment
                  position="end"
                  sx={{
                    color: "black",
                    fontSize: "1.4rem",
                    cursor: "pointer",
                  }}
                  onClick={() => setShow((prev) => !prev)}
                >
                  {show ? <VisibilityOffIcon /> : <VisibilityIcon />}
                </InputAdornment>
              }
            />
          </FormControl>
          <Button
            type="submit"
            fullWidth
            sx={{ bgcolor: "#48e3d2 !important", color: "white", p: 1.5 }}
          >
            {isLoading ? <Loader /> : "sign in"}
          </Button>
        </Stack>
      </Paper>
    </Container>
  );
};

export default SignIn;
