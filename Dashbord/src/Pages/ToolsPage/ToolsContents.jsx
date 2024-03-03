import React, { useEffect, useState } from "react";
import {
  useAddMetaAnalyticsMutation,
  useDeleteMetaAnalyticsMutation,
  useGetMetaAnalyticsQuery,
  useLazyGetMetaAnalyticsQuery,
} from "../../api/toolsApi";
import {
  Box,
  ButtonBase,
  CircularProgress,
  Container,
  Modal,
  Typography,
  useTheme,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import { useFormik } from "formik";
import * as yup from "yup";
import Loader from "../../Components/globals/Loader";

const contentData = {
  google: {
    ar: "رابط جوجل اناليتكس",
    en: "Google Analytics link",
  },
  tag: {
    ar: "رابط تاج مانجر",
    en: "Tag Manager link",
  },
  facebook: {
    ar: "رابط فيسبوك بيكسل",
    en: "Facebook pexel link",
  },
  snap: {
    ar: "رابط سناب بيكسل",
    en: "Snap pexel link",
  },
  tiktok: {
    ar: "رابط تيكتوك بيكسل",
    en: "TikTok pexel link",
  },
};

const ModalEdit = ({ open, handleClose, item }) => {
  const { customColors } = useTheme();
  const [_, { language: lang }] = useTranslation();
  const [addMetaAnalytics, { isLoading }] = useAddMetaAnalyticsMutation();

  const formik = useFormik({
    initialValues: {
      key: "",
      value: "",
    },
    validationSchema: yup.object({
      value: yup
        .string()
        .required(lang === "en" ? "Data is required" : " البيانات مطلوبه"),
      key: yup
        .string()
        .required(
          lang === "en"
            ? "you must select on of options"
            : "يجب عليك اختيار واحد من الاختيارات"
        ),
    }),
    onSubmit: (values) => {
      addMetaAnalytics(values)
        .unwrap()
        .then((res) => {
          toast.success(res[`success_${lang}`]);
          handleClose();
        })
        .catch((err) => {
          toast.error(err[`error_${lang}`]);
        });
    },
  });

  useEffect(() => {
    formik.setFieldValue("key", item?.item?.key);
    formik.setFieldValue("value", item?.item?.value);
  }, [item]);
  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box
        sx={{
          position: "absolute",

          top: "50%",
          left:
            lang === "en" ? { xs: "50%", md: "55%" } : { xs: "50%", md: "45%" },
          transform: "translate(-50%, -50%)",
          width: { xs: "90%", md: "50%" },
          bgcolor: customColors.container,
          boxShadow: 24,
          p: 4,
          borderRadius: "10px",
        }}
      >
        <Box my={2}>
          <Typography variant="h5">{item?.lable}</Typography>
        </Box>

        <Box>
          <form onSubmit={formik.handleSubmit}>
            <Box
              component={"textarea"}
              name="value"
              value={formik.values.value}
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              sx={{
                height: "200px",
                width: "100%",
                border: `1px solid ${customColors.inputField} !important`,
                fontSize: "18px",
                p: 2,
                outline: "none",
                borderRadius: "10px",
                bgcolor: customColors.container,
                color: customColors.text,
                resize: "none",
              }}
            />

            {formik.errors.value && formik.touched.value && (
              <Typography
                sx={{
                  color: "red",
                }}
              >
                {formik.errors.value}
              </Typography>
            )}
            <Box
              sx={{
                mt: 2,
                textAlign: "center",
              }}
            >
              <ButtonBase
                type="submit"
                disabled={isLoading}
                sx={{
                  bgcolor: customColors.main,
                  color: "#fff",
                  width: "fit-content",
                  alignSelf: "flex-end",
                  p: "0.5rem 2rem",

                  fontSize: "1rem",
                  fontWeight: "bold",
                  "&:hover": { bgcolor: customColors.main },
                  borderRadius: "10px",
                }}
              >
                {isLoading ? (
                  <Box sx={{ display: "flex" }}>
                    <CircularProgress
                      sx={{
                        color: "white",
                      }}
                    />
                  </Box>
                ) : lang === "en" ? (
                  "Save"
                ) : (
                  "حفظ"
                )}
              </ButtonBase>
            </Box>
          </form>
        </Box>
      </Box>
    </Modal>
  );
};

const ToolsContents = () => {
  const [_, { language: lang }] = useTranslation();
  const { customColors, colors } = useTheme();
  const [analyticsData, setAnalyticsData] = useState([]);
  const [open, setOpen] = useState(false);
  const [itemEdit, setItemEdit] = useState({});
  const { data, isLoading, isError, error } = useGetMetaAnalyticsQuery();

  const [deleteMetaAnalytics, { isLoading: deleteLoad }] =
    useDeleteMetaAnalyticsMutation();
  const handleClose = () => setOpen(false);
  const handleEdit = (item, lable) => {
    setOpen(true);
    setItemEdit({ item, lable });
  };

  const handleDelete = (id) => {
    deleteMetaAnalytics(id)
      .unwrap()
      .then((res) => {
        toast.success(res[`success_${lang}`]);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <Box
      sx={{
        my: 4,
      }}
    >
      {isLoading && <Loader extraStyle={{ height: "30vh" }} />}
      {!isLoading && error?.data && (
        <Box mt={10} textAlign={"center"}>
          <Typography
            variant="h4"
            sx={{
              color: colors.dangerous,
            }}
          >
            {error?.data[`error_${lang}`]}
          </Typography>
        </Box>
       
      )}

      {!isError && (
        <Container>
          {data?.data?.map((item, index) => (
            <Box key={index}>
              <Box>
                <Typography
                  sx={{
                    fontWeight: "bold",
                  }}
                >
                  {contentData[`${item.key}`][`${lang}`]}
                </Typography>
              </Box>

              <Box
                sx={{
                  border: "1px solid gray",
                  mt: 3,
                  p: 2,
                  borderRadius: "10px",
                  height: "250px",
                  overflow: "auto",
                  wordBreak: "break-word",
                }}
              >
                {item.value}
              </Box>

              <Box textAlign={lang == "en" ? "right" : "left"} mt={2}>
                <ButtonBase
                  onClick={() =>
                    handleEdit(item, contentData[`${item.key}`][`${lang}`])
                  }
                  sx={{
                    bgcolor: customColors.main,
                    color: "white",
                    width: "fit-content",
                    alignSelf: "flex-end",
                    p: { xs: "0.5rem 2rem", md: "0.5rem 3rem" },
                    fontSize: "1rem",
                    fontWeight: "bold",
                    "&:hover": { bgcolor: customColors.main },
                    borderRadius: "10px",
                    mx: 2,
                  }}
                >
                  {lang === "en" ? "Edit" : "تعديل"}
                </ButtonBase>
                <ButtonBase
                  onClick={() => handleDelete(item._id)}
                  disabled={deleteLoad}
                  sx={{
                    bgcolor: `${colors.dangerous} !important  `,
                    color: "#fff",
                    width: "fit-content",
                    alignSelf: "flex-end",
                    p: { xs: "0.5rem 2rem", md: "0.5rem 3rem" },
                    fontSize: "1rem",
                    fontWeight: "bold",
                    "&:hover": { bgcolor: "red" },
                    borderRadius: "10px",
                  }}
                >
                  {lang === "en" ? "Delete" : "مسح"}
                </ButtonBase>
              </Box>
            </Box>
          ))}
          <ModalEdit open={open} handleClose={handleClose} item={itemEdit} />
        </Container>
      )}
    </Box>
  );
};

export default ToolsContents;
