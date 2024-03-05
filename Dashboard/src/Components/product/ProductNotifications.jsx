import { useTheme } from "@emotion/react";
import {
  Box,
  Grid,
  Stack,
  Typography,
  Button,
  InputBase,
  Paper,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import InputText from "../globals/InputText";
// import NotificationSelector from "./NotificationSelector";
// import { useLazyGetAllUsersQuery } from "../../api/user.api";
const ProductNotifications = ({
  productNotificationValues,
  setProductFieldValue,
}) => {
  const [_, { language: lang }] = useTranslation();
  const { colors, btnStyle } = useTheme();
  const [open, setOpen] = useState(false);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setProductFieldValue([name], value);
  };
  return (
    <Grid item lg={12} xs={12}>
      <Accordion
        expanded={open}
        sx={{
          bgcolor: colors.bg_main,
        }}
      >
        <AccordionSummary
          aria-controls="panel1bh-content"
          id="panel1bh-header"
          sx={{
            cursor: "auto !important",
          }}
        >
          <Stack direction={"row"} justifyContent={"space-between"} width={1}>
            <Typography
              variant="h6"
              sx={{
                textTransform: "capitalize",
                color: colors.text,
                fontWeight: "bold",
                fontSize: "17px",
              }}
            >
              {lang === "en" ? "Notification" : "الإشعار"}
            </Typography>
            <Button
              sx={{ ...btnStyle, color: "#fff" }}
              onClick={() => setOpen(!open)}
            >
              {lang === "en" ? "Add" : "أضف"}
            </Button>
          </Stack>
        </AccordionSummary>
        <AccordionDetails>
          <Box mt={"10px"}>
            <InputText
              label={lang === "en" ? "title" : "العنوان"}
              name="title"
              type={"text"}
              value={productNotificationValues.title}
              handleChange={handleChange}
            />
          </Box>
          <Box mt={3}>
            <InputText
              label={lang === "en" ? "Messege" : "الرسالة "}
              name="message"
              type={"text"}
              value={productNotificationValues.message}
              handleChange={handleChange}
            />
          </Box>
          {/* <Box width={0.97} mx={"auto"} mt={"15px"}>
            <Typography
              sx={{
                color: customColors.text,
                mb: "4px",
                fontWeight: "bold",
              }}
            >
              {lang === "en" ? "Role" : "الدور"}
            </Typography>
            <Stack
              mt="10px"
              direction={{
                md: "row",
                xs: "column",
              }}
              alignItems={{
                md: "center",
                xs: "flex-start",
              }}
              flexWrap={"wrap"}
              gap={{
                md: "20px",
                xs: "5px",
              }}
            >
              {roles.map((item) => (
                <Stack
                  key={item}
                  direction={"row"}
                  alignItems={"center"}
                  gap={"5px"}
                >
                  <input
                    type="radio"
                    id={item}
                    name="role"
                    value={item}
                    onChange={(e) => {
                      setProductFieldValue("role", e.target.value);
                      setProductFieldValue("receiver", "");
                    }}
                  />
                  <Typography
                    component={"label"}
                    htmlFor={item}
                    sx={{
                      cursor: "pointer",
                    }}
                  >
                    {lang === "en" ? item : arabicRoles[item]}
                  </Typography>
                </Stack>
              ))}
            </Stack>
          </Box> */}
          {/* <Box mt={"15px"}>
            <NotificationSelector
              items={changedUsers}
              selectedUsers={selectedUsers}
              setSelectedUsers={setSelectedUsers}
            />
          </Box> */}
          <Stack direction={"row"} justifyContent={"center"}></Stack>
        </AccordionDetails>
      </Accordion>
    </Grid>
  );
};

export default ProductNotifications;
