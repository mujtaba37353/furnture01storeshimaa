import {
  Box,
  Stack,
  Table,
  TableCell,
  TableContainer,
  Button,
  TableHead,
  TableRow,
  Typography,
  Paper,
  TableBody,
  useTheme,
} from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { useTranslation } from "react-i18next";
import { useGetAllAttributesQuery } from "../../api/attribute.api";
import Loader from "../../Components/globals/Loader";

import AttributeModal from "../../Components/attributes/AttributeModal";
import AttributeRowCard from "../../Components/attributes/AttributeRowCard";
import { allowed } from "../../helper/roles";
import { useSelector } from "react-redux";

const AttributesPage = () => {
  const navigate = useNavigate();
  const [_, { language: lang }] = useTranslation();
  const { colors, customColors, palette } = useTheme();
  const { data: attsData,isError, error, isLoading } = useGetAllAttributesQuery();
  const { role } = useSelector((state) => state.user);

  const [selectedAtt, setSelectedAtt] = useState();
  const [open, setOpen] = useState(false);
  const handleOpenEditModal = (item) => {
    setOpen(true);
    setSelectedAtt(item);
  };
  return (
    <>
      <AttributeModal
        setOpen={setOpen}
        open={open}
        editedItem={selectedAtt}
        setEditedItem={setSelectedAtt}
      />
      <Box
        sx={{
          py: {
            lg: 3,
            md: 2.5,
            xs: 2,
          },
          px: {
            lg: 4,
            md: 2.5,
            xs: 2,
          },
        }}
      >
        <Box
          sx={{
            width: 0.97,
          }}
        >
          <Box py={5}>
            <Typography variant="h4" mb={"10px"}>
              {lang === "en" ? "Attributes" : "عوامل التصفية"}
            </Typography>
            <Stack
              direction={"row"}
              justifyContent={"space-between"}
              alignItems={"center"}
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
                  {lang === "en" ? "Home" : "الصفحة الرئيسية"}
                </Typography>
                <ArrowForwardIosIcon
                  sx={{
                    transform: lang === "ar" ? "rotateY(180deg)" : 0,
                  }}
                />
                <Typography
                  variant="h6"
                  sx={{
                    color: colors.main,
                    fontSize: "16px",
                  }}
                >
                  {lang === "en" ? "Attributes" : "عوامل التصفية"}
                </Typography>
              </Stack>
            </Stack>
          </Box>
          {allowed({ page: "attributes", role }) ? (
            <Stack direction={"row"} justifyContent={"flex-end"} mb={"30px"}>
              <Button
                sx={{
                  backgroundColor: "#00e3d2 !important",
                  color: "white",
                  textTransform: "capitalize",
                  minWidth: "130px",
                }}
                onClick={() => setOpen(true)}
              >
                <Typography>
                  {lang === "en" ? "Add attribute" : "إضافة عامل تصفية"}
                </Typography>
              </Button>
            </Stack>
          ) : undefined}

          {isLoading ? (
            <Loader extraStyle={{ height: "30vh" }} />
          ) : (
            <Box
              sx={{
                maxWidth: { md: "100%", sm: "100%", xs: 340 },
                mx: { xs: "auto", sm: "initial" },
                overflow: "hidden",
              }}
            >
              <Box sx={{ width: { xs: "100%", md: "95%" }, mx: "auto" }} mt={2}>
                {/* head */}
                <TableContainer component={Paper}>
                  <Table>
                    <TableHead>
                      <TableRow
                        sx={{
                          bgcolor: customColors.secondary,
                          borderRadius: "10px",
                          boxShadow:
                            palette.mode === "dark"
                              ? "none"
                              : "0px 0px 15px 0px #c6d5d3",
                          "&:last-child td, &:last-child th": {
                            textAlign: "center",
                          },
                        }}
                      >
                        <TableCell sx={{ width: 0.07 }}>
                          <Typography
                            variant="subtitle1"
                            sx={{
                              fontWeight: "bold",
                            }}
                          >
                            #
                          </Typography>
                        </TableCell>

                        <TableCell sx={{ width: 0.25 }}>
                          <Typography
                            variant="subtitle1"
                            sx={{
                              textAlign: "initial",
                              fontWeight: "bold",
                            }}
                          >
                            {lang === "en"
                              ? "Attribute name"
                              : "اسم عامل التصفية"}
                          </Typography>
                        </TableCell>
                        <TableCell colSpan={5}>
                          <Typography
                            variant="subtitle1"
                            sx={{
                              fontWeight: "bold",
                              textAlign: "initial",
                            }}
                          >
                            {lang === "en" ? "values" : "القيم"}
                          </Typography>
                        </TableCell>
                      </TableRow>
                    </TableHead>

                    <TableBody>
                      {attsData && !error ? (
                        attsData?.data.map((attribute, index) => (
                          <AttributeRowCard
                            key={attribute._id}
                            index={index}
                            item={attribute}
                            handleOpenEditModal={handleOpenEditModal}
                          />
                        ))
                      ) : (
                        <TableRow
                          sx={{
                            bgcolor: customColors.bg,
                          }}
                        >
                          <TableCell
                            sx={{
                              width: 1,
                              fontSize: "20px",
                              color: colors.dangerous,
                              fontWeight: "bold",
                            }}
                            colSpan={5}
                            align="center"
                          >
                         
                           {
                            error?.status!=="FETCH_ERROR"?
                                                <>    {error?.data[`error_${lang}`]}  </>

                            :<>
                             {error?.error} 
                           </>
}
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Box>
            </Box>
          )}
        </Box>
      </Box>
    </>
  );
};

export default AttributesPage;
