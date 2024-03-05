import { Typography } from "@mui/joy";
import { Box, Button, FormLabel, InputBase, Stack } from "@mui/material";
import { useFormik } from "formik";
import React from "react";
import { useTranslation } from "react-i18next";
import * as yup from "yup";
const AddUser = ({ setOpen, handelAddUser }) => {
  const [_, { language: lang }] = useTranslation();
  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      phone: "",
    },
    validationSchema: yup.object({
      name: yup.string().required(lang === "en" ? "Required" : "مطلوب"),
      email: yup
        .string()
        .email(lang === "en" ? "Invalid email" : "بريد الكتروني غير صالح")
        .required(lang === "en" ? "Required" : "مطلوب"),
      phone: yup.number().required(lang === "en" ? "Required" : "مطلوب"),
    }),
    onSubmit: (values) => {
      const newUser = {
        number: Math.floor(Math.random() * 100) + 1,
        name: values.name,
        email: values.email,
        phone: values.phone,
        total: Math.floor(Math.random() * 1000) + 602,
        joinDate: "12/5/2021",
      };

      
      handelAddUser(newUser);
      setOpen(false);
    },
  });
  return (
    <Box p={1}>
      <form onSubmit={formik.handleSubmit}>
        <Stack direction={{ xs: "column", md: "row" }} gap={2} mt={2}>
          <Box width={{ xs: "100%", md: "50%" }}>
            <FormLabel
              htmlFor="name"
              sx={{
                fontWeight: "bold",
              }}
            >
              {lang === "en" ? "Name" : "الاسم"}
            </FormLabel>
            <InputBase
              name="name"
              id="name"
              value={formik.values.name}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              sx={{
                border: "1px solid #ddd",
                borderRadius: "5px",
                padding: "5px",
                width: "100%",
                my: "10px",
                fontSize: { xs: "14px", md: "15px" },
              }}
            />
            {formik.touched.name && formik.errors.name && (
              <Box
                sx={{
                  color: "red",
                  fontSize: "12px",
                  fontWeight: "bold",
                }}
              >
                {formik.errors.name}
              </Box>
            )}
          </Box>

          <Box width={{ xs: "100%", md: "50%" }}>
            <FormLabel
              htmlFor="email"
              sx={{
                fontWeight: "bold",
              }}
            >
              {lang === "en" ? "Email" : "البريد الالكتروني"}
            </FormLabel>
            <InputBase
              name="email"
              id="email"
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              sx={{
                border: "1px solid #ddd",
                borderRadius: "5px",
                padding: "5px",
                width: "100%",
                my: "10px",
                fontSize: { xs: "14px", md: "15px" },
              }}
            />
            {formik.touched.email && formik.errors.email && (
              <Box
                sx={{
                  color: "red",
                  fontSize: "12px",
                  fontWeight: "bold",
                }}
              >
                {formik.errors.email}
              </Box>
            )}
          </Box>
        </Stack>

        <Box my={2}>
          <FormLabel
            htmlFor="phone"
            sx={{
              fontWeight: "bold",
            }}
          >
            {lang === "en" ? "Phone" : "رقم الجوال"}
          </FormLabel>
          <InputBase
            name="phone"
            id="phone"
            value={formik.values.phone}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            sx={{
              border: "1px solid #ddd",
              borderRadius: "5px",
              padding: "5px",
              width: "100%",
              my: "10px",
              fontSize: { xs: "14px", md: "15px" },
            }}
          />
          {formik.touched.phone && formik.errors.phone && (
            <Box
              sx={{
                color: "red",
                fontSize: "12px",
                fontWeight: "bold",
              }}
            >
              {formik.errors.phone}
            </Box>
          )}
        </Box>
        <Stack
          direction={"row"}
          sx={{
            justifyContent: "center",
            alignItems: "center",
            gap: "15px",
          }}
        >
          <Button
            type="submit"
            sx={{
              backgroundColor: "#00D5C5 !important",
              color: "#fff",
              textTransform: "capitalize",
              padding: "5px 40px",
            }}
          >
            <Typography
              sx={{
                fontSize: { xs: "15px", md: "18px" },
                fontWeight: "bold",
              }}
            >
              {lang === "en" ? "Save" : "حفظ"}
            </Typography>
          </Button>
          <Button
            sx={{
              border: "1px solid #00D5C5",
              textTransform: "capitalize",
              padding: "5px 40px",
              color: "#00D5C5",
            }}
            onClick={() => setOpen(false)}
          >
            <Typography
              sx={{
                fontSize: { xs: "15px", md: "18px" },
                fontWeight: "bold",
              }}
            >
              {lang === "en" ? "Cancel" : "إلغاء"}
            </Typography>
          </Button>
        </Stack>
      </form>
    </Box>
  );
};

export default AddUser;
