import { Grid, Stack, Typography } from '@mui/material'
import React from 'react'
import { useTranslation } from 'react-i18next';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import CloseIcon from '@mui/icons-material/Close';
export default function OrderItem({ orderitem, isShipping,lng }) {
   console.log(orderitem, 'ssswwed')
  return (
    <Grid item xs={5.8} md={5.7} xl={3.9} sx={{
        display: 'flex',
        height:'fit-content',
        flexDirection:{
        xs:'column',
        sm:'row',
        lg:'row'
      }
    }}>

      <Stack component={'img'} sx={{
        height:{
          xs:'30%',
          lg: '100%'
        },
        width: '50%',
         objectFit:'cover'
      }}

        src={orderitem?.imagesUrl[0]} />


     <Stack>
     <Typography sx={{
        padding: '0px 10px'
      }}>
        {
          lng === "en" ? orderitem?.title_en : orderitem.title_ar
        }
      </Typography>
      <Typography sx={{
        padding: '0px 10px',
        fontSize: {
          xs: '15px',
          md: '15px'
        }
      }}>
        {
          lng === "en" ? "shipping Price" : "سعر الشحن"
        }  {
          orderitem?.shippingPrice
        }
      </Typography>
      <Typography sx={{
        padding: '0px 10px',
        fontSize: {
          xs: '15px',
          md: '11px'
        }
      }}>
        {
          lng === "en" ? "total Quantity" : `عدد المنتجات التي تمت شرائها`
        }  {
          orderitem?.quantity
        }
      </Typography>
      <Typography sx={{
        padding: '0px 10px',
        fontSize: {
          xs: '15px',
          md: '11px'
        },
        display:'flex',
      }}>
        {
          lng === "en" ? "price" : `السعر`
        }  {
          orderitem?.finalPrice
        }
     <box sx={
   {   
    margin:'0px 20px'

  }  }>
     {lng==="en"?"Rs":'رس'}
     </box>
      </Typography>

      <Typography component={'p'} sx={{
        fontSize: {
          xs: '8x',
          md: '13px',

        },
        border: !isShipping ? "#706262" : '1px solid #21af21',
        padding: '2px 2px',
        borderRadius: "6px",
        width: 'fit-content',
        marginTop: "10px",
        backgroundColor: !isShipping ? "#706262" : "#21af21",
        color: "#fff",
        margin: "10px  10px",
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-around',
        width: 'fit-content',
        fontSize:{
          xs:'10px',
          md:'13px'
        },
        borderRadius:'50%'

      }}>
     
          
            <DoneAllIcon sx={{
              fontSize: '15px'
            }} />
        

      </Typography>
     </Stack>
    </Grid>
  )
}
