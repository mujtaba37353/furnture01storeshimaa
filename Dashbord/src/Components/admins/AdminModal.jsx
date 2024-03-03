import { useTheme } from "@emotion/react";
import {
  FormControl,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import { useFormik } from "formik";
import * as React from "react";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import * as Yup from "yup";
import { useCreateAdminMutation } from "../../api/user.api";

function AdminModal({ open, setOpen }) {
  const [addAdmin, { isLoading }] = useCreateAdminMutation();
  const { colors, customColors } = useTheme();

  const {
    i18n: { language },
  } = useTranslation();

  const handleClose = () => {
    setOpen(false);
  };
  const checkPhone =
    language === "en" ? "must be phone number" : "يجب ان يكون رقم جوال";
  const checkPassword =
    language === "en"
      ? "password must be at least 6 characters"
      : "يجب أن تكون كلمة المرور 6 أحرف على الأقل";

  const {
    handleSubmit,
    errors,
    values,
    touched,
    handleChange,
    resetForm,
    handleBlur,
  } = useFormik({
    initialValues: {
      name: "",
      email: "",
      phone: "",
      password: "",
      role: "",
    },
    validationSchema: Yup.object({
      name: Yup.string().required(language === "en" ? "Required" : "مطلوب"),
      email: Yup.string()
        .required(language === "en" ? "Required" : "مطلوب")
        .email(),
      phone: Yup.string()
        .matches(/^[+-]?\d+$/, checkPhone)
        .required(language === "en" ? "Required" : "مطلوب"),
      password: Yup.string()
        .min(6, checkPassword)
        .required(language === "en" ? "Required" : "مطلوب"),
      role: Yup.string().required(language === "en" ? "Required" : "مطلوب"),
    }),
    onSubmit: (values) => {
      addAdmin(values)
        .unwrap()
        .then((res) => {
          handleClose();
          resetForm();
          toast.success(
            language === "en" ? "Created Successfully" : "تم الاضافة بنجاح"
          );
        })
        .catch((error) => {
          let message =
            language === "en" ? error?.data?.error_en : error?.data?.error_ar;
          if (message === '"email" must be a valid email')
            message =
              language === "en"
                ? "must be a valid email"
                : "يجب أن يكون بريدًا إلكترونيًا صالحًا";
          toast.error(message);
        });
    },
  });
  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      PaperProps={{
        sx: {
          width: "100%",
          maxWidth: "720px!important",
          py: "40px",
          px: "30px",
          borderRadius: "10px",
        },
      }}
    >
      <form onSubmit={handleSubmit}>
        <FormControl sx={{ width: "100%", gap: 3 }}>
          <Stack>
            <Typography sx={{ color: customColors.label, mb: "4px" }}>
              {language === "en" ? "Name" : "الاسم"}
            </Typography>
            <TextField
              name="name"
              type="text"
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.name}
              helperText={touched.name && errors.name ? errors.name : ""}
              error={touched.name && errors.name}
              variant="outlined"
              sx={{
                "&:hover": {
                  fieldset: { borderColor: customColors.inputField },
                },
                fieldset: { borderColor: customColors.inputField },
              }}
            />
          </Stack>
          <Stack>
            <Typography sx={{ color: customColors.label, mb: "4px" }}>
              {language === "en" ? "Email" : "البريد الالكتروني"}
            </Typography>
            <TextField
              name="email"
              onChange={handleChange}
              onBlur={handleBlur}
              type="email"
              helperText={touched.email && errors.email ? errors.email : ""}
              error={touched.email && errors.email}
              value={values.email}
              variant="outlined"
              sx={{
                "&:hover": {
                  fieldset: { borderColor: customColors.inputField },
                },
                fieldset: { borderColor: customColors.inputField },
              }}
            />
          </Stack>
          <Stack>
            <Typography sx={{ color: customColors.label, mb: "4px" }}>
              {language === "en" ? "Phone" : "رقم الجوال"}
            </Typography>
            <TextField
              name="phone"
              type="text"
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.phone}
              helperText={touched.phone && errors.phone ? errors.phone : ""}
              error={touched.phone && errors.phone}
              variant="outlined"
              sx={{
                "&:hover": {
                  fieldset: { borderColor: customColors.inputField },
                },
                fieldset: { borderColor: customColors.inputField },
              }}
            />
          </Stack>
          <Stack>
            <Typography sx={{ color: customColors.label, mb: "4px" }}>
              {language === "en" ? "Password" : "كلمة المرور"}
            </Typography>
            <TextField
              name="password"
              type="password"
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.password}
              helperText={
                touched.password && errors.password ? errors.password : ""
              }
              error={touched.password && errors.password}
              variant="outlined"
              sx={{
                "&:hover": {
                  fieldset: { borderColor: customColors.inputField },
                },
                fieldset: { borderColor: customColors.inputField },
              }}
            />
          </Stack>
          <Stack>
            <Typography sx={{ color: customColors.label, mb: "4px" }}>
              {language === "en" ? "Role" : "نوع المدير"}
            </Typography>
            <Select
              id="demo-simple-select"
              value={values.role}
              // label="Role"
              name="role"
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.role && errors.role}
              helperText={touched.role && errors.role ? errors.role : ""}
              sx={{
                "&:hover": {
                  fieldset: { borderColor: customColors.inputField },
                },
                fieldset: { borderColor: customColors.inputField },
              }}
            >
              <MenuItem value={"adminA"}>
                {language === "en" ? "Admin A" : "مدير عام"}
              </MenuItem>
              <MenuItem value={"adminB"}>
                {language === "en" ? "Admin B" : "مدير"}
              </MenuItem>
              <MenuItem value={"adminC"}>
                {language === "en" ? "Admin C" : "محاسب"}
              </MenuItem>
              <MenuItem value={"subAdmin"}>
                {language === "en" ? "Sub Admin" : "مسؤول خدمة العملاء"}
              </MenuItem>
            </Select>
          </Stack>
        </FormControl>

        <Stack
          sx={{
            width: "100%",
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            mt: "20px",
            gap: 2,
          }}
        >
          <Button
            variant="contained"
            type="submit"
            sx={{
              bgcolor: colors.main,
              textTransform: "capitalize",
              "&:hover": { bgcolor: customColors.main },
            }}
            disabled={isLoading}
          >
            {language === "en" ? "Save" : "حفظ التعديلات"}
          </Button>
          <Button
            onClick={handleClose}
            variant="outlined"
            sx={{
              borderColor: colors.main,
              color: colors.main,
              textTransform: "capitalize",
              "&:hover": { borderColor: customColors.main },
            }}
          >
            {language === "en" ? "cancel" : "الغاء"}
          </Button>
        </Stack>
      </form>
    </Dialog>
  );
}

export default AdminModal;
