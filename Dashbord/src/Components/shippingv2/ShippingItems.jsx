import { Button, Grid, Stack, Typography } from '@mui/material'
import React, { useEffect } from 'react'
import OrderItem from './OrderItem'
import DoneAllIcon from '@mui/icons-material/DoneAll';
import CloseIcon from '@mui/icons-material/Close';
import OrderStatus from './orderStatus/OrderStatus';
import { useLazyGetAllOrdersQuery, useShipSpecificRepoMutation } from '../../api/order.api';
import { toast } from 'react-toastify';

export default function ShippingItems({ orderItems, isShipping, shippingInfo,shippingItems, lng
     ,setShippingItems,setLoading,setData}) {
    const [UpdateOrders]=useLazyGetAllOrdersQuery()
    console.log(lng, 'orderItems')
    const [shipRepo,{
        isLoading,
        isError
    }]=useShipSpecificRepoMutation()
    useEffect(()=>{
        setLoading(isLoading)
       },[isLoading])
    const ShipRepoNow =()=>{

        const productsArray = orderItems?.items?.map(item=>item.id);
        console.log(orderItems?.orderID,'orderItems?.orderID')
       
 
         shipRepo({
            orderId:orderItems?.orderID,
            products:productsArray,
            repoId:orderItems?.id
         }).then(res=>{
            if(res?.error?.data?.status==="error"){
                 toast.error(lng==="en"?res?.error?.data?.error_en:res?.error.data?.error_ar)
                return
            }
           if(!isError){
            console.log(res,'sadsadsad')

            
                setShippingItems ((prev)=> 
                {   
                    const NewRepo ={ RepoId: orderItems?.id, status: 'pending'};
                    prev.push(NewRepo)
                }
                )  
                UpdateOrders("?limit=1000&sendToDelivery=false&status[ne]=initiated").unwrap().then(res=>{
                    setData(res?.data)
                })    .catch((err)=>{
                    console.log(err)
                })
            }
            
            }).catch(err=>{
                console.log(err,'sasdsadsadsad')

            toast.error(lng==="en"?err?.error_en:err?.error_ar)
               console.log(err)
               return
        })
    }
    return (


        <Stack sx={{
            display:'flex',
            alignItems:'flex-start',
        }}>
          <Typography sx={{
                                        my: 1
                                    }}>
                                        {
                                            lng === "en" ? "products" : "المنتجات"
                                        }
                                    </Typography>
            <Grid container gap={1} sx={{
              }}>   {
                    orderItems?.items
                        ?.map((orderitem, idx) => {
                            return (
                                <OrderItem lng={lng} isShipping={isShipping} orderitem={orderitem} />
                            )
                        })}
              
              
            
            </Grid>
               <Stack sx={{
                width:'100%'
               }}>
               {
                    isShipping ? <>

                        <Typography component={'h1'} sx={{
                            fontSize: {
                                xs: '8x',
                                md: '20px',

                            },
                            padding: '20px 0px',
                            width: '100%',
                            marginTop: "10px",
                            // backgroundColor:   "#333",
                            color: "##333",
                            margin: "10px  10px",
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            width: '100%',
                            borderBottom:'1px solid #333',
                            fontWeight:'bold',

                        }}>
                            {
                                lng === "en" ? "Order Is Shipping From This Repostories  " : `تم شحن كل المنتجات من هذا المستودع   `
                            }

                            <DoneAllIcon sx={{
                                fontSize: '20px',
                                margin: '0px 10px'
                            }} />  </Typography>

                        <Typography sx={{
                              padding: '4px',
                            alignItems: 'center',
                            display:'flex',
                            justifyContent:'flex-start',
                            width:'fit-content'
                        }}>
                            <Typography sx={{
                                 padding: '0px 10px',
                                margin: '0px 10px',
                            fontWeight:'bold',
                                textTransform:'capitalize',
                             }}>
                                {
                                    lng === "en" ? "Order Status" : "حاله الطلب"
                                }:
                            </Typography>
                            <Typography sx={{}}>    
                                <OrderStatus status={shippingInfo?.status} lng={lng} />
                            </Typography>
                        </Typography>

                    </> : <>
                        <Button sx={{
                            backgroundColor: "#ddd",
                            borderRadius: '0px',
                            height: {
                                xs: '40px',
                               
                            },
                            fontWeight: 'bold',
                            color: "#333",
                            marginTop: 15,
                            backgroundColor:"#00D5C5!important",
                            color:"#fff",
                            borderRadius:"6px",
                            width:'30%',
                            textTransform:'capitalize',
                            fontSize:'15px',
                         }}
                        
                        disabled={isLoading}
                            onClick={ShipRepoNow}
                        >Ship Now</Button></>}
               </Stack>
         </Stack>
    )
}