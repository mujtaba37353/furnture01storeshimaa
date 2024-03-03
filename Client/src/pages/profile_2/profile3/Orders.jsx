import { Box, Button, ButtonBase, Grid, Paper, Stack, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { useLazyGetUserOrdersQuery, useTrackOrderRepoMutation } from '../../../redux/apis/ordersApi';
import { toast } from 'react-toastify';
import OrderImage from '../../../assets/svg/order.jpg'
import styles from './profile1.styles'
import { useTranslation } from 'react-i18next';

const salahCustomization = {
    initiated: { en: "initiated", ar: "بدأ الطلب" },
    default: { en: "TrackOrder", ar: " تتبع الطلب" },
    created: { en: "created", ar: "تم الطلب" },
    pending: { en: "pending", ar: "طلب معلق" },
    awaiting_pickup: { en: "awaiting pick up", ar: "في انتظار  اخذ الطلب" },
    currently_shipping: { en: "currently shipping", ar: "في الطريق للتوصيل" },
    shipment_on_hold: { en: "shipment on hold", ar: "الشحن معلق" },
    delivered: { en: "delivered", ar: "تم التوصيل" },
    canceled: { en: "canceled", ar: "  الطلب مرفوض" },
    returned: { en: "returned", ar: "طلب مرتجع" },
}
const OrderCard = (props) => {

    const [TrackOrderM] = useTrackOrderRepoMutation();

    const { id, lang ,   order       ,  orderShipping  } = props
    const [statu, setStatu] = useState('default')
    const handleShipping = (orderId, id) => {


        TrackOrderM({
            orderId,
            id

        }).unwrap().then(res => {
            console.log(res, 'resresres')
             setStatu(res?.data?.status.replaceAll(' ',''))

        }).catch(err => {


            toast.error(lang === "en" ? err?.data?.error_en : err?.data?.error_ar)
            console.log(err)
        })


    };

    return (
        <Box
            sx={{
                width: '100%',
                backgroundImage: `url(${OrderImage})`,
                backgroundRepeat: 'no-repeat',
                backgroundSize: 'contain',
                backgroundPosition: 'center',
                height: '300px',
                position: 'relative',
                textAlign: 'center',
            }}
        >
            <Box
                sx={{
                    position: 'absolute',
                    width: '100%',
                    py: 2,
                    bottom: 40,
                }}
            >
                <Typography sx={{
                    fontSize: {
                        xs: '10px',
                        md: '20px'
                    }
                }} textAlign={'center'}>

                    {/* {id} */}
                </Typography>
                <ButtonBase
                  onClick={() => 
                {
                    console.log(orderShipping,order,'asdsadsad')
                    handleShipping(orderShipping?.
                        shippingId
                        ,order?._id)
                }
                }
                >
                    <Typography
                        sx={{
                            borderRadius: '50px',
                            backgroundColor: '#727272 !important',
                            padding: '10px 40px',
                            boxShadow: '0px !important',
                            fontSize: {
                                xs: '10px',
                                md: '20px'
                            }
                        }}
                    >
                        {
            console.log(statu,'dsasadsdaqestatus')
        }
                        {salahCustomization[statu][lang]}
                    </Typography>
                </ButtonBase>
            </Box>
        </Box>

    )
}
export default function Orders() {
    const [data, setData] = useState()
    const [getOrderM, {
        data: shipping,
        isSuccess,
        isError,
        isLoading,
        error,
    }] = useLazyGetUserOrdersQuery(
        );
    const [TrackOrderM] = useTrackOrderRepoMutation();

    const [, { language: lang }] = useTranslation()


    useEffect(() => {
        getOrderM("?limit=1000&sendToDelivery=false&status[ne]=initiated").unwrap().then((res) => {

             setData(res?.data)
        }).catch(err => {


        })


    }, [data])

    return (



        <>
            <Paper elevation={3} sx={{
                ...styles.container,
                height:'fit-content'
            }}>
                <Typography sx={styles.headear}>
                    {lang === 'en' ? 'Orders' : 'الطلبات '}
                </Typography>
               

                    <Box
                        sx={{ ...styles.pageContainer, direction: lang === 'en' ? 'ltr' : 'rtl' }}
                    >

                        {
                            data?.length ? <>
                                {
                                    data?.length ?
                                    <Grid
                                    container
                                    direction="row"
                                    width={'100%'}
                                    gap={2}>
                                         {
                                            data?.map(order => {
 

                                                return (<>

                                                    {
                                                        order?.ordersShipping?.length ?
                                                            <>

                                                                {
                                                                    order?.ordersShipping?.map((orderShipping, index) => {

                                                                        return (

                                                                            <> 
                                                                              <Grid
                                                                                    component={Paper}
                                                                                    item
                                                                                    key={index}
                                                                                    xs={5}
                                                                                    sm={5}
                                                                                    md={3}
                                                                                    xl={3}
                                                                                    width={'90%'}
                                                                                    className="gridOrder"
                                                                                    sx={{
                                                                                        borderRadius: '30px',
                                                                                        overflow: 'hidden',
                                                                                        margin: 'auto',

                                                                                                                   }}
                                                                                >
                     <OrderCard  order={order} orderShipping={orderShipping} lang={lang} />
                                                                                </Grid>
                                                                            </>

                                                                        )
                                                                    })
                                                                }
                                                            </>

                                                            : null
                                                    }

                                                </>)
                                            })
                                        }
                                        </Grid> : null
                                }

                            </>

                                : null
                        }
                    </Box>
            


            </Paper>
        </>







    )
}
