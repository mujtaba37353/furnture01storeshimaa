import {
  Autocomplete,
  Box,
  Button,
  Checkbox,
  Grid,
  ListItemText,
  MenuItem,
  OutlinedInput,
  Select,
  Stack,
  TextField,
} from "@mui/material";
import { Link } from "react-router-dom";
import Typography from "@mui/material/Typography";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import { useTranslation } from "react-i18next";
import { useTheme } from "@emotion/react";
import { useFormik } from "formik";
import Radio from "@mui/material/Radio";
import FormControl from "@mui/material/FormControl";
import * as Yup from "yup";
import { useEffect, useRef, useState } from "react";
import { useGetAllUsersQuery } from "../../api/user.api";
import { useSendSmsMessageMutation } from "../../api/Messages";
import { toast } from "react-toastify";
import SearchIcon from "@mui/icons-material/Search";

export default function SmsMessages() {
  const [sendSmsMessage, { isLoading: isLoadingEmails }] =
    useSendSmsMessageMutation();
  const {
    i18n: { language },
  } = useTranslation();
  const { colors, customColors } = useTheme();
  
  const {
    data: users,
    isError: usersError,
    isLoading,
    error,
    

  } = useGetAllUsersQuery("limit=1000000");
  // yup
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [selectError, setSelectError] = useState("");
  const [usersNumbers, setUsersNumbers] = useState([]);
  console.log(selectedUsers, "selectedUsersselectedUsers");
  useEffect(() => {
    if ((!usersError, !isLoading)) {
      setUsersNumbers(users?.data);
    }
  }, [users]);
  const handleUserChange = (value) => {
    // if (selectedUsers.includes(value)) {
    //   setSelectedUsers(selectedUsers.filter((selected) => selected !== value));
    // } else {
    //   setSelectedUsers([...selectedUsers, value]);
    // }
    // const handleUserChange = (value) => {
    //   const {
    //     target: { value },
    //   } = event;
    //   setSelectedUsers(typeof value === "string" ? value.split(",") : value);
  };
  const {
    handleSubmit,
    setFieldValue,
    errors,
    values,
    touched,
    handleChange,
    resetForm,
    handleBlur,
  } = useFormik({
    initialValues: {
      message: "",
      SelectedType: "ALL",
    },
    validationSchema: Yup.object({
      message: Yup.string().required(language === "en" ? "Required" : "مطلوب"),
    }),
    onSubmit: (values) => {
      if (values.SelectedType === "ALL") {
        const formatedData = {
          phone: [],
          message: values.message,
        };

        sendSmsMessage(formatedData)
          .unwrap()
          .then(() => {
            toast.success(
              language === "en"
                ? "successfull send your Message"
                : "تم ارسال الرساله بنجاح"
            );
            setSelectedUsers([]);
            resetForm();
          })
          .catch(() => {
            toast.error(
              language === "en"
                ? "there is a problem while send Your Message"
                : "هناك مشكله في ارساله الرساله "
            );
          });
      } else {
        if (!selectedUsers.length && values.SelectedType !== "ALL") {
          setSelectError(
            language === "en"
              ? "please select users first"
              : "من فضلك اختر المستخدمين اولا "
          );
          return;
        } else {
          setSelectError("");

          const formatedData = {
            phone: selectedUsers?.map((user) => user.phone),
            message: values.message,
          };
          sendSmsMessage(formatedData)
            .unwrap()
            .then(() => {
              toast.success(
                language === "en"
                  ? "successfull send your Message"
                  : "تم ارسال الرساله بنجاح"
              );
              resetForm();
              setSelectedUsers([]);
            })
            .catch(() => {
              toast.error(
                language === "en"
                  ? "there is a problem while send Your Message"
                  : "هناك مشكله في ارساله الرساله "
              );
            });
        }
      }
    },
  });

  // yup
   const breadcrumbs = [
    <Link
      underline="hover"
      key="1"
      color="inherit"
      to="/"
      style={{ textDecoration: "none", color: customColors.text }}
    >
      {language === "en" ? "Home" : "الرئيسية"}
    </Link>,

    <Typography key="3" color="text.primary" sx={{ color: "#00e3d2" }}>
      {language === "en" ? "Mail Messages" : "الرسائل النصيه"}
    </Typography>,
  ];
  useEffect(() => {
    if (values?.SelectedType === "ALL") {
      setUsersNumbers(users?.data);
    }
  }, [values?.SelectedType]);
  const selectorRef = useRef();
  console.log("dsofhdsuyfgdsyugfdsyf", usersNumbers);
  return (
 <>
 {
  !usersError&&!isLoading?<>
     <Stack>
      <Box sx={{ py: "20px", px: { xs: "10px", sm: "20px", md: "40px" } }}>
        <Typography variant="h4" component="h1" gutterBottom>
          {language === "en" ? "Sms Messages" : "الرسائل النصيه"}
        </Typography>
        <Breadcrumbs
          separator={
            language === "en" ? (
              <NavigateNextIcon fontSize="small" />
            ) : (
              <NavigateBeforeIcon fontSize="small" />
            )
          }
          aria-label="breadcrumb"
        >
          {breadcrumbs}
        </Breadcrumbs>
        <Box
          sx={{
            width: { xs: "100%", lg: "85%" },
            background: customColors.bg,
            margin: "40px auto",
            py: "20px",
            px: { xs: 2, md: 7, lg: 10, xl: 15 },
            borderRadius: "10px",
            boxShadow: "rgba(99, 99, 99, 0.2) 0px 2px 8px 0px",
          }}
        >
          <form onSubmit={handleSubmit}>
            <Stack>
              <Typography sx={{ color: customColors.label, mb: "4px", my: 3 }}>
                {language === "en" ? "Message content" : "نص  الرساله "}
              </Typography>
              <TextField
                name="message"
                type="text"
                // m={1}
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.message}
                helperText={
                  touched.message && errors.message ? errors.message : ""
                }
                error={touched.message && errors.message}
                variant="outlined"
                multiline
                rows={5}
                sx={{
                  // '.css-1t8l2tu-MuiInputBase-input-MuiOutlinedInput-input': {
                  //   height: '200px'
                  // },
                  "&:hover": {
                    fieldset: { borderColor: customColors.inputField },
                  },
                  fieldset: { borderColor: customColors.inputField },
                }}
              />

              <Stack
                mt="10px"
                direction={{
                  md: "column",
                  xs: "column",
                }}
                alignItems={{
                  md: "flex-sater",
                  xs: "flex-start",
                  justifyContent: "flex-start",
                }}
                flexWrap={"wrap"}
                gap={{
                  md: "20px",
                  xs: "5px",
                }}
              >
                <Stack direction={"row"} alignItems={"center"} gap={"5px"}>
                  <Radio
                    id={"select"}
                    name={"SelectedType"}
                    value={"ALL"}
                    onChange={(e) => {
                      e.target.value === "ALL" && setSelectedUsers([]);
                      handleChange(e);
                    }}
                    checked={values.SelectedType === "ALL"}
                    sx={{
                      padding: 0,
                      ".css-14e8nas-MuiButtonBase-root-MuiRadio-root.Mui-checked":
                        {
                          color: " #00d5c5 !important",
                        },
                    }}
                  />
                  <Typography
                    component={"label"}
                    htmlFor={"ALL"}
                    sx={{
                      cursor: "pointer",
                    }}
                  >
                    {language === "en" ? "ALL" : "كل المستخدمين"}
                  </Typography>
                </Stack>
                {/* {values.SelectedType !== "ALL" ? (
                  <Stack
                    direction={"row"}
                    className="date-gradient floatingArray"
                    alignItems={"center"}
                    sx={{
                      borderRadius: "15px",
                      height: "40px",
                      width: { xs: "100%", md: "auto" },
                      px: 2,
                    }}
                  >
                    <SearchIcon sx={{ color: "black" }} />
                    <TextField
                      sx={{
                        width: "auto",
                        "& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline":
                          {
                            borderColor: "transparent !important",
                            outline: "none !important",
                            backgroundColor: "transparent !important",
                          },

                        "& input::placeholder": {
                          color: "black",
                        },
                        color: "black",
                      }}
                      placeholder={language === "en" ? "Search" : "ابحث هنا"}
                      name="search"
                      onChange={(e) => {
                        setUsersNumbers((prev) => {
                          const FilteredData = users?.data?.filter((item) =>
                            item?.phone?.includes(e.target.value)
                          );
                          return [...FilteredData];
                        });
                      }}
                    />
                  </Stack>
                ) : null} */}
                <Stack
                  direction={"row"}
                  alignItems={"center"}
                  gap={"5px"}
                  width="100%"
                >
                  <Radio
                    id={"select"}
                    name={"SelectedType"}
                    value={"select"}
                    onChange={handleChange}
                    checked={values.SelectedType === "select"}
                    sx={{
                      padding: 0,
                      ".css-vqmohf-MuiButtonBase-root-MuiRadio-root.Mui-checked":
                        {
                          color: " #00d5c5",
                        },
                    }}
                  />
                  <Grid
                    item
                    xs={12}
                    sx={{
                      width: "100%",
                    }}
                  >
                    <Box>
                      <FormControl sx={{ my: 1, width: "100%" }}>
                        {/* <Select
                          labelId="demo-multiple-checkbox-label"
                          id="demo-multiple-checkbox"
                          multiple
                          disabled={values.SelectedType === "ALL"}
                          value={selectedUsers}
                          onChange={handleUserChange}
                          input={<OutlinedInput />}
                          renderValue={(selected) => selected.join(", ")}
                          sx={{
                            width: "100%",
                          }}
                        >
                          {!isLoading && !usersError && usersNumbers?.length
                            ? usersNumbers
                                ?.filter((user) => !user.email)
                                .map((user) => {
                                  return (
                                    <MenuItem key={user.id} value={user.phone}>
                                      <Checkbox
                                        checked={
                                          selectedUsers?.indexOf(user.phone) >
                                            -1 || values.SelectedType === "ALL"
                                        }
                                      />
                                      <ListItemText primary={user.phone} />
                                    </MenuItem>
                                  );
                                })
                            : null}
                        </Select> */}
                        <Autocomplete
                          sx={{
                            mt: "10px",
                          }}
                          multiple
                          id="tags-standard"
                          options={
                            !isLoading && !usersError && usersNumbers?.length
                              ? usersNumbers?.filter((user) => !user.email)
                              : []
                          }
                          // onReset={(e)=>{
                          //     console.log(e)
                          // }}
                           ref={selectorRef}
                          getOptionLabel={(option) =>{
                             console.log(option.phone,'option.phone')
                           return option.phone.replace(/^\+(\d{3})/, '')
                          }}
                          disabled={values.SelectedType === "ALL"}
                          onChange={(_, values) => {
                            const asdasd = values.map((val) => {

                               // handleUserChange(val.phone)
                              return val;
                            });
                            setSelectedUsers((prev) => [...asdasd]);
                          }}
                          // onChange={(_, values) =>
                          //   setFieldValue(
                          //     "discountDepartment.value",
                          //     values.map((val) => val._id)
                          //   )
                          // }
                          renderInput={(params) => {
                            return <TextField {...params} />;
                          }}
                        />
                      </FormControl>
                      <Typography component={"p"}>{selectError}</Typography>
                    </Box>
                  </Grid>
                </Stack>
              </Stack>
            </Stack>
            <></>
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
                type="submit"
                variant="outlined"
                sx={{
                  bgcolor: `${colors.main} !important`,
                  color: '#fff',
                  textTransform: 'capitalize',
                 border: `1px solid ${colors.main} !important`,
                 px: 3,
                  py: 1,
                  fontSize: '1rem',
                  
                }}
                disabled={isLoadingEmails}
              >
                {language === "en" ? "send" : "ارسال"}
              </Button>
            </Stack>
          </form>
        </Box>
      </Box>
    </Stack></>:   <Typography
                          sx={{
                            fontWeight: "bold",
                            fontSize: { xs: "20px", sm: "25px", lg: "30px" },
                            color:  'red',
                            height:'100vh',
                            display:'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          {
                            error?.status!=="FETCH_ERROR"?
                                                <>    {error?.data[`error_${lang}`]}  </>

                            :<>
                             {error?.error} 
                            </>
                           }
                        </Typography>
 }
 </>
  );
}
