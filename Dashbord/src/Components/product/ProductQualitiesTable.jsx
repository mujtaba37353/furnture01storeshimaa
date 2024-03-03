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
  TextField,
  CircularProgress,
  useTheme,
} from "@mui/material";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import DeleteIcon from "@mui/icons-material/Delete";
import EditProductQualityModal from "./EditProductQualityModal";
const ProductQualitiesTable = ({
  productQualities,
  productQuantity,
  sortedQualities,
  setSortedQualities,
  produuctSetFieldValue,
  remainingQuantity,
  generalQualitiesData,
}) => {
  const { customColors, palette } = useTheme();
  const [_, { language: lang }] = useTranslation();
  const [open, setOpen] = useState(false);
  const [selectedItem, setSelectItem] = useState();
  const handleDeleteQuality = (qualityIndex) => {
    produuctSetFieldValue(
      `qualities`,
      productQualities.filter((_, index) => index !== qualityIndex)
    );
  };
  const handleOpenEditModel = (qualityIndex) => {
    setSelectItem(() => {
      const quality = productQualities.at(qualityIndex);
      return { ...quality, qualityIndex };
    });
    setOpen(true);
  };
  return (
    <>
      <EditProductQualityModal
        open={open}
        setOpen={setOpen}
        selectedItem={selectedItem}
        productQualities={productQualities}
        productQuantity={productQuantity}
        produuctSetFieldValue={produuctSetFieldValue}
        setSelectItem={setSelectItem}
        remainingQuantity={remainingQuantity}
        generalQualitiesData={generalQualitiesData}
        sortedQualities={sortedQualities}
        setSortedQualities={setSortedQualities}
      />
      <TableContainer component={Paper}>
        <Table
          sx={{
            minWidth: 650,
            overflowX: {
              lg: "auto",
              xs: "scroll",
            },
            height: "50%",
          }}
        >
          <TableHead>
            <TableRow
              sx={{
                bgcolor: customColors.secondary,
                borderRadius: "10px",
                boxShadow:
                  palette.mode === "dark" ? "none" : "0px 0px 15px 0px #c6d5d3",
                "&:last-child td, &:last-child th": {
                  textAlign: "center",
                },
              }}
            >
              <TableCell
                sx={{
                  minWidth: `50px !important`,
                  width: `50px !important`,
                }}
              >
                <Typography
                  sx={{
                    fontWeight: "bold",
                    textAlign: "center",
                  }}
                >
                  #
                </Typography>
              </TableCell>
              <TableCell
                sx={{
                  minWidth: `75px !important`,
                  width: `75px !important`,
                }}
              >
                <Typography
                  sx={{
                    fontWeight: "bold",
                    textAlign: "center",
                  }}
                >
                  {lang === "en" ? "quantity" : "الكمية"}
                </Typography>
              </TableCell>
              <TableCell
                sx={{
                  minWidth: `75px !important`,
                  width: `75px !important`,
                }}
              >
                <Typography
                  sx={{
                    fontWeight: "bold",
                    textAlign: "center",
                  }}
                >
                  {lang === "en" ? "price" : "السعر"}
                </Typography>
              </TableCell>
              {sortedQualities.map((sortedQual, idx) => (
                <TableCell
                  key={idx}
                  sx={{
                    minWidth: `200px !important`,
                    width: `200px !important`,
                  }}
                >
                  <Typography
                    variant="subtitle1"
                    sx={{
                      fontWeight: "bold",
                      textAlign: "center",
                    }}
                  >
                    {sortedQual[`key_${lang}`]}
                  </Typography>
                </TableCell>
              ))}
              <TableCell
                sx={{
                  minWidth: `150px !important`,
                  width: `150px !important`,
                }}
              ></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {productQualities.map((quality, idx) => (
              <TableRow
                key={idx}
                sx={{
                  "&:last-child td, &:last-child th": {
                    textAlign: "center",
                  },
                }}
              >
                <TableCell
                  sx={{
                    minWidth: `50px !important`,
                    width: `50px !important`,
                  }}
                >
                  <Typography
                    sx={{
                      fontWeight: "bold",
                      textAlign: "center",
                    }}
                  >
                    {idx + 1}
                  </Typography>
                </TableCell>
                <TableCell
                  sx={{
                    minWidth: `75px !important`,
                    width: `75px !important`,
                  }}
                >
                  <Typography
                    sx={{
                      fontWeight: "bold",
                      textAlign: "center",
                    }}
                  >
                    {quality.quantity}
                  </Typography>
                </TableCell>
                <TableCell
                  sx={{
                    minWidth: `75px !important`,
                    width: `75px !important`,
                  }}
                >
                  <Typography
                    sx={{
                      fontWeight: "bold",
                      textAlign: "center",
                    }}
                  >
                    {quality.price}
                  </Typography>
                </TableCell>
                {sortedQualities.map((sortedQual, idx) => {
                  const findedValueQuality = quality.values.find(
                    (el) => el.key_en === sortedQual.key_en
                  );
                  if (!findedValueQuality) {
                    return (
                      <TableCell
                        key={idx}
                        sx={{
                          minWidth: `200px !important`,
                          width: `200px !important`,
                        }}
                      >
                        <Typography
                          variant="subtitle1"
                          sx={{
                            fontWeight: "bold",
                            textAlign: "center",
                          }}
                        >
                          {`---`}
                        </Typography>
                      </TableCell>
                    );
                  }
                  return (
                    <TableCell
                      key={idx}
                      sx={{
                        minWidth: `200px !important`,
                        width: `200px !important`,
                      }}
                    >
                      <Typography
                        variant="subtitle1"
                        sx={{
                          fontWeight: "bold",
                          textAlign: "center",
                        }}
                      >
                        {findedValueQuality[`value_${lang}`]}
                      </Typography>
                    </TableCell>
                  );
                })}
                <TableCell
                  sx={{
                    minWidth: `150px !important`,
                    width: `150px !important`,
                  }}
                >
                  <Stack
                    direction={"row"}
                    alignItems={"center"}
                    justifyContent={"center"}
                    gap={"10px"}
                  >
                    <Button
                      sx={{
                        minWidth: 0,
                        border: `1px solid ${customColors.inputField}`,
                        color: customColors.inputField,
                      }}
                      onClick={() => handleOpenEditModel(idx)}
                    >
                      {lang === "en" ? "Edit" : "تعديل"}
                    </Button>
                    <Button
                      sx={{
                        minWidth: 0,
                        border: `1px solid ${customColors.dangerous}`,
                      }}
                      onClick={() => handleDeleteQuality(idx)}
                    >
                      <DeleteIcon
                        sx={{
                          color: customColors.dangerous,
                        }}
                      />
                    </Button>
                  </Stack>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};

export default ProductQualitiesTable;
