import { useState, useEffect } from "react";
import Button from "@mui/material/Button";
import CloseIcon from "@mui/icons-material/Close";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Stack,
  Typography,
} from "@mui/material";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { useFetchAllAttributes } from "../../hooks/attributes.hooks";
import { useTheme } from "@emotion/react";
import { useCreateAttributeMutation } from "../../api/attribute.api";
export default function ProductAttributes({
  productAttributes,
  setProductFieldValue,
  language,
}) {
  const [expanded, setExpanded] = useState("panel1");
  const handleChange = (panel) => (_, newExpanded) => {
    setExpanded(newExpanded ? panel : false);
  };
  const { attributes } = useFetchAllAttributes();
  const [customAttributes, setCustomAttributes] = useState([]);
  const [createAttribute] = useCreateAttributeMutation();

  const [open, setOpen] = useState(false);
  const { colors, btnStyle } = useTheme();
  const hundleAddAtt = (attribute, selectedValue, event) => {
    const { checked, value } = event.target;
    const existedAtt = productAttributes.find(
      (item) => item.key_en === attribute.key_en
    );
    if (checked) {
      existedAtt
        ? setProductFieldValue(
            "attributes",
            productAttributes.map((item) =>
              item.key_en === attribute.key_en
                ? {
                    key_en: attribute.key_en,
                    key_ar: attribute.key_ar,
                    values: [...existedAtt.values, selectedValue],
                  }
                : item
            )
          )
        : setProductFieldValue("attributes", [
            ...productAttributes,
            {
              key_en: attribute.key_en,
              key_ar: attribute.key_ar,
              values: [selectedValue],
            },
          ]);
    } else {
      existedAtt.values.length > 1
        ? setProductFieldValue(
            "attributes",
            productAttributes.map((item) =>
              item.key_en === existedAtt.key_en
                ? {
                    ...existedAtt,
                    values: existedAtt.values.filter(
                      (val) => val.value_en !== value
                    ),
                  }
                : item
            )
          )
        : setProductFieldValue(
            "attributes",
            productAttributes.filter((sel) => sel.key_en !== existedAtt.key_en)
          );
    }
  };
  const handleDeleteAttribute = (attr) => {
    setProductFieldValue(
      "attributes",
      productAttributes.filter((item) => item.key_en !== attr.key_en)
    );
  };
  const handleDeleteValueFromAttribute = (attr, valueItem) => {
    attr.values.length === 1
      ? handleDeleteAttribute(attr)
      : setProductFieldValue(
          "attributes",
          productAttributes.map((proAtt) =>
            proAtt.key_en === attr.key_en
              ? {
                  ...proAtt,
                  values: proAtt.values.filter(
                    (item) => item.value_en !== valueItem
                  ),
                }
              : proAtt
          )
        );
  };
  useEffect(() => {
    if (!open) {
      setExpanded(null);
    }
  }, [open]);
  useEffect(() => {
    if (attributes.data?.length > 0) {
      setCustomAttributes(
        attributes.data.map((att) => ({
          key_en: att.key_en,
          key_ar: att.key_ar,
          values: att.values.map((val) => ({
            value_en: val.value_en,
            value_ar: val.value_ar,
          })),
        }))
      );
    }
  }, [attributes.data]);
  return (
    <Box
      sx={{
        position: "relative",
      }}
    >
      <Accordion
        expanded={open}
        sx={{
          mt: 0.5,
          bgcolor: colors.bg_main,
        }}
      >
        <AccordionSummary
          sx={{
            cursor: "auto !important",
          }}
          aria-controls="panel1bh-content"
          id="panel1bh-header"
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
              {language === "en" ? "filtering ways" : "عوامل التصفية"}
            </Typography>
            <Button
              sx={{ ...btnStyle, color: "#fff" }}
              onClick={() => setOpen(!open)}
            >
              {language === "en" ? "Add" : "أضف"}
            </Button>
          </Stack>
        </AccordionSummary>
        <AccordionDetails>
          {customAttributes.length > 0
            ? customAttributes.map((attribute) => (
                <Accordion
                  expanded={expanded === attribute.key_en}
                  onChange={handleChange(attribute.key_en)}
                  sx={{
                    bgcolor: colors.bg,
                    svg: {
                      color: `${colors.main} !important`,
                    },
                  }}
                >
                  <AccordionSummary
                    aria-controls="panel1d-content"
                    id="panel1d-header"
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      borderColor: `1px solid red !important`,
                    }}
                  >
                    <Stack
                      direction={"row"}
                      alignItems={"center"}
                      justifyContent={"space-between"}
                      width={"100%"}
                    >
                      <Typography>{attribute[`key_${language}`]}</Typography>
                      <ArrowDropDownIcon
                        sx={{
                          transform:
                            expanded === attribute.key_en
                              ? `rotate(180deg)`
                              : `rotate(0)`,
                          transition: "all 0.4s",
                          color: "#000",
                          fontSize: "30px",
                        }}
                      />
                    </Stack>
                  </AccordionSummary>
                  <AccordionDetails>
                    {attribute.values.map((item) => (
                      <Stack
                        direction={"row"}
                        alignItems={"center"}
                        gap={"20px"}
                      >
                        <input
                          type="checkbox"
                          id={item.value_en}
                          value={item.value_en}
                          checked={productAttributes?.find(
                            (selected) =>
                              selected.key_en === attribute.key_en &&
                              selected.values.find(
                                ({ value_en }) => value_en === item.value_en
                              )
                          )}
                          onChange={(event) =>
                            hundleAddAtt(attribute, item, event)
                          }
                        />
                        <Typography
                          component="label"
                          htmlFor={item.value_en}
                          sx={{
                            color: colors.text,
                            fontWeight: "bold",
                            fontSize: "15px",
                            cursor: "pointer",
                          }}
                        >
                          {language === "en" ? item.value_en : item.value_ar}
                        </Typography>
                      </Stack>
                    ))}
                  </AccordionDetails>
                </Accordion>
              ))
            : undefined}
        </AccordionDetails>
      </Accordion>
      {productAttributes?.map((attribute) => (
        <Box
          elevation={2}
          sx={{
            width: "100%",
            mt: "20px",
            p: "10px",
            border: 1,
            borderColor: "divider",
            position: "relative",
          }}
        >
          <CloseIcon
            onClick={() => handleDeleteAttribute(attribute)}
            sx={{
              position: "absolute",
              top: 0,
              left: language === "ar" ? 0 : undefined,
              right: language === "en" ? 0 : undefined,
              cursor: "pointer",
              color: colors.dangerous,
            }}
          />
          <Typography variant="h5">{attribute[`key_${language}`]}</Typography>
          <Stack
            sx={{
              flexDirection: "row",
              gap: "10px",
              flexWrap: "wrap",
              mt: "8px",
            }}
          >
            {attribute.values.map((item) => {
              return (
                <Box
                  position={"relative"}
                  border={1}
                  borderColor={"divider"}
                  p={2}
                >
                  <CloseIcon
                    onClick={() =>
                      handleDeleteValueFromAttribute(attribute, item.value_en)
                    }
                    sx={{
                      position: "absolute",
                      top: 0,
                      left: language === "ar" ? 0 : undefined,
                      right: language === "en" ? 0 : undefined,
                      cursor: "pointer",
                      color: colors.dangerous,
                    }}
                  />
                  <Typography variant="h6">
                    {item[`value_${language}`]}
                  </Typography>
                </Box>
              );
            })}
          </Stack>
        </Box>
      ))}
    </Box>
  );
}
