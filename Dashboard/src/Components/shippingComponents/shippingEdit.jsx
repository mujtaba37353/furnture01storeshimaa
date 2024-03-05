import {
  Grid,
  Stack,
  Typography,
  Button,
  TableContainer,
  TableCell,
  TableBody,
  Table,
  TableHead,
  TableRow,
   Box,
} from "@mui/material";
import { useEffect, useState } from "react";

import MenuItem from "@mui/material/MenuItem";

import Select from "@mui/material/Select";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import { useCreateItemRepositoryMutation } from "../../api/order.api";
import { useTheme } from "@emotion/react";
export default function ShippingEdit({
  selectedProduct,
  active = "",
  isOne,
  orderId,
  open,
  setProduct,
  setActive,

  ...others
}) {
  //  const [selectedProduct,setProduct]= useState({});
  const [added, isAdded] = useState(false);
  const [productRepository, setProductRepository] = useState([]);
  const { colors, customColors } = useTheme();
  const [productRepoQ, setProductRepoQ] = useState(0);

  const [, { language: lang }] = useTranslation();
  const [ErrorMessage, setErrorMessage] = useState([]);
  const [quantities, setQuantities] = useState([]);
  const [createItemRepository, { isSuccess, isLoading }] =
    useCreateItemRepositoryMutation();
  useEffect(() => {
    if (open === false) {
      setProduct({});
      setActive("");
    }
  }, [open]);
  useEffect(() => {
    console.log(quantities);

    if (selectedProduct?.repositories?.length > 0) {
      const ReposProduct = selectedProduct?.repositories.reduce((acc, rep) => {
        const { repository, _id } = rep;

        const IsInRepo = selectedProduct?.Repos.find(
          (item) => item._id === repository
        );
        if (IsInRepo) {
          acc.push({
            IsInRepo,
          });
        } else {
          return;
        }
        return acc;
      }, []);
      setProductRepository(ReposProduct);

      isAdded(true);
    } else {
      isAdded(false);
    }

    const productSumInRepo = selectedProduct.Repos?.flatMap((pro) => {
      const { products } = pro;
      return products?.filter(
        (item) => item.productId === selectedProduct?.productId
      );
    })
      .flat()
      .reduce((acc, product) => {
        return acc + product?.quantity;
      }, 0);

    setProductRepoQ(productSumInRepo);
    setQuantities([]);
  }, [selectedProduct, selectedProduct?.repositories]);

  const handleChange = (event, rowIndex, product) => {
    const newQuantities = [...quantities].filter(Boolean);
    newQuantities[rowIndex] = event.target.value;

    setQuantities(newQuantities);
  };

  //handle remove

  // const HandleApi = (repos = []) => {
  //     console.log(repos)
  //     if(repos.length){
  //           const productRepo =repos.flatMap(({repository})=>{

  //             return    selectedProduct?.Repos.filter(rep=>rep._id ===repository ).map(item=>{
  //              return{
  //               ...item,
  //               repository
  //              }
  //             })
  //          }) ;
 
  
  //   const   productQ=     productRepo.flatMap(product=>{

      
  //     return    product.products.filter(({productId})=>productId===selectedProduct?.productId).map(item=> ({...item,repository:product?.repository}))

  //          })
  //          console.log(productQ)
           
  //          for(let key  in repos){
  //         console.log( repos[key])
  //      if(repos[key].repository ===productQ[key].repository  ){
  //           console.log('first')

  //           if(repos[key].quantity ===productQ[key].quantity  ){

 
  //           }else{
  //             toast.error(
  //               lang === "en"
  //                 ? `Required quantity must be equal to ${selectedProduct?.ProductQuantity}`
  //                 : `  لا يمكن اضافه هذا العدد الي  الي هذا المستودع`
  //             );
  //           }

  //         }

  //         }

 

        
  //     }

  
  // };

  const handleAdd = (e) => {
    const sum = quantities.reduce((accumulator, currentValue) => {
      return accumulator + currentValue;
    }, 0);

    if (productRepoQ < selectedProduct?.ProductQuantity) {
      console.log(selectedProduct?.ProductQuantity, productRepoQ);
      if (
        sum <
          Math.abs(
            selectedProduct?.ProductQuantity -
              selectedProduct?.ProductQuantity -
              productRepoQ
          ) ||
        sum !==
          Math.abs(
            selectedProduct?.ProductQuantity -
              selectedProduct?.ProductQuantity -
              productRepoQ
          )
      ) {
        toast.error(
          lang === "en"
            ? `Required quantity must be equal to ${selectedProduct?.ProductQuantity}`
            : `${Math.abs(
                selectedProduct?.ProductQuantity -
                  selectedProduct?.ProductQuantity -
                  productRepoQ
              )}الكمية المطلوبة يجب ان  تساوي `
        );
      } else if (
        sum ===
        Math.abs(
          selectedProduct?.ProductQuantity -
            selectedProduct?.ProductQuantity -
            productRepoQ
        )
      ) {
        const repos = selectedProduct?.Repos?.map((repo, index) => {
          return { repository: repo._id, quantity: quantities[index] };
        }).filter((item) => item.quantity);

        createItemRepository({
          id: orderId, //order id
          itemId: selectedProduct?.productId, //pro id
          typeOfItem: selectedProduct?.isCash ? "cash" : "online",
          repos,
        })
          .unwrap()
          .then(() => {
            toast.success(
              lang === "en" ? "added successfully" : "تم الاضاقه بنجاح "
            );
            selectedProduct.repositories = [...repos];
            selectedProduct.Repo = [...selectedProduct?.Repos];
          })
          .catch((err) => {
            toast.error(err.data[`error_${lang}`]);
          });
                 
      }
    } else if (sum < selectedProduct?.ProductQuantity) {
      console.log(sum, selectedProduct?.ProductQuantity);

      toast.error(
        lang === "en"
          ? `Required quantity must be equal to ${selectedProduct?.ProductQuantity}`
          : `${selectedProduct?.ProductQuantity}الكمية المطلوبة يجب ان  تساوي `
      );
    } else if (sum !== selectedProduct?.ProductQuantity) {
      toast.error(
        lang === "en"
          ? `Required quantity must be equal to ${selectedProduct?.ProductQuantity}`
          : `${selectedProduct?.ProductQuantity}الكمية المطلوبة يجب ان  تساوي `
      );
    } else {
      const repos = selectedProduct?.Repos?.map((repo, index) => {
        return { repository: repo._id, quantity: quantities[index] };
      }).filter((item) => item.quantity);

      createItemRepository({
        id: orderId, //order id
        itemId: selectedProduct?.productId, //pro id
        typeOfItem: selectedProduct?.isCash ? "cash" : "online",
        repos,
      })
        .unwrap()
        .then(() => {
          toast.success(
            lang === "en" ? "added successfully" : "تم الاضاقه بنجاح "
          );
          selectedProduct.repositories = [...repos];
          selectedProduct.Repo = [...selectedProduct?.Repos];
        })
        .catch((err) => {
          toast.error(err.data[`error_${lang}`]);
        });
    }
  };

  return (
    <Box
      className="customscroll"
      sx={{
         overflow: "auto",
        borderTop: "1px solid #333 ",
      }}
    >
      {selectedProduct?.repositories?.length > 0 ? (
        <TableContainer
          className={"customscroll"}
          {...others}
          component={"div"}
          sx={{
            width: "90%",
            maxWidth: "90%",
            mx: "auto",
            background: "none",
            border: "0px",
          }}
        >
          <Table aria-label="simple table" className={"customscroll"}>
            <TableHead
              sx={{ bgcolor: customColors.bg, color: customColors.text }}
            >
              <TableRow
                sx={{
                  position: "relative",
                }}
              >
                <TableCell align="center" sx={{ fontWeight: "bold" }}>
                  #
                </TableCell>
                <TableCell align="center" sx={{ fontWeight: "bold" }}>
                  {lang === "en" ? "Repo Name" : "اسم المستودع"}
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {productRepository?.map((repo, index) => (
                <TableRow
                  key={index}
                  sx={{ bgcolor: `${colors.bg_main} !important` }}
                >
                  <TableCell align="center">{index}</TableCell>
                  <TableCell align="center">
                    {repo?.IsInRepo[`name_${lang}`]}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <Box>
          {active !== "" ? (
            <>
              <Grid
                item
                xs={isOne ? 6 : 9}
                sx={{
                  bgcolor: customColors.bg_main,
                  borderRadius: "10px",
                  marginRight: "auto",
                  display: "flex",
                  justifyContent: "space-between",
                  flexDirection: "column",
                }}
              >
                <Typography
                  sx={{
                    textAlign: "center",
                    // textTransform: 'upperCase',
                    fontSize: { xs: "1.1rem", md: "1.2rem", lg: "1.4rem" },
                    // fontWeight: 'bold',
                    mb: 2,
                    py: 1,
                  }}
                >
                  {lang === "en"
                    ? "Repo Product Quantities"
                    : "كميات المنتجات في المستودعات"}
                </Typography>
                <TableContainer>
                  <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    <TableHead>
                      <TableRow>
                        <TableCell align="center">
                          {lang === "en" ? "product Name" : "اسم المنتج"}
                        </TableCell>
                        <TableCell align="center">
                          {lang === "en" ? "Quantity" : "الكمية"}
                        </TableCell>
                        <TableCell align="center">
                          {lang === "en" ? "Repo Name" : "اسم المستودع"}
                        </TableCell>
                        <TableCell align="center">
                          {lang === "en" ? "Repo Quantity" : "كمية المستودع"}
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {selectedProduct?.Repos?.map((row, rowIndex) => (
                        <TableRow
                          key={rowIndex}
                          sx={{
                            "&:last-child td, &:last-child th": { border: 0 },
                            position: "relative",
                          }}
                        >
                          <TableCell component="th" scope="row" align="center">
                            {selectedProduct?.product_title_en}
                          </TableCell>
                          <TableCell align="center">
                            <Select
                              sx={{
                                width: "80px",
                                padding: "3px",
                                height: "50px",
                              }}
                              disabled={
                                row?.products?.find(
                                  (pro) =>
                                    pro?.productId === selectedProduct?.product
                                )?.quantity === 0
                              }
                              id={`demo-simple-select-${rowIndex}`}
                              value={quantities[rowIndex] || 0} // Use the corresponding state value
                              onChange={(event) =>
                                handleChange(event, rowIndex, selectedProduct)
                              }
                              MenuProps={{
                                style: {
                                  maxHeight: 48 * 4.5 + 8,
                                },
                              }}
                            >
                              {/* i need to fill array from 0 to quantity */}
                              {Array.from(
                                Array(
                                  selectedProduct?.ProductQuantity + 1
                                ).keys()
                              ).map((q, i) => (
                                <MenuItem key={i} value={q}>
                                  {q}
                                </MenuItem>
                              ))}
                            </Select>
                          </TableCell>
                          <TableCell align="center">
                            {row[`name_${lang}`]}
                          </TableCell>
                          <TableCell align="center">
                            {
                              row?.products?.find(
                                (pro) =>
                                  pro?.productId === selectedProduct?.product
                              )?.quantity
                            }
                          </TableCell>

                          {row?.products?.find(
                            (pro) => pro?.productId === selectedProduct?.product
                          )?.quantity === 0 ? (
                            <Typography
                              sx={{
                                fontSize: "10px",
                                display: "flex",
                                alignItems: "center",
                                textAlign: "center",
                                padding: "3px",
                                position: "absolute",
                                top: "38%",
                                left: "10px",
                                border: "1px solid #333",
                                borderRadius: "10px",
                              }}
                            >
                              "كميه غير كافيه"
                            </Typography>
                          ) : null}
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
                <Stack
                  sx={{
                    marginTop: "auto",
                    marginLeft: "auto",
                    marginRight: "10px",
                    width: "100%",
                    padding: "10px",

                    position: "sticky",
                    bottom: "0px",
                    background: colors?.bgColor,
                  }}
                >
                  {!added ? (
                    <Button
                      disabled={isLoading}
                      sx={{
                        background:'linear-gradient(15deg, #00d5c5fc, black)',
                        color:`white!important`,
                        textTransform: "capitalize",
                         position: "sticky",
                          width:'fit-content',
                           p: "10px 20px",
                        left: "20px",

                         
                      }}
                      onClick={(e) => handleAdd(e)}
                    >
                      <Typography
                      sx={{
                        fontSize:{xs:'13px'}
                      }}
                      >
                        {lang === "en" ? "Add To Repositories" : " اضافة الي  مستودعات"}
                      </Typography>
                    </Button>
                  ) : null}
                </Stack>
              </Grid>

              {/*  */}
            </>
          ) : (
            <Box
              sx={{
                textAlign: "center",
                display: "flex",
                justifyContent: "center",
              }}
            >
              <Typography xs={6}>{
                lang==="en"?
                'Select Product First '
                :'اختر منتج اولا '

              }</Typography>
            </Box>
          )}
        </Box>
      )}
    </Box>
  );
}
