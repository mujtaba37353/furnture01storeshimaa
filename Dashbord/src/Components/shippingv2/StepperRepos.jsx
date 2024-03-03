import React from "react";
import "./index.css";
import { Box, Stack, Typography } from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import HourglassBottomIcon from "@mui/icons-material/HourglassBottom";
import "./index.css";
import { useTranslation } from "react-i18next";
const StepperRepos = ({ stepperRepos, ordersShipping ,mode}) => {
  const [_, { language: lng }] = useTranslation();
  console.log("stepperRepos repositories ", stepperRepos);
  console.log("stepperRepos ordersShipping ", ordersShipping);
  return (
    <Stack direction={"row"} justifyContent={"center"} mb={"20px"}>
      <Stack
        direction={"row"}
        justifyContent={"center"}
        alignItems={"center"}
        gap={"30px"}
        // className={`stepper-repos`}
      >
        {stepperRepos?.map((repo) => (
          <Box>
            <Box
              sx={{
                height: 60,
                width: 60,
                mx: "auto",
                borderRadius: "40%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                zIndex: "3 !important",
                bgcolor: mode==="dark"?"#333":"#FAFAFA",
                border: `1px solid ${ordersShipping?.find(({ RepoId }) => RepoId === repo?._id)  ? "#21AF21" : "divider" } !important`,
              }}
            >
              {ordersShipping?.find(({ RepoId }) => RepoId === repo?._id) ? (
                <CheckIcon
                  sx={{
                    color: "#21AF21",
                  }}
                />
              ) : (
                <HourglassBottomIcon />
              )}
            </Box>  
                
            <Typography mt={"5px"} align="center">
              {/* {repo[`name_${lng}`]} */}
              {
                lng==="en"?repo?.name_en:repo?.name_ar
              }
            </Typography>
          </Box>
        ))}
      </Stack>
    </Stack>
  );
};

export default StepperRepos;
