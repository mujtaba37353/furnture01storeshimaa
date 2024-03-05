import { Box, FormLabel, Stack, TextField, Typography, useTheme } from "@mui/material";
import { useFormik } from "formik";
import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

const SupportForm = ({ data, setDisplay }) => {
  const { customColors ,colors} = useTheme();
  const [_, { language: lang }] = useTranslation();
  useEffect(() => {
    formik.setValues(data);
  }, [data]);
  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      phone: "",
      message: "",
    },
  });

  return (
    <Box
      sx={{
        width: { xs: "100%", sm: "80%",},
        p: 2,
        mt: 5,
        
      }}
    >
      <Stack direction={{ xs: "column", sm: "row" }} gap={2}>
        {/* name */}
        <Box width={{ xs: "100%", sm: "50%" }}>
          <FormLabel
          
            sx={{
              fontWeight: "bold",
              fontSize: "20px",
              color:customColors.text,
              
            }}
          >
            {lang === "en" ? "Name" : "الاسم"}
          </FormLabel>
          <Box sx={{ mt: 2 }} />

          <Typography
            sx={{
              border: `2px solid ${customColors.inputField}`,
              p: 2,
              borderRadius: "5px",
              color:customColors.text
            }}
          >
            {data.name}
          </Typography>
        </Box>

        {/* email */}
        <Box width={{ xs: "100%", sm: "50%" }}>
          <FormLabel
          
            sx={{
              fontWeight: "bold",
              fontSize: "20px",
              color:customColors.text
            }}
          >
            {lang === "en" ? "Email" : "البريد الالكتروني"}
          </FormLabel>
          <Box sx={{ mt: 2 }} />

          <Typography
            sx={{
              border: `2px solid ${customColors.inputField}`,
              p: 2,
              color:customColors.text,
              borderRadius: "5px",
            }}
          >
            {data.email}
          </Typography>
        </Box>
      </Stack>
       {/* name */}
       <Box my={3}>
          <FormLabel
          
            sx={{
              fontWeight: "bold",
              fontSize: "20px",
              color:customColors.text
            }}
          >
            {lang === "en" ? "Phone Number" : "رقم الجوال"}
          </FormLabel>
          <Box sx={{ mt: 2 }} />

          <Typography
            sx={{
              border: `2px solid ${customColors.inputField}`,
              p: 2,
              color:customColors.text,
              borderRadius: "5px",
            }}
          >
            {data.phone}
          </Typography>
        </Box>
         {/* name */}
         <Box >
          <FormLabel
          
            sx={{
              fontWeight: "bold",
              fontSize: "20px",
              color:customColors.text
            }}
          >
            {lang === "en" ? "Message" : "الرسالة"}
          </FormLabel>
          <Box sx={{ mt: 2 }} />

          <Typography
            minHeight={"20vh"}
            sx={{
              border: `2px solid ${customColors.inputField}`,
              p: 2,
              borderRadius: "5px",
              color:customColors.text
            }}
          >
            {data.message}
          </Typography>
        </Box>
      {/* 
        <Box my={3}>
            <FormLabel
              htmlFor="phone"
              sx={{
                fontWeight: "bold",
                fontSize: "20px",
              }}
            >
              {lang === "en" ? "Phone" : "رقم الجوال"}
            </FormLabel>
            <TextField
              fullWidth
              id="phone"
              name="phone"
              value={formik.values.phone}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              sx={{
                mt: 2,
              }}
            />
            {formik.errors.phone && formik.touched.phone && (
            <Typography>
                {formik.errors.email}
            </Typography>
            )}
          </Box> */}

      {/* textarea */}
      {/* <Box>
            <FormLabel
                htmlFor="message"
                sx={{
                fontWeight: "bold",
                fontSize: "20px",
                }}
            >
                {lang === "en" ? "Message" : "الرسالة"}
            </FormLabel>
            <TextField
                fullWidth
                id="message"
                name="message"
                value={formik.values.message}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                multiline
                minRows={6}
                sx={{
                mt: 2,
              
                }}
            />
          </Box>
    */}
      <Box
        textAlign={"center"}
        mt={2}
        sx={{
          cursor: "pointer",
        }}
        onClick={() => setDisplay("flex")}
      >
        <ArrowBackIcon />
      </Box>
    </Box>
  );
};

export default SupportForm;
