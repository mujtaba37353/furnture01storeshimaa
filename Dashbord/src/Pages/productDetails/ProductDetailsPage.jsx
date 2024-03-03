import { useTheme } from "@emotion/react";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { Box, CardMedia, Grid, Rating, Stack, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import Loader from "../../Components/globals/Loader";
import { imageBaseUrl } from "../../api/baseUrl";
import { useGetProductById } from "../../hooks/products.hooks";
import ProductComments from "../../Components/product/ProductComments";
const ProductDetailsPage = () => {
  const [_, { language }] = useTranslation();
  const navigate = useNavigate();
  const { colors } = useTheme();
  const { id } = useParams();
  const { product, isLoading } = useGetProductById(id);
  const [imgIndex, setImgIndex] = useState();
  useEffect(() => {
    if (product.data) {
      setImgIndex(0);
    }
  }, [product.data]);
  return (
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
            {language === "en" ? "products" : "المنتجات"}
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
                {language === "en" ? "Home" : "الصفحة الرئيسية"}
              </Typography>
              <ArrowForwardIosIcon
                sx={{
                  transform: language === "ar" ? "rotateY(180deg)" : 0,
                  fontSize: "16px",
                }}
              />
              <Typography
                variant="h6"
                sx={{
                  color: colors.main,
                  fontSize: "16px",
                }}
              >
                {language === "en" ? "products" : "المنتجات"}
              </Typography>

              {product.data && !product.error ? (
                <>
                  <ArrowForwardIosIcon
                    sx={{
                      transform: language === "ar" ? "rotateY(180deg)" : 0,
                      fontSize: "16px",
                    }}
                  />
                  <Typography
                    variant="h6"
                    sx={{
                      color: colors.main,
                      fontSize: "16px",
                    }}
                  >
                    {product.data[`title_${language}`]}
                  </Typography>
                </>
              ) : undefined}
            </Stack>
          </Stack>
        </Box>
        {isLoading ? (
          <Loader />
        ) : product.data && !product.error ? (
          <Box>
            <Grid
              container
              sx={{
                mt: 5,
              }}
            >
              <Grid item lg={6} xs={12}>
                <Stack
                  sx={{
                    flexDirection: {
                      lg: "row",
                      xs: "column",
                    },
                    gap: "20px",
                  }}
                >
                  <Stack
                    sx={{
                      flexDirection: {
                        lg: "column",
                        xs: "row",
                      },
                      width: 80,
                      gap: "10px",
                    }}
                  >
                    {product.data.images.map((image, idx) => (
                      <Box position={"relative"}>
                        <CardMedia
                          src={`${imageBaseUrl}${image}`}
                          component="img"
                          sx={{
                            height: 100,
                            width: 80,
                            // objectFit: "cover",
                            borderRadius: "10px",
                            objectFit: "contain",

                            mt: {
                              lg: "15px",
                              xs: 0,
                            },
                            mb: {
                              lg: 0,
                              xs: "15px",
                            },
                            cursor: "pointer",
                            border: `1px solid ${
                              imgIndex === idx ? colors.main : "transparent"
                            } `,
                          }}
                          onClick={() => setImgIndex(idx)}
                        />
                      </Box>
                    ))}
                  </Stack>
                  <CardMedia
                    component="img"
                    sx={{
                      height: 400,
                      width: 0.8,
                      objectFit: "contain",
                    }}
                    src={`${imageBaseUrl}${product.data.images[imgIndex]}`}
                  />
                </Stack>
              </Grid>
              <Grid
                item
                lg={6}
                xs={12}
                sx={{
                  px: {
                    md: "20px",
                    xs: 0,
                  },
                }}
              >
                <Stack
                  sx={{
                    flexDirection: "row",
                    justifyContent: "flex-end",
                    gap: "20px",
                    mb: "40px",
                  }}
                >
                  <Typography
                    sx={{
                      borderBottom: 1,
                      borderColor: "divider",
                      pb: "5px",
                    }}
                  >
                    {product.data.category[`name_${language}`]}
                  </Typography>
                  {product.data?.subCategory && (
                    <Typography
                      sx={{
                        borderBottom: 1,
                        borderColor: "divider",
                        pb: "5px",
                      }}
                    >
                      {product.data.subCategory[`name_${language}`]}
                    </Typography>
                  )}
                  {product.data?.subSubCategory && (
                    <Typography
                      sx={{
                        borderBottom: 1,
                        borderColor: "divider",
                        pb: "5px",
                      }}
                    >
                      {product.data.subSubCategory[`name_${language}`]}
                    </Typography>
                  )}
                </Stack>
                <Typography variant={"h5"}>
                  {product.data[`title_${language}`]}
                </Typography>
                <Typography variant={"h6"} mt={4}>
                  {product.data.finalPrice}{" "}
                  {` ${language === "en" ? "SAR" : "ر.س"}`}
                </Typography>
                <Rating
                  value={product.data.rating}
                  readOnly
                  sx={{
                    mt: 2,
                  }}
                />
                <Box
                  dangerouslySetInnerHTML={{
                    __html: product.data[`description_${language}`],
                  }}
                />
                <Box
                  sx={{
                    mt: "15px",
                    border: 1,
                    borderColor: "divider",
                    p: 2,
                  }}
                >
                  <Typography variant="h6">
                    {language === "en" ? "Filter ways" : "عوامل التصفية"}
                  </Typography>

                  {product.data.attributes[0] ? (
                    product.data.attributes.map((attriubute) => (
                      <Box
                        sx={{
                          border: 1,
                          borderColor: "divider",
                          p: 2,
                          mt: "15px",
                        }}
                      >
                        <Typography textTransform={"capitalize"}>
                          {attriubute[`key_${language}`]}
                        </Typography>
                        <Stack
                          direction={"row"}
                          gap={"20px"}
                          flexWrap={"wrap"}
                          mt={"5px"}
                        >
                          {attriubute.values.map((item) => (
                            <Box
                              position={"relative"}
                              border={1}
                              p={2}
                              pt={3}
                              borderColor={"divider"}
                            >
                              <Typography textTransform={"capitalize"}>
                                {item[`value_${language}`]}
                              </Typography>
                            </Box>
                          ))}
                        </Stack>
                      </Box>
                    ))
                  ) : (
                    <Typography
                      variant="h6"
                      sx={{
                        color: colors.dangerous,
                        my: "5px",
                        fontSize: "medium",
                      }}
                    >
                      {language === "en"
                        ? "There are no filter ways"
                        : "لا توجد عوامل تصفية"}
                    </Typography>
                  )}
                </Box>
                <Box
                  sx={{
                    mt: "15px",
                    border: 1,
                    borderColor: "divider",
                    p: 2,
                  }}
                >
                  <Typography variant="h6">
                    {language === "en" ? "Qualities" : "المعاير"}
                  </Typography>
                  {console.log("my qualities here", product.data.qualities)}
                  {product.data.qualities[0] ? (
                    product.data.qualities.map((productQuality) => (
                      <Box
                        sx={{
                          border: 1,
                          borderColor: "divider",
                          p: 2,
                          mt: "15px",
                        }}
                      >
                        <Typography textTransform={"capitalize"} mb={"10px"}>
                          {productQuality.price}
                          {` `}
                          {language === "en" ? "SAR" : "ر.س"}
                        </Typography>
                        <Typography textTransform={"capitalize"} mb={"10px"}>
                          {language === "en"
                            ? `There are ${productQuality.quantity} of quantity`
                            : `يوجد ${productQuality.quantity} من الكمية`}
                        </Typography>
                        <Stack
                          direction={"row"}
                          alignItems={"center"}
                          justifyContent={"flex-start"}
                          gap={"10px"}
                          flexWrap={"wrap"}
                        >
                          {productQuality.image.map((img, idx) => (
                            <CardMedia
                              key={idx}
                              component={"img"}
                              src={imageBaseUrl + img}
                              sx={{
                                height: 70,
                                width: 70,
                              }}
                            />
                          ))}
                        </Stack>

                        <Stack
                          direction={"row"}
                          gap={"20px"}
                          flexWrap={"wrap"}
                          mt={"15px"}
                        >
                          {productQuality.values.map((item) => (
                            <Box
                              position={"relative"}
                              border={1}
                              p={2}
                              pt={3}
                              borderColor={"divider"}
                            >
                              <Typography
                                sx={{
                                  bgcolor: item?.color
                                    ? item.color
                                    : "transparent",
                                  color: item?.color && "#fff",
                                  p: "5px",
                                }}
                                textTransform={"capitalize"}
                              >
                                {item[`value_${language}`]}
                              </Typography>
                              <Typography fontSize="small">
                                {item.price}
                                {` ${language === "en" ? "ٌSAR" : "ر.س"}`}
                              </Typography>
                            </Box>
                          ))}
                        </Stack>
                      </Box>
                    ))
                  ) : (
                    <Typography
                      variant="h6"
                      sx={{
                        color: colors.dangerous,
                        fontSize: "medium",
                        my: "5px",
                      }}
                    >
                      {language === "en"
                        ? "There are no qualities"
                        : "لا توجد معايير"}
                    </Typography>
                  )}
                </Box>

                <Box
                  sx={{
                    border: 1,
                    borderColor: "divider",
                    p: 2,
                    mt: "20px",
                  }}
                >
                  <Typography variant="h6">
                    {language === "en" ? "Keywords" : "الكلمات المفتاحية"}
                  </Typography>
                  {product.data.keywords[0] ? (
                    <Stack
                      sx={{
                        flexDirection: "row",
                        flexWrap: "wrap",
                        gap: "20px",
                        mt: 2,
                        border: 1,
                        borderColor: "divider",
                        p: 2,
                        borderRadius: "3px",
                      }}
                    >
                      {product.data.keywords.map((keyword) => (
                        <Box
                          border={1}
                          borderColor={"divider"}
                          pt={2.5}
                          px={2}
                          borderRaius={"3px"}
                          position={"relative"}
                        >
                          <Typography py={1.5}>{keyword}</Typography>
                        </Box>
                      ))}
                    </Stack>
                  ) : (
                    <Typography
                      variant="h6"
                      sx={{
                        color: colors.dangerous,
                        fontSize: "medium",
                        my: "5px",
                      }}
                    >
                      {language === "en"
                        ? "There are no keywordsa"
                        : "لا توجد كلمات مفتاحية"}
                    </Typography>
                  )}
                </Box>
              </Grid>
            </Grid>
            <ProductComments productId={id} />
          </Box>
        ) : (
          <Box py={5}>
            <Typography
              variant="h6"
              sx={{
                color: colors.dangerous,
                textAlign: "center !important",
                fontSize: {
                  md: "30px",
                  xs: "25px",
                },
              }}
            >
              {product.error}
            </Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default ProductDetailsPage;
